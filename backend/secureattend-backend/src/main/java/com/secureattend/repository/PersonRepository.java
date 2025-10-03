package com.secureattend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.secureattend.domain.Person;

@Repository
public interface PersonRepository extends MongoRepository<Person, String> {
}


