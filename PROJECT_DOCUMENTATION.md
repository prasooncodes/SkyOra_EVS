# SkyOra Project Documentation

## 1. Project Overview

SkyOra is a full-stack airline booking platform made of two applications:

- `SkyOra-Backend`: an ASP.NET Core Web API built with .NET 10, Entity Framework Core, SQL Server, JWT authentication, Swagger, and PDF ticket generation.
- `SkyOra-Frontend`: an Angular 21 application with SSR support, route guards, local storage based auth, and a large set of booking, admin, and informational screens.

The platform supports customer registration and login, flight search, booking management, passenger entry, seat selection, ticket emailing, feedback, contact messages, chatbot-style assistance, and admin-level flight/user management.

## 2. High-Level Architecture

The system is split into three main layers:

1. Presentation layer
   - Angular routes and components in the frontend.
   - Public pages, authenticated user pages, and admin pages.

2. API layer
   - ASP.NET Core controllers expose REST endpoints under `api/*`.
   - JWT protected endpoints read the current user from token claims.

3. Data layer
   - Entity Framework Core maps models to SQL Server tables.
   - Repository classes encapsulate most CRUD operations.

The frontend talks to the backend through HTTP calls against `https://localhost:7169/api/...`.

## 3. Backend Summary

### 3.1 Main backend startup

The backend entry point is [SkyOra-Backend/skyora1/Program.cs](SkyOra-Backend/skyora1/Program.cs).

It configures:

- Controllers with JSON property naming preserved as-is.
- Swagger/OpenAPI for development.
- Dependency injection for repositories such as bookings, flights, users, passengers, feedback, messages, and chat knowledge.
- SQL Server through `AppDbContext`.
- JWT bearer authentication and authorization.
- CORS allowing all origins.
- `HttpClient` for AI/chat integration.

### 3.2 Core backend features

The backend controllers expose these functional areas:

- Auth: login and JWT issuance.
- Users: create, update, list, and delete users.
- Flights: list, search, create, edit, delete, and list operational cities.
- Bookings: create booking, list bookings, get booking by id, update booking, delete booking, reserve-seat lookup, and send ticket by email.
- Passengers: list passengers, create passenger records, and fetch passengers by booking.
- Feedback: collect and list feedback.
- Messages: collect and list contact messages.
- Chat: send AI assistant messages with live flight knowledge and fallback responses.
- Analytics: track page views and retrieve view counts.

### 3.3 Important backend behaviors

#### Authentication

The login endpoint validates the submitted email and password against the database, checks the password using BCrypt, and returns a JWT. The token includes the user id, email, and role claims.

Relevant file: [SkyOra-Backend/skyora1/Controllers/AuthController.cs](SkyOra-Backend/skyora1/Controllers/AuthController.cs)

#### Booking creation

When a booking is created, the backend reads the user id from the JWT token instead of trusting the client payload. This prevents the client from spoofing ownership of the booking. After saving the booking, the backend tries to generate a PDF ticket and email it to the user.

Relevant file: [SkyOra-Backend/skyora1/Controllers/BookingController.cs](SkyOra-Backend/skyora1/Controllers/BookingController.cs)

#### Ticket generation and email

The booking controller generates a PDF ticket with PdfSharpCore and attempts to send it through SMTP. If SMTP settings are missing, the booking still succeeds and the failure is logged.

#### AI assistant

The chat controller can call an external AI endpoint when configured. If the AI configuration is missing or the remote call fails, the backend returns a safe fallback response.

Relevant file: [SkyOra-Backend/skyora1/Controllers/ChatController.cs](SkyOra-Backend/skyora1/Controllers/ChatController.cs)

#### Page analytics

The analytics controller stores page view counts, first-view timestamps, and last-view timestamps. This is used to measure which pages are visited most often.

Relevant file: [SkyOra-Backend/skyora1/Controllers/AnalyticsController.cs](SkyOra-Backend/skyora1/Controllers/AnalyticsController.cs)

## 4. Backend Data Model

The main entities are defined in the model layer and registered in [SkyOra-Backend/skyora1/DAL/AppDbContext.cs](SkyOra-Backend/skyora1/DAL/AppDbContext.cs).

- `User`: stores name, age, gender, role, email, password hash, and bookings.
- `Flight`: stores flight number, route, departure and arrival times, seat inventory, and pricing.
- `Booking`: links a user to a flight, stores passenger count, booking dates, total amount, booking status, and passengers.
- `Passenger`: stores passenger details and seat assignment for a booking.
- `Feedback`: stores user feedback text.
- `Messages`: stores contact form submissions.
- `PageView`: stores analytics counters per page.

The database is also seeded with sample flight data so the application has operational routes available immediately after setup.

## 5. Frontend Summary

### 5.1 Main frontend startup

The frontend is an Angular application configured in [SkyOra-Frontend/src/app/app.config.ts](SkyOra-Frontend/src/app/app.config.ts) and routed in [SkyOra-Frontend/src/app/app.routes.ts](SkyOra-Frontend/src/app/app.routes.ts).

It uses:

- Angular routing.
- SSR and client hydration.
- `HttpClient` with fetch support.
- Route guards for authenticated and admin-only pages.

### 5.2 Frontend structure

The `src/app` folder is organized around:

- `Component/`: feature screens such as booking, login, flight management, feedback, chat, payment, and policy pages.
- `services/`: API clients for flights, bookings, users, passengers, feedback, messages, analytics, chat, and auth.
- `guards/`: route protection for logged-in users and admins.
- `Models/`: TypeScript interfaces for frontend data binding.

### 5.3 Frontend route groups

The application is split into these user-facing areas:

- Public pages: welcome, about, contact, offers, terms, policies, error, and informational screens.
- Authentication pages: login, register, admin registration.
- Flight browsing: flight list, flight details, search, and flight management pages.
- Booking journey: book flight, passenger details, booking cart, seat selection, payment, success page, manage booking, cancel booking, edit booking, and ticket-related screens.
- Account and support: manage account, feedback, contact messages, chat widget, and travel certificate.
- Admin screens: flight add/edit, display feedback, display mails, user list, and analytics-related functionality.

## 6. Main User Flows

### 6.1 Customer booking flow

1. The user opens the site and searches for flights by source, destination, and optionally departure date.
2. The user selects a flight and enters passenger details.
3. Seat selection is performed for each passenger.
4. The booking is submitted to the backend with the JWT token attached.
5. The backend stores the booking, assigns the booking to the logged-in user, and attempts to email a PDF ticket.
6. The user can later view, edit, cancel, or resend the ticket for the booking.

### 6.2 Admin flow

1. An admin logs in and accesses protected screens.
2. The admin can add, edit, and delete flights.
3. The admin can view feedback, user entries, contact messages, and analytics data.

### 6.3 Support flow

1. A user can send a message through the contact form.
2. A user can leave feedback.
3. The chat widget can answer from the AI endpoint when configured, otherwise it falls back to a safe local response.

## 7. API Surface Summary

The backend exposes the following main routes:

- `POST /api/Auth/Login`
- `GET /api/User`
- `GET /api/User/{id}`
- `POST /api/User`
- `PUT /api/User/{id}`
- `DELETE /api/User/{id}`
- `GET /api/Flight`
- `GET /api/Flight/{id}`
- `GET /api/Flight/search`
- `POST /api/Flight`
- `PUT /api/Flight/{id}`
- `DELETE /api/Flight/{id}`
- `GET /api/Flight/operational-cities`
- `GET /api/Booking`
- `GET /api/Booking/{id}`
- `POST /api/Booking`
- `PUT /api/Booking/{id}`
- `DELETE /api/Booking/{id}`
- `GET /api/Booking/flight/{flightId}/reserved-seats`
- `POST /api/Booking/{id}/sendticket`
- `GET /api/Passenger`
- `GET /api/Passenger/{id}`
- `POST /api/Passenger`
- `GET /api/Feedback`
- `POST /api/Feedback`
- `GET /api/Message`
- `POST /api/Message`
- `POST /api/Chat/send`
- `POST /api/analytics/track`
- `GET /api/analytics`

## 8. Technology Stack

### Backend

- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- JWT authentication
- BCrypt password hashing
- Swagger / OpenAPI
- PdfSharpCore for ticket PDFs
- SMTP email delivery
- Semantic Kernel package presence for AI-related integration

### Frontend

- Angular 21
- Angular SSR and hydration
- Bootstrap
- Leaflet
- ng-recaptcha
- RxJS

## 9. Setup And Run

### 9.1 Backend

1. Open [SkyOra-Backend/skyora1/appsettings.json](SkyOra-Backend/skyora1/appsettings.json).
2. Configure the SQL Server connection string under `ConnectionStrings:conn`.
3. Configure JWT settings under `Jwt`.
4. Optionally configure SMTP settings if you want ticket emails to be sent.
5. Run the API project from the backend solution.

### 9.2 Frontend

1. Open [SkyOra-Frontend/package.json](SkyOra-Frontend/package.json).
2. Install dependencies with npm.
3. Start the Angular app.
4. Make sure the frontend API URLs still match the backend host and port.

### 9.3 Common commands

Backend:

```bash
dotnet restore
dotnet build
dotnet run
```

Frontend:

```bash
npm install
npm start
npm run build
```

## 10. Notes For Presentation

If you need to explain the project in an interview or demo, present it in this order:

1. What SkyOra does: flight search, booking, ticketing, and support.
2. How the system is split: Angular frontend plus ASP.NET Core backend.
3. How a booking works end to end: search, select, passenger details, seat selection, pay, confirm, email ticket.
4. How security works: login, JWT, role-based guards, and protected booking APIs.
5. How operations work: admin flight management, feedback/messages, analytics, and chatbot support.

## 11. Interview Script

SkyOra is a full-stack airline booking platform built with an Angular frontend and an ASP.NET Core backend. The goal of the system is to let users search flights, book seats, manage passengers, receive tickets by email, and contact support, while giving admins the tools to manage flights and review platform activity.

On the backend, the application uses Entity Framework Core with SQL Server, JWT authentication, repository-based business logic, and Swagger for API testing. The key entities are users, flights, bookings, passengers, feedback, messages, and page views. When a user logs in, the backend validates the password with BCrypt and returns a JWT token, which is then used to secure booking and account-related actions.

The booking flow is the most important part of the system. A user searches for flights, selects a route, enters passenger details, chooses seats, and submits the booking. The backend saves the booking under the logged-in user, calculates the booking data, and then generates a PDF ticket. If SMTP is configured, the ticket is emailed to the user automatically.

The frontend is organized into reusable components and route-based screens. It includes public pages like welcome, about, contact, offers, and policies, plus authenticated pages for booking, account management, and booking history. Admin users can access flight add and edit screens, user management, feedback, mail display, and analytics pages. Route guards protect the private and admin-only sections.

The project also includes supporting features such as a chatbot, feedback forms, contact messages, seat selection, ticket resend, and page analytics. The chatbot can use an external AI endpoint if configured, but it also has a fallback response so the application still behaves safely when AI settings are unavailable.

In short, SkyOra is designed as a complete airline reservation workflow: search, book, pay, manage, and support. The technical value of the project is in how the frontend, backend, database, authentication, email delivery, and admin tools are connected into one end-to-end system.

## 11. Where To Look In Code

- Backend startup and service wiring: [SkyOra-Backend/skyora1/Program.cs](SkyOra-Backend/skyora1/Program.cs)
- Database context and seeded flights: [SkyOra-Backend/skyora1/DAL/AppDbContext.cs](SkyOra-Backend/skyora1/DAL/AppDbContext.cs)
- Booking logic: [SkyOra-Backend/skyora1/Controllers/BookingController.cs](SkyOra-Backend/skyora1/Controllers/BookingController.cs)
- Auth logic: [SkyOra-Backend/skyora1/Controllers/AuthController.cs](SkyOra-Backend/skyora1/Controllers/AuthController.cs)
- Flight API: [SkyOra-Backend/skyora1/Controllers/FlightController.cs](SkyOra-Backend/skyora1/Controllers/FlightController.cs)
- Route map: [SkyOra-Frontend/src/app/app.routes.ts](SkyOra-Frontend/src/app/app.routes.ts)
- Frontend auth service: [SkyOra-Frontend/src/app/services/auth-service.ts](SkyOra-Frontend/src/app/services/auth-service.ts)
- Frontend booking API client: [SkyOra-Frontend/src/app/services/booking.ts](SkyOra-Frontend/src/app/services/booking.ts)
