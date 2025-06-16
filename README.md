# My Expense Tracker

A modern, responsive expense tracking application built with Angular 19 and TailwindCSS. This application helps users manage their finances by tracking expenses, income, and account balances.

## Features

- **User Authentication**: Secure login and registration system
- **Dashboard**: Overview of financial status with main account balance
- **Multiple Accounts**: Create and manage multiple financial accounts
- **Transaction Management**: Record deposits, withdrawals, and transfers between accounts
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing

## Technology Stack

- **Frontend**: Angular 19 with standalone components
- **Styling**: TailwindCSS 4.1
- **Icons**: Font Awesome
- **Form Handling**: Angular Reactive Forms
- **Authentication**: Token-based authentication with route guards

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v19.2.6)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/my-expense-tracker.git
   cd my-expense-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:4200`

### Backend API

This application requires the backend API server to function properly. The backend repository is available at:
[My-Expense-Tracker-BE](https://github.com/yourusername/My-Expense-Tracker-BE)

The API server should be running on `http://localhost:5297`. Follow the instructions in the backend repository to set up and run the API server.

## Project Structure

```
my-expense-tracker/
├── src/
│   ├── app/
│   │   ├── core/               # Core functionality
│   │   │   ├── guards/         # Route guards for authentication
│   │   │   ├── interceptors/   # HTTP interceptors
│   │   │   ├── services/       # Core services (auth, account, transaction)
│   │   │   └── utils/          # Utility functions and helpers
│   │   ├── features/          # Feature modules
│   │   │   ├── auth/          # Authentication components
│   │   │   ├── home/          # Home dashboard components
│   │   │   ├── landing/       # Landing page components
│   │   │   ├── models/        # Data models and interfaces
│   │   │   └── error/         # Error handling components
│   │   └── shared/           # Shared components, directives, and pipes
│   │       └── components/    # Reusable UI components
│   ├── assets/               # Static assets (images, fonts)
│   └── styles.css            # Global styles with TailwindCSS
└── package.json             # Project dependencies and scripts
```

Generate new components, services, etc. using Angular CLI:

```bash
ng generate component component-name
```

### Building for Production

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

---

Created with ❤️ using Angular and TailwindCSS
