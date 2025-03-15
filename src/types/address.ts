export interface Address {
  _id?: string
  name: string
  addressLine1: string
  country: string
  city: string
  county: string
  neighborhood: string
  street: string
  no: string
  flat: string
  postalCode: string
}

export interface AddressFormData {
  name: string
  addressLine1: string
  country: string
  city: string
  county: string
  neighborhood: string
  street: string
  no: string
  flat: string
  postalCode: string
}

export interface UserInformation {
  _id: string
  user: {
    _id: string
    firstName: string
    lastName: string
    phone: string
    email?: string
    image?: string | null
    fcmToken?: string | null
    createdAt: string
    updatedAt: string
  }
  addresses: Address[]
  defaultAddress?: string
  paymentCards: PaymentCard[]
  defaultPaymentCard?: string
  createdAt: string
  updatedAt: string
}

// This is a placeholder for the PaymentCard interface
// We'll define it properly in the paymentCard.ts file
interface PaymentCard {
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

