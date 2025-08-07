// index.js
const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');
require('dotenv').config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

const app = express();
const port = 3001;

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
    const { fullName, email, password, organization, role, location , firebaseUid} = req.body;

    if (!fullName || !email || !password || !organization || !role || !location) {
      // FIX: Use res.json() to send a JSON error object
      return res.status(400).json({ message: 'All fields are required.' });
    }
     console.log(req.body);
   

    await db.collection('users').doc(firebaseUid).set({
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
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Endpoint for user sign-in (generates a custom token)
app.post('/signin', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      // FIX: Use res.json() to send a JSON error object
      return res.status(400).json({ message: 'Email is required.' });
    }

    const userRecord = await admin.auth().getUserByEmail(email);
    const customToken = await admin.auth().createCustomToken(firebaseUid);

    res.status(200).json({ message: 'Custom token generated successfully', customToken });
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(401).json({ message: 'User not found or invalid credentials', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
