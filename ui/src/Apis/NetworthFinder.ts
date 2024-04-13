import axios from 'axios'

export default axios.create({
  baseURL: 'http://127.0.0.1:8000/api/networth',
  // baseURL: 'http://localhost:4000/networth',
})
