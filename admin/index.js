// index.js

// 1. Import all the required packages
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

// 2. Load environment variables from the .env file
dotenv.config();

// 3. Initialize the Express app
const app = express();

// 4. Set the port for the server, with a fallback to 3000
const port = process.env.PORT || 3002;

// 5. Use the middleware packages
app.use(cors());
// Use body-parser to parse incoming JSON request bodies
app.use(bodyParser.json());

// 6. Define a simple GET route to confirm the server is running
app.get('/', (req, res) => {
  res.send('Simple Express server with body-parser is running!');
});

// 7. Define a POST route to show body-parser in action
app.post('/data', (req, res) => {
  // The data sent in the request body is now available in req.body
  console.log('Received data:', req.body);
  res.status(200).json({ message: 'Data received successfully!', data: req.body });
});

// 8. Start the server
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
