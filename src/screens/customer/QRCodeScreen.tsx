"use client"

import { useEffect, useState, useCallback } from "react"
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Share, StatusBar } from "react-native"
import QRCode from "react-native-qrcode-svg"
import { useAuth } from "../../contexts/AuthContext"
import { api } from "../../services/api"
import { colors } from "../../theme/colors"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

const QRCodeScreen = () => {
  const { user } = useAuth()
  const [qrValue, setQrValue] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQRCode = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // In a real app, you might want to generate a temporary token or code
      // that expires after some time for security reasons
      const response = await api.get("/users/qrcode")
      setQrValue(response.data.code)
    } catch (error) {
      console.error("Error fetching QR code:", error)
      setError("Failed to generate QR code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQRCode()
  }, [fetchQRCode])

  const handleRefresh = () => {
    fetchQRCode()
  }

  const handleShare = async () => {
    if (!qrValue) return

    try {
      await Share.share({
        message: `My Loyalty App QR Code: ${qrValue}`,
      })
    } catch (error) {
      console.error("Error sharing QR code:", error)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Your QR Code</Text>
        <Text style={styles.subtitle}>Show this to merchants to earn or redeem points</Text>

        <View style={styles.qrContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
                <Text style={styles.refreshButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <QRCode
                value={qrValue || `user_${user?._id}`}
                size={200}
                color={colors.text}
                backgroundColor={colors.card}
              />
              <Text style={styles.codeText}>{qrValue}</Text>
            </>
          )}
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleRefresh}>
            <Icon name="refresh" size={20} color={colors.primary} />
            <Text style={styles.actionText}>Refresh</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Icon name="share-variant" size={20} color={colors.primary} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 40,
    textAlign: "center",
  },
  qrContainer: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 250,
    minWidth: 250,
  },
  codeText: {
    marginTop: 20,
    fontSize: 14,
    color: colors.textSecondary,
  },
  errorContainer: {
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: colors.error,
    marginBottom: 15,
    textAlign: "center",
  },
  refreshButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  actionsContainer: {
    flexDirection: "row",
    marginTop: 40,
    justifyContent: "center",
    gap: 30,
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    color: colors.primary,
    marginTop: 5,
    fontSize: 14,
  },
})

export default QRCodeScreen

