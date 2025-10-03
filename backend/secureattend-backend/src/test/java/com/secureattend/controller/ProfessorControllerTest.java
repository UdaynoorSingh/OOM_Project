package com.secureattend.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.secureattend.domain.Attendance;
import com.secureattend.domain.Session;
import com.secureattend.service.AttendanceService;
import com.secureattend.service.SessionService;

class ProfessorControllerTest {
    @Mock
    private SessionService sessionService;
    @Mock
    private AttendanceService attendanceService;

    private ProfessorController professorController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        professorController = new ProfessorController(sessionService, attendanceService);
    }

    @Test
    void testCreateSession() {
        // Given
        String classId = "class1";
        Session expectedSession = new Session();
        expectedSession.setId("session1");
        expectedSession.setClassId(classId);
        when(sessionService.createSession(classId)).thenReturn(expectedSession);

        // When
        ResponseEntity<Session> response = professorController.createSession(classId);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedSession, response.getBody());
    }

    @Test
    void testGetLiveAttendance() {
        // Given
        String sessionId = "session1";
        List<Attendance> expectedAttendance = Arrays.asList(new Attendance());
        when(attendanceService.getAttendanceForSession(sessionId)).thenReturn(expectedAttendance);

        // When
        ResponseEntity<List<Attendance>> response = professorController.getLiveAttendance(sessionId);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedAttendance, response.getBody());
    }

    @Test
    void testUpdateHeadcount() {
        // Given
        String sessionId = "session1";
        ProfessorController.HeadcountRequest request = new ProfessorController.HeadcountRequest();
        request.headcount = 25;
        
        Session expectedSession = new Session();
        expectedSession.setId("session1");
        expectedSession.setProfessorHeadcount(25); // FIXED: Use correct method name
        
        when(sessionService.updateProfessorHeadcount(sessionId, 25)).thenReturn(expectedSession);

        // When
        ResponseEntity<Session> response = professorController.updateHeadcount(sessionId, request);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedSession, response.getBody());
        assertEquals(25, response.getBody().getProfessorHeadcount()); // FIXED: Use correct method name
    }
}