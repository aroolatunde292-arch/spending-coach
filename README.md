# Spending Coach

**A personal budgeting application that helps users plan expenses, track spending, and understand how much money is safe to spend.**

Spending Coach is a personal software development project built around a practical financial challenge: money can run out sooner than expected when spending decisions are made without a clear plan.

The application helps users create a budget based on their available funds, expected expenses, and next income date. It also tracks actual spending against planned amounts and calculates an estimated safe-to-spend balance.

## The Problem

Traditional budgeting approaches can feel unrealistic when expenses happen in batches rather than evenly every day. Food shopping, transportation, mobile data, and unexpected costs can compete for the same limited funds.

Spending Coach takes a practical approach by allowing users to plan around their actual spending patterns and reserve money for unexpected expenses.

## Features

* **Four-step budget setup:** Enter available funds, the next income date, expense categories, and expected costs.
* **Flexible expense planning:** Budget for groceries, prepared food, transport, mobile data, bills, health, education, family support, and entertainment.
* **Spending tracker:** Record, edit, and delete spending transactions.
* **Safe-to-spend calculation:** Estimate available discretionary money after accounting for recorded spending, remaining planned expenses, and a protected buffer.
* **Category-level progress:** Compare planned spending, amounts paid, and remaining budgets.
* **Protected emergency buffer:** Set aside funds for unexpected expenses.

## Technology Stack

* Next.js
* React
* TypeScript
* Tailwind CSS

## Getting Started

### Prerequisites

Install Node.js and npm.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/aroolatunde292-arch/spending-coach.git
   ```

2. Navigate to the project directory:

   ```bash
   cd spending-coach
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 in your browser.

## Current Status

Spending Coach is an ongoing personal project. The current implementation includes budget setup, expense planning, transaction management, category-level progress, and safe-to-spend calculations.

**Current limitation:** Budget data is managed in application state and is not yet saved to a persistent database. Saving budgets across page reloads and sessions is a potential future improvement.

## Future Improvements

* Persist budgets and transactions between sessions.
* Improve validation and test budget calculations across different scenarios.
* Refine the user experience and responsive design.
* Add more detailed financial summaries and insights.
* Deploy a live demo for portfolio visitors.

## Author

**Olatunde Aro**

GitHub: [@aroolatunde292-arch](https://github.com/aroolatunde292-arch)
