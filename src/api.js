import axios from 'axios'

const URL = `${process.env.VUE_APP_SERVER_HOST}`

export default function frontendAPI() {
  this.getToken = (
    data = {
      guid: 'Gosj99BJCk-GzcNcq9VC_Q',
    }
  ) => axios.post(`${URL}/api/user/token`, data)

  this.getUser = (token) =>
    axios.get(`${URL}/api/user/`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

  this.getAllMapNodes = (token) =>
    axios.get(`${URL}/api/map/`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

  this.getMapNode = (token, id = 1) =>
    axios.get(`${URL}/api/map/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

  this.postResult = (token, formData) =>
    axios.post(`${URL}/api/map`, formData, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

  this.putFinish = (token, id = 1) =>
    axios.put(
      `${URL}/api/map/${id}`,
      {},
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    )
}
