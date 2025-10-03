package com.secureattend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.secureattend.domain.Attendance;
import com.secureattend.service.AttendanceService;
import com.secureattend.verification.VerificationInput;

@RestController
@RequestMapping("/api/student")
public class StudentController {
    private final AttendanceService attendanceService;

    public StudentController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/mark-attendance")
    public ResponseEntity<Attendance> markAttendance(@RequestBody VerificationInput input) {
        Attendance attendance = attendanceService.markAttendance(input);
        return attendance != null ? ResponseEntity.ok(attendance) : ResponseEntity.badRequest().build();
    }

    @GetMapping("/{studentId}/attendance")
    public ResponseEntity<List<Attendance>> getStudentAttendance(@PathVariable String studentId) {
        List<Attendance> attendance = attendanceService.getAttendanceForStudent(studentId);
        return ResponseEntity.ok(attendance);
    }

    @GetMapping("/{studentId}/sessions/{sessionId}/attendance")
    public ResponseEntity<Attendance> getAttendanceForSession(@PathVariable String studentId, @PathVariable String sessionId) {
        Optional<Attendance> attendance = attendanceService.getAttendanceForStudentAndSession(studentId, sessionId);
        return attendance.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
