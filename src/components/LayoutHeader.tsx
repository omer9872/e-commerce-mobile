'use client';

import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

import {colors} from '../theme/colors';

interface LayoutHeaderProps {
  title: string;
  showBackButton?: boolean;
  customComponent?: React.ReactNode;
}

const LayoutHeader = ({
  title,
  showBackButton,
  customComponent,
}: LayoutHeaderProps) => {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      {showBackButton && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
          }}>
          <Icon name="arrow-left" size={24} color={colors.card} />
        </TouchableOpacity>
      )}

      {customComponent ? (
        customComponent
      ) : (
        <Text style={styles.headerTitle}>{title}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 5,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 1000,
    padding: 10,
  },
});

export default LayoutHeader;
