package com.secureattend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.secureattend.domain.Session;

@Repository
public interface SessionRepository extends MongoRepository<Session, String> {
    List<Session> findByClassIdAndOpen(String classId, boolean open);
}


