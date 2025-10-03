package com.secureattend.domain;

public class Professor extends Person {
    private String department;

    @Override
    public void markAttendance(String sessionId) {
        // Professor confirms dual-tick/headcount in services; entity keeps polymorphic contract
    }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
}


