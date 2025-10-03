package com.secureattend.domain;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "sessions")
public class Session {
    @Id
    private String id;
    private String classId;
    private String qrToken;
    private String codeword;
    private Instant startTime;
    private Instant endTime;
    private boolean open;
    private int professorHeadcount;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getClassId() { return classId; }
    public void setClassId(String classId) { this.classId = classId; }
    public String getQrToken() { return qrToken; }
    public void setQrToken(String qrToken) { this.qrToken = qrToken; }
    public String getCodeword() { return codeword; }
    public void setCodeword(String codeword) { this.codeword = codeword; }
    public Instant getStartTime() { return startTime; }
    public void setStartTime(Instant startTime) { this.startTime = startTime; }
    public Instant getEndTime() { return endTime; }
    public void setEndTime(Instant endTime) { this.endTime = endTime; }
    public boolean isOpen() { return open; }
    public void setOpen(boolean open) { this.open = open; }
    public int getProfessorHeadcount() { return professorHeadcount; }
    public void setProfessorHeadcount(int professorHeadcount) { this.professorHeadcount = professorHeadcount; }
}


