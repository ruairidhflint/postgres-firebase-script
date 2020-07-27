// Library Imports
const fetch = require('node-fetch');
const fb = require('firebase');

// Firebase setup ( import config settings, initialize app and intialize access to database )
const config = require('./fbConfig');
fb.initializeApp(config);
const db = fb.firestore();

// Original URL of Postgres/Node deployed URL
const deployedRESTURL = 'https://threesixsixquotes.herokuapp.com/quotes';

// Function to fetch all quotes from original node/postgres database and then loop through
// each quote and post to the new Firebase database
async function fetchAndUploadQuotes() {
  fetch(deployedRESTURL)
    .then((res) => res.json())
    .then((json) =>
      json.quotes.forEach((quote) => {
        postToFirebase(quote);
      }),
    )
    .catch((err) => {
      console.log({ err, message: 'There was an error' });
    });
}

function postToFirebase(quote) {
  db.collection('quotes')
    .add({
      quote: quote.quote,
      author: quote.author,
      dayOfYear: quote.dayOfYear,
    })
    .then(() => {
      console.log('Quote added');
    })
    .catch((error) => {
      console.log({ message: 'There was an error', error });
    });
}

// fetchAndUploadQuotes();

// Function to retrieve all quotes from firebase database and check length to ensure
// all quotes were retrieved and successfully posted to Firebase
function checkAllQuotesExist() {
  db.collection('quotes')
    .get()
    .then((snapshot) => {
      console.log(snapshot.docs.length);
    });
}

// checkAllQuotesExist();
