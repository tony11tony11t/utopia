import axios from 'axios'

const URL = `${process.env.VUE_APP_SERVER_HOST}`

export default function frontendAPI() {
  this.getToken = () => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    })
    const value =
      process.env.VUE_APP_MODE === 'DEVELOP'
        ? 'vZWohRkfjUKW8S12HCkcVw'
        : params.guid
    return axios.post(`${URL}/api/user/token`, {
      guid: value,
    })
  }

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

  this.resetUserPassNode = (token) =>
    axios.get(`${URL}/api/user/reset`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
}
