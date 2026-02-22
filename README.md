# Slooze Food Ordering System
## 🚀 Tech Stack (Turborepo)

### Backend
- Nest (TypeScript)
- PostgreSQL (Neon)
- Prisma ORM
- JWT Based Authentication
- RBAC implemented.

### Frontend
- Next.js 15 (App Router)
- TypeScript
- shadcn/ui + Tailwind CSS
- Axios

---

## 🌍 Way 1: Live Deployed Version (Recommended)

### Frontend
👉 **https://slooze.anuragbhoite.in/login**

### Backend
👉 **https://backend.slooze.anuragbhoite.in**

> The deployed version demonstrates the complete end-to-end flow with real authentication, authorization, RBAC.

---

## 🔑 Test Credentials

You can use the following test accounts to verify multi-tenancy and isolation:

**User 1 (ADMIN)**
* **Email:** `nick@slooze.com`
* **Password:** `password123`

**User 2 (MANAGER)**
* **Email:** `america@slooze.com`
* **Password:** `password123`

**User 3 (MEMBER)**
* **Email:** `travis@slooze.com`
* **Password:** `password123`

---

## 🐳 Way 2: (Docker Database)

Follow these steps to get the project running locally using Docker for PostgreSQL and pnpm for package management.

### 1. Prerequisites & Installation

Ensure **Docker** is installed and running. If you don't have **pnpm** installed, install it via npm:

```bash
npm install -g pnpm
```
**Clone the repository and install dependencies:**
- Make sure you have node version >= 20.19+
```bash
git clone https://github.com/anuraag-5/Slooze.git
cd Slooze
pnpm install
npm i -g @nestjs/cli
```

**Spin up a PostgreSQL container:**
```bash
docker run -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres
```
**Create the database environment file:**
- Path: apps/backend/.env
- Content:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
```

**Run the database migrations:**
- cd apps/backend/prisma
```bash
npx prisma migrate dev --name init
npx prisma generate
```

**Seed temporary data**
- cd apps/backend/prisma
```bash
pnpm run seed:db
```

**Create the backend environment file:**
- Path: apps/backend/.env
- Content (Add):
```bash
JWT_SECRET=mysecret
PORT=3001
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
```

**Create the frontend environment file:**
- Path: apps/frontend/.env
- Content:
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

**5. Running the Application**
- You will need two terminal windows.
- Terminal 1: Start Backend
```bash
cd apps/backend
pnpm run start:dev
```
- Terminal 2: Start Frontend Go to the root directory (/Slooze or open a new terminal) and run:
```bash
pnpm run dev
```
**🎉 You can now interact with the app at http://localhost:3000.**


**Some images**

<img width="1919" height="869" alt="image" src="https://github.com/user-attachments/assets/c140fa08-a7f3-4944-b3b1-7969a80f1dc9" />

<img width="1919" height="871" alt="image" src="https://github.com/user-attachments/assets/a99fb7f7-1152-4004-ae68-f79e6d61cd0c" />



