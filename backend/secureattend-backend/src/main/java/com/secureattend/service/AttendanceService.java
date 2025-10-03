package com.secureattend.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.secureattend.domain.Attendance;
import com.secureattend.domain.Session;
import com.secureattend.repository.AttendanceRepository;
import com.secureattend.repository.SessionRepository;
import com.secureattend.verification.VerificationInput;
import com.secureattend.verification.VerificationStrategy;

@Service
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final SessionRepository sessionRepository;
    private final List<VerificationStrategy> verificationStrategies;

    public AttendanceService(AttendanceRepository attendanceRepository, SessionRepository sessionRepository, List<VerificationStrategy> verificationStrategies) {
        this.attendanceRepository = attendanceRepository;
        this.sessionRepository = sessionRepository;
        this.verificationStrategies = verificationStrategies;
    }

    public Attendance markAttendance(VerificationInput input) {
        if (input == null || input.studentId == null || input.sessionId == null) return null;
        
        Optional<Session> sessionOpt = sessionRepository.findById(input.sessionId);
        if (sessionOpt.isEmpty() || !sessionOpt.get().isOpen()) return null;

        List<String> passedLayers = new java.util.ArrayList<>();
        for (VerificationStrategy strategy : verificationStrategies) {
            if (strategy.verify(input)) {
                passedLayers.add(strategy.getName());
            }
        }

        Attendance attendance = new Attendance();
        attendance.setStudentId(input.studentId);
        attendance.setSessionId(input.sessionId);
        attendance.setVerificationLayersPassed(passedLayers);
        attendance.setSystemVerified(passedLayers.size() >= 3); // Require at least 3 layers
        attendance.setTimestamp(Instant.now());
        
        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getAttendanceForSession(String sessionId) {
        return attendanceRepository.findBySessionId(sessionId);
    }

    public List<Attendance> getAttendanceForStudent(String studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    public Optional<Attendance> getAttendanceForStudentAndSession(String studentId, String sessionId) {
        return attendanceRepository.findByStudentIdAndSessionId(studentId, sessionId);
    }

    public Attendance flagProxy(String attendanceId, boolean flagged) {
        return attendanceRepository.findById(attendanceId)
                .map(att -> {
                    att.setFlaggedProxy(flagged);
                    return attendanceRepository.save(att);
                })
                .orElse(null);
    }

    public Attendance professorVerify(String attendanceId, boolean verified) {
        return attendanceRepository.findById(attendanceId)
                .map(att -> {
                    att.setProfessorVerified(verified);
                    return attendanceRepository.save(att);
                })
                .orElse(null);
    }
}
