import axios from 'axios'
const instance = axios.create({
  baseURL: `http://${process.env.HOST || 'localhost'}:${process.env.PORT ||
    3000}`,
  timeout: 1500,//1000时容易造成超时
  header: {}
})
export default instance
