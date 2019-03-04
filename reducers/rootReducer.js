import { combineReducers } from 'redux';
import groupMetaReducer from './groupMeta';

export default combineReducers({
  groupMeta: groupMetaReducer,
});
