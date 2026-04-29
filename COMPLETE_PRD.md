# BUILD_MATCH - Complete Product Requirements Document (v2.0)
**Last Updated:** April 12, 2026  
**Status:** Ready for Project Transfer/Restart

---

## SECTION 1: EXECUTIVE SUMMARY

### Project Overview
**BUILD_MATCH** is a B2B marketplace platform that connects real estate developers with skilled contractors. The platform eliminates the trust deficit in the renovation industry by providing:
- Transparent bidding system with competitive pricing
- Secure escrow payments via Stripe integration
- In-app messaging for direct collaboration
- Role-based dashboards for different user types
- Detailed contractor profiles with ratings and reviews

### Problems Solved
1. **Trust Gap:** Contractors are unknown; developers fear overpaying or being scammed
2. **Inefficient Discovery:** Manual contractor search is time-consuming
3. **Payment Risk:** No protection for either party during project execution
4. **Communication Friction:** Multiple platforms (email, phone, text) for coordination
5. **Verification:** No way to verify contractor qualifications and past performance

### Market Opportunity
- US construction industry: $1.7 trillion annually
- Small renovation projects (<$50k): $400B market
- Current platforms (Upwork, TaskRabbit) don't serve real estate developers well
- **Target MVP:** Local contractors and small-to-medium developers (10-50 employees)

---

## SECTION 2: TECHNOLOGY STACK

### Frontend
```
Framework:           Expo 54 (React Native)
Routing:             expo-router
UI Library:          Custom React Native components
Styling:             Tailwind CSS v4 + Uniwind
Icons:               Tabler Icons (React Native)
Charts/Graphs:       (Planned future)
HTTP Client:         Fetch API (custom wrapper)
State Management:    React Hooks + Context API
Storage:             AsyncStorage (user data), SecureStore (tokens)
Animations:          react-native-reanimated v4.1.1
Date Handling:       JavaScript Date object (no library)
```

### Backend (Reference/Requirements)
```
Language:            Python 3.11+
Framework:           FastAPI 0.100+
Database:            MongoDB 6.0+
Async Driver:        motor (async MongoDB driver)
Auth:                JWT (jsonwebtoken)
Password Hashing:    bcrypt
Payments:            Stripe API (via emergentintegrations)
Webhooks:            Stripe webhooks for payment events
Caching:             Redis (optional, for message polling optimization)
```

### Infrastructure
```
Mobile Deployment:   EAS (Expo Application Services)
Web Hosting:         Vercel or EAS Hosting
Database Hosting:    MongoDB Atlas
API Hosting:         Railway, Render, or AWS EC2
Payment Gateway:     Stripe (production account required)
Email Service:       Sendgrid (optional, for transactional emails)
```

---

## SECTION 3: USER ROLES & PERSONAS

### Role 1: Developer
**Definition:** Real estate developers, homeowners, or project managers seeking contractors

**Characteristics:**
- Budget-conscious and quality-focused
- Multiple active projects simultaneously
- Need transparency in pricing and timelines
- Manage team communications
- Want to build relationships with trusted contractors

**Key Needs:**
- Post jobs quickly with clear requirements
- View multiple bids for comparison
- Secure escrow payment flow
- Direct communication with bidding contractors
- Job status tracking and history

**Permissions:**
- ✅ Create, read, update, delete own jobs
- ✅ View all contractor profiles
- ✅ Accept bids and initiate payments
- ✅ Message contractors
- ✅ View conversation history
- ✅ Manage profile and company info

### Role 2: Contractor
**Definition:** Individual contractors or small firms offering services

**Characteristics:**
- Compete on reputation and past work
- Value steady income stream
- Prefer clear project scopes
- Build long-term client relationships
- Responsive communicators

**Key Needs:**
- Browse available jobs matching skills
- Submit competitive bids
- Manage multiple active bids
- Direct communication with developers
- Profile visibility and reputation building
- Easy project tracking

**Permissions:**
- ✅ Create, read, update own profile
- ✅ Browse all jobs
- ✅ Submit and manage own bids
- ✅ Message developers
- ✅ View conversation history
- ❌ Cannot view other contractors
- ❌ Cannot modify other users' data

### Role 3: Admin (Backend Only)
**Definition:** Platform administrators for maintenance and moderation

**Permissions:**
- ✅ Create seed admin user on startup
- ✅ View all users, jobs, bids
- ✅ Moderate content if needed
- ✅ Manage payment disputes
- ✅ Generate analytics reports

---

## SECTION 4: COMPLETE FEATURE LIST

### 4.1 Authentication & Authorization
**Feature:** User Registration
- Sign up as Developer or Contractor
- Email/password registration (role selection)
- OAuth future consideration (Google, Apple)
- Email verification (backend responsibility)

**Feature:** User Login
- Email and password authentication
- JWT token generation
- Token storage in SecureStore (not AsyncStorage)
- "Remember me" functionality via persistent tokens
- Automatic logout on token expiration
- Password reset flow (backend requirement)

**Feature:** Session Management
- Bearer token in Authorization header
- Token refresh mechanism
- Automatic logout on 401 unauthorized
- Session activity tracking (optional)

---

### 4.2 Developer Features

#### Dashboard
**Purpose:** Overview of all posted jobs and project activity

**Displays:**
- Total jobs posted (stat)
- Open jobs pending bids (stat)
- Jobs in progress (stat)
- Recent job activity timeline
- Quick action buttons:
  - "Post a New Job" (primary CTA)
  - "View My Jobs" (secondary CTA if has jobs)
  - "Find Contractors" (link to search)

**Empty State:**
- Encouraging message when no jobs posted
- "Post Your First Job" call-to-action
- Guide on how marketplace works

**Activity Timeline:**
- Shows recent bids received
- Shows bid acceptances
- Shows payment status updates
- Shows contractor messages
- Color-coded by status (open=blue, accepted=green, paid=gold)

---

#### Job Management

**Feature: Create Job**
- Title input (required)
- Detailed description (required, rich text nice-to-have)
- Category dropdown (Plumbing, Electrical, HVAC, Carpentry, General, Other)
- Budget range inputs:
  - Minimum budget (required, numeric)
  - Maximum budget (required, numeric)
  - Validation: max > min
- Location input (required, geocoding optional)
- Duration estimate (optional dropdown: <1 week, 1-2 weeks, 2-4 weeks, 1-2 months, 2+ months)
- Skills required (optional, comma-separated tags)
- Attachments (photos/documents, future feature)
- Preview before posting
- Submit button sends to backend

**Feature: View My Jobs**
- List of all posted jobs
- Filter/sort by:
  - Status (open, in_progress, completed, archived)
  - Date posted (newest first)
  - Budget
- Card display per job:
  - Job title
  - Category badge
  - Location
  - Budget range
  - Number of bids received
  - Status indicator
  - Tap to view details

**Feature: Job Details Screen**
- Full job information display
- Bid list (all bids for this job):
  - Contractor name/rating
  - Bid amount
  - Proposal excerpt
  - Estimated duration
  - Status (pending, accepted, rejected)
- "Accept Bid" button on each pending bid
- "Message Contractor" quick action
- Job status indicator
- Option to edit job (if still open)
- Option to close/archive job

---

#### Bid Management

**Feature: View & Manage Bids**
- All bids on each job listed with:
  - Contractor profile info
  - Bid amount
  - Full proposal text
  - Estimated project duration
  - Submission date
- Sort bids by:
  - Amount (low to high)
  - Date (newest first)
  - Contractor rating (highest first)

**Feature: Accept Bid**
- "Accept" button on each bid
- Confirmation modal before accepting
- Transitions job status to "in_progress"
- Generates payment escrow
- Initiates Stripe payment flow

**Feature: Reject Bid**
- "Reject" button on each pending bid
- Optional rejection reason (nice-to-have feedback)
- Keeps job in "open" state for more bids

---

#### Escrow Payment Management

**Feature: Initialize Escrow Payment**
- After accepting a bid:
  - Display payment summary (bid amount, platform fee, total)
  - Full name, company info pre-filled
  - Payment method selection
- Redirect to Stripe payment page
- Handle payment success/failure

**Feature: Payment Status Tracking**
- Poll `GET /api/payments/status/{sessionId}` every 3 seconds
- Display loading state during polling
- Handle timeout (30 seconds max)
- Show:
  - Payment amount
  - Status (pending, completed, failed, cancelled)
  - Timestamp
  - Transaction receipt button (future)

**Feature: Payment Confirmation**
- Success screen after payment completes
- Display confirmation number
- "View Job" button to return to job details
- "Message Contractor" button to start communication

---

#### Contractor Search & Discovery

**Feature: Search/Browse Contractors**
- Tab in bottom navigation labeled "Search"
- Search bar with filters:
  - Keyword search (name, skills, company)
  - Category filter (Plumbing, Electrical, etc.)
  - Location filter (radius or zip code)
  - Minimum rating (stars: 4.5+, 4.0+, 3.5+, all)
  - Hourly rate range slider
  - Experience years (1+, 3+, 5+, 10+)
- Results display:
  - Contractor card with:
    - Avatar (initials)
    - Name
    - Rating (stars) and review count
    - Hourly rate
    - Top 3 skills
    - Location
    - "View Profile" button
- Infinite scroll or pagination
- Shows "No results" with helpful message

**Feature: Contractor Profile (View Only for Developer)**
- Header section:
  - Avatar, name, role badge, rating
- Stats row:
  - Jobs completed
  - Avg. rating
  - Hourly rate
  - Location
- About section (bio)
- Company name
- Skills list (all skills, not just top 3)
- Experience years
- "Send Message" button (primary action)
- "View Messages" button if conversation exists

---

### 4.3 Contractor Features

#### Dashboard
**Purpose:** Overview of available job opportunities and active bids

**Displays:**
- Recommended jobs (based on skills match)
- Jobs you've bid on (in progress)
- Stats:
  - Active bids
  - Jobs completed
  - Rating (if applicable)
  - Hourly rate
- Recent messages from developers
- Quick actions:
  - "Browse Jobs" button
  - "View My Bids" button
  - "Complete Profile" notification (if incomplete)

**Empty State** (New contractor):
- "Start finding work" message
- "Browse jobs that fit your trade" description
- "Browse Jobs" CTA

---

#### Profile Management

**Feature: View Profile**
- Avatar with initials
- Name and role badge
- Stat cards:
  - Jobs completed
  - Rating (stars)
  - Hourly rate
- "Edit Profile" button
- About bio (if filled)
- Company name (if filled)
- Location
- Skills tags
- Experience years

**Feature: Edit Profile**
- Form fields:
  - Name (pre-filled)
  - Bio/About text area (optional)
  - Phone number (optional)
  - Location (required for search results)
  - Company name (optional)
  - **Contractor-specific:**
    - Hourly rate (required, numeric)
    - Experience years (optional, numeric)
    - Skills (comma-separated tags, optional)
- "Save Changes" button with loading state
- Success toast notification
- Validation errors displayed inline

**Feature: Completion Check**
- New contractor sees "Complete your profile" banner
- Reminder until all fields filled
- Fields required: bio, location, hourly_rate, skills
- Prevents profile visibility until complete (optional enforcement)

---

#### Job Discovery & Bidding

**Feature: Browse Available Jobs**
- Master job list with filtering:
  - Category filter
  - Budget range slider
  - Location filter
  - Skills/keywords search
- Job cards display:
  - Title
  - Category badge
  - Location
  - Budget range
  - Tap to view full details
- Sort options:
  - Newest first
  - Budget (low to high)
  - Closest location
- Infinite scroll pagination

**Feature: View Job Details (as Contractor)**
- Full job description
- Developer name and rating (if available)
- Budget range
- Location
- Category
- Skills required (compared to your skills, visually highlight matches)
- Duration estimate
- Number of other bids received
- "Submit Bid" button (primary action)
- Message developer button (secondary action)

**Feature: Submit Bid**
- Modal/screen with form:
  - Your bid amount (currency input required)
  - Your proposal (text area, required, min 50 chars recommended)
  - Estimated completion duration
  - "Submit Bid" button
  - "Message Developer" option before submitting (nice-to-have)
- Confirmation before submitting
- Success message: "Bid submitted! Developer will review and may message you"
- Redirect to "My Bids" view

**Feature: Manage Your Bids**
- List of all bids you've submitted:
  - Status badge (pending, accepted, rejected)
  - Job title
  - Your bid amount
  - Developer name
  - Date submitted
- Grouped by status (pending, active, completed)
- Sort options

**Feature: View Bid Details**
- Full job info
- Your bid details
- Status and timeline
- Developer response (if rejected, optional feedback)
- "Message Developer" button if pending/accepted

---

### 4.4 Messaging Features

#### In-App Messaging System

**Feature: Conversations List**
- Tab in bottom navigation labeled "Messages"
- List of active conversations:
  - Other user name and avatar
  - Last message preview (truncated)
  - Last message timestamp (relative time)
  - Unread indicator (dot or badge count)
  - Swipe to archive/delete (optional)
- "No conversations" empty state message
- Pull-to-refresh functionality
- Search conversations (future feature)

**Feature: Conversation View**
- Header with other user name, profile link
- Message list (scrollable, newest at bottom):
  - Message bubbles showing:
    - Sender name (only if needed)
    - Message content
    - Timestamp (grouped by day if old messages)
    - Seen indicator (optional)
- Text input at bottom:
  - Keyboard-aware, stays above keyboard
  - Placeholder text: "Type a message..."
  - Send button (disabled if empty)
  - Emoji picker (nice-to-have)
- Auto-scroll to newest message on open
- Auto-refresh messages every 5 seconds (polling, **to be optimized to WebSocket**)

**Feature: Start Conversation**
- "Message" button on contractor profile (Developer action)
- "Message" button on developer profile (Contractor action)
- Pre-filled recipient
- Initial message optional
- Conversation created on first message send

**Feature: Conversation Management**
- Archive conversation (removes from list, keeps history)
- Delete conversation (removes list item and history)
- Mark as read (auto on view, manual option)
- Notification for new message (badge count on tab)

---

### 4.5 Search Features

#### Job Search (Contractor View)
- Covered under "Job Discovery & Bidding" above
- Full-text search on job title, description, category
- Filter combinations (location + budget + skills)
- Sort by relevance, date, budget

#### Contractor Search (Developer View)
- Covered under "Contractor Search & Discovery" above
- Filter by skills, location, rating, rate, experience
- Sort by rating, experience, hourly rate

---

## SECTION 5: DATABASE SCHEMA

### Collection: `users`
```javascript
{
  _id: ObjectId,
  email: string (unique),
  password_hash: string (bcrypt),
  name: string,
  role: "contractor" | "developer",
  
  // Common fields (both roles)
  phone: string (optional),
  location: string (optional),
  company_name: string (optional),
  bio: string (optional),
  avatar_url: string (optional),
  created_at: timestamp,
  updated_at: timestamp,
  
  // Contractor-specific
  hourly_rate: number (optional),
  experience_years: number (optional),
  skills: [string], // ["Plumbing", "Electrical"]
  jobs_completed: number (default: 0),
  rating: number (0-5 stars, optional),
  review_count: number (default: 0),
  
  // Developer-specific
  experience_years: number (optional),
  
  // Status
  is_verified: boolean (default: false),
  is_active: boolean (default: true),
  last_login: timestamp (optional),
}
```

### Collection: `jobs`
```javascript
{
  _id: ObjectId,
  developer_id: ObjectId (ref: users),
  developer_name: string (denormalized for display),
  title: string,
  description: string,
  category: string, // "Plumbing", "Electrical", "HVAC", "Carpentry", "General", "Other"
  location: string,
  budget_min: number,
  budget_max: number,
  duration: string (optional), // "<1 week", "1-2 weeks", "2-4 weeks", "1-2 months", "2+ months"
  skills_required: [string] (optional),
  status: string, // "open", "in_progress", "completed", "closed"
  
  // Bid tracking
  bids_count: number (default: 0),
  accepted_bid_id: ObjectId (optional, ref: bids),
  accepted_contractor_id: ObjectId (optional, ref: users),
  
  // Timestamps
  created_at: timestamp,
  updated_at: timestamp,
  completed_at: timestamp (optional),
  
  // Images (future feature)
  attachments: [
    {
      url: string,
      type: string, // "image", "pdf", "doc"
      uploaded_at: timestamp,
    }
  ],
}
```

### Collection: `bids`
```javascript
{
  _id: ObjectId,
  job_id: ObjectId (ref: jobs, indexed),
  contractor_id: ObjectId (ref: users, indexed),
  contractor_name: string (denormalized),
  amount: number,
  proposal: string (min 50 chars required),
  estimated_duration: string (optional),
  status: string, // "pending", "accepted", "rejected", "cancelled"
  
  rejection_reason: string (optional),
  
  created_at: timestamp,
  updated_at: timestamp,
}
```

### Collection: `conversations`
```javascript
{
  _id: ObjectId,
  participant_1_id: ObjectId (ref: users),
  participant_2_id: ObjectId (ref: users),
  
  // Denormalized for quick lookup
  participant_1_name: string,
  participant_2_name: string,
  
  last_message: string (preview text),
  last_message_timestamp: timestamp,
  last_message_sender_id: ObjectId,
  
  read_by: {
    [user_id]: timestamp (of last read)
  },
  
  created_at: timestamp,
  updated_at: timestamp,
  
  // Index: compound unique on (participant_1_id, participant_2_id)
}
```

### Collection: `messages`
```javascript
{
  _id: ObjectId,
  conversation_id: ObjectId (ref: conversations, indexed),
  sender_id: ObjectId (ref: users, indexed),
  content: string,
  
  read: boolean (default: false),
  read_at: timestamp (optional),
  
  edited: boolean (default: false),
  edited_at: timestamp (optional),
  
  created_at: timestamp,
  
  // Index: (conversation_id, created_at) for sort efficiency
}
```

### Collection: `payment_transactions`
```javascript
{
  _id: ObjectId,
  job_id: ObjectId (ref: jobs),
  bid_id: ObjectId (ref: bids),
  developer_id: ObjectId (ref: users),
  contractor_id: ObjectId (ref: users),
  
  amount: number,
  currency: string (default: "USD"),
  
  stripe_session_id: string (unique, indexed),
  stripe_payment_intent_id: string (optional),
  stripe_charge_id: string (optional),
  
  status: string, // "pending", "completed", "failed", "refunded", "disputed"
  
  // Escrow details
  escrow_released: boolean (default: false),
  escrow_released_at: timestamp (optional),
  
  developer_name: string (denormalized),
  contractor_name: string (denormalized),
  
  metadata: {
    platform_fee_percent: number,
    platform_fee_amount: number,
    contractor_receives: number,
  },
  
  created_at: timestamp,
  updated_at: timestamp,
  expires_at: timestamp (for pending sessions, 24 hours from creation),
}
```

---

## SECTION 6: API ENDPOINTS & SPECIFICATIONS

### Base URL: `/api`

---

### AUTH ENDPOINTS

#### POST `/auth/register`
**Purpose:** Create new user account
**Access:** Public
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe",
  "role": "contractor" | "developer"
}
```
**Response (201):**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "contractor",
  "token": "eyJhbGci...",
  "created_at": "2024-01-01T00:00:00Z"
}
```
**Error Responses:**
- 400: Email already exists / Invalid password / Missing fields
- 422: Validation error (password requirements, email format)

---

#### POST `/auth/login`
**Purpose:** Authenticate user and return JWT token
**Access:** Public
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```
**Response (200):**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "contractor",
  "token": "eyJhbGci...",
  "last_login": "2024-01-01T00:00:00Z"
}
```
**Error Responses:**
- 401: Invalid credentials
- 404: User not found

---

#### GET `/auth/me`
**Purpose:** Get current logged-in user
**Access:** Authenticated (Bearer token)
**Headers:** `Authorization: Bearer {token}`
**Response (200):**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "contractor",
  "phone": "555-1234",
  "location": "Brooklyn, NY",
  "bio": "Professional plumber with 10 years experience",
  "hourly_rate": 85,
  "experience_years": 10,
  "skills": ["Plumbing", "Gas Fitting"],
  "rating": 4.8,
  "jobs_completed": 45
}
```

---

#### POST `/auth/logout`
**Purpose:** Invalidate token (backend - frontend clears local storage)
**Access:** Authenticated
**Response (200):** Empty or `{ "message": "Logged out" }`

---

### JOB ENDPOINTS

#### GET `/jobs/`
**Purpose:** List all available jobs with filtering
**Access:** Authenticated
**Query Parameters:**
```
?category=Plumbing
&location=Brooklyn
&budget_min=1000
&budget_max=5000
&skills=Electrical
&sort=newest|budget|rating
&page=1
&limit=20
```
**Response (200):**
```json
{
  "jobs": [
    {
      "_id": "job_1",
      "title": "Kitchen Renovation",
      "description": "Complete kitchen update...",
      "category": "General",
      "location": "Brooklyn, NY",
      "budget_min": 5000,
      "budget_max": 8000,
      "skills_required": ["Carpentry", "Electrical"],
      "status": "open",
      "bids_count": 3,
      "created_at": "2024-01-01T00:00:00Z",
      "developer_name": "ABC Developments"
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 20
}
```

---

#### GET `/jobs/{id}`
**Purpose:** Get job details including bids
**Access:** Authenticated
**Response (200):**
```json
{
  "_id": "job_1",
  "title": "Bathroom Plumbing",
  "description": "Need to replace all fixtures and pipes...",
  "category": "Plumbing",
  "location": "Manhattan, NY",
  "budget_min": 2000,
  "budget_max": 3500,
  "duration": "1-2 weeks",
  "skills_required": ["Plumbing", "Gas Fitting"],
  "status": "open",
  "bids_count": 5,
  "bids": [
    {
      "_id": "bid_1",
      "contractor_id": "contractor_1",
      "contractor_name": "John's Plumbing",
      "amount": 2800,
      "proposal": "I can complete this in one week...",
      "estimated_duration": "5 days",
      "status": "pending"
    }
  ],
  "created_at": "2024-01-01T00:00:00Z",
  "developer_id": "dev_1",
  "developer_name": "ABC Developments"
}
```
**Error Responses:**
- 404: Job not found
- 403: Access denied

---

#### POST `/jobs/`
**Purpose:** Create new job (Developer only)
**Access:** Authenticated, role = "developer"
**Request Body:**
```json
{
  "title": "Kitchen Renovation",
  "description": "Full kitchen remodel with new cabinets and appliances",
  "category": "General",
  "location": "Brooklyn, NY",
  "budget_min": 5000,
  "budget_max": 8000,
  "duration": "2-4 weeks",
  "skills_required": ["Carpentry", "Electrical", "Plumbing"]
}
```
**Response (201):**
```json
{
  "_id": "job_new",
  "title": "Kitchen Renovation",
  "description": "...",
  "status": "open",
  "created_at": "2024-01-01T00:00:00Z",
  "developer_id": "dev_1"
}
```

---

#### PUT `/jobs/{id}`
**Purpose:** Update job (Developer only, if status still "open")
**Access:** Authenticated, role = "developer", job.developer_id = user.id
**Request Body:** Same as POST (any fields to update)
**Response (200):** Updated job object

---

#### GET `/jobs/my-jobs`
**Purpose:** Get all jobs posted by current developer
**Access:** Authenticated, role = "developer"
**Query Parameters:**
```
?status=open|in_progress|completed|closed
&sort=newest|oldest|budget
```
**Response (200):**
```json
{
  "jobs": [...],
  "stats": {
    "total": 10,
    "open": 3,
    "inProgress": 2
  }
}
```

---

### BID ENDPOINTS

#### GET `/jobs/{id}/bids`
**Purpose:** Get all bids for a specific job
**Access:** Authenticated (only job creator or contractors who bid)
**Response (200):**
```json
{
  "bids": [
    {
      "_id": "bid_1",
      "contractor_id": "contractor_1",
      "contractor_name": "John's Plumbing",
      "amount": 2800,
      "proposal": "...",
      "estimated_duration": "5 days",
      "status": "pending",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

#### POST `/jobs/{id}/bids`
**Purpose:** Submit bid on a job (Contractor only)
**Access:** Authenticated, role = "contractor"
**Request Body:**
```json
{
  "amount": 2500,
  "proposal": "I have 10 years experience and can deliver high-quality work...",
  "estimated_duration": "4 days"
}
```
**Response (201):**
```json
{
  "_id": "bid_new",
  "job_id": "job_1",
  "contractor_id": "contractor_1",
  "amount": 2500,
  "proposal": "...",
  "status": "pending",
  "created_at": "2024-01-01T00:00:00Z"
}
```
**Validation:**
- Contractor cannot bid on own job (if developer)
- Contractor cannot bid twice (update existing bid instead)
- Amount must be positive
- Proposal min 50 characters

---

#### PUT `/bids/{id}`
**Purpose:** Update own bid (Contractor only, if status "pending")
**Access:** Authenticated, role = "contractor", bid.contractor_id = user.id
**Request Body:**
```json
{
  "amount": 2400,
  "proposal": "Updated proposal...",
  "estimated_duration": "3 days"
}
```
**Response (200):** Updated bid object

---

#### PUT `/bids/{id}/accept`
**Purpose:** Accept a bid and initiate escrow (Developer only)
**Access:** Authenticated, role = "developer"
**Request Body:**
```json
{}
```
**Response (200):**
```json
{
  "_id": "bid_1",
  "status": "accepted",
  "job_id": "job_1",
  "contractor_id": "contractor_1",
  "amount": 2500,
  "payment_session_id": "stripe_session_123"
}
```
**Side Effects:**
- Job status → "in_progress"
- Stripe checkout session created
- Payment record created with status "pending"

---

#### PUT `/bids/{id}/reject`
**Purpose:** Reject a bid (Developer only)
**Access:** Authenticated, role = "developer"
**Request Body:**
```json
{
  "reason": "Budget exceeded" (optional)
}
```
**Response (200):**
```json
{
  "_id": "bid_1",
  "status": "rejected",
  "rejection_reason": "Budget exceeded"
}
```
**Side Effects:**
- Job remains "open"
- Contractor notified via message (optional future feature)

---

### USER ENDPOINTS

#### GET `/users/contractors`
**Purpose:** Search for contractors with filters
**Access:** Authenticated
**Query Parameters:**
```
?search=John
&category=Plumbing
&location=Brooklyn
&min_rating=4.0
&max_hourly_rate=100
&min_experience=3
&skills=Electrical
&page=1
&limit=20
```
**Response (200):**
```json
{
  "contractors": [
    {
      "_id": "contractor_1",
      "name": "John's Plumbing",
      "email": "john@example.com",
      "rating": 4.8,
      "review_count": 25,
      "hourly_rate": 85,
      "location": "Brooklyn, NY",
      "skills": ["Plumbing", "Gas Fitting"],
      "experience_years": 10,
      "jobs_completed": 45,
      "bio": "Professional plumber with high-quality work"
    }
  ],
  "total": 127,
  "page": 1
}
```

---

#### GET `/users/contractors/{id}`
**Purpose:** Get contractor profile details
**Access:** Authenticated
**Response (200):**
```json
{
  "_id": "contractor_1",
  "name": "John's Plumbing",
  "email": "john@example.com",
  "company_name": "John's Professional Plumbing LLC",
  "phone": "555-1234",
  "location": "Brooklyn, NY",
  "bio": "Professional plumber with 10 years experience in residential and commercial projects",
  "hourly_rate": 85,
  "experience_years": 10,
  "skills": ["Plumbing", "Gas Fitting", "Water Heater Installation"],
  "rating": 4.8,
  "review_count": 25,
  "jobs_completed": 45
}
```

---

#### GET `/users/profile`
**Purpose:** Get own profile (any role)
**Access:** Authenticated
**Response (200):** Current user object with all fields

---

#### POST `/users/profile`
**Purpose:** Create/initialize profile (usually called after registration)
**Access:** Authenticated
**Request Body:**
```json
{
  "phone": "555-1234",
  "location": "Brooklyn, NY",
  "company_name": "ABC LLC",
  "bio": "Professional contractor..."
}
```
**Response (200):** Updated user object

---

#### PUT `/users/profile`
**Purpose:** Update profile
**Access:** Authenticated
**Request Body:** Any updatable fields
```json
{
  "bio": "Updated bio...",
  "hourly_rate": 95,
  "skills": ["Plumbing", "Electrical", "Gas Fitting"],
  "location": "Manhattan, NY"
}
```
**Response (200):** Updated user object

---

#### PUT `/users/profile/{id}`
**Purpose:** Developer viewing/updating contractor profile (limited)
**Access:** Authenticated, role = "developer"
**Note:** Developers cannot modify contractor profiles
**Response (403):** Forbidden

---

### MESSAGE ENDPOINTS

#### GET `/messages/conversations`
**Purpose:** Get list of all conversations for current user
**Access:** Authenticated
**Query Parameters:**
```
?limit=20
&offset=0
```
**Response (200):**
```json
{
  "conversations": [
    {
      "_id": "conv_1",
      "other_user": {
        "_id": "user_2",
        "name": "John Doe",
        "role": "contractor",
        "rating": 4.8
      },
      "last_message": "Thanks for accepting my bid!",
      "updated_at": "2024-01-15T10:30:00Z",
      "unread_count": 2
    }
  ]
}
```

---

#### GET `/messages/conversations/{id}`
**Purpose:** Get conversation summary with other user info
**Access:** Authenticated, must be participant
**Response (200):**
```json
{
  "_id": "conv_1",
  "other_user": {
    "_id": "user_2",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "contractor",
    "rating": 4.8,
    "hourly_rate": 85
  },
  "last_message": "...",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

#### GET `/messages/conversations/{id}/messages`
**Purpose:** Get message history for a conversation
**Access:** Authenticated, must be participant
**Query Parameters:**
```
?limit=50
&offset=0
```
**Response (200):**
```json
{
  "messages": [
    {
      "_id": "msg_1",
      "sender_id": "user_1",
      "content": "Do you have experience with gas piping?",
      "created_at": "2024-01-15T09:00:00Z",
      "read": true
    },
    {
      "_id": "msg_2",
      "sender_id": "user_2",
      "content": "Yes, I have 10 years experience with gas systems",
      "created_at": "2024-01-15T09:05:00Z",
      "read": true
    }
  ],
  "total": 24
}
```

---

#### POST `/messages/conversations/{id}/messages`
**Purpose:** Send message in conversation
**Access:** Authenticated, must be participant
**Request Body:**
```json
{
  "content": "Great! When can you start?"
}
```
**Response (201):**
```json
{
  "_id": "msg_new",
  "conversation_id": "conv_1",
  "sender_id": "user_1",
  "content": "Great! When can you start?",
  "created_at": "2024-01-15T10:00:00Z",
  "read": false
}
```
**Validation:**
- Content required (non-empty)
- Max 5000 characters

---

#### POST `/messages/conversations`
**Purpose:** Start new conversation with user
**Access:** Authenticated
**Request Body:**
```json
{
  "recipient_id": "user_2",
  "initial_message": "Are you available for this project?"
}
```
**Response (201):**
```json
{
  "_id": "conv_new",
  "other_user": { ... },
  "last_message": "Are you available for this project?",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

---

### PAYMENT ENDPOINTS

#### POST `/payments/create-escrow`
**Purpose:** Create Stripe payment session for escrow
**Access:** Authenticated, role = "developer", must be job creator
**Request Body:**
```json
{
  "bid_id": "bid_1",
  "return_url": "https://app.buildmatch.com/payment/success"
}
```
**Response (201):**
```json
{
  "session_id": "stripe_session_123",
  "url": "https://checkout.stripe.com/pay/cs_live_...",
  "transaction_id": "txn_1"
}
```
**Side Effects:**
- Payment transaction created with status "pending"
- Stripe checkout session initialized

---

#### GET `/payments/status/{sessionId}`
**Purpose:** Check payment status (polling endpoint)
**Access:** Authenticated
**Response (200):**
```json
{
  "status": "pending" | "completed" | "failed" | "cancelled",
  "session_id": "stripe_session_123",
  "amount": 2500,
  "currency": "USD",
  "completed_at": "2024-01-15T10:15:00Z",
  "charge_id": "ch_1234..." (if completed)
}
```

---

#### GET `/payments/transactions/{id}`
**Purpose:** Get payment transaction details
**Access:** Authenticated, involved party (developer or contractor)
**Response (200):**
```json
{
  "_id": "txn_1",
  "job_id": "job_1",
  "bid_id": "bid_1",
  "developer_id": "dev_1",
  "contractor_id": "contractor_1",
  "amount": 2500,
  "status": "completed",
  "stripe_charge_id": "ch_1234",
  "created_at": "2024-01-15T10:00:00Z",
  "completed_at": "2024-01-15T10:15:00Z",
  "metadata": {
    "platform_fee_percent": 10,
    "platform_fee_amount": 250,
    "contractor_receives": 2250
  }
}
```

---

### WEBHOOK ENDPOINTS

#### POST `/webhook/stripe`
**Purpose:** Handle Stripe payment events
**Access:** Public (secured by Stripe signature verification)
**Webhook Events:**
- `checkout.session.completed` → Update payment_transactions status to "completed"
- `charge.failed` → Update payment_transactions status to "failed"
- `charge.refunded` → Update status to "refunded"

---

## SECTION 7: COMPLETE SCREEN STRUCTURE & NAVIGATION

### Root Navigation: Expo Router

```
app/
├── _layout.tsx                 # Root stack with AuthProvider
├── (auth)/                     # Auth stack (shown when !user)
│   ├── _layout.tsx
│   ├── login.tsx               # Login screen
│   └── register.tsx            # Registration with role selection
├── (tabs)/                     # Main app tabs (shown when user)
│   ├── _layout.tsx             # Bottom tab navigation
│   ├── dashboard.tsx           # Home/dashboard (role-specific)
│   ├── search.tsx              # Search contractors (dev) or jobs (contractor)
│   ├── messages.tsx            # Conversations list
│   ├── my-jobs.tsx             # My jobs (developer only mode)
│   └── profile.tsx             # User profile
├── job/
│   ├── [id].tsx                # Job detail
│   ├── create.tsx              # Create job (developer)
│   └── estimate.tsx            # Bid estimation tool
├── contractor/
│   └── [id].tsx                # Contractor profile (view only)
├── conversation/
│   └── [id].tsx                # Conversation detail
└── payment/
    ├── success.tsx             # Payment success
    └── cancel.tsx              # Payment cancelled
```

---

### SCREEN DETAILS

#### AUTH SCREENS

**Login Screen: `(auth)/login.tsx`**
- Email input
- Password input
- "Log In" button
- "Don't have an account? Sign Up" link → navigate to register
- Error messages (invalid credentials)
- Loading state
- Keep me logged in checkbox (optional)

**Register Screen: `(auth)/register.tsx`**
- Email input
- Password input (with strength indicator)
- Name input
- Role selector: Contractor / Developer (radio or toggle)
- "Create Account" button
- "Already have an account? Log In" link
- Password requirements (show/hide)
- Loading state
- Error messages

---

#### MAIN TABS

**Tab Navigation Layout:**
- Bottom tab bar with 4 tabs:
  1. 📊 Dashboard (home icon)
  2. 🔍 Search (search icon) - different content for each role
  3. 💬 Messages (chat icon)
  4. 👤 Profile (person icon)

---

#### DASHBOARD - Developer View: `(tabs)/dashboard.tsx`
**Content Sections:**
1. **Header Section**
   - Profile avatar with initials
   - Greeting: "Welcome back, [Name]"
   - Quick stats row (conditional):
     - Total jobs posted
     - Open jobs
     - In progress

2. **Hero Section** (Empty state or active state)
   - Eyebrow text (small)
   - Title
   - Description
   - Primary CTA: "Post a New Job"
   - Secondary CTA (if jobs exist): "View My Jobs"
   - Progress indicators: Post job → Review bids → Fund escrow

3. **Recent Activity Timeline**
   - Activity items (bids received, payments sent, etc.)
   - Color-coded by stage
   - Timestamps
   - Shows max 5 items, "View All" link to my-jobs

4. **Quick Navigation Cards**
   - "Post a New Job"
   - "Browse Contractors"
   - "View My Jobs"

---

#### DASHBOARD - Contractor View: `(tabs)/dashboard.tsx`
**Content Sections:**
1. **Header Section**
   - Profile avatar
   - Greeting
   - Stats:
     - Active bids
     - Jobs completed
     - Rating
     - Hourly rate

2. **Profile Completion** (If incomplete)
   - Banner: "Complete your profile to get more job matches"
   - "Complete Profile" button
   - Shows which fields are missing

3. **Hero Section** (Empty or active)
   - "Start finding work" / "Stay close to live opportunities"
   - "Browse Jobs" CTA
   - Progress indicators

4. **Recommended Jobs** (If profile complete)
   - Jobs matching contractor skills
   - Card display with quick "Bid" action
   - 5-10 items, "View All" link to search

5. **Your Active Bids** (If bids exist)
   - List of pending/accepted bids
   - Status badge
   - Job title and amount
   - Links to full details

---

#### SEARCH/DISCOVER - Developer: `(tabs)/search.tsx`
**Contractor Search Screen:**
- Search bar with icon
- Filter section (collapsible):
  - Category dropdown
  - Location input
  - Min/Max hourly rate slider
  - Experience years dropdown
  - Min rating toggle (4.5+, 4.0+, 3.5+, All)
  - Skills search
- Results list:
  - Infinite scroll
  - Contractor cards (avatar, name, rating, rate, top 3 skills, location)
  - "View Profile" button on each card
- Empty state: "No contractors match your search"

---

#### SEARCH/DISCOVER - Contractor: `(tabs)/search.tsx`
**Job Search Screen:**
- Search bar
- Filter section:
  - Category dropdown
  - Location input
  - Budget range slider
  - Skills filter (multiselect)
  - Sort dropdown (Newest, Budget low-to-high, Closest)
- Results list:
  - Infinite scroll
  - Job cards (title, category, location, budget, bid count)
  - "View Details" or direct "Bid" prompt
- Empty state: "No jobs match your search. Try adjusting filters"

---

#### MESSAGES: `(tabs)/messages.tsx`
- Conversations list (pull to refresh)
- Each conversation shows:
  - Avatar/initials
  - Other user name
  - Last message preview
  - Timestamp
  - Unread indicator (dot or badge)
- Swipe actions (archive/delete) - optional
- Empty state: "No conversations yet. Message a user to start chatting."
- Pull-to-refresh

---

#### PROFILE: `(tabs)/profile.tsx` (Already provided)
- Avatar with initials
- Name and email
- Role badge
- Stats row (role-specific)
- Not editing:
  - "Edit Profile" button
  - About section (if filled)
  - Location section
  - Skills section
  - Company section
- Editing:
  - Form inputs for all editable fields
  - "Save Changes" button (loading state)
  - "Cancel" button
- Logout button (destructive style)

---

#### JOB DETAIL: `job/[id].tsx`
**Before Bid Accepted (Open Job):**
- Job title, category badge, location
- Budget range
- Full description
- Skills required (with visual matching if contractor)
- Duration estimate
- Number of bids
- Bid list section:
  - Sortable (by amount, date, rating)
  - Each bid shows:
    - Contractor name/avatar
    - Bid amount (highlighted)
    - Proposal preview
    - Estimated duration
    - Status badge
  - "Accept" button (developer only)
  - "Message Contractor" action (developer only)
  - "View Contractor Profile" button (optional)
- "Message Developer" button (contractor)

**After Bid Accepted (In Progress):**
- Same header info
- Accepted bid highlighted/prominent
- Payment status section:
  - "Escrow Initiated" or "Payment Pending" status
  - Amount
  - "Go to Payment" button
- "Message Contractor" button
- Timeline showing project stages (optional future)

---

#### CREATE JOB: `job/create.tsx`
- Form fields:
  - Title input
  - Description textarea
  - Category dropdown
  - Budget inputs (min/max)
  - Location input
  - Duration estimate dropdown
  - Skills required (comma-separated with tag display)
- Preview section (collapsible)
  - Shows how job will appear to contractors
- "Post Job" button (primary)
- "Save as Draft" button (optional future)
- Validation messages below fields
- "Cancel" or back button

---

#### ESTIMATE TOOL: `job/estimate.tsx` (Optional)
- Interactive tool to estimate project budget
- Input: Project type, scope, complexity
- Output: Estimated budget range
- "Post Job" button at bottom (pre-fills budget)

---

#### CONTRACTOR PROFILE: `contractor/[id].tsx`
*View-only profile visible to developers*
- Header:
  - Avatar with initials
  - Name
  - Role badge: "Contractor"
  - Rating (stars and count)
  - Hourly rate
- Stats:
  - Jobs completed
  - Average rating
  - Location
  - Experience years
- About section (bio)
- Company name (if applicable)
- Skills (all skills as tag list)
- "Send Message" button (primary)
- "View Messages" button (if conversation exists)

---

#### CONVERSATION DETAIL: `conversation/[id].tsx`
- Header:
  - Other user name
  - Status online/offline (optional future)
  - "View Profile" link
- Message list:
  - Grouped by day
  - Message bubbles (yours on right, theirs on left)
  - Timestamps
  - Seen indicator (optional)
  - Scroll to newest on load
- Input area:
  - Text input (auto-expand)
  - Send button (disabled if empty)
  - Keyboard-aware spacing
  - Emoji picker (optional)
- Pull-to-refresh for older messages

---

#### PAYMENT SCREENS

**Success: `payment/success.tsx`**
- Success checkmark icon
- "Payment Confirmed!" heading
- Payment summary:
  - Amount
  - Timestamp
  - Transaction ID
  - Breakdown (bid amount, platform fee, contractor receives)
- "View Job" button (primary)
- "Message Contractor" button (secondary)
- "Back to Dashboard" button

**Cancel: `payment/cancel.tsx`**
- "Payment Cancelled" heading
- "You can retry or choose a different bid"
- "Return to Job" button (primary)
- "Browse Other Bids" button
- Contact support link (optional)

---

#### MY JOBS: `(tabs)/my-jobs.tsx` (developer-exclusive subtab)
__Actually a separate screen or modal, not a tab__
- Filter/sort controls:
  - Status filter (open, in progress, completed)
  - Sort dropdown
- Jobs list:
  - Each job card shows:
    - Title
    - Status badge
    - Budget range
    - Bid count
    - Last updated timestamp
  - Tap to view details
- Stats header:
  - Total jobs
  - Open count
  - In progress count
- Empty state: "No jobs yet. Post your first job!"

---

## SECTION 8: STYLING & DESIGN TOKENS

### Theme Configuration (from design_guidelines.json)

**Primary Colors:**
- Primary: `#14a800` (green, Upwork-inspired)
- Primary Hover: `#118c00`
- Primary Light: `#e8f7e5`
- Primary Foreground: `#ffffff`

**Secondary Colors:**
- Secondary: `#0f172a` (dark slate)
- Secondary Foreground: `#ffffff`

**Background Colors:**
- Default: `#ffffff`
- Subtle: `#f8fafc`
- Muted: `#f1f5f9`

**Status Colors:**
- Success: `#10b981` (green)
- Warning: `#f59e0b` (amber)
- Error: `#ef4444` (red)
- Info/Escrow Locked: `#3b82f6` (blue)

**Text Colors:**
- Primary text: `#0f172a`
- Secondary text: `#475569`
- Muted text: `#64748b`
- Inverse: `#ffffff`

**Border Colors:**
- Default: `#e2e8f0`
- Focus: `#14a800` (primary)
- Divider: `#f1f5f9`

### Typography
- Heading font: Work Sans or system-ui
- Body font: IBM Plex Sans or system-ui
- Sizes: Standard scale (xs, sm, base, lg)

### Spacing
- Global padding: p-4 (mobile), p-6 (tablet)
- Section gaps: gap-6 (mobile), gap-8 (tablet)
- Border radius: full (buttons), xl (cards), lg (inputs)
- Min touch target: 48px height

### Design Philosophy
- "No explicit borders" rule: Use background color shifts instead
- White space as structural element
- High-contrast typography
- Subtle depth through layering, not shadows
- Glass morphism for floating panels (opacity: 80%, blur: 24px)

---

## SECTION 9: TESTING REQUIREMENTS

### Unit Testing
- [ ] API client error handling
- [ ] Form validation (job creation, bidding)
- [ ] Auth context logic
- [ ] useProfile hook
- [ ] useConversation hook
- [ ] Job filtering/sorting logic
- [ ] Payment status polling logic

### Integration Testing
- [ ] User registration → login flow
- [ ] Job creation → bid submission
- [ ] Bid acceptance → payment flow
- [ ] Message sending → receiving
- [ ] Profile create → update

### E2E Testing (Cypress/Detox)
- [ ] Developer: Post job → receive bids → accept → pay
- [ ] Contractor: Search jobs → bid → accept → communicate
- [ ] Messaging flow between two users
- [ ] Payment success/failure flows

### Test Data Seeds
- 10+ contractors with different skills/ratings
- 20+ active jobs in various categories
- Sample conversations and messages
- Mock payment transactions

---

## SECTION 10: SECURITY REQUIREMENTS

### Authentication
- ✅ JWT tokens in Authorization header
- ✅ SecureStore for token persistence (not AsyncStorage)
- ✅ Token expiration and refresh
- ✅ Bcrypt password hashing (min cost factor 10)
- ✅ Rate limiting on auth endpoints

### Backend Requirements
- ✅ HTTPS only (no HTTP)
- ✅ CORS configured (allow app domain only)
- ✅ Request validation on all endpoints
- ✅ SQL injection prevention (MongoDB uses parameterized queries)
- ✅ XSS prevention (sanitize user input)
- ✅ CSRF protection (if applicable)
- ✅ OAuth2 scope limitation

### Data Protection
- ✅ Sensitive data encrypted at rest (MongoDB Enterprise)
- ✅ PCI-DSS compliance for payment handling (Stripe manages this)
- ✅ User data isolation (cannot access other users' data)
- ✅ Audit logging of sensitive operations

### Stripe Integration
- ✅ Server-side payment creation (no client-side charge)
- ✅ Webhook signature verification
- ✅ Payment intent confirmation
- ✅ No hardcoding of API keys (environment variables)

---

## SECTION 11: PERFORMANCE BASELINES

### Target Metrics
- App startup: < 3 seconds (cold)
- Screen navigation: < 500ms
- API response: < 1 second (p95)
- Bundle size: < 40MB (uncompressed, Android)
- Memory usage: < 200MB sustained (mobile)
- TTI (Time to Interactive): < 2 seconds

### Optimization Areas (From Health Check)
- ✅ Metro bundler: 40% faster with optimizations
- ✅ Message polling: Replace 5s interval with WebSocket
- ✅ Caching: Implement request deduplication
- ✅ Code splitting: Lazy load screens by route
- ✅ Component memoization: Prevent unnecessary re-renders

---

## SECTION 12: DEPLOYMENT & CI/CD

### Development Environment
```bash
npm install
npm run start           # Start Metro bundler
# or
npm run start:fast     # With optimizations
```

### Testing & Linting
```bash
npm run lint           # ESLint check
npm run type-check     # TypeScript check
npm run test           # Jest (to be configured)
```

### Build & Deploy

**Android:**
```bash
eas build --platform android
eas submit --platform android
```

**iOS:**
```bash
eas build --platform ios
eas submit --platform ios
```

**Web:**
```bash
expo export --platform web
# Deploy to Vercel, Netlify, or EAS Hosting
```

### Environment Variables Required
```
EXPO_PUBLIC_BACKEND_URL=https://api.buildmatch.com
EXPO_PUBLIC_USE_MOCK_API=false
SENTRY_DSN=https://...
STRIPE_PUBLIC_KEY=pk_live_...
```

---

## SECTION 13: BACKEND REQUIREMENTS (For New Project Setup)

**Must Be Implemented:**
1. **FastAPI app initialization** with CORS, middleware
2. **MongoDB connection** (async motor driver)
3. **JWT auth flow** (register, login, token refresh)
4. **Bcrypt password hashing** with salt rounds
5. **All database collections** with proper indexes
6. **All API endpoints** as documented in Section 6
7. **Stripe integration** with payment session creation
8. **Stripe webhooks** for payment status updates
9. **Message auto-cleanup** (optional: delete old messages after 90 days)
10. **Admin seed** on startup (create admin user if none exists)

**Recommended Libraries:**
- FastAPI 0.100+
- pydantic for validation
- motor for async MongoDB
- PyJWT for tokens
- bcrypt for passwords
- stripe>=5.0 for payments
- python-dotenv for env vars

---

## SECTION 14: SCALABILITY CONSIDERATIONS

### Current Limitations
- Polling-based messaging (not scalable beyond 1000 concurrent users)
- Single MongoDB instance (no sharding)
- No caching layer (Redis)
- Frontend bundle size grows with each feature

### Scaling Path (Future)
**Phase 1 (1000-10k weekly active users):**
- Implement WebSocket for messages
- Add Redis caching for frequently accessed data
- Implement job search caching

**Phase 2 (10k-100k weekly active users):**
- MongoDB sharding on user_id and job_id
- CDN for static assets
- Image optimization and resizing
- Notification service (email, push)

**Phase 3 (100k+ weekly active users):**
- Microservices: messaging, payments, jobs services
- Event-driven architecture (Kafka/RabbitMQ)
- Read replicas for reporting
- Advanced analytics

---

## SECTION 15: ANALYTICS & MONITORING

### Key Metrics to Track
- User signup and retention
- Number of jobs posted and bids received
- Average time to bid acceptance
- Payment conversion rate
- Message response time
- Search result quality (click-through rate)

### Recommended Tools
- Sentry (error tracking)
- Firebase Analytics or Amplitude (user analytics)
- New Relic or Datadog (performance monitoring)
- Full-text logging (ELK stack or Cloud Logging)

---

## SECTION 16: SUCCESS CRITERIA & MILESTONES

### MVP Launch (Ready Now)
- ✅ User auth (register/login)
- ✅ Developer job posting
- ✅ Contractor bidding
- ✅ Bid acceptance
- ✅ Escrow payment (Stripe)
- ✅ In-app messaging
- ✅ Profile management
- ✅ Search and discovery

### Post-Launch Improvements (3-6 months)
- Password reset flow
- Email notifications
- Contractor ratings/reviews
- Job category templates
- Advanced filtering
- Bulk email export (for developers)

### 6-12 Month Roadmap
- Contractor insurance verification
- Background checks
- Payment disputes/refund system
- Contractor portfolio/gallery
- Mobile app native builds (iOS/Android stores)
- International expansion (currencies, languages)

---

## APPENDIX: QUICK CHECKLIST FOR PROJECT RESTART

### Setup Phase
- [ ] Clone repo or start fresh with `expo init`
- [ ] Install all dependencies from package.json
- [ ] Setup environment variables (.env.example → .env)
- [ ] Configure Metro bundler (from BUNDLE_OPTIMIZATION.md)
- [ ] Add .watchmanignore (from BUNDLE_OPTIMIZATION.md)

### Frontend Development
- [ ] Verify all screen files exist (app/, (auth)/, (tabs)/, etc.)
- [ ] Test auth flow (register → login → logout)
- [ ] Test navigation (all tabs, nested screens)
- [ ] Test dark mode (if design supports it)
- [ ] Verify shared UI components render correctly
- [ ] Test Tailwind + Uniwind styling

### API Integration
- [ ] Verify backend is running (EXPO_PUBLIC_BACKEND_URL correct)
- [ ] Test API client error handling
- [ ] Test auth endpoints (register, login, me, logout)
- [ ] Test job endpoints (create, list, get, update)
- [ ] Test bid endpoints (submit, accept, reject)
- [ ] Test message endpoints (send, fetch, list)
- [ ] Test payment endpoints (create session, check status)

### Data Validation
- [ ] Test form validations (job creation, bidding, profile)
- [ ] Test API response parsing (types match domain.ts)
- [ ] Test error handling (API failures, network errors)
- [ ] Test edge cases (empty lists, missing fields)

### Security Checks
- [ ] Tokens stored in SecureStore, not AsyncStorage
- [ ] No API keys hardcoded
- [ ] No sensitive data in console logs
- [ ] HTTPS enforced (backend)
- [ ] CORS properly configured
- [ ] Rate limiting on endpoints

### Performance Validation
- [ ] Cold start time: < 3 seconds
- [ ] Screen navigation: < 500ms
- [ ] API response: < 1 second
- [ ] Bundle size: < 40MB
- [ ] Memory usage: < 200MB

### Testing Phase
- [ ] Run linter: `npm run lint`
- [ ] Run type check: `npm run type-check`
- [ ] Manual test all user flows
- [ ] Test on real mobile device (if available)
- [ ] Test web build
- [ ] Test Android build
- [ ] Test iOS build (if on Mac)

---

## FINAL NOTES

**This document serves as the complete specification for BUILD_MATCH.** Use it to:
1. Restart the project from scratch
2. Hand off to another developer
3. Onboard new team members
4. Plan future features
5. Reference during development

**Last reviewed:** April 12, 2026  
**Next review:** Quarterly or after major changes

---

