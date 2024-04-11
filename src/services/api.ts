import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://192.168.17.184:3333'
})