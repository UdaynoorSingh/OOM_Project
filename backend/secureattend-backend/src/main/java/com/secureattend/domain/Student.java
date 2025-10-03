package com.secureattend.domain;

public class Student extends Person {
    private String studentNumber;

    @Override
    public void markAttendance(String sessionId) {
        // Student flow handled via strategies externally; this represents polymorphic intent
        // No-op in entity; services perform actual verification
    }

    public String getStudentNumber() { return studentNumber; }
    public void setStudentNumber(String studentNumber) { this.studentNumber = studentNumber; }
}


