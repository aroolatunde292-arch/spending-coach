# Spending Coach

**Make Your Money Last Longer.**

Spending Coach is a personal budgeting web application designed to help people plan expenses, track everyday spending, and make more informed decisions about how they use their available money.

The project addresses a practical financial challenge: money can run out earlier than expected when essential expenses, everyday purchases, and unexpected costs compete for the same funds.

🔗 **Live Demo:** [spending-coach-yesxtra.netlify.app](https://spending-coach-yesxtra.netlify.app/)

💻 **Source Code:** [View the repository on GitHub](https://github.com/aroolatunde292-arch/spending-coach)

## The Problem

Budgeting can be difficult when expenses do not happen evenly throughout the week. Groceries may need to last several days, mobile data may be purchased in batches, and transportation costs can vary with each outing.

Spending Coach is designed around these real-world spending patterns. It helps users plan for expected costs, monitor actual spending, and protect money needed for upcoming expenses.

## Features

- **Guided budget setup:** Enter available funds, expected income timing, expense categories, and planned costs.
- **Flexible expense planning:** Plan for food, transportation, mobile data, bills, family support, school, health, and entertainment.
- **Spending tracker:** Record, edit, and delete spending transactions.
- **Safe-to-spend estimate:** Calculate an estimated amount available after recorded spending, remaining planned expenses, and a protected financial buffer.
- **Category-level progress:** Review spending against planned category amounts.
- **Protected buffer:** Reserve money for unexpected expenses rather than treating every remaining naira as available to spend.
- **Budget history:** Archive a budget period while retaining its associated planning information and transactions.
- **Recently Deleted and recovery:** Move archived budgets to Recently Deleted and restore eligible budgets within the 30-day recovery period.
- **Browser-based data storage:** Save and restore supported budget information using the browser's local storage.
- **Progressive web app foundations:** Includes an app manifest, application icons, service-worker registration, and an offline fallback page.

## Technology Stack

- **Framework:** Next.js
- **UI library:** React
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Development tools:** Node.js, npm, Git, and GitHub
- **Deployment:** Netlify

## How the Safe-to-Spend Estimate Works

Spending Coach estimates how much money is safe to spend by accounting for:

1. Current funds remaining after recorded spending.
2. Expenses that are still planned for the budget period.
3. Money protected as a financial buffer.

The goal is to help users distinguish between money they currently hold and money they can reasonably spend without compromising their existing plan.

## Run Locally

### Prerequisites

Install [Node.js](https://nodejs.org/) and npm.

### Installation

Clone the repository:

```bash
git clone https://github.com/aroolatunde292-arch/spending-coach.git
```

Navigate to the project directory:

```bash
cd spending-coach
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To create a production build, run:

```bash
npm run build
```

## Data Storage and Privacy

Budget information is stored locally in the user's browser using `localStorage`. Supported information can be restored when the application is reopened in the same browser.

The current implementation does not provide cloud-based account synchronisation or a remote database. Browser data may be lost if the user clears the site's stored data, and it does not automatically transfer between devices or browsers.

Users should avoid relying on this implementation as their only record of important financial information.

## Development Goals

Spending Coach is an ongoing personal software development project focused on practical financial planning and a clear user experience.

Potential areas for future development include:

- Automated tests for budget calculations and important user flows.
- Stronger validation and recovery for saved data.
- More detailed spending summaries and financial insights.
- Further usability and accessibility improvements.
- More robust offline behaviour and testing across devices.
- Optional secure synchronisation across devices.

## About the Developer

**Olatunde Aro**  
Aspiring Frontend Developer | AI-Assisted Development

I am building practical, user-focused digital products while developing my skills in frontend technologies, application planning, and version control. Spending Coach is an opportunity to explore how budgeting calculations, interface design, and application state can work together to address a real-world problem.

- **GitHub:** [@aroolatunde292-arch](https://github.com/aroolatunde292-arch)
- **Live Project:** [Spending Coach](https://spending-coach-yesxtra.netlify.app/)
