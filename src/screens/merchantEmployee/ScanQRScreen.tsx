'use client';

import {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import TextInput from '../../components/TextInput';
import {colors} from '../../theme/colors';
import {api} from '../../services/api';

const ScanQRScreen = () => {
  const [isScanning, setIsScanning] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [transactionAmount, setTransactionAmount] = useState('');
  const insets = useSafeAreaInsets();

  const device = useCameraDevice('back');

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      if (codes.length > 0 && isScanning) {
        setIsScanning(false);
        setScannedCode(codes[0].value ?? null);
        setModalVisible(true);
      }
    },
  });

  useEffect(() => {
    (async () => {
      const permission = await Camera.requestCameraPermission();
      if (permission !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need camera permission to scan QR codes',
          [
            {
              text: 'OK',
              onPress: async () => await Camera.requestCameraPermission(),
            },
          ],
        );
      }
    })();
  }, []);

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>No camera device found</Text>
      </View>
    );
  }

  const processTransaction = async (type: 'earn' | 'redeem') => {
    if (!scannedCode || !transactionAmount) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setIsProcessing(true);
    setModalVisible(false);

    try {
      const amount = Number.parseFloat(transactionAmount);

      if (isNaN(amount) || amount <= 0) {
        Alert.alert('Error', 'Please enter a valid amount');
        resetScanner();
        return;
      }

      // Process the QR code data based on transaction type
      const endpoint =
        type === 'earn' ? '/transactions/process' : '/transactions/redeem';
      const response = await api.post(endpoint, {
        qrCode: scannedCode,
        amount: amount,
      });

      if (response.data.success) {
        const message =
          type === 'earn'
            ? `Transaction processed for ${response.data.customerName}. ${response.data.pointsEarned} points earned.`
            : `Redemption processed for ${response.data.customerName}. ${response.data.pointsRedeemed} points redeemed.`;

        Alert.alert('Success', message, [{text: 'OK', onPress: resetScanner}]);
      } else {
        Alert.alert('Error', response.data.message, [
          {text: 'OK', onPress: resetScanner},
        ]);
      }
    } catch (error) {
      console.error('Error processing transaction:', error);
      Alert.alert(
        'Transaction Failed',
        'There was an error processing this transaction. Please try again.',
        [{text: 'OK', onPress: resetScanner}],
      );
    } finally {
      setIsProcessing(false);
      setTransactionAmount('');
    }
  };

  const resetScanner = () => {
    setScannedCode(null);
    setIsScanning(true);
    setModalVisible(false);
  };

  const toggleTorch = () => {
    setTorchOn(!torchOn);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, {paddingTop: insets.top}]}>
        <Text style={styles.title}>Scan Customer QR Code</Text>
      </View>

      <View style={styles.cameraContainer}>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isScanning}
          codeScanner={codeScanner}
          torch={torchOn ? 'on' : 'off'}
        />

        <View style={styles.overlay}>
          <View style={styles.scanArea} />
        </View>

        {isProcessing && (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.processingText}>Processing...</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.torchButton} onPress={toggleTorch}>
          <Icon
            name={torchOn ? 'flashlight-off' : 'flashlight'}
            size={24}
            color={colors.primary}
          />
          <Text style={styles.buttonText}>
            {torchOn ? 'Turn Off Flash' : 'Turn On Flash'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Transaction Type Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetScanner();
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Transaction Type</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Transaction Amount ($)</Text>
              <TextInput
                style={styles.input}
                value={transactionAmount}
                onChangeText={setTransactionAmount}
                placeholder="Enter amount"
                keyboardType="decimal-pad"
                disableKeyboardShortcuts
                autoFocus
              />
            </View>

            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[styles.optionButton, {backgroundColor: colors.success}]}
                onPress={() => processTransaction('earn')}>
                <Icon name="cart-plus" size={24} color="#FFFFFF" />
                <Text style={styles.optionText}>Purchase</Text>
                <Text style={styles.optionDescription}>
                  Customer earns points
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionButton, {backgroundColor: colors.primary}]}
                onPress={() => processTransaction('redeem')}>
                <Icon name="star" size={24} color="#FFFFFF" />
                <Text style={styles.optionText}>Redeem</Text>
                <Text style={styles.optionDescription}>
                  Customer spends points
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setModalVisible(false);
                resetScanner();
              }}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 5,
    textAlign: 'center',
  },
  cameraContainer: {
    overflow: 'hidden',
    position: 'relative',
    margin: 20,
    borderRadius: 12,
    width: StyleSheet.absoluteFill,
    height: 400,
    marginTop: '25%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: '60%',
    height: '60%',
    borderWidth: 5,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
    borderRadius: 12,
  },
  processingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 16,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  torchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    marginLeft: 8,
    color: colors.primary,
    fontWeight: '500',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: colors.text,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    paddingTop: '35%',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  optionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  optionDescription: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ScanQRScreen;
