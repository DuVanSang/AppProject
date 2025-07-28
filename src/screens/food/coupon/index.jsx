import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import theme from '../../../theme';

const COUPONS = [
  {
    id: '10PERCENT',
    label: '10% OFF total bill',
    type: 'percent',
    value: 10,
    description: 'Valid for all orders.'
  },
  {
    id: '20PERCENT',
    label: '20% OFF total bill',
    type: 'percent',
    value: 20,
    description: 'Valid for orders over $5.'
  },
  {
    id: 'FREESHIP',
    label: 'Free Delivery',
    type: 'freeship',
    value: 0,
    description: 'Valid for delivery fee under $1.'
  }
];

const CouponScreen = ({ route }) => {
  const navigation = useNavigation();

  const handleSelectCoupon = (coupon) => {
    // Trả coupon về màn checkout qua navigation params
    if (route?.params?.onSelectCoupon) {
      route.params.onSelectCoupon(coupon);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a discount coupon</Text>
      <FlatList
        data={COUPONS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.couponCard} onPress={() => handleSelectCoupon(item)}>
            <Text style={styles.couponLabel}>{item.label}</Text>
            <Text style={styles.couponDesc}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.white, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 18, color: theme.colors.primary },
  couponCard: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 10,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2
  },
  couponLabel: { fontSize: 16, fontWeight: '600', color: theme.colors.black, marginBottom: 6 },
  couponDesc: { fontSize: 13, color: theme.colors.gray },
});

export default CouponScreen;
