const axios = require('axios');
const express = require('express');
//const open = require('open');

// Salesforce credentials
const clientId = '3MVG9fe4g9fhX0E7JOaPiaIDczBx57DzFYk41RZP2BHgP_RPRZILJ2zlNuI5RQ57uuqIz4hdltAQfAVKsVzD.';
const clientSecret = '264270992248AEEC076C83F9F3F2A28389ABFD18EC284975CB7F341051A77A2C';
const redirectUri = 'http://localhost:3000/callback';

// Salesforce API endpoint
const baseUrl = 'https://login.salesforce.com';
const apiVersion = 'v50.0';

// Create an express server
const app = express();

// Route to initiate the authorization flow
app.get('/login', (req, res) => {
  res.redirect(`${baseUrl}/services/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`);
});

// Route to handle the callback from Salesforce
app.get('/callback', async (req, res) => {
  const authCode = req.query.code;

  try {
    // Exchange authorization code for an access token
    const response = await axios.post(`${baseUrl}/services/oauth2/token`, {
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code: authCode
    });

    // Access token for subsequent API requests
    const accessToken = response.data.access_token;

    // Retrieve account details
    const accounts = await getAccountDetails(accessToken);
    res.send('Account details: ' + JSON.stringify(accounts));
  } catch (error) {
    console.error('An error occurred:', error);
    res.send('Error: ' + error.message);
  }
});

// Retrieve account details
async function getAccountDetails(accessToken) {
  try {
    const response = await axios.get(`${baseUrl}/services/data/${apiVersion}/query?q=SELECT+Id,Name+FROM+Account`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const accounts = response.data.records;
    return accounts;
  } catch (error) {
    console.error('Failed to retrieve account details:', error.response.data);
    throw error;
  }
}

// Start the server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
  console.log('Waiting for authorization...');
 // open(`http://localhost:3000/login`);
});
