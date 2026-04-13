# Online Voting System

A full-stack, secure Online Voting System designed to allow users to participate in elections and administrators to manage polls.

**Live Demo:** [https://online-voting-system-gold-two.vercel.app](https://online-voting-system-gold-two.vercel.app)
**Start Backend:** [https://online-voting-system-k4bq.onrender.com](https://online-voting-system-k4bq.onrender.com)

---

## 🏗️ Architecture Overview

The system is built using a modern decoupled architecture:
- **Backend:** A robust RESTful API built with Java 21 and Spring Boot 3, providing secure endpoints for authentication, poll management, and voting logic.
- **Frontend:** A responsive Single Page Application (SPA) built with React 18, Vite, and Tailwind CSS.
- **Database:** Relational data storage using MySQL (local for development, cloud-hosted for production).

---

## ⚙️ Backend Deep Dive

The backend serves as the secure core of the application, handling all business logic, data persistence, and authorization.

### 🛠️ Tech Stack
- **Java 21**
- **Spring Boot 3.x** (Web, Data JPA, Security)
- **Spring Security & JWT** (JSON Web Tokens) for stateless authentication
- **Hibernate / Spring Data JPA** for ORM
- **MySQL Driver**
- **Docker** for containerized deployment

### 🗄️ Database Schema & Entities
The database relies on three primary entities with managed relationships to ensure data integrity and prevent duplicate voting:

1. **`Voter` (User)**
   - Stores user credentials and roles (`USER` or `ADMIN`).
   - Maintains a `@ManyToMany` relationship with `Poll` (`votedPolls`) to quickly check if a user has participated in a specific election.
   - Maintains a `@ManyToMany` relationship with `Option` (`votedOptions`) to track the specific choice a user made.

2. **`Poll` (Election)**
   - Stores poll metadata (Title, Description, Start/End Time).
   - Has a `@OneToMany` relationship with `Option`. When a poll is deleted, `CascadeType.ALL` ensures all associated options are also safely removed.

3. **`Option` (Candidate/Choice)**
   - Stores the option text and the total `votes` count.
   - Back-references the `Poll` it belongs to (ignored in JSON serialization using `@JsonIgnore` to prevent infinite recursion).

### 🔐 Security & Authentication
- **Stateless Sessions:** The application uses `SessionCreationPolicy.STATELESS`. No session state is stored on the server.
- **JWT Filter:** A custom `JwtFilter` intercepts every incoming request. It extracts the Bearer token from the `Authorization` header, validates the signature and expiration, and sets the `SecurityContext` allowing Spring to authorize endpoints based on the user's role.
- **Password Hashing:** Passwords are never stored in plain text. `BCryptPasswordEncoder` is used to hash passwords during registration and verify them during login.
- **CORS Configuration:** Spring Security is configured with a dynamic `CorsConfigurationSource` to safely allow cross-origin requests from the React frontend via the `${FRONTEND_URL}` environment variable.

### 📡 Core API Endpoints

**Authentication (`/api/auth`)**
- `POST /register` - Registers a new Voter/Admin.
- `POST /login` - Authenticates credentials and returns a JWT + User ID.

**Poll Management (`/api/polls`)**
- `GET /` - Fetches all active and historical polls.
- `GET /{pollId}/results` - Returns detailed voting results for a specific poll.
- `GET /user-votes/{userId}` - Returns historical voting data (polls and specific options) for a given user.
- `POST /{pollId}/vote` - Records a vote. Validates that the user exists, the poll exists, the option belongs to the poll, and **critically**, that the user hasn't already voted in this poll.

**Admin Endpoints** *(Protected by UI routing, validated by backend logic)*
- `POST /` - Creates a new poll alongside its initial options.
- `DELETE /{pollId}` - Safely deletes a poll. The service layer carefully untangles foreign-key constraints (removing the poll from users' `votedPolls` and `votedOptions` sets) before executing the deletion to prevent database errors.

---

## 🚀 Deployment (Docker & Render)

The backend is designed for cloud-native deployment using Docker. 

A multi-stage `Dockerfile` is included:
1. **Build Stage:** Uses `eclipse-temurin:21-jdk-alpine` to compile the Java code and package it into a standalone `.jar` using the Maven wrapper (`./mvnw`).
2. **Run Stage:** Uses a lighter `eclipse-temurin:21-jre-alpine` image to execute the `.jar` file, exposing port `8080`.

**Environment Variables Required for Production:**
- `DB_URL`: The JDBC connection string to the cloud MySQL instance.
- `DB_USER`: Database username.
- `DB_PASS`: Database password.
- `FRONTEND_URL`: The domain of the deployed frontend (e.g., `https://online-voting-system-gold-two.vercel.app`) to configure CORS safely.

---

## 💻 Local Setup Instructions

### Backend Setup
1. Ensure **Java 21** and **MySQL** are installed.
2. Create a local database named `votingdb`:
   ```sql
   CREATE DATABASE votingdb;
   ```
3. Navigate to the root directory and run the Spring Boot application using Maven:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(The application will start on `http://localhost:8080` and automatically create the necessary database tables via Hibernate).*

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *(The React app will be accessible at `http://localhost:3000` and proxy API requests to port `8080`).*

### Screenshots
<img width="1901" height="837" alt="Screenshot 2026-04-13 045713" src="https://github.com/user-attachments/assets/650fe307-d934-4e67-a660-31d65bc22096" />

<img width="1892" height="834" alt="Screenshot 2026-04-13 045833" src="https://github.com/user-attachments/assets/e7937b92-caff-48ef-aeb9-e2cc21bc7020" />

<img width="1895" height="836" alt="Screenshot 2026-04-13 045852" src="https://github.com/user-attachments/assets/0099177a-189c-4332-ba19-14554dc3118b" />


