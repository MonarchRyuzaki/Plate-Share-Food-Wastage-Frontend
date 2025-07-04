# PlateShare Application Documentation

This document outlines the various URLs (routes) in the PlateShare application and their purpose.

## Main Pages

-   **`/` (Home Page)**
    -   **File:** `src/app/page.tsx`
    -   **Purpose:** The public landing page for the application. It provides an overview of what PlateShare does, how it works, and includes primary calls-to-action for donors and NGOs.

## Authentication Routes

### Donor Authentication

-   **`/auth/donor/login`**
    -   **File:** `src/app/auth/donor/login/page.tsx`
    -   **Purpose:** The login page for registered donors.

-   **`/auth/donor/register`**
    -   **File:** `src/app/auth/donor/register/page.tsx`
    -   **Purpose:** The registration form for new donors to create an account. It collects necessary details like name, email, password, and address.

### NGO Authentication

-   **`/auth/ngo/login`**
    -   **File:** `src/app/auth/ngo/login/page.tsx`
    -   **Purpose:** The login page for registered NGOs.

-   **`/auth/ngo/register`**
    -   **File:** `src/app/auth/ngo/register/page.tsx`
    -   **Purpose:** The registration form for new NGOs. It collects detailed information including organization name, registration number, cause, and registration proof documents.

## Donor-Specific Routes

-   **`/donor/dashboard`**
    -   **File:** `src/app/donor/dashboard/page.tsx`
    -   **Purpose:** The main dashboard for a logged-in donor. It displays a list of their current and past food donations, showing their status (e.g., Available, Claimed).

-   **`/donor/donations/new`**
    -   **File:** `src/app/donor/donations/new/page.tsx`
    -   **Purpose:** The page containing the form for a donor to create a new food donation listing.

-   **`/donor/donations/[id]/edit`**
    -   **File:** `src/app/donor/donations/[id]/edit/page.tsx`
    -   **Purpose:** The page that allows a donor to edit the details of one of their existing donation listings.

## NGO-Specific Routes

-   **`/ngo/dashboard`**
    -   **File:** `src/app/ngo/dashboard/page.tsx`
    -   **Purpose:** The main dashboard for a logged-in NGO. It shows a list of donations the NGO has claimed, along with their status (e.g., Claimed, Picked Up).

## Public Donation Routes

-   **`/donations`**
    -   **File:** `src/app/donations/page.tsx`
    -   **Purpose:** A public page that shows a grid of all available food donations. This is the primary marketplace where NGOs can browse and filter listings.

-   **`/donations/[id]`**
    -   **File:** `src/app/donations/[id]/page.tsx`
    -   **Purpose:** A public-facing page that shows the detailed information for a single donation listing. This is the page an NGO views to see the specifics before claiming a donation.
