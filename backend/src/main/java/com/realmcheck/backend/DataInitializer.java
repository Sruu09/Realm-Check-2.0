package com.realmcheck.backend;

import com.realmcheck.backend.entity.Course;
import com.realmcheck.backend.entity.User;
import com.realmcheck.backend.repository.CourseRepository;
import com.realmcheck.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DataInitializer {
    @Bean
    public CommandLineRunner initData(UserRepository userRepository, CourseRepository courseRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByUsername("mockUser").isEmpty()) {
                User mock = new User();
                mock.setUsername("mockUser");
                mock.setEmail("mock@example.com");
                mock.setPasswordHash(passwordEncoder.encode("password"));
                userRepository.save(mock);
                System.out.println("Created mockUser for JWT authentication");
            }

            if (courseRepository.count() == 0) {
                List<Course> sampleCourses = List.of(
                    new Course("Introduction to Computer Science (CS50x)", "PROGRAMMING", "Harvard University's introduction to the intellectual enterprises of computer science and the art of programming.", "Beginner", "12 weeks", "edX / Harvard", "https://cs50.harvard.edu/x", "COURSE", "cs,programming,c,python,sql"),
                    new Course("Java Programming and Software Engineering", "PROGRAMMING", "Duke University program designed to teach foundational programming in Java and object-oriented design.", "Beginner", "8 weeks", "Coursera / Duke", "https://www.coursera.org/specializations/java-programming", "COURSE", "java,software engineering,oop"),
                    new Course("Spring Boot 3 & Spring Framework 6", "PROGRAMMING", "Master Spring Boot and Spring Framework with hands-on projects, REST APIs, and JPA.", "Intermediate", "6 weeks", "Udemy", "https://spring.io/guides", "COURSE", "spring,spring boot,backend,java"),
                    new Course("Full Stack Open - Deep Dive Into Modern Web Development", "WEB DEVELOPMENT", "Learn React, Redux, Node.js, MongoDB, GraphQL and TypeScript in one go from University of Helsinki.", "Intermediate", "12 weeks", "University of Helsinki", "https://fullstackopen.com", "COURSE", "react,node,typescript,web"),
                    new Course("Machine Learning Specialization", "AI & DATA SCIENCE", "Master foundational AI concepts and practical machine learning tools by Andrew Ng and DeepLearning.AI.", "Intermediate", "10 weeks", "Coursera / DeepLearning.AI", "https://www.deeplearning.ai", "COURSE", "ai,machine learning,python"),
                    new Course("Google Cybersecurity Professional Certificate", "CYBERSECURITY", "Prepare for an entry-level cybersecurity job with hands-on labs covering SIEM tools, Python and Linux.", "Beginner", "16 weeks", "Coursera / Google", "https://grow.google/certificates/cybersecurity", "COURSE", "cybersecurity,security,linux,python"),
                    new Course("AWS Certified Solutions Architect Associate", "CLOUD COMPUTING", "Comprehensive cloud architecture training covering compute, storage, networking, and AWS security.", "Intermediate", "8 weeks", "AWS Skill Builder", "https://aws.amazon.com/certification/certified-solutions-architect-associate", "COURSE", "aws,cloud,devops,architecture"),
                    new Course("Python for Everybody Specialization", "PROGRAMMING", "Learn to program and analyze data with Python, databases, and visualization tools.", "Beginner", "6 weeks", "Coursera / University of Michigan", "https://www.py4e.com", "COURSE", "python,programming,data"),
                    new Course("React - The Complete Guide (incl. Next.js)", "WEB DEVELOPMENT", "Dive into modern React with hooks, context, state management, and modern React 19 patterns.", "Beginner", "10 weeks", "Udemy", "https://react.dev", "COURSE", "react,frontend,javascript,nextjs"),
                    new Course("The Missing Semester of Your CS Education", "DEVELOPMENT TOOLS", "MIT course teaching the command-line, Vim, Git, debugging, profiling, and modern terminal tooling.", "Beginner", "4 weeks", "MIT", "https://missing.csail.mit.edu", "COURSE", "git,bash,terminal,linux"),
                    new Course("Financial Markets & Personal Finance", "FINANCE", "Yale University course on risk management, behavioral finance principles, and personal financial decisions.", "Beginner", "7 weeks", "Coursera / Yale", "https://www.coursera.org/learn/financial-markets-global", "COURSE", "finance,investing,economics"),
                    new Course("Deep Learning Specialization", "AI & DATA SCIENCE", "Build neural networks, CNNs, RNNs, and Transformers with TensorFlow and PyTorch.", "Advanced", "14 weeks", "Coursera / DeepLearning.AI", "https://www.deeplearning.ai", "COURSE", "deep learning,ai,neural networks,pytorch"),
                    new Course("Kubernetes for Beginners", "DEVOPS", "Understand container orchestration, pods, services, deployments, and cluster management.", "Intermediate", "5 weeks", "Linux Foundation", "https://kubernetes.io/docs/tutorials", "COURSE", "kubernetes,docker,devops,cloud"),
                    new Course("SQL for Data Science", "AI & DATA SCIENCE", "Learn relational databases, complex joins, subqueries, and data manipulation with SQL.", "Beginner", "4 weeks", "Coursera / UC Davis", "https://www.coursera.org/learn/sql-for-data-science", "COURSE", "sql,database,data")
                );
                courseRepository.saveAll(sampleCourses);
                System.out.println("Seeded " + sampleCourses.size() + " verified educational courses into PostgreSQL.");
            }
        };
    }
}
