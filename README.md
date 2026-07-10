# SkyOra

SkyOra is a full-stack travel management and booking application built with Angular on the frontend and ASP.NET Core on the backend. It provides a modern user experience for browsing flights, managing bookings, handling authentication, and interacting with travel-related features.

## Overview

SkyOra is designed as a scalable web application for travel services, combining:

- a responsive and modular frontend experience,
- a secure backend API,
- database-backed business logic,
- automated testing for reliability.

## Features

- User registration, login, and account management
- JWT-based authentication and role-based access control
- Flight browsing, adding, editing, and management
- Booking creation, updating, cancellation, and tracking
- Passenger detail collection and booking cart workflows
- Payment gateway experience and booking confirmation flow
- Travel certificate, baggage, pet policy, and add-on information pages
- Feedback submission and display of messages or support feedback
- Admin registration and administrative management features
- Responsive UI with multiple travel and account-related screens
- Testing support for unit, component, and user acceptance testing

## Tech Stack

### Frontend
- Angular 21
- TypeScript
- Bootstrap
- RxJS
- Vitest for unit testing
- Playwright for UAT/end-to-end testing

### Backend
- ASP.NET Core
- Entity Framework Core
- SQL Server
- JWT Authentication
- Swagger / OpenAPI
- xUnit and Moq for backend testing

## Project Structure

- [SkyOra-Frontend](SkyOra-Frontend) – Angular frontend application
- [SkyOra-Backend](SkyOra-Backend) – ASP.NET Core backend application
- [SkyOra-Backend/SkyOra1.Tests](SkyOra-Backend/SkyOra1.Tests) – Backend unit tests

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js and npm
- .NET 10 SDK
- SQL Server (or a reachable SQL Server instance)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd SkyOra
```

### 2. Run the frontend

```bash
cd SkyOra-Frontend
npm install
npm start
```

The frontend will be available at:

```text
http://localhost:4200
```

### 3. Run the backend

```bash
cd ../SkyOra-Backend
dotnet restore
dotnet run --project skyora1/skyora1.csproj
```

The backend API will be available through the configured ASP.NET Core endpoints.

## Configuration

The backend uses configuration values such as the database connection string and JWT settings. Update the relevant configuration files in the backend project before running locally.

## Testing

### Frontend unit tests

```bash
cd SkyOra-Frontend
npm run test:unit
```

### Frontend UAT / end-to-end tests

```bash
cd SkyOra-Frontend
npm run test:uat
```

### Backend tests

```bash
cd SkyOra-Backend
dotnet test SkyOra1.Tests/SkyOra1.Tests.csproj
```

If the backend process is already running and blocks the build output, stop it before re-running backend tests:

```powershell
Get-Process skyora1 -ErrorAction SilentlyContinue | Stop-Process -Force
```

## Architecture Summary

The application follows a modern full-stack architecture:

- Angular components and routes manage the user interface
- ASP.NET Core controllers expose RESTful APIs
- Repository classes handle data access logic
- Entity Framework Core manages database operations
- JWT authentication secures protected endpoints
- Dependency injection keeps the system modular and maintainable

## Notes

This project includes both basic component-level testing and browser-based user acceptance testing, making it suitable for demonstrating modern software development practices.

## License

This project does not currently include a specified license file.
