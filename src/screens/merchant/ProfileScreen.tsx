import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { MerchantProfileStackParamList } from "../../navigation/MerchantNavigator"
import { useAuth } from "../../contexts/AuthContext"
import { colors } from "../../theme/colors"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

type ProfileScreenNavigationProp = StackNavigationProp<MerchantProfileStackParamList, "Profile">

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>()
  const { user, signOut } = useAuth()

  const navigateToEditProfile = () => {
    navigation.navigate("EditProfile")
  }

  const navigateToSettings = () => {
    navigation.navigate("Settings")
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      // Navigation will be handled by the AuthContext
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Merchant Profile</Text>
      </View>

      <View style={styles.userInfoSection}>
        <Icon name="store" size={80} color={colors.primary} />
        <Text style={styles.businessName}>{user?.businessName || "Business Name"}</Text>
        <Text style={styles.userEmail}>{user?.email || "merchant@example.com"}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user?.totalTransactions || 0}</Text>
          <Text style={styles.statLabel}>Transactions</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user?.totalPointsIssued || 0}</Text>
          <Text style={styles.statLabel}>Points Issued</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={navigateToEditProfile}>
          <Icon name="account-edit" size={24} color={colors.primary} />
          <Text style={styles.actionText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={navigateToSettings}>
          <Icon name="cog" size={24} color={colors.primary} />
          <Text style={styles.actionText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleSignOut}>
          <Icon name="logout" size={24} color={colors.error} />
          <Text style={[styles.actionText, { color: colors.error }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  userInfoSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  businessName: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 10,
  },
  userEmail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  actionsContainer: {
    paddingHorizontal: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  actionText: {
    fontSize: 16,
    marginLeft: 15,
    color: colors.text,
  },
})

export default ProfileScreen

