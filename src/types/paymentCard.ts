export interface PaymentCard {
  _id: string
  cardType: string
  cardAssociation: string
  cardFamily: string
  cardAlias: string
  binNumber: string
  cardToken: string
  cardUserKey: string
  createdAt: string
  updatedAt: string
}

export interface PaymentCardFormData {
  cardHolderName: string
  cardNumber: string
  expireMonth: string
  expireYear: string
  cvc: string
  cardAlias: string
}

