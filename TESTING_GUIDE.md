# TESTING GUIDE - Student Grievance Redressal System

## Quick Start

1. **Open in Browser:** Navigate to `index.html`
2. **Choose a Role:** Student, Faculty, HOD, or Principal
3. **Use Test Credentials** (see below)
4. **Explore Features** following the test scenarios

---

## Test Credentials

### Student Account
```
Email: student@example.com
Password: student123

OR

Email: john@example.com
Password: pass123
```

### Faculty Account
```
Email: faculty@example.com
Password: faculty123
```

### HOD Account
```
Email: hod@example.com
Password: hod123
```

### Principal Account
```
Email: principal@example.com
Password: principal123
```

---

## Test Scenario 1: Student Submits Grievance

### Steps:
1. Go to `index.html`
2. Click "Student Login"
3. Enter credentials: `student@example.com` / `student123`
4. Click "Login"
5. Should redirect to **Student Dashboard** (Spage.html)
6. Click **"📝 Submit New Grievance"** button
7. Fill form:
   - **Student Name:** Your Name
   - **Roll Number:** 21IT001
   - **Grievance Title:** Lab Equipment Not Working
   - **Category:** Infrastructure
   - **Department:** Computer Engineering
   - **Description:** Computer lab systems are down for 2 days
8. Click **"Submit Grievance"**
9. **Expected:** Alert showing "Grievance submitted successfully!" with Grievance ID (e.g., GRV1234)

### Verify:
- Go back to dashboard, you should see your grievance listed
- Try submitting with "Anonymous" checked - name and roll number fields should hide

---

## Test Scenario 2: Track Grievance

### Steps:
1. Go to `index.html`
2. Click "Student Login" (or stay if already logged in)
3. Click **"🔍 Track Grievance"** button
4. Enter a Grievance ID: `GRV1001` (from sample data)
5. Click **"Track Status"**
6. **Expected:** Grievance details displayed showing:
   - Grievance ID: GRV1001
   - Title: Lab Equipment Issue
   - Category: Infrastructure
   - Status: In Progress
   - Department: Computer Engineering
   - Description: Computer lab computers are not functioning properly...
   - Submitted Date: 2026-03-10

### Verify:
- Try invalid ID (e.g., `GRV9999`)
- Should show: "Grievance ID not found"

---

## Test Scenario 3: Student Dashboard

### Steps:
1. Login as Student (see Test Scenario 1)
2. You're now on **Student Dashboard**
3. Scroll down to see **"Your Grievances"** table
4. **Expected:** Table shows:
   - GRV1001 | Lab Equipment Issue | Infrastructure | In Progress | 2026-03-10
   - GRV1002 | Unfair Grading | Academic | Pending | 2026-03-09

### Features to Test:
- Quick action buttons at top: Submit Grievance, Track Grievance
- Logout link in navbar
- Responsive layout (resize browser)

---

## Test Scenario 4: HOD Dashboard

### Steps:
1. Go to `index.html`
2. Click "HOD Login"
3. Enter credentials: `hod@example.com` / `hod123`
4. Click "Login"
5. Should redirect to **HOD Dashboard** (HOD DASH.html)
6. See all grievances in table with columns:
   - ID, Student Name, Category, Description, Status, Action

### Test Status Update:
1. Find a grievance (e.g., GRV1001)
2. Click **"Update"** button in the last column
3. Prompt appears asking for new status
4. Enter: `Resolved`
5. Click OK
6. **Expected:** Alert saying "Status updated successfully"
7. Table refreshes with new status
8. Statistics cards at top update automatically

### Multiple Status Updates:
- Try: Pending → In Progress → Resolved
- Statistics should change after each update
- Visit Student Dashboard to verify status changed there too

---

## Test Scenario 5: Principal Dashboard

### Steps:
1. Go to `index.html`
2. Click "Principal Login"
3. Enter credentials: `principal@example.com` / `principal123`
4. Click "Login"
5. Should redirect to **Principal Dashboard** (Principal DASH.html)

### View Statistics:
- **Statistics Cards** show:
  - Total Complaints: Should match total grievances
  - In Progress: Count of grievances with "In Progress" status
  - Resolved: Count of grievances with "Resolved" status

### View Department Breakdown:
- Scroll down to see **"Department Wise Overview"** table
- Columns:
  - Department Name
  - Total Grievances
  - Pending Count
  - Resolved Count
  - View Button
- **Expected Output Example:**
  - Computer Engineering | 2 | 1 | 0
  - Mechanical Engineering | 1 | 0 | 1

---

## Test Scenario 6: Form Validation

### Test Empty Fields:
1. Go to **Submit Grievance** page
2. Try to submit without filling any field
3. **Expected:** Browser shows required field validation

### Test Anonymous Submission:
1. On **Submit Grievance** page
2. Check **"Submit as Anonymous"** checkbox
3. **Expected:** Name and Roll Number fields disappear
4. Uncheck the checkbox
5. **Expected:** Name and Roll Number fields reappear

---

## Test Scenario 7: Navigation & Links

### Test Navigation Highlighting:
1. Visit different pages
2. Check navbar links - active page should be highlighted
3. All links should be clickable and functional

### Test All Navigation Links:
```
Home → index.html
Student Login → student.html
Faculty Login → login.html
HOD Login → HOD.html
Principal Login → Principal.html
Submit Grievance → submiit.html (when logged in)
Track Grievance → track.html
Dashboard → Spage.html (for students)
Logout → Clears session, returns to home
```

---

## Test Scenario 8: Data Persistence

### Test Local Storage:
1. Submit a grievance with your custom data
2. Copy the Grievance ID shown in alert
3. Close the browser completely
4. Reopen and navigate to `index.html`
5. Login again as the same student
6. Go to Dashboard
7. **Expected:** Your grievance still appears in the list
8. Track it using the ID you copied
9. **Expected:** All your data is still there

### Clear Data (if needed):
1. Press F12 to open Developer Tools
2. Go to "Application" tab
3. Find "Local Storage"
4. Click the domain URL
5. Select all entries and delete
6. Refresh page
7. Sample data will reload automatically

---

## Test Scenario 9: Multi-User Testing

### Test Different Users:
1. Submit grievance as `john@example.com`
2. Logout
3. Submit grievance as `student@example.com`
4. Logout
5. Login as HOD
6. See both grievances in the table
7. **Expected:** HOD can see all grievances from all students
8. Login as student again
9. **Expected:** Students only see their own grievances

---

## Test Scenario 10: Error Handling

### Invalid Login:
1. Go to any login page
2. Enter wrong password
3. **Expected:** Alert shows "Invalid Login"
4. Page doesn't redirect

### Missing Fields:
1. Try to submit grievance without filling required fields
2. **Expected:** Browser validation prevents submission

### Invalid Grievance ID:
1. Go to Track Grievance
2. Enter non-existent ID
3. **Expected:** Alert shows "Grievance ID not found"

---

## Screenshots to Capture

For project documentation, capture these:

1. Home Page (`index.html`)
2. Student Login Page
3. Student Dashboard with grievances
4. Submit Grievance Form
5. Track Grievance with results
6. HOD Dashboard with table
7. Principal Dashboard with statistics
8. Faculty Dashboard

---

## Common Issues & Solutions

### Issue: Grievances not showing
**Solution:** 
- Clear localStorage via Developer Tools
- Refresh page
- Sample data will reload

### Issue: Can't login
**Solution:**
- Copy-paste credentials to avoid typos
- Check spelling exactly
- Open Developer Tools Console (F12) to see errors

### Issue: Styles not loading
**Solution:**
- Clear browser cache (Ctrl+Shift+Delete)
- Try in incognito/private mode
- Make sure all HTML files are in same directory

### Issue: Navigation not working
**Solution:**
- Check that all HTML files are in the same folder
- Verify file names match links exactly
- Check browser console for 404 errors

---

## Performance Checklist

- ✅ Pages load instantly (no server needed)
- ✅ Forms responsive to clicks
- ✅ Alerts appear immediately
- ✅ Navigation works smoothly
- ✅ Data updates in real-time
- ✅ Mobile responsive
- ✅ No console errors
- ✅ Logout works properly

---

## Test Data Summary

### Pre-loaded Grievances:
```
GRV1001 - John Doe - Lab Equipment Issue - Infrastructure - In Progress
GRV1002 - Jane Smith - Unfair Grading - Academic - Pending
GRV1003 - Rahul Kumar - Hostel Food Quality - Hostel - Resolved
```

### Departments in Sample Data:
- Computer Engineering
- Mechanical Engineering

### Categories Available:
- Academic
- Hostel
- Exam
- Infrastructure
- Harassment

---

## Final Verification Checklist

- ✅ All 5 login pages work
- ✅ Grievance submission generates unique ID
- ✅ Grievance tracking retrieves correct data
- ✅ Student dashboard shows only student's grievances
- ✅ HOD dashboard shows all grievances with update capability
- ✅ Principal dashboard shows correct statistics
- ✅ Form validation prevents empty submissions
- ✅ Anonymous submission option hides name/roll
- ✅ All data persists in localStorage
- ✅ Logout clears session
- ✅ Navigation links work
- ✅ UI is responsive
- ✅ No JavaScript errors
- ✅ Sample data loads on first visit

---

**Total Test Time:** ~30 minutes for all scenarios
**Success Criteria:** All 10 test scenarios pass without errors
