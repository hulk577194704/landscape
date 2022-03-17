import axios from 'axios'
const request = axios.create({
    baseURL: "http://localhost:9000",
    timeout: 50000,
})

export default request
