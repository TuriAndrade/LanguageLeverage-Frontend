import axios from "axios"
import "dotenv"

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
})

export default api

//DOTENV IS NOT SAFE IN REACT BECAUSE THE VARIABLES ARE EMBBEDED INTO THE BUILD
//But for the API URL it's ok, because it's not secret
//One should not save secret stuff in the client side
//The variables have to start with the REACT_APP_ prefix, otherwise they are ignored
