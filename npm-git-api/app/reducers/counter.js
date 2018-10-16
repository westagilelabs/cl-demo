// @flow
import { INCREMENT_COUNTER, DECREMENT_COUNTER,RECEIVED_DEPENDENCIES,RECEIVED_REPO_STATS } from '../actions/counter';
import type { Action } from './types';

export default function counter(state: any = 0, action: Action) {
  switch (action.type) {
    case INCREMENT_COUNTER:
      return state + 1;
    case DECREMENT_COUNTER:
      return state - 1;
    case RECEIVED_DEPENDENCIES:
      return action.data;
    case RECEIVED_REPO_STATS:      
      return JSON.parse(action.packageStats);
    default:
      return state;
  }
}
