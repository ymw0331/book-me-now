# 🧪 Comprehensive Testing Guide for Book Me Now

## Testing Strategy

### Current Setup
- **Frontend**: Next.js 15 with mock data
- **Backend**: Mock API routes returning static data
- **Database**: No database connection (using mock data)
- **Auth**: Mock authentication (no real JWT validation)

### Testing Options

## Option 1: Test with Mock Data Only (Current - Recommended for Phase 4)
**✅ This is sufficient for Phase 4 validation**

### Advantages:
- No backend dependencies needed
- Fast testing cycles
- Predictable data for consistent testing
- All CRUD operations return success
- Good for UI/UX validation

### What Works:
- All page navigation
- Form submissions (mock success)
- Search and filtering (mock results)
- Auth flow simulation
- UI component interactions
- Responsive design testing

### What Doesn't Work:
- Real data persistence
- Actual authentication
- Real payment processing
- Database queries
- File uploads

---

## Option 2: Connect to Legacy MERN Backend (For Phase 5)
**For full integration testing**

### Setup:
```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start legacy backend
cd 00-legacy-mern
npm install
npm start
# Runs on http://localhost:8000

# Terminal 3: Start Next.js frontend
npm run dev
# Runs on http://localhost:3000
```

### Environment Config:
```env
# apps/web/.env.local
LEGACY_API_URL=http://localhost:8000
DATABASE_URL=mongodb://localhost:27017/book-me-now
JWT_SECRET=your-secret-key
```

---

## 📋 Comprehensive Testing Checklist

### 1. Navigation & Layout Testing
- [x] **Logo/Brand Link**
  - [x] Click BookMe logo → Navigate to homepage
  - [x] Logo serves as home navigation (no redundant Home link)

- [ ] **Main Navigation**
  - [ ] Explore → Search page
  - [ ] Dashboard → User dashboard (requires login)
  - [ ] My Trips → User bookings
  - [ ] Wishlist → Saved properties

- [ ] **Responsive Menu**
  - [ ] Mobile hamburger menu functionality
  - [ ] Tablet view navigation
  - [ ] Desktop full navigation

### 2. Authentication Flow Testing

#### Registration Page (`/register`)
- [ ] **Form Validation**
  - [ ] Empty fields show error messages
  - [ ] Email format validation
  - [ ] Password strength requirements
  - [ ] Password confirmation match
  - [ ] Terms acceptance required

- [ ] **Submission**
  - [ ] Loading state during submission
  - [ ] Success message → Redirect to dashboard
  - [ ] Error handling for existing email

#### Login Page (`/login`)
- [ ] **Form Validation**
  - [ ] Email required and valid format
  - [ ] Password required (min 6 chars)
  - [ ] Remember me checkbox

- [ ] **Submission**
  - [ ] Loading state during login
  - [ ] Success toast → Redirect to dashboard
  - [ ] Error message for invalid credentials
  - [ ] Social login buttons (info message)

### 3. Property Pages Testing

#### Homepage (`/`)
- [ ] **Hero Section**
  - [ ] Search bar visible
  - [ ] Hero image/gradient loads
  - [ ] Call-to-action clear

- [ ] **Featured Properties**
  - [ ] Mock properties display
  - [ ] Property cards render correctly
  - [ ] Favorite button shows toast
  - [ ] Click card → Property details

- [ ] **Statistics**
  - [ ] Stats numbers display
  - [ ] Categories grid renders
  - [ ] Trust indicators section

- [ ] **Newsletter**
  - [ ] Email input field
  - [ ] Subscribe button → Toast message

#### Search Page (`/search`)
- [ ] **Search Bar**
  - [ ] Location input
  - [ ] Date pickers
  - [ ] Guest counter
  - [ ] Search button

- [ ] **Filters Panel**
  - [ ] Price range slider
  - [ ] Property type checkboxes
  - [ ] Amenities selection
  - [ ] Guest rating filter
  - [ ] Clear all filters

- [ ] **Results Grid**
  - [ ] Property cards display
  - [ ] Grid/List view toggle
  - [ ] Sort options
  - [ ] Pagination/Load more

- [ ] **Map View**
  - [ ] Toggle map visibility
  - [ ] Property markers
  - [ ] Info windows

#### Property Details (`/properties/[id]`)
- [ ] **Image Gallery**
  - [ ] Main image displays
  - [ ] Thumbnail navigation
  - [ ] Full-screen view

- [ ] **Property Info**
  - [ ] Title and location
  - [ ] Price per night
  - [ ] Bed/bath count
  - [ ] Description text
  - [ ] Amenities list

- [ ] **Booking Widget**
  - [ ] Check-in/out dates
  - [ ] Guest selector
  - [ ] Price calculation
  - [ ] Book now button

- [ ] **Host Information**
  - [ ] Host name and avatar
  - [ ] Contact host button
  - [ ] Response rate/time

### 4. Dashboard Testing

#### User Dashboard (`/dashboard`)
- [ ] **Overview Cards**
  - [ ] Upcoming bookings
  - [ ] Recent activity
  - [ ] Quick stats

- [ ] **Bookings List**
  - [ ] Booking cards display
  - [ ] Status indicators
  - [ ] Action buttons

#### Host Dashboard (`/dashboard/host`)
- [ ] **Property Management**
  - [ ] List of properties
  - [ ] Add new property button
  - [ ] Edit/Delete actions
  - [ ] View analytics

- [ ] **Booking Requests**
  - [ ] Pending requests
  - [ ] Accept/Reject buttons
  - [ ] Guest information

#### My Trips (`/dashboard/trips`)
- [ ] **Upcoming Trips**
  - [ ] Trip cards with details
  - [ ] Cancel booking option
  - [ ] View property link

- [ ] **Past Trips**
  - [ ] History list
  - [ ] Leave review button
  - [ ] Rebook option

#### Settings (`/dashboard/settings`)
- [ ] **Profile Settings**
  - [ ] Edit name/email
  - [ ] Change password
  - [ ] Upload avatar

- [ ] **Payment Methods**
  - [ ] Add card form
  - [ ] Saved cards list
  - [ ] Set default

### 5. CRUD Operations Testing

#### Create (C)
- [ ] **New Property (`/properties/new`)**
  - [ ] Multi-step form
  - [ ] Image upload area
  - [ ] Form validation
  - [ ] Save draft
  - [ ] Publish property

- [ ] **New Booking**
  - [ ] Select dates
  - [ ] Guest details
  - [ ] Payment info
  - [ ] Confirmation page

#### Read (R)
- [ ] **View Properties**
  - [ ] List pagination
  - [ ] Search functionality
  - [ ] Filter results

- [ ] **View Bookings**
  - [ ] Booking details
  - [ ] Receipt/Invoice
  - [ ] Guest information

#### Update (U)
- [ ] **Edit Property (`/properties/[id]/edit`)**
  - [ ] Load existing data
  - [ ] Update fields
  - [ ] Save changes
  - [ ] Success message

- [ ] **Update Profile**
  - [ ] Edit user info
  - [ ] Change settings
  - [ ] Save preferences

#### Delete (D)
- [ ] **Delete Property**
  - [ ] Confirmation modal
  - [ ] Success message
  - [ ] Redirect to list

- [ ] **Cancel Booking**
  - [ ] Cancellation reason
  - [ ] Refund info
  - [ ] Confirmation

### 6. Payment Flow Testing

#### Stripe Integration
- [ ] **Checkout Session**
  - [ ] Redirect to Stripe (mock)
  - [ ] Payment form

- [ ] **Success Page (`/stripe/success`)**
  - [ ] Success message
  - [ ] Booking confirmation
  - [ ] Email sent notification

- [ ] **Cancel Page (`/stripe/cancel`)**
  - [ ] Cancellation message
  - [ ] Try again button
  - [ ] Contact support

### 7. Error Handling Testing

- [ ] **404 Pages**
  - [ ] Invalid routes → 404 page
  - [ ] Back to home link

- [ ] **API Errors**
  - [ ] Network errors → Toast message
  - [ ] Server errors → Error boundary

- [ ] **Form Errors**
  - [ ] Validation messages
  - [ ] Field highlighting
  - [ ] Error summary

### 8. Performance Testing

- [ ] **Page Load Times**
  - [ ] Initial load < 3s
  - [ ] Route transitions smooth
  - [ ] Image lazy loading

- [ ] **Build Metrics**
  - [ ] Build completes without errors
  - [ ] Bundle size acceptable
  - [ ] All pages pre-render

### 9. Responsive Design Testing

- [ ] **Mobile (320px - 768px)**
  - [ ] Navigation menu works
  - [ ] Cards stack vertically
  - [ ] Forms usable
  - [ ] Modals fit screen

- [ ] **Tablet (768px - 1024px)**
  - [ ] Grid layouts adjust
  - [ ] Navigation visible
  - [ ] Sidebar/content layout

- [ ] **Desktop (1024px+)**
  - [ ] Full navigation
  - [ ] Multi-column layouts
  - [ ] Hover effects work

### 10. Accessibility Testing

- [ ] **Keyboard Navigation**
  - [ ] Tab through elements
  - [ ] Enter/Space activation
  - [ ] Escape closes modals

- [ ] **Screen Reader**
  - [ ] Alt text for images
  - [ ] ARIA labels
  - [ ] Semantic HTML

---

## Testing Commands

```bash
# Run development server
npm run dev

# Build and check for errors
npm run build

# Type checking
npm run type-check

# Linting
npm run lint

# Start production build locally
npm run build && npm run start

# Test with different viewports
# Open Chrome DevTools → Toggle device toolbar
```

---

## Test Data Reference

### Mock Users
```javascript
// Admin
email: admin@bookmenow.com
password: admin123

// Regular User
email: user@example.com
password: password123

// Host
email: host@example.com
password: host123
```

### Mock Properties
- All properties return from API with static data
- Images from picsum.photos
- Prices: $100-$600/night
- Locations: New York, Miami, Aspen, Boston

---

## Current Testing Status

### ✅ What's Working (with Mock Data):
1. All pages render without errors
2. Navigation between pages
3. Form submissions (mock success)
4. Toast notifications
5. Responsive layouts
6. Search page with filters
7. Property cards display
8. Dashboard pages load
9. Auth pages with validation
10. Build completes successfully

### ⚠️ What Needs Real Backend:
1. Actual user authentication
2. Data persistence
3. Real property search
4. Booking creation
5. Payment processing
6. Image uploads
7. Email notifications
8. User sessions

---

## Recommendation for Current Phase

**For Phase 4 Validation: Use Mock Data Testing**
- All UI/UX can be validated
- Component interactions work
- Forms submit successfully (mock)
- Navigation flow is complete
- Good enough to demonstrate functionality

**For Phase 5 (Production Ready): Connect Legacy Backend**
- Real authentication
- Database persistence
- Actual CRUD operations
- Payment integration
- Full end-to-end testing

---

## Quick Test Sequence

1. **Start the app**: `npm run dev`
2. **Open browser**: http://localhost:3000
3. **Test navigation**: Click through all nav items
4. **Test auth**: Register → Login → Logout
5. **Test search**: Use filters, view results
6. **Test property**: View details, try booking
7. **Test dashboard**: Check all tabs
8. **Test responsive**: Resize window
9. **Build check**: `npm run build`
10. **Celebrate**: Phase 4 complete! 🎉