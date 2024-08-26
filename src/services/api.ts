import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://192.168.141.184:3333'
})
