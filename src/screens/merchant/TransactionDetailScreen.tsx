"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native"
import { type RouteProp, useRoute } from "@react-navigation/native"
import type { MerchantTransactionStackParamList } from "../../navigation/MerchantNavigator"
import { api } from "../../services/api"
import { colors } from "../../theme/colors"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

type TransactionDetailScreenRouteProp = RouteProp<MerchantTransactionStackParamList, "TransactionDetail">

interface TransactionDetail {
  id: string
  customerName: string
  customerEmail: string
  amount: number
  pointsEarned: number
  date: string
  type: "earn" | "redeem"
  items: Array<{ name: string; quantity: number; price: number }>
}

const TransactionDetailScreen = () => {
  const route = useRoute<TransactionDetailScreenRouteProp>()
  const { transactionId } = route.params
  const [transaction, setTransaction] = useState<TransactionDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTransactionDetail()
  }, [])

  const fetchTransactionDetail = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await api.get(`/merchant/transactions/${transactionId}`)
      setTransaction(response.data)
    } catch (err) {
      console.error("Error fetching transaction detail:", err)
      setError("Failed to load transaction details. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (error || !transaction) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || "Transaction not found"}</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon
          name={transaction.type === "earn" ? "star-plus-outline" : "star-minus-outline"}
          size={40}
          color={transaction.type === "earn" ? colors.success : colors.error}
        />
        <Text style={styles.headerText}>{transaction.type === "earn" ? "Points Earned" : "Points Redeemed"}</Text>
        <Text style={styles.pointsText}>
          {transaction.type === "earn" ? "+" : "-"} {transaction.pointsEarned} pts
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transaction Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Transaction ID:</Text>
          <Text style={styles.detailValue}>{transaction.id}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{new Date(transaction.date).toLocaleString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Amount:</Text>
          <Text style={styles.detailValue}>${transaction.amount.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Name:</Text>
          <Text style={styles.detailValue}>{transaction.customerName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailValue}>{transaction.customerEmail}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        {transaction.items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQuantity}>x{item.quantity}</Text>
            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: colors.primary,
    padding: 24,
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.card,
    marginTop: 8,
  },
  pointsText: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.card,
    marginTop: 8,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "500",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  itemQuantity: {
    fontSize: 16,
    color: colors.textSecondary,
    marginRight: 16,
  },
  itemPrice: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "500",
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: "center",
  },
})

export default TransactionDetailScreen

