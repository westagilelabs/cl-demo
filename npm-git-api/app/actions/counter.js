// @flow
import type { GetState, Dispatch } from '../reducers/types';
import electron,{remote} from 'electron';

export const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
export const DECREMENT_COUNTER = 'DECREMENT_COUNTER';
export const RECEIVED_DEPENDENCIES = 'RECEIVED_DEPENDENCIES';
export const RECEIVED_REPO_STATS = 'RECEIVED_REPO_STATS';
const dependencies = remote.require('./modules/readpackage');
const repStats = remote.require('./modules/git-repo-stats');

export function increment() {
  return {
    type: INCREMENT_COUNTER
  };
}

export function decrement() {
  return {
    type: DECREMENT_COUNTER
  };
}

export function incrementIfOdd() {
  return (dispatch: Dispatch, getState: GetState) => {
    const { counter } = getState();

    if (counter % 2 === 0) {
      return;
    }

    dispatch(increment());
  };
}

export function getSampleData(){
  let data = {
    counter:[{
      name:'hello'
    }]
  };
  return {
    type: RECEIVED_DEPENDENCIES,
    data
  };
}

export function incrementAsync(delay: number = 1000) {
  return (dispatch: Dispatch) => {
    setTimeout(() => {
      dispatch(increment());
    }, delay);
  };
}


export function getDependencies(){
  let dependency_names = Object.keys(dependencies);
  let data = {
    counter:dependency_names
  }
  return {
    type:RECEIVED_DEPENDENCIES,
    data
  }
}

export function repoStats(stats){
  return {
    type: RECEIVED_REPO_STATS,
    packageStats:stats
  }
}

export function repoStatsError(error){
  return {
    type: REPO_STATS_ERROR,
    erorr
  };
}

export function getPackageStats(packageName){
  return (dispatch: Dispatch) => {
    if(navigator.onLine){    
      repStats.getStats(packageName, (err,result) => {
        if(err){
            dispatch(repoStatsError(err)); 
        }else{      
          dispatch(repoStats(result));
        }
      });
  }else{
    console.log('Came to offilineadfafasfa:::::');
    repStats.getOfflineStats(packageName, (err,result) => {
      if(err){
        dispatch(repoStatsError(err)); 
      }else{              
        dispatch(repoStats(result));
      }
    });
  }
  }
  
}
