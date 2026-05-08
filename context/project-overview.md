# BUILD_MATCH

## Overview

BUILD_MATCH is a mobile marketplace for real estate developers and contractors. It helps developers post renovation jobs, compare bids, accept the right contractor, and manage escrow-backed payments, while giving contractors a way to discover work, submit proposals, and communicate in one place. The app solves the trust, discovery, payment, and communication problems that make renovation projects slow and risky.

## Goals

1. Enable developers to post jobs and receive comparable bids from contractors.
2. Let contractors browse relevant jobs, submit bids, and track bid status.
3. Support secure project handoff with messaging, acceptance, and escrow payment flows.

## Core User Flow

1. User signs in as a developer or contractor.
2. Developer posts a job or contractor browses available jobs.
3. Contractor submits a bid and the developer reviews competing proposals.
4. Developer accepts a bid and the platform initiates escrow payment.
5. Both parties use in-app messaging and track the job through completion.

## Features

### Authentication & Roles

- Email/password registration and login.
- Role-based experiences for developers and contractors.

### Jobs, Bids, and Discovery

- Developer job posting, job details, and bid comparison.
- Contractor search, job browsing, bid submission, and bid management.

### Payments and Messaging

- Escrow payment creation and payment status tracking.
- In-app conversations between developers and contractors.

## Scope

### In Scope

- Mobile app flows for registration, login, dashboards, job browsing, bidding, and profile management.
- Core marketplace workflows for bid acceptance, messaging, and escrow payment initiation.

### Out of Scope

- Backend implementation details beyond the API contract defined in the PRD.
- Native app store deployment, advanced analytics, and future features like reviews, WebSocket messaging, or disputes.

## Success Criteria

1. A developer can sign in, post a job, review bids, and accept one bid.
2. A contractor can sign in, browse jobs, submit a bid, and see bid status updates.
3. Both roles can open a conversation and complete the escrow payment flow without leaving the app.
