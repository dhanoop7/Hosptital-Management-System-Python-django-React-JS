# Hosptital-Management-System-Python-django-React-JS
Hospital Administration System This project is a comprehensive Hospital Administration System designed to streamline operations across various departments including Reception, Doctor, and Pharmacy. The system is mobile-responsive, ensuring an optimal user experience across different devices.



1. Project Overview:

The system comprises modules for Reception, Doctor, and Pharmacy management.
Each module serves specific functionalities tailored to the respective roles, such as patient registration, appointment scheduling, prescription management, and consultation history tracking.


2. General Requirements:

Emphasizes mobile responsiveness for optimal user experience across devices.
Ensures live form validation for accurate data entry.
Implements secure password requirements and unique email address validation.
Provides confirmation emails with randomly generated passwords for user registration.



3. Authentication and Authorization:

Utilizes JWT token authentication for secure user authentication.
Employs Django's utilities for password hashing and security measures.


4. Reception Module:

Facilitates new patient registration with essential details and appointment scheduling.
Enables patient search by ID and viewing consultation history.
Includes department management functionalities.


5. Doctor Module:

Allows doctors to receive appointment details, view patient history, and add prescriptions.
Provides the option to reassign patients to other doctors based on expertise.
Supports consultation history viewing with prescription details.


5. Pharmacy Module:

Enables pharmacists to view submitted prescriptions and patient details.
Facilitates prescription search by patient ID and viewing prescription history.

6. MySQL Database Integration:

MySQL is utilized as the backend database management system for storing and managing data related to the Hospital Administration System.
It provides a robust and scalable solution for storing various types of data, including patient information, appointments, prescriptions, and consultation history.

The database schema is designed to accommodate the requirements of the Hospital Administration System.
Tables are created to represent entities such as patients, doctors, appointments, prescriptions, departments, and consultation history.
Relationships between these entities are established using foreign keys to ensure data integrity and consistency.

Django's ORM (Object-Relational Mapping) is utilized to interact with the MySQL database.
Models are defined in Django to represent database tables, allowing seamless interaction with the database without writing raw SQL queries.
The ORM handles tasks such as data retrieval, insertion, updating, and deletion, abstracting away the complexities of database management.


7. Technologies Used:

Django REST Framework: Utilized for building RESTful APIs in Django, enabling seamless communication between frontend and backend.

JWT Token Authentication: Ensures secure user authentication using JSON Web Tokens.

React: Frontend library for building dynamic user interfaces.

React Router DOM: Used for routing within the React application.

Axios: JavaScript library for making HTTP requests to the backend.

Cookies-js: Library for handling cookies in JavaScript.

Overall, my project demonstrates a well-structured and feature-rich Hospital Administration System, leveraging modern technologies and best practices for both backend and frontend development.
