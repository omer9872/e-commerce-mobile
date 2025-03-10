"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { api } from "../../services/api"
import { colors } from "../../theme/colors"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import type { MerchantEmployeeTransactionStackParamList } from "../../navigation/MerchantEmployeeNavigator"

type TransactionHistoryScreenNavigationProp = StackNavigationProp<
  MerchantEmployeeTransactionStackParamList,
  "TransactionHistory"
>

interface Transaction {
  id: string
  customerName: string
  amount: number
  pointsEarned: number
  date: string
  type: "earn" | "redeem"
}

const TransactionHistoryScreen = () => {
  const navigation = useNavigation<TransactionHistoryScreenNavigationProp>()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await api.get("/merchant/transactions")
      setTransactions(response.data)
    } catch (err) {
      console.error("Error fetching transactions:", err)
      setError("Failed to load transactions. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={() => navigation.navigate("TransactionDetail", { transactionId: item.id })}
    >
      <View style={styles.transactionIcon}>
        <Icon
          name={item.type === "earn" ? "star-plus-outline" : "star-minus-outline"}
          size={24}
          color={item.type === "earn" ? colors.success : colors.error}
        />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.customerName}>{item.customerName}</Text>
        <Text style={styles.transactionDate}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      <View style={styles.transactionAmount}>
        <Text style={[styles.amountText, { color: item.type === "earn" ? colors.success : colors.error }]}>
          {item.type === "earn" ? "+" : "-"} {item.pointsEarned} pts
        </Text>
        <Text style={styles.amountValue}>${item.amount.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  )

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchTransactions}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions found.</Text>}
      />
    </View>
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
  listContent: {
    padding: 16,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  transactionIcon: {
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  transactionAmount: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 24,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: "600",
  },
})

export default TransactionHistoryScreen

