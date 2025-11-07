# LawConnect – Lawyer Appointment System

LawConnect is a full-stack web application that simplifies the process of finding, booking, and managing appointments with lawyers.  
It provides verified lawyer profiles, real-time slot availability, secure authentication, and a seamless user experience for both clients and lawyers.

---

## 🚀 Features

### ✅ User Features (Clients)
- Register and log in securely using JWT authentication  
- Browse and search lawyers by name, specialization, or location  
- View lawyer profiles, expertise, ratings, and available time slots  
- Book appointments with real-time availability  
- Manage bookings (view, cancel)  
- Rate lawyers after consultations  

### ✅ Lawyer Features
- Register and create a professional profile  
- Add, update, or delete available slots  
- View booked appointments  
- Accept or reject client bookings (if enabled)  

### ✅ Admin Features (Optional)
- Approve or verify lawyer accounts  
- Manage users, lawyers, and appointments  
- Ensure only valid lawyers are listed on the platform  

---

## 🧱 Architecture

LawConnect follows a **RESTful service architecture**, separated into:

- **Frontend:**  
  - HTML5  
  - Bootstrap 5  
  - CSS  
  - JavaScript (Fetch API for REST calls)

- **Backend:**  
  - Java  
  - Spring Boot  
  - Spring Security (JWT Authentication)  
  - Spring Data JPA  
  - MySQL Database  

The system uses a **Controller → Service → Repository** layered architecture for clean separation of concerns.

---

## 🗂️ Database Design

### ✅ Core Entities
- **User**  
  - id, name, email, password, role (CLIENT / LAWYER / ADMIN)

- **Lawyer**  
  - lawyerId, specialization, experience, bio, rating, associated userId  

- **Slot**  
  - slotId, lawyerId, date, startTime, endTime, status (AVAILABLE / BOOKED)

- **Appointment**  
  - appointmentId, userId, lawyerId, slotId, status (PENDING / CONFIRMED / CANCELLED)  

### ✅ Key Constraints
- One lawyer → many slots  
- One user → many appointments  
- Slot cannot be double-booked  
- Appointment and Slot are transactionally updated  

---

## 🔐 Security

LawConnect implements a strong security layer using:

- **JWT (JSON Web Tokens)** for login  
- **Spring Security** for route protection  
- **Role-based access control (RBAC)**  
  - CLIENT → book & view appointments  
  - LAWYER → manage slots & bookings  
  - ADMIN → verify lawyers  

- Passwords stored using **BCrypt hashing**  

---

## ⚙️ Backend Setup

### ✅ Prerequisites
- Java 17+  
- Maven  
- MySQL  
