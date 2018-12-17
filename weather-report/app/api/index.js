import axios from "axios";


const axiosInstance = axios.create({
  baseURL : process.env.SERVER_URL
  ,withCredentials : true
})

// let currentForm;

axiosInstance.interceptors.request.use(config => {

  if(config.data){
    // currentForm = config.data.currentForm;
  }

  return config
})

axiosInstance.interceptors.response.use((response) =>
    // if(response.data.error){
    //   // return store.dispatch({ type: "ERROR", val: response.data.error })
    // }
    // else{
       response
    // }
  ,
  (error) =>
    // if(error){
    //   store.dispatch({ type: "ERROR", val: 'Something went wrong, Please try again' })
    // }
    // else {
       Promise.reject(error)
    // }
  )

export default axiosInstance
