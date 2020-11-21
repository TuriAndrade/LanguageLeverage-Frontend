import api from "../services/api"

export default async function getCsrfToken() {
  try {
    const response = await api.get("/specific/csrf/token", {
      withCredentials: true,
    })

    return response.data.token
  } catch (error) {
    try {
      const response = await api.get("/generic/csrf/token")

      return response.data.token
    } catch (error) {
      return null
    }
  }
}
