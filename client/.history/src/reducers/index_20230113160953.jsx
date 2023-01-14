import { combineReducers } from 'redux';
import {authReduce}from

const rootReducer = combineReducers( {
  user: authReducer,
} );