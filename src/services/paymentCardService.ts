import { api } from "./api"
import type { UserInformation } from "../types/address"
import type { PaymentCardFormData } from "../types/paymentCard"

export const addPaymentCard = async (cardData: PaymentCardFormData): Promise<UserInformation> => {
  const response = await api.post("/end-user-information/payment-card", {
    cardHolderName: cardData.cardHolderName,
    cardNumber: cardData.cardNumber.replace(/\s/g, ""), // Remove spaces from card number
    expireMonth: cardData.expireMonth,
    expireYear: cardData.expireYear,
    cvc: cardData.cvc,
    cardAlias: cardData.cardAlias,
  })
  return response.data
}

export const deletePaymentCard = async (cardId: string): Promise<UserInformation> => {
  const response = await api.delete(`/end-user-information/payment-card/${cardId}`)
  return response.data
}

export const setDefaultPaymentCard = async (cardId: string): Promise<UserInformation> => {
  const response = await api.put(`/end-user-information/payment-card/${cardId}/default`)
  return response.data
}

