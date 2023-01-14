import { combineReducers } from 'redux';
import {auth}

const rootReducer = combineReducers( {
  user: authReducer,
} );