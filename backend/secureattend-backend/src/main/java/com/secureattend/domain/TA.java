package com.secureattend.domain;

public class TA extends Person {
    private String supervisorProfessorId;

    @Override
    public void markAttendance(String sessionId) {
        // TA typically generates reports; polymorphic method kept for contract completeness
    }

    public String getSupervisorProfessorId() { return supervisorProfessorId; }
    public void setSupervisorProfessorId(String supervisorProfessorId) { this.supervisorProfessorId = supervisorProfessorId; }
}


