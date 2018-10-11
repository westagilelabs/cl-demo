import initialWeather from "../states/weather";

const weatherReducer = (state = initialWeather, actions) => {

  switch(actions.type){
    case 'SET_SEARCH_PHRASE' :
      return {
        ...state,
        city : actions.val
      };
    case 'PUSH_WEATHER_RESULTS' :
      return {
        ...state,
        results : actions.val
      };
    case 'PUSH_WEATHER_FORECAST' :
      return {
        ...state,
        forecast : actions.val
      };
    default :
      return {
        ...state
      }
  }

};

export default weatherReducer;
