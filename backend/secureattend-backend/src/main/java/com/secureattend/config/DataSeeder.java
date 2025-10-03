package com.secureattend.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.secureattend.domain.CourseClass;
import com.secureattend.domain.Person;
import com.secureattend.domain.Professor;
import com.secureattend.domain.Student;
import com.secureattend.domain.TA;
import com.secureattend.repository.CourseClassRepository;
import com.secureattend.repository.PersonRepository;

@Component
public class DataSeeder implements CommandLineRunner {
    private final PersonRepository personRepository;
    private final CourseClassRepository courseClassRepository;

    public DataSeeder(PersonRepository personRepository, CourseClassRepository courseClassRepository) {
        this.personRepository = personRepository;
        this.courseClassRepository = courseClassRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Clear existing data
        personRepository.deleteAll();
        courseClassRepository.deleteAll();

        // Create Professor
        Professor prof = new Professor();
        prof.setId("prof1");
        prof.setName("Dr. Smith");
        prof.setRole(Person.Role.PROFESSOR);
        prof.setDepartment("Computer Science");
        personRepository.save(prof);

        // Create Students
        Student student1 = new Student();
        student1.setId("student1");
        student1.setName("Alice Johnson");
        student1.setRole(Person.Role.STUDENT);
        student1.setStudentNumber("S001");
        personRepository.save(student1);

        Student student2 = new Student();
        student2.setId("student2");
        student2.setName("Bob Wilson");
        student2.setRole(Person.Role.STUDENT);
        student2.setStudentNumber("S002");
        personRepository.save(student2);

        // Create TA
        TA ta = new TA();
        ta.setId("ta1");
        ta.setName("Charlie Brown");
        ta.setRole(Person.Role.TA);
        ta.setSupervisorProfessorId("prof1");
        personRepository.save(ta);

        // Create Course Class
        CourseClass course = new CourseClass();
        course.setId("class1");
        course.setCode("CS101");
        course.setTitle("Introduction to Computer Science");
        course.setProfessorId("prof1");
        course.setStudentIds(Arrays.asList("student1", "student2"));
        courseClassRepository.save(course);
    }
}