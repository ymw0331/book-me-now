import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
//1.import from react-redux and redux
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

//2.create user reducer function, 
const authReducer = ( state = {}, action ) => //{type: "LOGGED_IN_USER", payload: {name: "Wayne", role}}
{
  switch ()

};

  //3.combine multiple reducers
  //4.create redux store
  //5.provide redux store to the entire app


  const root = ReactDOM.createRoot( document.getElementById( 'root' ) );
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
