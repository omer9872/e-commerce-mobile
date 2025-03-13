'use client';

import {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';

import LayoutHeader from '../../components/LayoutHeader';
import {useAuth} from '../../contexts/AuthContext';
import {colors} from '../../theme/colors';
import {api} from '../../services/api';

interface TransactionCodeResponse {
  _id: string;
  user: string;
  code: string;
  createdBy: string;
  createdAt: string;
}

const QRCodeScreen = () => {
  const {user} = useAuth();
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);

  const insets = useSafeAreaInsets();

  const fetchQRCode = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      setShowQRCode(false);

      // Generate a new transaction code
      const response = await api.post<TransactionCodeResponse>(
        '/transaction-code',
        {
          type: 'points_earned_from_purchase',
        },
      );
      setQrValue(response.data.code);
    } catch (error) {
      console.error('Error fetching QR code:', error);
      setError('Failed to generate QR code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQRCode();
  }, [fetchQRCode]);

  const handleRefresh = () => {
    fetchQRCode();
  };

  const handleShare = async () => {
    if (!qrValue) return;

    try {
      await Share.share({
        message: `My Loyalty App QR Code: ${qrValue}`,
      });
    } catch (error) {
      console.error('Error sharing QR code:', error);
    }
  };

  return (
    <View style={{...styles.container, paddingTop: insets.top}}>
      <View style={styles.subContainer}>
        <LayoutHeader title="Generate Code" />

        <View style={styles.content}>
          <Text style={styles.title}>Your QR Code</Text>
          <Text style={styles.subtitle}>
            Show this to merchants to earn or redeem points
          </Text>

          <View style={styles.qrContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                  style={styles.refreshButton}
                  onPress={handleRefresh}>
                  <Text style={styles.refreshButtonText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <QRCode
                  value={qrValue || ''}
                  size={220}
                  color={colors.text}
                  backgroundColor={colors.card}
                />
                {showQRCode ? (
                  <Text style={styles.codeText}>{qrValue}</Text>
                ) : (
                  <TouchableOpacity
                    style={styles.showCodeButton}
                    onPress={() => setShowQRCode(true)}>
                    <Text style={styles.showCodeButtonText}>Show Code</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleRefresh}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  subContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 40,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 40,
    textAlign: 'center',
  },
  qrContainer: {
    backgroundColor: colors.card,
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 250,
    minWidth: 250,
  },
  codeText: {
    marginTop: 10,
    fontSize: 19,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 4,
  },
  showCodeButton: {
    marginTop: 10,
  },
  showCodeButtonText: {
    color: colors.primary,
    fontSize: 16,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: colors.error,
    marginBottom: 15,
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 40,
    justifyContent: 'center',
    gap: 30,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: colors.primary,
    marginTop: 5,
    fontSize: 14,
  },
});

export default QRCodeScreen;
