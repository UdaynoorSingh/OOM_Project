# SecureAttend: Multi-Layer Attendance Verification System

A comprehensive web application that implements a multi-layer attendance verification system with QR codes, location verification, face recognition, and professor verification.

## 🏗️ Architecture

### Tech Stack
- **Backend**: Java 17 + Spring Boot 3.3.3 + MongoDB
- **Frontend**: React 18 + TypeScript + Material UI + Vite
- **Database**: MongoDB
- **Build Tools**: Maven (Backend), npm (Frontend)

### OOP Design Principles Implementation

The backend implements all four pillars of Object-Oriented Programming:

#### 1. **Abstraction**
- `Person` abstract class with `markAttendance()` abstract method
- `VerificationStrategy` interface for different verification layers
- Service interfaces (`AttendanceService`, `UserService`)

#### 2. **Encapsulation**
- Private fields in domain models with getters/setters
- Repository pattern for data access
- Service layer encapsulation of business logic

#### 3. **Inheritance**
- `Student`, `Professor`, `TA` extend `Person`
- Polymorphic behavior through method overriding
- Repository inheritance from `MongoRepository`

#### 4. **Polymorphism**
- Different `markAttendance()` implementations per role
- Strategy pattern for verification layers
- Factory pattern for QR/codeword generation

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 16+
- MongoDB 4.4+
- Maven 3.6+

### 1. Database Setup

```bash
# Start MongoDB (adjust path as needed)
mongod --dbpath /path/to/your/db

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. Backend Setup

```bash
cd backend/secureattend-backend

# Install dependencies and run
mvn clean install
mvn spring-boot:run

# Backend will start on http://localhost:8080
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend will start on http://localhost:5173
```

## 📁 Project Structure

```
SecureAttend/
├── backend/
│   └── secureattend-backend/
│       ├── src/main/java/com/secureattend/
│       │   ├── domain/           # OOP Domain Models
│       │   │   ├── Person.java   # Abstract base class
│       │   │   ├── Student.java  # Extends Person
│       │   │   ├── Professor.java # Extends Person
│       │   │   ├── TA.java       # Extends Person
│       │   │   ├── CourseClass.java
│       │   │   ├── Session.java
│       │   │   └── Attendance.java
│       │   ├── repository/       # Data Access Layer
│       │   ├── service/          # Business Logic
│       │   ├── controller/       # REST Controllers
│       │   ├── verification/     # Strategy Pattern
│       │   ├── factory/          # Factory Pattern
│       │   └── config/           # Configuration
│       └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/           # React Components
│   │   │   ├── RoleSelector.tsx
│   │   │   ├── ProfessorDashboard.tsx
│   │   │   ├── StudentPortal.tsx
│   │   │   └── TADashboard.tsx
│   │   ├── services/            # API Services
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🔧 Core Features

### 1. Professor Dashboard
- **Create Sessions**: Generate QR codes and 6-letter codewords
- **Live Monitoring**: Real-time attendance tracking
- **Manual Verification**: Professor headcount and dual-tick verification
- **Proxy Flagging**: Flag suspected proxy attendance

### 2. Student Portal
- **Multi-Layer Verification**:
  1. QR Code/Codeword entry
  2. Location verification (GPS + Wi-Fi)
  3. Face recognition with liveness detection
- **Attendance History**: View past attendance records
- **Status Tracking**: Monitor verification status

### 3. TA Dashboard
- **Attendance Reports**: Generate detailed attendance analytics
- **Trend Analysis**: Track student attendance patterns
- **Verification Statistics**: Monitor system effectiveness

## 🛡️ Security Features

### Multi-Layer Verification System
1. **QR/Codeword Verification**: Session-specific tokens
2. **Location Verification**: GPS coordinates and Wi-Fi SSID
3. **Face Recognition**: Biometric verification with liveness detection
4. **Professor Verification**: Manual headcount and dual-tick system
5. **Proxy Detection**: Flag suspicious attendance patterns

### Verification Strategies (Strategy Pattern)
- `QrCodeVerification`: Validates QR tokens
- `CodewordVerification`: Validates 6-letter codewords
- `LocationVerification`: GPS and Wi-Fi validation
- `FaceVerification`: Biometric and liveness checks

## 🗄️ Database Schema

### MongoDB Collections

#### users
```json
{
  "_id": "student1",
  "name": "Alice Johnson",
  "role": "STUDENT",
  "studentNumber": "S001",
  "attendanceRecordIds": ["att1", "att2"]
}
```

#### classes
```json
{
  "_id": "class1",
  "code": "CS101",
  "title": "Introduction to Computer Science",
  "professorId": "prof1",
  "studentIds": ["student1", "student2"]
}
```

#### sessions
```json
{
  "_id": "session1",
  "classId": "class1",
  "qrToken": "ABC123...",
  "codeword": "XYZ789",
  "startTime": "2024-01-15T10:00:00Z",
  "open": true,
  "professorHeadcount": 25
}
```

#### attendance
```json
{
  "_id": "att1",
  "studentId": "student1",
  "sessionId": "session1",
  "verificationLayersPassed": ["QR", "LOCATION", "FACE"],
  "systemVerified": true,
  "professorVerified": false,
  "flaggedProxy": false,
  "timestamp": "2024-01-15T10:05:00Z"
}
```

## 🔌 API Endpoints

### Professor Endpoints
- `POST /api/professor/classes/{classId}/sessions` - Create session
- `PUT /api/professor/sessions/{sessionId}/close` - Close session
- `GET /api/professor/classes/{classId}/sessions/open` - Get open sessions
- `GET /api/professor/sessions/{sessionId}/attendance` - Get live attendance
- `PUT /api/professor/sessions/{sessionId}/headcount` - Update headcount
- `PUT /api/professor/attendance/{attendanceId}/flag` - Flag proxy
- `PUT /api/professor/attendance/{attendanceId}/verify` - Verify attendance

### Student Endpoints
- `POST /api/student/mark-attendance` - Mark attendance
- `GET /api/student/{studentId}/attendance` - Get student attendance
- `GET /api/student/{studentId}/sessions/{sessionId}/attendance` - Get specific attendance

### TA Endpoints
- `GET /api/ta/sessions/{sessionId}/attendance` - Get verified attendance
- `GET /api/ta/students/{studentId}/attendance` - Get student history

## 🧪 Testing

### Backend Tests
```bash
cd backend/secureattend-backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
```bash
cd backend/secureattend-backend
mvn clean package
java -jar target/secureattend-backend-0.0.1-SNAPSHOT.jar
```

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy dist/ folder to your web server
```

## 🔧 Configuration

### Backend Configuration (`application.properties`)
```properties
spring.application.name=secureattend-backend
server.port=8080
spring.data.mongodb.uri=mongodb://localhost:27017/secureattend
secureattend.cors.allowed-origins=http://localhost:5173
```

### Frontend Configuration (`vite.config.ts`)
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
})
```

## 🎯 Usage Examples

### 1. Professor Creates Session
1. Navigate to Professor Dashboard
2. Click "Create New Session"
3. Share QR code or codeword with students
4. Monitor live attendance
5. Update headcount and verify attendance
6. Close session when complete

### 2. Student Marks Attendance
1. Navigate to Student Portal
2. Enter session ID and QR/codeword
3. Complete multi-layer verification:
   - Location verification (automatic)
   - Face recognition (simulated)
4. Submit attendance
5. View attendance history

### 3. TA Generates Reports
1. Navigate to TA Dashboard
2. Select session for analysis
3. View attendance statistics
4. Generate trend reports
5. Monitor verification rates

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running on port 27017
   - Check connection string in `application.properties`

2. **CORS Errors**
   - Verify frontend URL in `secureattend.cors.allowed-origins`
   - Ensure backend is running on port 8080

3. **Build Errors**
   - Ensure Java 17+ is installed
   - Check Node.js version (16+)
   - Clear Maven cache: `mvn clean`

## 📝 Development Notes

### OOP Implementation Highlights

1. **Abstraction**: `Person` abstract class defines common behavior
2. **Encapsulation**: Private fields with controlled access
3. **Inheritance**: Role-based inheritance hierarchy
4. **Polymorphism**: Different attendance marking per role

### Design Patterns Used

- **Strategy Pattern**: Verification strategies
- **Factory Pattern**: QR/codeword generation
- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic encapsulation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section

---

**SecureAttend** - Secure, Multi-Layer Attendance Verification System
