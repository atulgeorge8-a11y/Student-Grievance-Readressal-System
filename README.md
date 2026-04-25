# Student Grievance Redressal System - Documentation

## Project Overview

This is a complete **Student Grievance Redressal System** built with **HTML, CSS, and Vanilla JavaScript**. The system provides a transparent and secure platform for students to submit, track, and resolve their concerns with institutional support.

---

## 📁 File Structure

```
student/
├── index.html                    # Home page & main landing page
├── student.html                  # Student login page
├── Spage.html                    # Student dashboard
├── submiit.html                  # Submit grievance form
├── track.html                    # Track grievance page
├── login.html                    # Faculty login page
├── Faculty veiw.html             # Faculty dashboard
├── HOD.html                      # HOD login page
├── HOD DASH.html                 # HOD dashboard
├── Principal.html                # Principal login page
├── Principal DASH.html           # Principal dashboard
└── script.js                     # Main JavaScript functionality
```

---

## 🚀 Getting Started

### 1. Open the System
- Start by opening `index.html` in your web browser
- This is the main landing page with navigation to all login portals

### 2. Test Credentials

The system includes predefined test credentials for demonstration:

#### Student Login
- **Email:** `student@example.com`
- **Password:** `student123`
- **OR**
- **Email:** `john@example.com`
- **Password:** `pass123`

#### Faculty Login
- **Email:** `faculty@example.com`
- **Password:** `faculty123`

#### HOD Login
- **Email:** `hod@example.com`
- **Password:** `hod123`

#### Principal Login
- **Email:** `principal@example.com`
- **Password:** `principal123`

---

## 📋 Features

### 1. **Login Validation**
- Separate login pages for Student, Faculty, HOD, and Principal
- Form validation ensures email and password are entered
- Invalid credentials show "Invalid Login" alert
- Successful login redirects to the respective dashboard
- User session stored in `sessionStorage`

### 2. **Submit Grievance**
- **Grievance ID Generation:** Automatically generates unique ID in format `GRV####`
- **Anonymous Submission:** Students can choose to submit anonymously
- **Form Fields:**
  - Student Name (hidden if anonymous)
  - Roll Number (hidden if anonymous)
  - Grievance Title
  - Category (Academic, Hostel, Exam, Infrastructure, Harassment)
  - Department Concerned
  - Description
  - Supporting File (Optional)
- **Data Storage:** Grievances stored in browser's `localStorage`
- **Success Message:** Shows grievance ID after successful submission
- **Form Fields Stored:**
  - Grievance ID
  - Student Name / "Anonymous"
  - Roll Number / "N/A"
  - Title
  - Category
  - Description
  - Department
  - Status (default: "Pending")
  - Submission Date
  - Email (for tracking)

### 3. **Track Grievance**
- Enter Grievance ID (e.g., GRV1001)
- Displays grievance details including:
  - Title
  - Category
  - Current Status
  - Department
  - Description
  - Submission Date
- Shows "Grievance ID not found" if ID doesn't exist

### 4. **Student Dashboard**
- Displays all grievances submitted by the logged-in student
- Shows grievance ID, title, category, status, and submission date
- Quick navigation to:
  - Submit new grievance
  - Track existing grievance
  - Logout

### 5. **HOD Dashboard**
- Displays all grievances from the institution
- Columns: ID, Student Name, Category, Description, Status
- **Status Update Feature:** 
  - Click "Update" button on any grievance
  - Change status to: Pending, In Progress, or Resolved
  - Statistics updated in real-time
- Shows counts: Pending, In Progress, Resolved

### 6. **Principal Dashboard**
- **Summary Statistics:**
  - Total Complaints
  - In Progress Grievances
  - Resolved Grievances
- **Department-wise Overview Table:**
  - Department name
  - Total grievances
  - Pending grievances
  - Resolved grievances
  - View button for details

### 7. **Faculty Dashboard**
- View assigned grievances (expandable for future assignment system)
- Current status and grievance counts
- Simple interface for faculty reference

### 8. **Data Persistence**
- All data stored in `localStorage` (client-side)
- No database required
- Data persists across browser sessions
- Perfect for demonstrations and learning

---

## 🔧 JavaScript Functions (script.js)

### Utility Functions
- `generateGrievanceID()` - Creates unique ID
- `getAllGrievances()` - Retrieves all grievances from localStorage
- `saveGrievances(grievances)` - Saves grievances to localStorage
- `getGrievanceByID(id)` - Finds specific grievance by ID
- `updateGrievanceStatus(id, newStatus)` - Updates status
- `getStudentGrievances(email)` - Gets student's grievances
- `getGrievanceStats()` - Calculates statistics
- `highlightActiveNav()` - Highlights active navigation link

### Login Functions
- `loginUser(role)` - Validates credentials and redirects to dashboard
- `logout()` - Clears session and returns to home
- `isUserLoggedIn()` - Checks if user is authenticated
- `getCurrentUser()` - Returns current logged-in user

### Grievance Functions
- `submitGrievance()` - Handles grievance submission
- `toggleAnonymous()` - Shows/hides name fields for anonymous submission
- `trackGrievance()` - Searches for and displays grievance
- `displayGrievanceDetails(grievance)` - Shows grievance details

### Dashboard Functions
- `displayStudentGrievances()` - Shows student's grievances
- `displayHODGrievances()` - Shows all grievances in table
- `updateStatusDropdown(ID)` - Updates grievance status
- `updateHODStats()` - Updates HOD statistics
- `displayPrincipalStats()` - Shows principal summary
- `displayDepartmentStats()` - Shows department-wise breakdown

---

## 🎨 Design Features

### Theme Colors
- **Primary Blue:** #1E88E5
- **Dark Blue:** #1565C0
- **Background:** #f4f8fc
- **Status Colors:**
  - Pending: Red (#e53935)
  - In Progress: Orange (#fb8c00)
  - Resolved: Green (#43a047)

### Responsive Design
- Mobile-friendly layout
- Adapts to tablets and desktops
- Navigation hides on mobile (can be improved with hamburger menu)

### Modern UI Elements
- Smooth transitions and hover effects
- Rounded corners on cards and buttons
- Box shadows for depth
- Clean typography with Google Fonts (Poppins, Inter)

---

## 📊 Sample Data

The system comes pre-loaded with sample grievances for testing:

1. **GRV1001** - Lab Equipment Issue (Computer Eng, In Progress)
2. **GRV1002** - Unfair Grading (Computer Eng, Pending)
3. **GRV1003** - Hostel Food Quality (Mechanical Eng, Resolved)

These demonstrate the system's functionality across different statuses and departments.

---

## 🔐 Security Considerations

**Current Implementation (Development):**
- Hardcoded credentials for testing
- No password encryption
- Session stored in `sessionStorage` (cleared on browser close)
- Data stored locally (no server transmission)

**For Production, Add:**
- Backend authentication with secure password hashing
- Database storage instead of localStorage
- HTTPS encryption
- Role-based access control (RBAC)
- Input validation and sanitization
- CSRF protection
- Rate limiting on login attempts

---

## 🧪 Testing Instructions

### Test Student Flow
1. Go to `index.html`
2. Click "Student Login"
3. Use credentials: `student@example.com` / `student123`
4. View dashboard with sample grievances
5. Click "Submit Grievance" to submit new grievance
6. View generated Grievance ID
7. Use "Track Grievance" with any GRV#### ID

### Test HOD Flow
1. Go to `index.html`
2. Click "HOD Login"
3. Use credentials: `hod@example.com` / `hod123`
4. View all grievances in table
5. Click "Update" button to change status
6. Watch statistics update automatically

### Test Principal Flow
1. Go to `index.html`
2. Click "Principal Login"
3. Use credentials: `principal@example.com` / `principal123`
4. View summary statistics
5. Scroll to see department-wise breakdown

---

## 💡 How It Works

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    STUDENT GRIEVANCE SYSTEM                      │
└─────────────────────────────────────────────────────────────────┘

LOGIN PAGE
    ↓
[Validate Credentials]
    ↓
SESSION STORAGE
    ↓
DASHBOARD
    ↓
┌─────────────────────────────────────────────────────────────────┐
│                          GRIEVANCE                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  SUBMIT → Generate ID → Store in localStorage → Success  │   │
│  │                                                           │   │
│  │  TRACK → Search localStorage → Display Details → Result  │   │
│  │                                                           │   │
│  │  UPDATE → Change Status → localStorage → Sync Stats      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Browser Storage

### sessionStorage (Login Info)
```javascript
{
  "currentUser": {
    "email": "student@example.com",
    "role": "student"
  }
}
```

### localStorage (Grievances)
```javascript
[
  {
    "grievanceID": "GRV1001",
    "name": "John Doe",
    "rollNumber": "21IT001",
    "title": "Lab Equipment Issue",
    "category": "Infrastructure",
    "description": "...",
    "department": "Computer Engineering",
    "status": "In Progress",
    "email": "john@example.com",
    "submittedDate": "2026-03-10",
    "isAnonymous": false
  },
  // ... more grievances
]
```

---

## ⚙️ Browser Compatibility

- **Chrome/Chromium:** ✅ Full support
- **Firefox:** ✅ Full support
- **Safari:** ✅ Full support
- **Edge:** ✅ Full support
- **IE 11:** ⚠️ Partial support (missing some CSS features)

---

## 🚀 Future Enhancements

1. **Backend Integration**
   - Node.js/Express server
   - MongoDB/PostgreSQL database
   - API endpoints for data persistence

2. **Advanced Features**
   - Email notifications
   - File upload for supporting documents
   - Admin dashboard for college administration
   - Grievance category analytics
   - Response time tracking
   - Escalation mechanism

3. **UI/UX Improvements**
   - Dark mode
   - Mobile app version
   - Hamburger menu for mobile
   - Real-time notifications
   - PDF export for grievances
   - Search and filter grievances

4. **Security Enhancements**
   - Two-factor authentication
   - Password reset functionality
   - HTTPS encryption
   - Session timeout
   - IP-based access control

---

## 📝 Customization Guide

### Change College Name
Search in all files for "Fr.Conceicao Rodrigues" and replace with your college name.

### Change Color Scheme
In `style` sections, modify:
```css
--primary-color: #1E88E5;
--dark-color: #1565C0;
--success-color: #43a047;
--warning-color: #fb8c00;
--error-color: #e53935;
```

### Add New Categories
In `submiit.html`, add options to the category select:
```html
<option>Your New Category</option>
```

---

## ❓ Troubleshooting

### Grievances Not Showing
- Check browser's Developer Tools → Application → localStorage
- Click "Clear All" and refresh
- Sample data will reload automatically

### Login Not Working
- Ensure you're using exact credentials
- Check browser console for errors (F12)
- Clear sessionStorage and try again

### Style Issues
- Clear browser cache (Ctrl+Shift+Delete)
- Try in incognito/private mode
- Check if JavaScript is enabled

---

## 📧 Support

For issues or questions about this system:
- Check the code comments in `script.js`
- Review the HTML structure in each page
- Test with provided sample data first
- Verify browser console for error messages

---

## 📄 License

This project is created for educational purposes as part of an engineering college demonstration project.

---

## ✅ Checklist for Project Submission

- ✅ Vanilla JavaScript (no frameworks)
- ✅ Login validation for all roles
- ✅ Grievance submission with auto ID generation
- ✅ Track grievance functionality
- ✅ Student dashboard
- ✅ HOD dashboard with status updates
- ✅ Principal dashboard with statistics
- ✅ Form validation
- ✅ Navigation highlighting
- ✅ localStorage for persistence
- ✅ Anonymous submission option
- ✅ Responsive design
- ✅ Professional UI with blue/white theme

---

**System Version:** 1.0  
**Last Updated:** March 2026  
**Created for:** Student Project Demonstration
