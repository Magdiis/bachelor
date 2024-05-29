// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/firestore';
import { attachCustomCommands } from 'cypress-firebase';



const fbConfig = {
    apiKey: "AIzaSyALFVvTdNX3NDqH7aYJB3T3Ex-abS7eTN0",
    authDomain: "test-89223.firebaseapp.com",
    projectId: "test-89223",
    storageBucket: "test-89223.appspot.com",
    messagingSenderId: "676978918553",
    appId: "1:676978918553:web:6d3d4eceecdf39207f2408",
    measurementId: "G-2EM48W16L7"
};
console.log("abc", process.env.SERVICE_ACCOUNT)
firebase.initializeApp(fbConfig);

attachCustomCommands({ Cypress, cy, firebase });