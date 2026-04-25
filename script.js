// ============================================================
// STUDENT GRIEVANCE REDRESSAL SYSTEM - MAIN SCRIPT
// ============================================================

// ============================================================
// ============================================================
// 1. UTILITY FUNCTIONS & INTERACTIVE UI
// ============================================================

// Inject Global Interaction CSS
function injectInteractionStyles() {
    if(document.getElementById('interactive-styles')) return;
    const style = document.createElement('style');
    style.id = 'interactive-styles';
    style.innerHTML = `
        .card { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease; cursor: default; }
        .card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.15); }
        tbody tr { transition: background-color 0.2s ease, transform 0.1s ease; }
        tbody tr:hover { background-color: #e3f2fd !important; transform: scale(1.002); }
        button { transition: transform 0.1s ease, background-color 0.3s ease, box-shadow 0.2s ease !important; }
        button:active { transform: scale(0.95); }
        button:hover { box-shadow: 0 4px 10px rgba(30, 136, 229, 0.3); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        body { animation: fadeIn 0.4s ease-out; }
        .custom-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.5); z-index: 999; display: flex; justify-content: center; align-items: center;
            opacity: 0; animation: fadeInOverlay 0.2s forwards; backdrop-filter: blur(4px);
        }
        @keyframes fadeInOverlay { to { opacity: 1; } }
        .custom-modal-content {
            background: white; padding: 25px 30px; border-radius: 12px; width: 100%; max-width: 450px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2); transform: scale(0.9); animation: popModal 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes popModal { to { transform: scale(1); } }
        .custom-modal-content h3 { color: #1E88E5; margin-bottom: 15px; font-family: 'Poppins', sans-serif; }
        .custom-modal-content p { margin-bottom: 20px; line-height: 1.5; color: #444; }
        .custom-modal-content select { width: 100%; padding: 10px; margin-bottom: 20px; border-radius: 6px; border: 1px solid #ccc; font-family: inherit; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 10px; }
        .btn-cancel { background: #e0e0e0 !important; color: #333 !important; }
        .btn-cancel:hover { background: #ccc !important; }
    `;
    document.head.appendChild(style);
}

// Reusable Modal Component
function showCustomModal(title, contentHtml, onConfirmCallback = null, isPrompt = false) {
    const overlay = document.createElement('div');
    overlay.className = 'custom-modal-overlay';
    
    let promptHtml = isPrompt ? '<select id="modalStatusSelect"><option value="Pending">Pending</option><option value="In Progress">In Progress</option><option value="Resolved">Resolved</option></select>' : '';
    let buttonsHtml = onConfirmCallback ? 
        '<button class="btn-cancel" onclick="closeCustomModal()">Cancel</button><button onclick="confirmCustomModal()">Confirm</button>' : 
        '<button onclick="closeCustomModal()">Close</button>';

    overlay.innerHTML = `
        <div class="custom-modal-content">
            <h3>${title}</h3>
            ${contentHtml}
            ${promptHtml}
            <div class="modal-actions">${buttonsHtml}</div>
        </div>`;
    document.body.appendChild(overlay);

    window.closeCustomModal = () => document.body.contains(overlay) && document.body.removeChild(overlay);
    window.confirmCustomModal = () => {
        if(isPrompt) onConfirmCallback(document.getElementById('modalStatusSelect').value);
        else onConfirmCallback();
        closeCustomModal();
    };
}

// Generate unique Grievance ID
function generateGrievanceID() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const id = 'GRV' + Math.floor(timestamp / 1000) % 10000;
    return id;
}

// Get all grievances from localStorage
function getAllGrievances() {
    const grievances = localStorage.getItem('grievances');
    return grievances ? JSON.parse(grievances) : [];
}

// Save grievances to localStorage
function saveGrievances(grievances) {
    localStorage.setItem('grievances', JSON.stringify(grievances));
}

// Get grievance by ID
function getGrievanceByID(id) {
    const grievances = getAllGrievances();
    return grievances.find(g => g.grievanceID === id);
}

// Update grievance status
function updateGrievanceStatus(id, newStatus) {
    const grievances = getAllGrievances();
    const grievance = grievances.find(g => g.grievanceID === id);
    if (grievance) {
        grievance.status = newStatus;
        saveGrievances(grievances);
        return true;
    }
    return false;
}

// Get grievances by student (rollNumber)
function getStudentGrievances(rollNumber) {
    const grievances = getAllGrievances();
    return grievances.filter(g => g.rollNumber === rollNumber);
}

// Get statistics for Principal Dashboard
function getGrievanceStats() {
    const grievances = getAllGrievances();
    const stats = {
        total: grievances.length,
        pending: grievances.filter(g => g.status === 'Pending').length,
        inProgress: grievances.filter(g => g.status === 'In Progress').length,
        resolved: grievances.filter(g => g.status === 'Resolved').length,
        byDepartment: {}
    };

    // Count by department
    grievances.forEach(g => {
        if (!stats.byDepartment[g.department]) {
            stats.byDepartment[g.department] = {
                total: 0,
                pending: 0,
                resolved: 0
            };
        }
        stats.byDepartment[g.department].total++;
        if (g.status === 'Pending') stats.byDepartment[g.department].pending++;
        if (g.status === 'Resolved') stats.byDepartment[g.department].resolved++;
    });

    return stats;
}

// Validate form fields
function validateField(value, fieldName) {
    if (!value || value.trim() === '') {
        alert(`${fieldName} is required`);
        return false;
    }
    return true;
}

// Highlight active navigation link
function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a, header a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(currentPage)) {
            link.style.color = '#1E88E5';
            link.style.fontWeight = '700';
        } else {
            link.style.color = '#333';
            link.style.fontWeight = '500';
        }
    });
}

// ============================================================
// 2. LOGIN FUNCTIONALITY
// ============================================================

// Predefined credentials (for demonstration)
const credentials = {
    student: [
        { rollNumber: '21IT001', password: 'student123', name: 'John Doe' },
        { rollNumber: '21IT035', password: 'pass123', name: 'Jane Smith' },
        { rollNumber: 'DEMO', password: 'demo', name: 'Demo Student' }
    ],
    faculty: [
        { email: 'academic@faculty.com', password: 'pass123', category: 'Academic' },
        { email: 'hostel@faculty.com', password: 'pass123', category: 'Hostel' },
        { email: 'exam@faculty.com', password: 'pass123', category: 'Exam' },
        { email: 'infrastructure@faculty.com', password: 'pass123', category: 'Infrastructure' },
        { email: 'harassment@faculty.com', password: 'pass123', category: 'Harassment' },
        { email: 'general@faculty.com', password: 'pass123', category: 'Other' }
    ],
    hod: [
        { email: 'hod@example.com', password: 'hod123' }
    ],
    principal: [
        { email: 'principal@example.com', password: 'principal123' }
    ]
};

// Function to validate login
function loginUser(role) {
    console.log('loginUser called with role:', role);
    
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    
    if (!emailInput || !passwordInput) {
        console.error('Input fields not found');
        alert('Error: Input fields not found. Please refresh the page.');
        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }

    const validCredentials = credentials[role];
    const matchedUser = validCredentials && validCredentials.find(cred => cred.email === email && cred.password === password);

    if (matchedUser) {
        // Store login info in sessionStorage
        const sessionData = { email, role };
        if (role === 'faculty') {
            sessionData.category = matchedUser.category;
        }
        sessionStorage.setItem('currentUser', JSON.stringify(sessionData));
        console.log('Login successful, redirecting...');
        
        // Redirect to appropriate dashboard
        const dashboardMap = {
            student: 'Spage.html',
            faculty: 'Faculty veiw.html',
            hod: 'HOD DASH.html',
            principal: 'Principal DASH.html'
        };
        
        const redirectUrl = dashboardMap[role];
        window.location.href = redirectUrl;
    } else {
        console.error('Login failed - invalid credentials');
        let hint = 'student@example.com / student123';
        if (role === 'hod') hint = 'hod@example.com / hod123';
        if (role === 'principal') hint = 'principal@example.com / principal123';
        if (role === 'faculty') hint = 'academic@faculty.com (or hostel/exam/infrastructure/harassment/general@faculty.com) / pass123';
        
        alert('Invalid Login. Please check your email and password.\\n\\nHint:\\nEmail: ' + hint);
    }
}

// Function to validate student login (different input IDs)
function loginStudent() {
    console.log('loginStudent called');
    
    const rollInput = document.getElementById('studentRollInput');
    const passwordInput = document.getElementById('studentPasswordInput');
    
    if (!rollInput || !passwordInput) {
        console.error('Student input fields not found');
        alert('Error: Input fields not found. Please refresh the page.');
        return;
    }

    const loginIdentifier = rollInput.value.trim().toUpperCase();
    const password = passwordInput.value.trim();

    if (!loginIdentifier || !password) {
        alert('Please enter both Roll Number/Name and password');
        return;
    }

    const validCredentials = credentials['student'];

    const matchedUser = validCredentials && validCredentials.find(cred => {
        return (cred.rollNumber.toUpperCase() === loginIdentifier || cred.name.toUpperCase() === loginIdentifier) && cred.password === password;
    });

    if (matchedUser) {
        // Store login info in sessionStorage
        const rollNumber = matchedUser.rollNumber;
        sessionStorage.setItem('currentUser', JSON.stringify({ rollNumber, name: matchedUser.name, role: 'student' }));
        console.log('Student login successful, redirecting...');
        
        // Redirect to dashboard
        window.location.href = 'Spage.html';
    } else {
        console.error('Student login failed - invalid credentials');
        alert('Invalid Login. Please check your Roll Number/Name and password.\n\nTry:\nRoll Number: DEMO\nPassword: demo');
    }
}

// Function to logout
function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'student.html';
}

// Check if user is logged in
function isUserLoggedIn() {
    return sessionStorage.getItem('currentUser') !== null;
}

// Get current user info
function getCurrentUser() {
    const user = sessionStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// ============================================================
// 3. SUBMIT GRIEVANCE FUNCTIONALITY
// ============================================================

function submitGrievance() {
    const form = document.querySelector('form');
    if (!form) return;

    // Get form values using IDs
    const currentUser = getCurrentUser();
    let name = document.getElementById('studentName')?.value?.trim() || '';
    let rollNumber = document.getElementById('rollNumber')?.value?.trim() || '';
    const title = document.getElementById('grievanceTitle')?.value?.trim() || '';
    const category = document.getElementById('grievanceCategory')?.value?.trim() || '';
    const description = document.getElementById('grievanceDescription')?.value?.trim() || '';
    const department = document.getElementById('grievanceDepartment')?.value?.trim() || 'General';
    const isAnonymous = document.getElementById('anonymousCheck')?.checked || false;
    let email = isAnonymous ? 'anonymous@system.com' : (currentUser?.email || 'student@example.com');

    // Force current logged in student details to ensure it shows up in their dashboard
    if (currentUser && currentUser.role === 'student' && !isAnonymous) {
        name = currentUser.name || name;
        rollNumber = currentUser.rollNumber || rollNumber;
        email = currentUser.email || email;
    }

    // Validation
    if (!isAnonymous) {
        if (!validateField(name, 'Student Name')) return;
        if (!validateField(rollNumber, 'Roll Number')) return;
    }
    if (!validateField(title, 'Grievance Title')) return;
    if (!validateField(category, 'Category')) return;
    if (!validateField(description, 'Description')) return;
    if (!validateField(department, 'Department')) return;

    // Generate Grievance ID
    const grievanceID = generateGrievanceID();

    // Create grievance object
    const grievance = {
        grievanceID,
        name: isAnonymous ? 'Anonymous' : name,
        rollNumber: isAnonymous ? 'N/A' : rollNumber,
        title,
        category,
        description,
        department,
        status: 'Pending',
        email,
        submittedDate: new Date().toLocaleDateString(),
        isAnonymous,
        facultyFeedback: '' // Added for faculty feedback
    };

    // Save to localStorage
    const grievances = getAllGrievances();
    grievances.push(grievance);
    saveGrievances(grievances);

    // Show success message and reset form
    alert(`Grievance submitted successfully!\nYour Grievance ID: ${grievanceID}`);
    form.reset();
    document.getElementById('anonymousCheck').checked = false;
    showNameRollFields();
}

// Toggle anonymous submission visibility
function toggleAnonymous() {
    const checkbox = document.querySelector('input[type="checkbox"]');
    if (!checkbox) return;

    checkbox.addEventListener('change', showNameRollFields);
}

function showNameRollFields() {
    const checkbox = document.getElementById('anonymousCheck');
    const nameInput = document.getElementById('studentName');
    const rollInput = document.getElementById('rollNumber');
    
    if (!checkbox || !nameInput || !rollInput) return;

    if (checkbox.checked) {
        nameInput.style.display = 'none';
        rollInput.style.display = 'none';
        nameInput.value = '';
        rollInput.value = '';
    } else {
        nameInput.style.display = 'block';
        rollInput.style.display = 'block';
    }
}

// ============================================================
// 4. TRACK GRIEVANCE FUNCTIONALITY
// ============================================================

function trackGrievance() {
    const trackingInput = document.getElementById('grievanceIDInput');
    if (!trackingInput) return;

    const searchTerm = trackingInput.value.trim().toUpperCase();

    if (!searchTerm) {
        alert('Please enter a Grievance ID, Name, or Roll Number');
        return;
    }

    const grievancesList = getAllGrievances();
    // Filter by ID, Name, or Roll Number (case-insensitive)
    const matchedGrievances = grievancesList.filter(g => 
        (g.grievanceID && g.grievanceID.toUpperCase() === searchTerm) ||
        (g.name && g.name.toUpperCase() === searchTerm) ||
        (g.rollNumber && g.rollNumber.toUpperCase() === searchTerm)
    );

    if (matchedGrievances.length === 0) {
        alert('No grievances found for the given search term');
        trackingInput.value = '';
        return;
    }

    // Display grievance details
    displayMultipleGrievanceDetails(matchedGrievances);
}

function displayMultipleGrievanceDetails(grievances) {
    const resultDiv = document.querySelector('.track-result') || createTrackResultDiv();
    
    let htmlContent = `<h3 style="color:#1E88E5; margin-bottom:15px;">Found ${grievances.length} Grievance(s)</h3>`;
    
    grievances.forEach(grievance => {
        let statusColor = '#e53935'; // default pending
        if(grievance.status === 'In Progress') statusColor = '#fb8c00';
        if(grievance.status === 'Resolved') statusColor = '#43a047';

        let feedbackHtml = '';
        if (grievance.status === 'Resolved' && grievance.facultyFeedback) {
            feedbackHtml = `
            <div style="margin-top:15px; padding:15px; background:#e8f5e9; border-left:4px solid #43a047; border-radius:4px;">
                <h4 style="color:#2e7d32; margin-bottom:5px;">Faculty Feedback:</h4>
                <p style="color:#1b5e20; margin:0;">${grievance.facultyFeedback}</p>
            </div>`;
        }

        htmlContent += `
            <div class="grievance-detail" style="background:white; padding:25px; border-radius:12px; margin-top:20px; box-shadow:0 10px 30px rgba(0,0,0,0.08); text-align:left; border-top:4px solid ${statusColor};">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <h3 style="margin:0; color:#333;">${grievance.title}</h3>
                    <span style="background:${statusColor}; color:white; padding:5px 12px; border-radius:20px; font-size:12px; font-weight:600;">${grievance.status}</span>
                </div>
                <p style="margin-bottom:8px;"><strong>ID:</strong> ${grievance.grievanceID} | <strong>Submitted:</strong> ${grievance.submittedDate}</p>
                <p style="margin-bottom:8px;"><strong>Student:</strong> ${grievance.name} (${grievance.rollNumber})</p>
                <p style="margin-bottom:8px;"><strong>Category:</strong> ${grievance.category} | <strong>Dept:</strong> ${grievance.department}</p>
                <div style="margin-top:15px; padding:15px; background:#f9f9f9; border-radius:8px;">
                    <strong>Description:</strong><br/>
                    ${grievance.description}
                </div>
                ${feedbackHtml}
            </div>
        `;
    });
    
    resultDiv.innerHTML = htmlContent;
}

function createTrackResultDiv() {
    const trackBox = document.querySelector('.track-box');
    if (!trackBox) return null;
    
    const resultDiv = document.createElement('div');
    resultDiv.className = 'track-result';
    trackBox.parentNode.insertBefore(resultDiv, trackBox.nextSibling);
    return resultDiv;
}

// ============================================================
// 5. STUDENT DASHBOARD FUNCTIONALITY
// ============================================================

function displayStudentGrievances() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'student') return;

    const grievances = getStudentGrievances(currentUser.rollNumber);
    const tableBody = document.querySelector('table tbody');
    
    if (!tableBody) return;

    if (grievances.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:20px;">No grievances submitted yet</td></tr>';
        return;
    }

    tableBody.innerHTML = grievances.map(g => {
        let statusStyle = '';
        if(g.status === 'Pending') statusStyle = 'color: #e53935; font-weight: bold;';
        if(g.status === 'In Progress') statusStyle = 'color: #fb8c00; font-weight: bold;';
        if(g.status === 'Resolved') statusStyle = 'color: #43a047; font-weight: bold;';

        return `
        <tr>
            <td style="font-weight: 500;">${g.grievanceID}</td>
            <td>${g.title}</td>
            <td>${g.category}</td>
            <td style="${statusStyle}">${g.status}</td>
            <td>${g.submittedDate}</td>
            <td>
                ${g.status === 'Resolved' && g.facultyFeedback ? 
                  `<button class="btn" style="background:#43a047; font-size: 13px;" onclick="showCustomModal('Faculty Review for ${g.grievanceID}', '<p>${g.facultyFeedback.replace(/'/g, '&apos;')}</p>')">View Feedback</button>` 
                  : `<span style="color: #999; font-size: 13px; font-style: italic;">N/A</span>`}
            </td>
        </tr>
    `}).join('');
}

// ============================================================
// 6. FACULTY DASHBOARD FUNCTIONALITY
// ============================================================

function displayFacultyGrievances() {
    const currentUser = getCurrentUser();
    let grievances = getAllGrievances();
    
    // Filter by category if not 'Other'. If 'Other', maybe they see 'Other' or 'General'.
    if (currentUser && currentUser.category) {
        grievances = grievances.filter(g => g.category === currentUser.category);
    }

    const tableBody = document.querySelector('table tbody');
    
    if (!tableBody) return;

    if (grievances.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">No grievances assigned yet</td></tr>';
        return;
    }

    tableBody.innerHTML = grievances.map((g) => `
        <tr>
            <td>${g.grievanceID}</td>
            <td>${g.name}</td>
            <td>${g.category}</td>
            <td>${g.status}</td>
            <td>
                <button onclick="showCustomModal('Grievance Details', '<p>${g.description.replace(/'/g, '&apos;')}</p>')">View</button>
                ${g.status !== 'Resolved' ? `<button onclick="resolveGrievanceWithFeedback('${g.grievanceID}')" style="background:#43a047; margin-left:5px;">Resolve</button>` : ''}
            </td>
        </tr>
    `).join('');

    updateFacultyStats(grievances);
}

function resolveGrievanceWithFeedback(grievanceID) {
    showCustomModal(
        'Resolve Grievance',
        `<p>Please provide a feedback or resolution note for <strong>${grievanceID}</strong>:</p>
         <textarea id="facultyFeedbackText" rows="4" style="width:100%; padding:10px; border-radius:6px; border:1px solid #ccc; font-family:inherit; margin-bottom:15px;" placeholder="Type your feedback here..."></textarea>`,
        function() {
            const feedbackText = document.getElementById('facultyFeedbackText')?.value?.trim() || 'No specific feedback provided.';
            const grievances = getAllGrievances();
            const grievance = grievances.find(g => g.grievanceID === grievanceID);
            if (grievance) {
                grievance.status = 'Resolved';
                grievance.facultyFeedback = feedbackText;
                saveGrievances(grievances);
                displayFacultyGrievances();
                showCustomModal('Success', '<p>Grievance resolved and feedback saved!</p>');
            }
        }
    );
}

function updateFacultyStats(grievances) {
    const stats = {
        pending: grievances.filter(g => g.status === 'Pending').length,
        inProgress: grievances.filter(g => g.status === 'In Progress').length,
        resolved: grievances.filter(g => g.status === 'Resolved').length
    };
    
    const pendingCard = document.querySelector('.pending');
    const progressCard = document.querySelector('.progress');
    const resolvedCard = document.querySelector('.resolved');

    if (pendingCard) pendingCard.textContent = `Pending: ${stats.pending}`;
    if (progressCard) progressCard.textContent = `In Progress: ${stats.inProgress}`;
    if (resolvedCard) resolvedCard.textContent = `Resolved: ${stats.resolved}`;
}

// ============================================================
// 7. HOD DASHBOARD FUNCTIONALITY
// ============================================================

function displayHODGrievances() {
    const grievances = getAllGrievances();
    const tableBody = document.querySelector('table tbody');
    
    if (!tableBody) return;

    if (grievances.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:20px;">No grievances to display</td></tr>';
        return;
    }

    tableBody.innerHTML = grievances.map((g, index) => `
        <tr>
            <td>${g.grievanceID}</td>
            <td>${g.name}</td>
            <td>${g.category}</td>
            <td>${g.description.substring(0, 30)}...</td>
            <td>${g.status}</td>
            <td>
                ${g.status === 'Resolved' && g.facultyFeedback ? 
                  `<button style="background:#43a047;" onclick="showCustomModal('Faculty Feedback for ${g.grievanceID}', '<p>${g.facultyFeedback.replace(/'/g, '&apos;')}</p>')">View Feedback</button>` 
                  : `<button onclick="updateStatusDropdown('${g.grievanceID}')">Update</button>`}
            </td>
        </tr>
    `).join('');

    updateHODStats();
}

function updateStatusDropdown(grievanceID) {
    showCustomModal(
        'Update Grievance Status',
        `<p>Please select the new status for grievance <strong>${grievanceID}</strong>:</p>`,
        function(newStatus) {
            if (updateGrievanceStatus(grievanceID, newStatus)) {
                displayHODGrievances();
                showCustomModal('Success', '<p>Status updated successfully!</p>');
            }
        },
        true // Enables dropdown prompt
    );
}

function updateHODStats() {
    const stats = getGrievanceStats();
    const pendingCard = document.querySelector('.pending');
    const progressCard = document.querySelector('.progress');
    const resolvedCard = document.querySelector('.resolved');

    if (pendingCard) pendingCard.textContent = `Pending: ${stats.pending}`;
    if (progressCard) progressCard.textContent = `In Progress: ${stats.inProgress}`;
    if (resolvedCard) resolvedCard.textContent = `Resolved: ${stats.resolved}`;
}

// ============================================================
// 8. PRINCIPAL DASHBOARD FUNCTIONALITY
// ============================================================

function displayPrincipalStats() {
    const stats = getGrievanceStats();
    
    const totalCard = document.querySelector('.total');
    const escalatedCard = document.querySelector('.escalated');
    const resolvedCard = document.querySelector('.resolved');

    if (totalCard) totalCard.textContent = `Total Complaints: ${stats.total}`;
    if (escalatedCard) escalatedCard.textContent = `In Progress: ${stats.inProgress}`;
    if (resolvedCard) resolvedCard.textContent = `Resolved: ${stats.resolved}`;
}

function displayDepartmentStats() {
    const stats = getGrievanceStats();
    const tableBody = document.querySelector('table tbody');
    
    if (!tableBody) return;

    const departments = Object.keys(stats.byDepartment);

    if (departments.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">No departments with grievances</td></tr>';
        return;
    }

    tableBody.innerHTML = departments.map(dept => {
        const data = stats.byDepartment[dept];
        return `
            <tr>
                <td>${dept}</td>
                <td>${data.total}</td>
                <td>${data.pending}</td>
                <td>${data.resolved}</td>
                <td><button onclick="viewDepartmentGrievances('${dept}')">View Feedbacks</button></td>
            </tr>
        `;
    }).join('');
}

function viewDepartmentGrievances(dept) {
    const grievances = getAllGrievances().filter(g => g.department === dept && g.status === 'Resolved');
    if (grievances.length === 0) {
        showCustomModal(`${dept} Resolves`, '<p>No resolved grievances for this department yet.</p>');
        return;
    }

    let html = `<div style="max-height: 300px; overflow-y: auto;">`;
    grievances.forEach(g => {
        html += `
            <div style="background:#f9f9f9; padding:15px; margin-bottom:10px; border-left:4px solid #43a047; border-radius:4px; text-align:left;">
                <p><strong>ID:</strong> ${g.grievanceID} | <strong>Title:</strong> ${g.title}</p>
                <p><strong>Assigned To:</strong> ${g.category} Faculty</p>
                <p style="color:#2e7d32; margin-top:5px;"><strong>Feedback:</strong> ${g.facultyFeedback || 'No feedback left'}</p>
            </div>
        `;
    });
    html += `</div>`;
    
    showCustomModal(`Resolved Grievances in ${dept}`, html);
}
// Adding it to global
window.viewDepartmentGrievances = viewDepartmentGrievances;


// ============================================================
// 9. INITIALIZATION AND EVENT LISTENERS
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    // Inject custom global interactive styles and modals
    injectInteractionStyles();

    // Initialize Chatbot on all pages
    initChatbot();

    // Highlight active navigation
    highlightActiveNav();

    // Setup form handlers based on page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (currentPage.includes('submiit')) {
        toggleAnonymous();
        const submitBtn = document.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.addEventListener('click', function(e) {
                e.preventDefault();
                submitGrievance();
            });
        }
    }

    if (currentPage.includes('track')) {
        const trackBtn = document.querySelector('button');
        if (trackBtn) {
            trackBtn.addEventListener('click', trackGrievance);
        }
    }

    if (currentPage.includes('Spage')) {
        displayStudentGrievances();
    }

    if (currentPage.includes('Faculty')) {
        displayFacultyGrievances();
    }

    if (currentPage.includes('HOD DASH')) {
        displayHODGrievances();
    }

    if (currentPage.includes('Principal DASH')) {
        displayPrincipalStats();
        displayDepartmentStats();
    }

    // Add some sample data for testing (remove in production)
    if (getAllGrievances().length === 0) {
        const sampleGrievances = [
            { grievanceID: 'GRV1001', name: 'John Doe', rollNumber: '21IT001', title: 'Lab Equipment Issue', category: 'Infrastructure', description: 'Computer lab computers are not functioning properly.', department: 'Computer Engineering', status: 'In Progress', email: 'john@example.com', submittedDate: '2026-03-10', isAnonymous: false },
            { grievanceID: 'GRV1002', name: 'Jane Smith', rollNumber: '21IT035', title: 'Unfair Grading', category: 'Academic', description: 'Question paper evaluation seems incorrect.', department: 'Computer Engineering', status: 'Pending', email: 'jane@example.com', submittedDate: '2026-03-09', isAnonymous: false },
            { grievanceID: 'GRV1003', name: 'Rahul Kumar', rollNumber: '21ME042', title: 'Hostel Food Quality', category: 'Hostel', description: 'Food quality in hostel mess has deteriorated significantly.', department: 'Mechanical Engineering', status: 'Resolved', email: 'rahul@example.com', submittedDate: '2026-03-01', isAnonymous: false, facultyFeedback: 'We have spoken to the hostel administration and changed the catering agency. It should improve starting next week.' },
            { grievanceID: 'GRV1004', name: 'Sneha Patel', rollNumber: '21EC015', title: 'Wi-Fi Connection Issues', category: 'Infrastructure', description: 'The Wi-Fi in the library is extremely slow.', department: 'Electronics Engineering', status: 'Pending', email: 'sneha@example.com', submittedDate: '2026-04-12', isAnonymous: false },
            { grievanceID: 'GRV1005', name: 'Amit Sharma', rollNumber: '21CE058', title: 'Late Bus Arrivals', category: 'Transport', description: 'The college bus from the central station has been consistently late.', department: 'Civil Engineering', status: 'In Progress', email: 'amit@example.com', submittedDate: '2026-04-15', isAnonymous: false },
            { grievanceID: 'GRV1006', name: 'Priya Rajan', rollNumber: '21IT112', title: 'Library Book Shortage', category: 'Academic', description: 'Not enough copies of the required textbook for the operating systems module.', department: 'Computer Engineering', status: 'Pending', email: 'priya@example.com', submittedDate: '2026-04-10', isAnonymous: false },
            { grievanceID: 'GRV1007', name: 'Karan Singh', rollNumber: '21ME088', title: 'Workshop Safety', category: 'Infrastructure', description: 'Some of the lathe machines lack proper safety guards.', department: 'Mechanical Engineering', status: 'Resolved', email: 'karan@example.com', submittedDate: '2026-02-28', isAnonymous: false, facultyFeedback: 'New safety guards have been installed and standard safety protocols have been rigidly updated.' },
            { grievanceID: 'GRV1008', name: 'Neha Gupta', rollNumber: '21EC044', title: 'Strict Attendance Rules', category: 'Academic', description: 'The recent attendance policy does not account for genuine medical emergencies.', department: 'Electronics Engineering', status: 'In Progress', email: 'neha@example.com', submittedDate: '2026-04-11', isAnonymous: false },
            { grievanceID: 'GRV1009', name: 'Anil Desai', rollNumber: '21CE021', title: 'Water Cooler Malfunction', category: 'Infrastructure', description: 'Water cooler near the 3rd-floor civil department is dispensing warm water.', department: 'Civil Engineering', status: 'Pending', email: 'anil@example.com', submittedDate: '2026-04-14', isAnonymous: false },
            { grievanceID: 'GRV1010', name: 'Ritu Verma', rollNumber: '21IT077', title: 'Schedule Overlap', category: 'Academic', description: 'Two of my core elective exams are scheduled at the same time.', department: 'Computer Engineering', status: 'Resolved', email: 'ritu@example.com', submittedDate: '2026-03-22', isAnonymous: false },
            { grievanceID: 'GRV1011', name: 'Deepak Joshi', rollNumber: '21ME055', title: 'Canteen Hygiene', category: 'Hostel', description: 'Tables in the main canteen are not cleaned frequently during lunch hours.', department: 'Mechanical Engineering', status: 'In Progress', email: 'deepak@example.com', submittedDate: '2026-04-05', isAnonymous: false },
            { grievanceID: 'GRV1012', name: 'Sonal Tiwari', rollNumber: '21EC092', title: 'Lab Components Missing', category: 'Academic', description: 'Not enough Arduino boards during the microcontrollers practical session.', department: 'Electronics Engineering', status: 'Pending', email: 'sonal@example.com', submittedDate: '2026-04-15', isAnonymous: false },
            { grievanceID: 'GRV1013', name: 'Vikram Mehta', rollNumber: '21CE045', title: 'Parking Issues', category: 'Transport', description: 'Students from other colleges are taking up spaces in our designated parking lot.', department: 'Civil Engineering', status: 'Resolved', email: 'vikram@example.com', submittedDate: '2026-01-19', isAnonymous: false },
            { grievanceID: 'GRV1014', name: 'Manoj Pillai', rollNumber: '21IT029', title: 'Harassment', category: 'Other', description: 'A senior has been repeatedly bothering me near the library elevators.', department: 'Computer Engineering', status: 'In Progress', email: 'manoj@example.com', submittedDate: '2026-04-08', isAnonymous: false },
            { grievanceID: 'GRV1015', name: 'Anonymous', rollNumber: 'N/A', title: 'Washroom Cleanliness', category: 'Infrastructure', description: 'The washrooms on the 4th floor have a strong foul odor.', department: 'General', status: 'Pending', email: 'anonymous@system.com', submittedDate: '2026-04-16', isAnonymous: true },
            { grievanceID: 'GRV1016', name: 'Arjun Das', rollNumber: '21ME101', title: 'Fee Payment Portal Error', category: 'Other', description: 'I got charged twice for my exam registration fees.', department: 'Mechanical Engineering', status: 'Pending', email: 'arjun@example.com', submittedDate: '2026-04-16', isAnonymous: false },
            { grievanceID: 'GRV1017', name: 'Snehal Reddy', rollNumber: '21EC033', title: 'No Air Conditioning', category: 'Infrastructure', description: 'The AC in the main auditorium is not working during guest lectures.', department: 'Electronics Engineering', status: 'Resolved', email: 'snehal@example.com', submittedDate: '2026-03-30', isAnonymous: false },
            { grievanceID: 'GRV1018', name: 'Tarun Saxena', rollNumber: '21CE018', title: 'Late Notice for Holidays', category: 'Other', description: 'The administration gives an official holiday notice too late.', department: 'Civil Engineering', status: 'In Progress', email: 'tarun@example.com', submittedDate: '2026-04-09', isAnonymous: false },
            { grievanceID: 'GRV1019', name: 'Kavita Menon', rollNumber: '21IT099', title: 'Sports Equipment Bad Condition', category: 'Infrastructure', description: 'The basketball nets are torn and the gym equipment is rusting.', department: 'Computer Engineering', status: 'Pending', email: 'kavita@example.com', submittedDate: '2026-04-13', isAnonymous: false },
            { grievanceID: 'GRV1020', name: 'Anonymous', rollNumber: 'N/A', title: 'Faculty Bias', category: 'Academic', description: 'I feel a particular faculty constantly favors a group of students in vivas.', department: 'Mechanical Engineering', status: 'In Progress', email: 'anonymous@system.com', submittedDate: '2026-04-01', isAnonymous: true }
        ];
        saveGrievances(sampleGrievances);
    }
});

// Make logout function accessible globally
window.logout = logout;
window.loginStudent = loginStudent;
window.updateStatusDropdown = updateStatusDropdown;
window.resolveGrievanceWithFeedback = resolveGrievanceWithFeedback;

// ============================================================
// 10. CHATBOT FUNCTIONALITY
// ============================================================

function initChatbot() {
    // 1. Inject Chatbot CSS
    if (!document.getElementById('chatbot-styles')) {
        const style = document.createElement('style');
        style.id = 'chatbot-styles';
        style.innerHTML = `
            .chatbot-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #1E88E5, #1565C0);
                color: white;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 28px;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                z-index: 1000;
                transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            .chatbot-btn:hover {
                transform: scale(1.1);
            }
            .chatbot-window {
                position: fixed;
                bottom: 90px;
                right: 20px;
                width: 350px;
                max-height: 500px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                display: flex;
                flex-direction: column;
                z-index: 1000;
                overflow: hidden;
                transform-origin: bottom right;
                transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                opacity: 0;
                transform: scale(0);
                pointer-events: none;
            }
            .chatbot-window.active {
                opacity: 1;
                transform: scale(1);
                pointer-events: auto;
            }
            .chatbot-header {
                background: linear-gradient(135deg, #1E88E5, #1565C0);
                color: white;
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-family: 'Poppins', sans-serif;
                font-size: 16px;
                font-weight: 600;
            }
            .chatbot-close {
                cursor: pointer;
                font-size: 20px;
                opacity: 0.8;
                transition: 0.2s;
            }
            .chatbot-close:hover {
                opacity: 1;
            }
            .chatbot-body {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                background: #f4f8fc;
                display: flex;
                flex-direction: column;
                gap: 15px;
                min-height: 330px;
                max-height: 330px;
            }
            .chat-msg {
                max-width: 80%;
                padding: 12px 15px;
                border-radius: 12px;
                font-size: 14px;
                line-height: 1.4;
                position: relative;
                animation: fadeInMsg 0.3s ease;
            }
            @keyframes fadeInMsg {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .chat-bot {
                background: white;
                color: #333;
                align-self: flex-start;
                border: 1px solid #e0e0e0;
                border-bottom-left-radius: 4px;
            }
            .chat-msg a.chat-action-link {
                display: inline-block;
                margin-top: 10px;
                padding: 8px 15px;
                background: linear-gradient(135deg, #1E88E5, #1565C0);
                color: white !important;
                text-decoration: none !important;
                border-radius: 8px;
                font-weight: 500;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .chat-msg a.chat-action-link:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 10px rgba(30,136,229,0.3);
            }
            .chat-msg a {
                color: #1E88E5;
                text-decoration: underline;
                font-weight: 600;
            }
            .chat-user {
                background: #1E88E5;
                color: white;
                align-self: flex-end;
                border-bottom-right-radius: 4px;
            }
            .chatbot-options {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 5px;
            }
            .chat-option-btn {
                background: transparent;
                border: 1px solid #1E88E5;
                color: #1E88E5;
                padding: 8px 12px;
                border-radius: 20px;
                font-size: 13px;
                cursor: pointer;
                transition: 0.2s;
                font-family: inherit;
            }
            .chat-option-btn:hover {
                background: #1E88E5;
                color: white;
            }
            .chatbot-footer {
                padding: 15px;
                background: white;
                border-top: 1px solid #eee;
                display: flex;
                gap: 10px;
            }
            .chatbot-footer input {
                flex: 1;
                padding: 10px 15px;
                border: 1px solid #ddd;
                border-radius: 20px;
                font-family: inherit;
                outline: none;
                font-size: 14px;
            }
            .chatbot-footer input:focus {
                border-color: #1E88E5;
            }
            .chatbot-footer button {
                background: #1E88E5;
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: 0.2s;
                font-size: 16px;
            }
            .chatbot-footer button:hover {
                background: #1565C0;
            }
            .chatbot-body::-webkit-scrollbar {
                width: 6px;
            }
            .chatbot-body::-webkit-scrollbar-thumb {
                background: #ccc;
                border-radius: 3px;
            }
        `;
        document.head.appendChild(style);
    }

    // 2. Create Chatbot HTML
    const chatbotHTML = `
        <div class="chatbot-btn" id="chatbotBtn">💬</div>
        <div class="chatbot-window" id="chatbotWindow">
            <div class="chatbot-header">
                SGRS Assistant
                <span class="chatbot-close" id="chatbotClose">&times;</span>
            </div>
            <div class="chatbot-body" id="chatbotBody">
                <!-- Messages will appear here -->
            </div>
            <div class="chatbot-footer">
                <input type="text" id="chatInput" placeholder="Type a message..." autocomplete="off">
                <button id="chatSendBtn">➤</button>
            </div>
        </div>
    `;
    
    const div = document.createElement('div');
    div.innerHTML = chatbotHTML;
    document.body.appendChild(div);

    // 3. Chatbot Logic
    const chatbotBtn = document.getElementById('chatbotBtn');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotBody = document.getElementById('chatbotBody');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');

    chatbotBtn.addEventListener('click', () => {
        chatbotWindow.classList.toggle('active');
        if (chatbotBody.children.length === 0) {
            startConversation();
        }
    });

    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
    });

    function appendMessage(sender, text, isHtml = false, id = null) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${sender === 'bot' ? 'chat-bot' : 'chat-user'}`;
        if (id) msgDiv.id = id;
        if (isHtml) {
            msgDiv.innerHTML = text;
        } else {
            msgDiv.textContent = text;
        }
        chatbotBody.appendChild(msgDiv);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }

    function appendOptions(options) {
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'chatbot-options';
        
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'chat-option-btn';
            btn.textContent = opt.text;
            btn.onclick = () => {
                chatInput.value = opt.text; // Set input
                optionsDiv.remove(); // Remove options after selection
                sendUserMessage();  // Trigger send immediately!
            };
            optionsDiv.appendChild(btn);
        });
        
        chatbotBody.appendChild(optionsDiv);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }

    function startConversation() {
        appendMessage('bot', 'Hello! 👋 I am the Ultra-Smart SGRS Assistant. Ask me literally anything, or select an option below:');
        setTimeout(() => {
            appendOptions([
                { text: 'How to submit a grievance?' },
                { text: 'Track my grievance' },
                { text: 'Forgot my password' },
                { text: 'Contact admin' }
            ]);
        }, 500);
    }

    async function sendUserMessage() {
        const text = chatInput.value.trim();
        if (!text) return;
        
        appendMessage('user', text);
        chatInput.value = '';
        
        // Remove existing options if user types instead
        const existingOptions = document.querySelectorAll('.chatbot-options');
        existingOptions.forEach(opt => opt.remove());



        // Show typing indicator
        const typingId = 'typing-' + Date.now();
        appendMessage('bot', '<i>Thinking...</i>', true, typingId);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            const data = await response.json();
            
            // Remove typing indicator
            const typingMsg = document.getElementById(typingId);
            if (typingMsg) typingMsg.remove();

            if (data.error) {
        	        // Graceful fallback if no API key
        	        handleLocalResponse(text, data.error);
        	    } else {
        	        let botText = data.reply.replace(/\n/g, '<br>');
        	        botText = botText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        	        appendMessage('bot', botText, true);
        	    }
        	} catch (err) {
        	    const typingMsg = document.getElementById(typingId);
        	    if (typingMsg) typingMsg.remove();
        	    handleLocalResponse(text, err.message);
        	}
    }

    function handleLocalResponse(text, errorMsg = '') {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('submit') || lowerText.includes('new') || lowerText.includes('create')) {
            appendMessage('bot', 'To submit a grievance, go to the Submit page, fill in your details (or submit anonymously), choose a category, and describe your issue.<br><br><a href="submiit.html" class="chat-action-link">Submit a Grievance ➔</a>', true);
        } else if (lowerText.includes('track') || lowerText.includes('status')) {
            appendMessage('bot', 'You can track the status of your grievance using your ID, Name, or Roll Number on the Track page.<br><br><a href="track.html" class="chat-action-link">Track your Grievance ➔</a>', true);
        } else if (lowerText.includes('password') || lowerText.includes('login')) {
            appendMessage('bot', 'If you forgot your password, please contact the administration or try the default student login (student@example.com / student123).<br><br><a href="login.html" class="chat-action-link">Go to Login ➔</a>', true);
        } else if (lowerText.includes('contact') || lowerText.includes('admin')) {
            appendMessage('bot', 'You can contact the admin by raising a General Grievance and addressing it to the Principal.', true);
        } else {
            let errorFeedback = '';
            if (errorMsg && typeof errorMsg === 'string' && errorMsg.includes('leaked')) {
                errorFeedback = '<br><br><b style="color:#d32f2f;">Critical Error: Your Gemini API Key was reported as leaked and has been blocked. You MUST replace it in the .env file!</b>';
            }
            appendMessage('bot', "I'm currently in local mode because my Gemini AI API Key isn't working properly! 😕" + errorFeedback + "<br><br>For now, ask me basic things like: <i>submitting, tracking, passwords, or contacting admin!</i>", true);
        }
    }

    chatSendBtn.addEventListener('click', sendUserMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendUserMessage();
    });
}
