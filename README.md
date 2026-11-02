# TransitConnect

Public Transportation & Route Information Mobile Application — a university software-engineering project.

TransitConnect helps passengers discover public-transport routes, find nearby stops on a map, view demonstration schedules, save favourite routes, receive service alerts, and report transportation problems. The mobile app (React Native + Expo + TypeScript) talks to a Node.js/Express REST API backed by PostgreSQL via Prisma.

---

## 1. Repository layout

TransitConnect/
├── backend/       Node.js + Express + Prisma + PostgreSQL REST API
├── mobile/        React Native + Expo Router + TypeScript mobile application
├── docker-compose.yml
└── README.md

Frontend and backend are separate applications communicating only through HTTP. The mobile app never connects to PostgreSQL directly.

---

## 2. Technology stack

| Layer | Technology |
|---|---|
| Mobile | React Native 0.76, Expo SDK 52, Expo Router 4, TypeScript |
| State | TanStack Query, Zustand, AsyncStorage, Expo SecureStore |
| Forms | React Hook Form + Zod |
| Device | Expo Location, React Native Maps, Expo Notifications, Expo Image Picker |
| Backend | Node.js, Express 4, TypeScript, Zod, JWT, bcrypt |
| Database | PostgreSQL 16, Prisma ORM |
| Testing | Jest + Supertest (backend), Jest + React Native Testing Library (mobile) |
| Build | EAS Build (APK / AAB) |

---

## 3. Prerequisites

- Node.js ≥ 18 and npm ≥ 9
- Docker Desktop (for local PostgreSQL) **or** an existing PostgreSQL 16 instance
- Expo Go on a physical Android device **or** an Android emulator
- (For building an APK) `eas-cli` and an Expo account

---

## 4. Installation

Clone the repository and install workspace dependencies from the **root** directory:

```bash
git clone https://github.com/<your-org>/transitconnect.git
cd transitconnect
npm install