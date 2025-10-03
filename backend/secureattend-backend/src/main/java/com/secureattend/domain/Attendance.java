package com.secureattend.domain;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "attendance")
public class Attendance {
    @Id
    private String id;
    private String studentId;
    private String sessionId;
    private List<String> verificationLayersPassed = new ArrayList<>();
    private boolean systemVerified;
    private boolean professorVerified;
    private boolean flaggedProxy;
    private Instant timestamp = Instant.now();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public List<String> getVerificationLayersPassed() { return verificationLayersPassed; }
    public void setVerificationLayersPassed(List<String> verificationLayersPassed) { this.verificationLayersPassed = verificationLayersPassed; }
    public boolean isSystemVerified() { return systemVerified; }
    public void setSystemVerified(boolean systemVerified) { this.systemVerified = systemVerified; }
    public boolean isProfessorVerified() { return professorVerified; }
    public void setProfessorVerified(boolean professorVerified) { this.professorVerified = professorVerified; }
    public boolean isFlaggedProxy() { return flaggedProxy; }
    public void setFlaggedProxy(boolean flaggedProxy) { this.flaggedProxy = flaggedProxy; }
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}


