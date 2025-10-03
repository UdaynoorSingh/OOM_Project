package com.secureattend.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.secureattend.domain.CourseClass;

@Repository
public interface CourseClassRepository extends MongoRepository<CourseClass, String> {
    Optional<CourseClass> findByCode(String code);
}


