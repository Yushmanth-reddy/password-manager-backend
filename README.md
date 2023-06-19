# PassMan - A Cryptographically Secured Password Manager

Passman is a password manager built with the MERN (MongoDB, Express, React, Node.js) stack that uses the RSA (Rivest–Shamir–Adleman) cryptographic algorithm for encryption and decryption of user passwords. This application provides a secure and user-friendly interface for storing and managing passwords, ensuring that users can have access to their accounts' credentials with ease.

# Features

- Secure storage of user passwords in an encrypted database
- Use of RSA algorithm to encrypt and decrypt user passwords
- Automatic password generation for strong and unique passwords
- Simple and intuitive user interface for easy password management
- Public Private key encryction for maximum security
- Private key is not stored anywhere in our databases

## Repositories

Frontend: [Password Manager](https://github.com/Yushmanth-reddy/passwordManagerFrontend)

Backend: [Password Manager](https://github.com/Yushmanth-reddy/password-manager-backend)

# Technologies Used

- MongoDB as the database
- Express as the web application framework
- React as the front-end framework
- Node.js as the back-end runtime environment
- RSA module for password encryption and decryption
- Material-UI for front-end design and styling
- Axios for HTTP requests
- JWT for token-based authentication

# Installation

1. Clone the Repository from Github:

### `git clone https://github.com/your_username/passman.git`

2. Install the required packages in the server and client directories:

### `cd npm install`

### `npm i`

3. Run the server:

### `npm start`

4. Run the client:

### `npm start`

5. Open your web browser and navigate to http://localhost:3000 to access the password manager.

# Usage

1. Create an account by providing your email address and a master password.
2. Use the password manager to store your usernames and passwords for various accounts.

# Future Tasks

1. password strength meter to ensure that your passwords are strong and secure.
2. Enable multi-factor authentication for added security.
3. Share your passwords with other authorized users.
4. Set automatic password expiry and change notifications to ensure that your passwords are always up to date.


# Security

Passman uses the RSA algorithm for password encryption and decryption. User passwords are encrypted before storing them in the database and are decrypted when accessed by authorized users. The application also uses Passport.js for authentication, which ensures that only authorized users can access the password manager. JWT tokens are used to authenticate users and authorize their access to the password manager.

## Team Members

1. Harshith Mentee | 2021IMT-063
2. Ponnolu Yushmanth Pali Reddy | 2021IMT-075
3. Avijeet Jain | 2021IMG-018
