# 🚀 Step-by-Step Test Walkthrough

## Pre-Test Setup

```bash
# 1. Start the development server
npm run dev

# 2. Open browser
http://localhost:3000

# 3. Open DevTools Console (F12) to watch for errors
```

---

## 📝 Test Flow: Follow These Steps in Order

### STEP 1: Homepage Exploration (Not Logged In)
**URL:** http://localhost:3000

✅ **Check these elements:**
1. [ ] BookMe logo is visible (top-left)
2. [ ] Click BookMe logo → stays on homepage
3. [ ] "Explore" link is visible in navigation
4. [ ] "Login" button is visible (top-right)
5. [ ] "Sign up" button is visible
6. [ ] Search bar shows in hero section
7. [ ] Featured properties show (4 cards)
8. [ ] Click on a property card → Should redirect to login (not logged in)
9. [ ] Stats section shows (25,000 hotels, etc.)
10. [ ] Newsletter signup → Enter email → Click Subscribe → See success toast

**Expected Result:** Homepage loads, all sections visible, clicking protected content redirects to login

---

### STEP 2: User Registration
**URL:** Click "Sign up" or go to http://localhost:3000/register

✅ **Test the registration form:**

1. **Test validation (submit empty form first):**
   - [ ] Click "Create account" with empty fields
   - [ ] See error: "Name is required"
   - [ ] See error: "Email is required"
   - [ ] See error: "Password is required"
   - [ ] See error: "You must accept the terms"

2. **Test password mismatch:**
   - [ ] Fill in:
     - Name: `John Doe`
     - Email: `john@example.com`
     - Password: `Password123`
     - Confirm Password: `Different123`
   - [ ] See error: "Passwords do not match"

3. **Test weak password:**
   - [ ] Enter password: `123`
   - [ ] See error: "Password must be at least 6 characters"

4. **Successful registration:**
   - [ ] Fill in:
     - Name: `John Doe`
     - Email: `john@example.com`
     - Password: `Password123`
     - Confirm Password: `Password123`
   - [ ] Check "I agree to Terms and Conditions"
   - [ ] Click "Create account"
   - [ ] See loading spinner
   - [ ] See success toast: "Account created successfully! Welcome aboard!"
   - [ ] Redirected to dashboard

**Expected Result:** Form validation works, successful registration shows toast and redirects

---

### STEP 3: User Login
**URL:** http://localhost:3000/login

✅ **Test the login flow:**

1. **Test validation:**
   - [ ] Click "Sign in" with empty fields
   - [ ] See error: "Email is required"
   - [ ] See error: "Password is required"

2. **Test invalid email format:**
   - [ ] Enter email: `notanemail`
   - [ ] See error: "Invalid email address"

3. **Successful login:**
   - [ ] Fill in:
     - Email: `john@example.com`
     - Password: `Password123`
   - [ ] Check "Remember me for 30 days"
   - [ ] Click "Sign in"
   - [ ] See loading: "Signing in..."
   - [ ] See success toast: "Welcome back!"
   - [ ] Redirected to dashboard

4. **Test social login buttons:**
   - [ ] Click "Google" → See info toast: "Google login coming soon!"
   - [ ] Click "GitHub" → See info toast: "GitHub login coming soon!"

**Expected Result:** Login works with validation, shows success toast

---

### STEP 4: Dashboard (Logged In User)
**URL:** http://localhost:3000/dashboard

✅ **Check dashboard elements:**
1. [ ] Navigation now shows: Explore, Dashboard, My Trips, Wishlist
2. [ ] User menu appears (top-right with avatar)
3. [ ] Dashboard welcome message
4. [ ] Recent bookings section (empty or mock data)
5. [ ] Quick stats cards
6. [ ] Upcoming trips section

**Expected Result:** Dashboard loads with user-specific navigation

---

### STEP 5: Search & Browse Properties
**URL:** Click "Explore" or http://localhost:3000/search

✅ **Test search functionality:**

1. **Search bar:**
   - [ ] Enter location: `New York`
   - [ ] See search results update (mock data)

2. **Filters panel (left side):**
   - [ ] **Price range:** Drag slider from $0 to $500
   - [ ] **Property type:** Check "Hotels" and "Apartments"
   - [ ] **Amenities:** Check "Free WiFi" and "Breakfast"
   - [ ] **Guest rating:** Select "4+ stars"
   - [ ] See: "12 properties found" (or similar)

3. **Results interaction:**
   - [ ] Property cards display with images
   - [ ] Price per night visible
   - [ ] Rating stars visible
   - [ ] Superhost badges on some properties
   - [ ] Heart icon for favorites → Click → See toast: "Favorites coming soon!"

4. **View switching:**
   - [ ] Click grid view icon (if available)
   - [ ] Click list view icon (if available)

5. **Clear filters:**
   - [ ] Click "Clear all" → Filters reset
   - [ ] All properties show again

**Expected Result:** Search page works, filters apply (mock), properties display

---

### STEP 6: View Property Details (READ)
**URL:** Click any property card from search

✅ **Check property details page:**

1. **Main elements:**
   - [ ] Property title displays
   - [ ] Location shows
   - [ ] Price per night visible
   - [ ] Main image displays
   - [ ] "4 beds" or similar info

2. **Description section:**
   - [ ] Property description text
   - [ ] Amenities list
   - [ ] Check-in/out times

3. **Booking widget (right side):**
   - [ ] Price per night shows
   - [ ] Date selection fields
   - [ ] Guest counter
   - [ ] "Reserve" or "Book Now" button

4. **Host information:**
   - [ ] Host name
   - [ ] Host avatar/image
   - [ ] "Contact Host" button

5. **Try to book:**
   - [ ] Select check-in date: Tomorrow
   - [ ] Select check-out date: 3 days from now
   - [ ] Guests: 2
   - [ ] Click "Book Now"
   - [ ] See toast or redirect to payment

**Expected Result:** Property details display, booking widget interactive

---

### STEP 7: Create New Property (CREATE - Host Mode)
**URL:** http://localhost:3000/properties/new

✅ **Test property creation form:**

1. **Step 1 - Basic Info:**
   - [ ] Title: `Beautiful Beach House`
   - [ ] Property Type: Select "House"
   - [ ] Location: `Miami Beach, FL`
   - [ ] Click "Next"

2. **Step 2 - Details:**
   - [ ] Bedrooms: 3
   - [ ] Bathrooms: 2
   - [ ] Max Guests: 6
   - [ ] Description: `Stunning beachfront property with ocean views`
   - [ ] Click "Next"

3. **Step 3 - Amenities:**
   - [ ] Check: WiFi, Parking, Kitchen, Air conditioning
   - [ ] Click "Next"

4. **Step 4 - Pricing:**
   - [ ] Price per night: $250
   - [ ] Cleaning fee: $50
   - [ ] Service fee: Auto-calculated
   - [ ] Click "Next"

5. **Step 5 - Photos:**
   - [ ] Upload area visible
   - [ ] Skip for now (mock)
   - [ ] Click "Next"

6. **Step 6 - Availability:**
   - [ ] Set available from: Today
   - [ ] Set available to: 6 months from now
   - [ ] Click "Publish"

7. **Result:**
   - [ ] See success toast: "Property created successfully!"
   - [ ] Redirected to property page or dashboard

**Expected Result:** Multi-step form works, validation triggers, success message shows

---

### STEP 8: Edit Property (UPDATE)
**URL:** http://localhost:3000/properties/[id]/edit

✅ **Test property editing:**

1. **Load existing data:**
   - [ ] Form pre-fills with property data
   - [ ] All fields editable

2. **Make changes:**
   - [ ] Change title to: `Updated Beach House - Now with Pool!`
   - [ ] Change price to: $299
   - [ ] Add amenity: Swimming Pool
   - [ ] Update description

3. **Save changes:**
   - [ ] Click "Update Property"
   - [ ] See loading state
   - [ ] See success toast: "Property updated!"
   - [ ] Redirected to property page

**Expected Result:** Edit form loads with data, changes save successfully

---

### STEP 9: My Trips / Bookings (READ)
**URL:** http://localhost:3000/dashboard/trips

✅ **Check bookings page:**

1. **Upcoming trips:**
   - [ ] Trip cards display (or "No upcoming trips")
   - [ ] Each card shows:
     - Property image
     - Property name
     - Check-in/out dates
     - Total price
     - Status badge

2. **Past trips:**
   - [ ] Historical bookings section
   - [ ] "Leave Review" button
   - [ ] "Book Again" button

3. **Actions:**
   - [ ] Click "View Details" → Opens booking details
   - [ ] Click "Cancel Booking" → See confirmation modal
   - [ ] Click "Leave Review" → See toast: "Reviews coming soon!"

**Expected Result:** Trips page loads, booking cards display

---

### STEP 10: Host Dashboard (Host View)
**URL:** http://localhost:3000/dashboard/host

✅ **Check host features:**

1. **Property listings:**
   - [ ] "My Properties" section
   - [ ] Property cards with:
     - Edit button
     - Delete button
     - View button
     - Status indicator

2. **Booking requests:**
   - [ ] Incoming bookings section
   - [ ] Accept/Decline buttons
   - [ ] Guest information

3. **Analytics:**
   - [ ] Views count
   - [ ] Bookings count
   - [ ] Revenue (mock data)

4. **Delete property (DELETE):**
   - [ ] Click delete icon on a property
   - [ ] See confirmation modal: "Are you sure?"
   - [ ] Click "Delete"
   - [ ] See success toast: "Property deleted!"
   - [ ] Property removed from list

**Expected Result:** Host dashboard shows properties, delete works with confirmation

---

### STEP 11: Payment Flow
**URL:** From property booking

✅ **Test checkout process:**

1. **Initiate payment:**
   - [ ] From property page, click "Book Now"
   - [ ] Review booking details
   - [ ] Click "Proceed to Payment"

2. **Stripe checkout (Mock):**
   - [ ] Redirected to checkout
   - [ ] See booking summary
   - [ ] Price breakdown visible

3. **Success flow:**
   - [ ] Go to: http://localhost:3000/stripe/success
   - [ ] See success message
   - [ ] "Your booking is confirmed!"
   - [ ] Booking reference number
   - [ ] "View Booking" button

4. **Cancel flow:**
   - [ ] Go to: http://localhost:3000/stripe/cancel
   - [ ] See cancellation message
   - [ ] "Payment was cancelled"
   - [ ] "Try Again" button
   - [ ] "Contact Support" link

**Expected Result:** Payment pages load with appropriate messages

---

### STEP 12: User Settings
**URL:** http://localhost:3000/dashboard/settings

✅ **Test settings page:**

1. **Profile settings:**
   - [ ] Name field shows current name
   - [ ] Email field shows current email
   - [ ] Phone number field
   - [ ] Bio/About field

2. **Change password:**
   - [ ] Current password field
   - [ ] New password field
   - [ ] Confirm password field
   - [ ] Click "Update Password" → See toast

3. **Payment methods:**
   - [ ] "Add Payment Method" button
   - [ ] Saved cards list (empty or mock)

4. **Notifications:**
   - [ ] Email notifications toggle
   - [ ] SMS notifications toggle
   - [ ] Marketing emails toggle

5. **Save changes:**
   - [ ] Make any change
   - [ ] Click "Save Settings"
   - [ ] See success toast: "Settings updated!"

**Expected Result:** Settings page loads, forms interactive, changes show success

---

### STEP 13: Logout
**URL:** Click user menu → Logout

✅ **Test logout:**
1. [ ] Click avatar menu (top-right)
2. [ ] Click "Logout"
3. [ ] Redirected to homepage
4. [ ] Navigation shows "Login" and "Sign up" again
5. [ ] Try to access http://localhost:3000/dashboard → Redirected to login

**Expected Result:** Logout works, protected routes redirect to login

---

### STEP 14: Error Handling
**URL:** Various

✅ **Test error scenarios:**

1. **404 Page:**
   - [ ] Go to: http://localhost:3000/nonexistent
   - [ ] See 404 error page
   - [ ] "Page not found" message
   - [ ] "Back to Home" button works

2. **Protected routes:**
   - [ ] While logged out, try: http://localhost:3000/dashboard
   - [ ] Redirected to login page

3. **Invalid property:**
   - [ ] Go to: http://localhost:3000/properties/invalid-id
   - [ ] See error or redirect

**Expected Result:** Error pages display, protected routes redirect

---

### STEP 15: Responsive Testing
**URL:** Any page

✅ **Test different screen sizes:**

1. **Mobile (iPhone SE - 375px):**
   - [ ] Open DevTools (F12)
   - [ ] Toggle device toolbar
   - [ ] Select iPhone SE
   - [ ] Navigation becomes hamburger menu
   - [ ] Click hamburger → Menu opens
   - [ ] Property cards stack vertically
   - [ ] Forms fit screen

2. **Tablet (iPad - 768px):**
   - [ ] Select iPad
   - [ ] Navigation visible
   - [ ] 2-column grid for properties
   - [ ] Sidebar layouts work

3. **Desktop (1920px):**
   - [ ] Full navigation visible
   - [ ] 4-column grid for properties
   - [ ] All hover effects work

**Expected Result:** Layout adapts to all screen sizes

---

## 🎯 Final Checklist

### Core Functionality Status:
- [ ] ✅ Registration works with validation
- [ ] ✅ Login works with authentication
- [ ] ✅ Homepage displays content
- [ ] ✅ Search page with filters
- [ ] ✅ Property details page
- [ ] ✅ Dashboard pages load
- [ ] ✅ CRUD operations show success toasts
- [ ] ✅ Navigation works throughout
- [ ] ✅ Responsive design adapts
- [ ] ✅ Error handling in place
- [ ] ✅ Logout functionality
- [ ] ✅ Build completes without errors

---

## 📊 Test Results Summary

```markdown
Total Tests: 15 sections
Passed: _____ / 15
Failed: _____ / 15

Issues Found:
1. ________________________________
2. ________________________________
3. ________________________________

Notes:
- All forms submit successfully (mock)
- All CRUD operations return success (mock)
- No real data persistence (as expected)
- UI/UX fully functional
```

---

## 🚨 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Page not loading | Check `npm run dev` is running |
| Blank page | Check browser console for errors |
| Toast not showing | Check Toaster component in layout |
| Forms not submitting | Check validation errors |
| Navigation missing items | Check login status |
| Styles broken | Run `npm run build` to check |
| 404 errors | Check URL spelling |
| No mock data | Normal - using static mock data |

---

## ✅ Test Complete!

If all tests pass, Phase 4 is validated and ready!

**Next Steps:**
1. Run `npm run build` one final time
2. Check no console errors
3. Phase 4 complete! 🎉

**For Phase 5:**
- Connect real backend
- Add real authentication
- Implement data persistence
- Add payment processing