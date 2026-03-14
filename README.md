# Password Vault Application

This repository contains a **full-stack password vault application** built as a portfolio project. It includes both the backend API and the frontend client.

---

## Repository Structure

```
/backend  - .NET backend API
/frontend - React frontend application (Vite + TypeScript)
```

Each folder contains its own README with more details on running the application individually.

---

## Features

- Create, fetch, and view password entries.
- Encrypted storage of passwords (backend encryption with a hard-coded key for MVP purposes).
- Basic frontend interface to manage password entries.
- Demonstrates full-stack integration (React frontend + .NET backend).

---

## Running the Application

### Backend

1. Navigate to the backend folder:

```bash
cd backend/Api
```

2. Start the backend API using .NET watch:

```bash
dotnet watch run
```

- The API will run locally (default port: 5174 or as configured).

### Frontend

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies using **pnpm** (if not installed yet):

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm run dev
```

- The frontend will run locally (default port: 5173).

---

## Usage

1. Start the backend API first.
2. Start the frontend development server.
3. Open the frontend in your browser (`http://localhost:5173`).
4. Use the UI to create new password entries or view existing ones.

---

## Notes

- This is an **MVP project for portfolio purposes**. The backend uses a hard-coded key for encryption; it is **not suitable for production**.
- Each folder contains a **more detailed README** with instructions specific to that part of the application.

---

## Tech Stack

- **Backend**: .NET, C#
- **Frontend**: React, TypeScript, Vite, pnpm
- **Encryption**: AES (backend, MVP implementation)

---

## License

This project is for portfolio/demo purposes. Use at your own risk.
