package com.secureattend.domain;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public abstract class Person {
    @Id
    private String id;
    private String name;
    private Role role;
    private List<String> attendanceRecordIds = new ArrayList<>();

    public enum Role {
        STUDENT, PROFESSOR, TA
    }

    public abstract void markAttendance(String sessionId);

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public List<String> getAttendanceRecordIds() { return attendanceRecordIds; }
    public void setAttendanceRecordIds(List<String> attendanceRecordIds) { this.attendanceRecordIds = attendanceRecordIds; }
}


