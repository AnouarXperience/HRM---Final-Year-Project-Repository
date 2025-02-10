# Project Dashboard

## Overview

This project consists of the following components that work together to create a full-stack solution:

- **Mobile App (React Native)**: Located in the `HrPoint` folder.
- **Frontend (Angular)**: Located in the `frontend` folder.
- **Backend (Spring Boot)**: Located in the `backend` folder.

Each component can be developed, tested, and run independently. Below are the instructions for setting up and running each part of the project.

---

## Project Setup

### Frontend (Angular)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) for the frontend. The Angular application is located in the `frontend` folder.

### To set up the Angular frontend:

1. Navigate to the `frontend` folder:

    ```bash
    cd frontend
    ```

2. Install the necessary dependencies:

    ```bash
    npm install
    ```

3. Start the Angular development server:

    ```bash
    ng serve
    ```

4. Open your browser and go to `http://localhost:4200/`. You should now see the Angular application running!

---

### Backend (Spring Boot)

The backend of the project is built using Spring Boot. The backend code resides in the `backend` folder.

### To run the Spring Boot backend:

1. Navigate to the `backend` folder:

    ```bash
    cd backend
    ```

2. If you're using **Maven**, run the following command to start the backend:

    ```bash
    mvn spring-boot:run
    ```

3. If you're using **Gradle**, use this command instead:

    ```bash
    ./gradlew bootRun
    ```

4. The backend API will be accessible at `http://localhost:8080/` by default.

---

### Mobile App (React Native)

The mobile app for this project is developed using React Native. The mobile code is located in the `HrPoint` folder.

### To run the React Native mobile app:

1. Navigate to the `HrPoint` folder:

    ```bash
    cd HrPoint
    ```

2. Install the necessary dependencies:

    ```bash
    npm install
    ```

3. Start the React Native development server:

    ```bash
    npx react-native start
    ```

4. In another terminal window, run the app on an emulator or connected device:

    - For **iOS**:

        ```bash
        npx react-native run-ios
        ```

    - For **Android**:

        ```bash
        npx react-native run-android
        ```

5. The app should now be running on your emulator or connected device!

---

## Summary

This project consists of three main components:

- **Angular Frontend**
- **Spring Boot Backend**
- **React Native Mobile Application**

Each part is developed and run independently, but they work together to form the complete solution.
