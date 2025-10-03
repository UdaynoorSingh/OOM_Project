package com.secureattend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.secureattend.domain.Attendance;
import com.secureattend.domain.Session;
import com.secureattend.repository.AttendanceRepository;
import com.secureattend.repository.SessionRepository;
import com.secureattend.verification.VerificationInput;
import com.secureattend.verification.VerificationStrategy;

class AttendanceServiceTest {
    @Mock
    private AttendanceRepository attendanceRepository;
    @Mock
    private SessionRepository sessionRepository;
    @Mock
    private VerificationStrategy verificationStrategy;

    private AttendanceService attendanceService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        List<VerificationStrategy> strategies = Arrays.asList(verificationStrategy);
        attendanceService = new AttendanceService(attendanceRepository, sessionRepository, strategies);
    }

    @Test
    void testMarkAttendance_Success() {
        // Given
        VerificationInput input = new VerificationInput();
        input.studentId = "student1";
        input.sessionId = "session1";
        input.qrOrCodeword = "test123";

        Session session = new Session();
        session.setId("session1");
        session.setOpen(true);

        when(sessionRepository.findById("session1")).thenReturn(Optional.of(session));
        when(verificationStrategy.verify(any())).thenReturn(true);
        when(attendanceRepository.save(any(Attendance.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        Attendance result = attendanceService.markAttendance(input);

        // Then
        assertNotNull(result);
        assertEquals("student1", result.getStudentId());
        assertEquals("session1", result.getSessionId());
        assertTrue(result.isSystemVerified());
        verify(attendanceRepository).save(any(Attendance.class));
    }

    @Test
    void testMarkAttendance_ClosedSession() {
        // Given
        VerificationInput input = new VerificationInput();
        input.studentId = "student1";
        input.sessionId = "session1";

        Session session = new Session();
        session.setId("session1");
        session.setOpen(false);

        when(sessionRepository.findById("session1")).thenReturn(Optional.of(session));

        // When
        Attendance result = attendanceService.markAttendance(input);

        // Then
        assertNull(result);
        verify(attendanceRepository, never()).save(any());
    }

    @Test
    void testGetAttendanceForSession() {
        // Given
        String sessionId = "session1";
        List<Attendance> expectedAttendance = Arrays.asList(new Attendance());
        when(attendanceRepository.findBySessionId(sessionId)).thenReturn(expectedAttendance);

        // When
        List<Attendance> result = attendanceService.getAttendanceForSession(sessionId);

        // Then
        assertEquals(expectedAttendance, result);
        verify(attendanceRepository).findBySessionId(sessionId);
    }
}
