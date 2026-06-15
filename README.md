# Hospital IT Helpdesk Portal

A web-based IT helpdesk portal for hospitals. It includes login/register, ticket creation, category and priority selection, status tracking, technician assignment, SLA due tracking, resolution notes, ticket history/activity logs, dashboard analytics, and CSV report export.

## Run

```bash
npm run install-all
npm run dev
```

Frontend: http://localhost:3000  
Backend API: http://localhost:5000

## Demo Login

Admin/Technician/User accounts can be created from Register. For a technician/admin, choose the required role during registration.

## Structure

- `client/` React.js frontend with React Router, Context API, Axios, controlled forms, Bootstrap, responsive UI.
- `server/` Node.js + Express REST API with file-based LocalStorage-style JSON persistence.
