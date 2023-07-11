
# PassMan - A Cryptographically Secured Password Manager

Passman is a password manager built with the MERN (MongoDB, Express, React, Node.js) stack that uses the RSA (Rivest–Shamir–Adleman) cryptographic algorithm for encryption and decryption of user passwords. This application provides a secure and user-friendly interface for storing and managing passwords, ensuring that users can have access to their accounts' credentials with ease.

# Features Implemented

## 1. Frontend

1. Login - SignUp pages for auth.
2. Home page for users to know about the passMan.
3. Private key page to enter the private key.
4. Add password page to stored password detailes safely.
5. update password page to update the detailes of specific password.
6. Simple and intuitive user interface for easy password management

## 2. Backend

1. Auth Routes:
   - `/signup` : SignUp
   - `/signin` : SignIn
   - `/refresh-token` : Generates new access token when the existing token expires
   - Authorization (JWT Verification)
2. Password Routes:
   - POST
     - `/addPass` : Add Password detailes 
     - `/showPass/:passId` : Decrypt the specific password
     - `/getpass/:passId` : Get the password detailes of specific password
   - GET
     - `/getallpass` : Get the detailes of all passwords stored by the specific user
   - PUT
     - `/updatePass/:passId` : Update the password detailes of specific password
   - DELETE
     - `/delPass/:passId` : Delete the detailes of specific password

3. Use of RSA algorithm to encrypt and decrypt user passwords
4. Private key is not stored anywhere in our databases

## Repositories

Frontend: [Password Manager](https://github.com/Yushmanth-reddy/passwordManagerFrontend)

Backend: [Password Manager](https://github.com/Yushmanth-reddy/password-manager-backend)

# Technologies Used

- MongoDB as the database
- Express as the web application framework
- React as the front-end framework
- Node.js as the back-end runtime environment
- RSA module for password encryption and decryption
- Tailwind-css for front-end design and styling
- Axios for HTTP requests
- JWT for token-based authentication

# Local Setup

Clone the frontend and backend repositories, cd into them individually, and then follow the below mentioned steps for setting up backend and frontend seprately.

## 1. Frontend

1. Fork the repository.
2. Clone the repository (`git clone URL`).
3. Open the folder in which you cloned the repository.
4. Run `npm install`.
5. Setup your backend using the below mentioned steps. Now you can either deploy your backend separately and use the hosted link or run localy and use that respective link.
6. After you successfully add the backend url to your .env file you can run `npm start` and start working localy.

## 2. Backend

1. Fork the repository.
2. Clone the repository (`git clone URL`).
3. Open the folder in which you cloned the repository.
4. Run `npm install`.
5. Create a .env file same as the given env file (.example.env).
6. Create a local MongoDB database using mongo shell or you can use hosted MongoDB database as well using MongoDB Atlas. Once any one of them is setup you can substitute their URI in the .env file.
7. Now you can run `npm start` and start working localy.

### Note:

Run `npm start` in the Backend repo first and then in Frontend .

# Usage

1. Create an account by providing your email address and a master password.
2. Store the unique private key safely, which is used for the decryption of passwords.
3. Use the password manager to store your usernames and passwords for various accounts.

# Future Tasks

1. Password strength meter to ensure that your passwords are strong and secure.
2. Enable multi-factor authentication for added security.
3. Share your passwords with other authorized users.
4. Set automatic password expiry and change notifications to ensure that your passwords are always up to date.
5. Develop an web extension where the password is auto filled in the respective website on entering the private key.
6. Develop forgot password feature to retrive the PassMan's password of user.


# Security

Passman uses the RSA algorithm for password encryption and decryption. User passwords are encrypted before storing them in the database and are decrypted when accessed by authorized users. JWT tokens are used to authenticate users and authorize their access to the password manager. Access Token gets expired every 1 hour and new access token is generated with the help of refresh token, maintaining the user's authentication.

## Team Members

1. Harshith Mentee | 2021IMT-063
2. Ponnolu Yushmanth Pali Reddy | 2021IMT-075
3. Avijeet Jain | 2021IMG-018
