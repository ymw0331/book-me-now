import { combineReducers } from 'redux';
import { authReducer } from './auth.jsx;
';

const rootReducer = combineReducers( {
  user: authReducer,
} );