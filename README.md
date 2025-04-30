# My Monorepo

Welcome to the **AsyncAwait - Auction Management Project** project!  
This repository contains the frontend, backend, and documentation for our application.

---

## 📂 Project Structure

```
/frontend    ➔ Next.js frontend application
/backend     ➔ Express.js backend API
/docs        ➔ Project documentation (architecture, API specs, setup guides)
```


## 🚀 Getting Started

## 🛠 Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/)
- **Backend:** [Express.js](https://expressjs.com/)
- **Package Manager:** [npm Workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces) / [Turborepo](https://turbo.build/)

---

## 🔥 Contribution Guidelines

## 📦 Step 1: Clone the Repository

First, download the project code onto your computer.

Open your terminal and run:

```bash
git clone https://github.com/alvy00/asyncawait-auction-project.git
```

---

## 📂 Step 2: Understand the Folder Structure

Here's how the project is organized:

```
/frontend    ➔ Next.js frontend app (the client users will see)
/backend     ➔ Express.js backend app (APIs and server-side logic)
/docs        ➔ Project documentation (what you're reading now)
/package.json (root) ➔ project management config
```

👉 **You will mostly work inside either `/frontend` or `/backend`, depending on your task.**

---

## 🧹 Step 3: Install All Dependencies

Make sure you are inside the main project folder:

```bash
cd asyncawait-auction-project
```

Then install all necessary libraries:

```bash
npm install
```

✅ This will install dependencies for **both** frontend and backend at once!

---

## 🚀 Step 4: Run the Project Locally

Start both the frontend and backend servers:

```bash
npm run dev
```


## 🔥 Step 5: Basic Commands You'll Use

| Command             | Purpose                                 |
|---------------------|-----------------------------------------|
| `npm install`        | Install all project dependencies       |
| `npm run dev`        | Start frontend and backend together    |
| `npm run build`      | Create optimized production builds     |

---

## 🔒 Step 6: How We Manage Code (VERY IMPORTANT)

### You CANNOT push directly to `main`.  
Instead, follow this process:

1. Create a **new branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
   Example:
   ```bash
   git checkout -b feature/add-login-page
   ```

2. Work on your task in your branch.

3. Stage and commit your changes:
   ```bash
   git add .
   git commit -m "Added login page"
   ```

4. Push your branch to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request (PR)** from GitHub UI:
   - Base branch = `developement`
   - Compare branch = your feature branch
   - Write a clear PR description (what you changed).

6. Once approved, you or the reviewer can merge it!

---

Please **read these files** before working on big features or backend routes!

---

## ⚡ Quick Troubleshooting

| Problem                          | Solution |
|----------------------------------|----------|
| `npm install` fails?             | Make sure Node.js and npm are installed. |
| Ports already in use?            | Stop any running servers or change ports. |
| Project doesn't run?             | Check for missing environment variables or dependencies. |
| Can't push to `main`?            | You're doing it right — open a Pull Request instead! |

---

## 🎯 Final Reminder

- **Always** pull the latest `main` branch before starting a new feature:
  ```bash
  git checkout development
  git pull origin development
  ```
- **Small commits** and **small PRs** are better than huge ones.
- **Ask questions early** — don’t stay stuck!

---


## ⚡ Useful Commands

| Command           | What it Does                     |
| ----------------- | --------------------------------- |
| `npm install`      | Install all dependencies         |
| `npm run dev`      | Start frontend + backend locally |
| `npm run build`    | Build production versions        |

---

# 🎯 Let's build something amazing!
