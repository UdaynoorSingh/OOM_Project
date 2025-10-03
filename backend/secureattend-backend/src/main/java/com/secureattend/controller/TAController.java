package com.secureattend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.secureattend.domain.Attendance;
import com.secureattend.service.AttendanceService;

@RestController
@RequestMapping("/api/ta")
public class TAController {
    private final AttendanceService attendanceService;

    public TAController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping("/sessions/{sessionId}/attendance")
    public ResponseEntity<List<Attendance>> getVerifiedAttendance(@PathVariable String sessionId) {
        List<Attendance> attendance = attendanceService.getAttendanceForSession(sessionId);
        return ResponseEntity.ok(attendance);
    }

    @GetMapping("/students/{studentId}/attendance")
    public ResponseEntity<List<Attendance>> getStudentAttendanceHistory(@PathVariable String studentId) {
        List<Attendance> attendance = attendanceService.getAttendanceForStudent(studentId);
        return ResponseEntity.ok(attendance);
    }
}
