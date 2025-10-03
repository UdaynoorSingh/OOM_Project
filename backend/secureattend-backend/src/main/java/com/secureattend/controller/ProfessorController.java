package com.secureattend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.secureattend.domain.Attendance;
import com.secureattend.domain.Session;
import com.secureattend.service.AttendanceService;
import com.secureattend.service.SessionService;

@RestController
@RequestMapping("/api/professor")
public class ProfessorController {
    private final SessionService sessionService;
    private final AttendanceService attendanceService;

    public ProfessorController(SessionService sessionService, AttendanceService attendanceService) {
        this.sessionService = sessionService;
        this.attendanceService = attendanceService;
    }

    @PostMapping("/classes/{classId}/sessions")
    public ResponseEntity<Session> createSession(@PathVariable String classId) {
        Session session = sessionService.createSession(classId);
        return ResponseEntity.ok(session);
    }

    @PutMapping("/sessions/{sessionId}/close")
    public ResponseEntity<Session> closeSession(@PathVariable String sessionId) {
        Session session = sessionService.closeSession(sessionId);
        return session != null ? ResponseEntity.ok(session) : ResponseEntity.notFound().build();
    }

    @GetMapping("/classes/{classId}/sessions/open")
    public ResponseEntity<List<Session>> getOpenSessions(@PathVariable String classId) {
        List<Session> sessions = sessionService.getOpenSessionsForClass(classId);
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/sessions/{sessionId}/attendance")
    public ResponseEntity<List<Attendance>> getLiveAttendance(@PathVariable String sessionId) {
        List<Attendance> attendance = attendanceService.getAttendanceForSession(sessionId);
        return ResponseEntity.ok(attendance);
    }

    @PutMapping("/sessions/{sessionId}/headcount")
    public ResponseEntity<Session> updateHeadcount(@PathVariable String sessionId, @RequestBody HeadcountRequest request) {
        Session session = sessionService.updateProfessorHeadcount(sessionId, request.headcount);
        return session != null ? ResponseEntity.ok(session) : ResponseEntity.notFound().build();
    }

    @PutMapping("/attendance/{attendanceId}/flag")
    public ResponseEntity<Attendance> flagProxy(@PathVariable String attendanceId, @RequestBody FlagRequest request) {
        Attendance attendance = attendanceService.flagProxy(attendanceId, request.flagged);
        return attendance != null ? ResponseEntity.ok(attendance) : ResponseEntity.notFound().build();
    }

    @PutMapping("/attendance/{attendanceId}/verify")
    public ResponseEntity<Attendance> verifyAttendance(@PathVariable String attendanceId, @RequestBody VerifyRequest request) {
        Attendance attendance = attendanceService.professorVerify(attendanceId, request.verified);
        return attendance != null ? ResponseEntity.ok(attendance) : ResponseEntity.notFound().build();
    }

    public static class HeadcountRequest {
        public int headcount;
    }

    public static class FlagRequest {
        public boolean flagged;
    }

    public static class VerifyRequest {
        public boolean verified;
    }
}
