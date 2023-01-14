import { combineReducers } from 'redux';
import {authReducer}from

const rootReducer = combineReducers( {
  user: authReducer,
} );