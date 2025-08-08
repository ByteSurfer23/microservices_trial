// index.js
const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');
// Load environment variables from the .env file
require('dotenv').config();
const connection = require('./connection');
// Attempt to parse the service account key, with error handling
let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
} catch (error) {
  console.error('FATAL ERROR: Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY environment variable.');
  console.error('Please ensure the variable contains a valid single-line JSON object.');
  process.exit(1); // Exit the process if the key is invalid
}

const app = express();
const port = 3001;

// Initialize Firebase Admin SDK with the parsed service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Firebase Microservice is running!');
});

// Endpoint for user sign-up
app.post('/signup', async (req, res) => {
  try {
    // Get the Firebase ID token from the Authorization header
    const idToken = req.headers.authorization.split('Bearer ')[1];
    if (!idToken) {
      return res.status(401).json({ message: 'Authorization token not provided.' });
    }

    // Verify the ID token to ensure the request is from an authenticated user
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;

    // Destructure the fields from the body that are sent by the frontend
    const { fullName, email, organization, role, location, salutation } = req.body;

    // IMPORTANT: Perform backend validation. The 'password' field is no longer
    // needed here because it's handled by Firebase Auth on the frontend.
    if (!fullName || !email || !organization || !role || !location || !salutation) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    console.log('Received data:', req.body);
    

    await db.collection('users').doc(firebaseUid).set({
      salutation, // Add the salutation field to the Firestore document
      name: fullName,
      email,
      organization,
      role,
      location,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'User created successfully!', uid: firebaseUid });
  } catch (error) {
    console.error('Error during sign-up:', error);
    // This error could be due to invalid service account credentials, which is what your log shows.
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Endpoint for user sign-in (generates a custom token)
app.post('/signin', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const userRecord = await admin.auth().getUserByEmail(email);
    // FIX: Get the user's UID from the userRecord object
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    res.status(200).json({ message: 'Custom token generated successfully', customToken });
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(401).json({ message: 'User not found or invalid credentials', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
