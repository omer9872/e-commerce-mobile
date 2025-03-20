import { api } from "./api"

export const userService = {
  updateEmail: async (email: string) => {
    const response = await api.put("/user/email", { email })
    return response.data
  },

  verifyEmail: async (code: string) => {
    const response = await api.put("/user/email/verify", { code })
    return response.data
  },

  updatePhone: async (phone: string) => {
    const response = await api.put("/user/phone", { phone })
    return response.data
  },

  verifyPhone: async (code: string) => {
    const response = await api.put("/user/phone/verify", { code })
    return response.data
  },
}

