import api from "../services/api"

export default async function authenticate() {
  try {
    const response = await api.get("/authenticate", {
      withCredentials: true,
    })

    if (response.data.isAdmin || response.data.isEditor) {
      return {
        isAdmin: response.data.isAdmin,
        isEditor: response.data.isEditor,
        isValidated: response.data.isValidated,
        hasFullPermission: response.data.hasFullPermission,
      }
    }

    return null
  } catch (error) {
    return null
  }
}
