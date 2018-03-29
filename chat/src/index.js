import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

var config = {
    apiKey: "AIzaSyCGz7hyQ3WICB5bNCchPRnJpISkqUQfdq8",
    authDomain: "info343-chat-d4c52.firebaseapp.com",
    databaseURL: "https://info343-chat-d4c52.firebaseio.com",
    projectId: "info343-chat-d4c52",
    storageBucket: "",
    messagingSenderId: "392420779013"
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
