const fetch = require('node-fetch');
const fb = require('firebase');
const config = require('./fbConfig');
fb.initializeApp(config);
const db = fb.firestore();

const deployedRESTURL = 'https://threesixsixquotes.herokuapp.com/quotes';

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

function checkAllQuotesExist() {
  db.collection('quotes')
    .get()
    .then((snapshot) => {
      console.log(snapshot.docs.length);
    });
}

// checkQuotes();

function retrieveSingleQuote(day) {
  db.collection('quotes')
    .where('dayOfYear', '==', day)
    .get()
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        console.log(doc.data());
      });
    });
}

// retrieveSingleQuote(10);
