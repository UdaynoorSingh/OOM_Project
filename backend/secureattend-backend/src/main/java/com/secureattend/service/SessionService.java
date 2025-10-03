package com.secureattend.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.secureattend.domain.Session;
import com.secureattend.factory.CodeFactory;
import com.secureattend.repository.SessionRepository;

@Service
public class SessionService {
    private final SessionRepository sessionRepository;
    private final CodeFactory codeFactory;

    public SessionService(SessionRepository sessionRepository, CodeFactory codeFactory) {
        this.sessionRepository = sessionRepository;
        this.codeFactory = codeFactory;
    }

    public Session createSession(String classId) {
        Session session = new Session();
        session.setClassId(classId);
        session.setQrToken(codeFactory.generateQrToken());
        session.setCodeword(codeFactory.generateCodeword());
        session.setStartTime(Instant.now());
        session.setOpen(true);
        return sessionRepository.save(session);
    }

    public Session closeSession(String sessionId) {
        return sessionRepository.findById(sessionId)
                .map(session -> {
                    session.setOpen(false);
                    session.setEndTime(Instant.now());
                    return sessionRepository.save(session);
                })
                .orElse(null);
    }

    public List<Session> getOpenSessionsForClass(String classId) {
        return sessionRepository.findByClassIdAndOpen(classId, true);
    }

    public Optional<Session> getSessionById(String sessionId) {
        return sessionRepository.findById(sessionId);
    }

    public Session updateProfessorHeadcount(String sessionId, int headcount) {
        return sessionRepository.findById(sessionId)
                .map(session -> {
                    session.setProfessorHeadcount(headcount);
                    return sessionRepository.save(session);
                })
                .orElse(null);
    }
}
