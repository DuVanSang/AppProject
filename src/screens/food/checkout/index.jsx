import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'

import { useSelector, useDispatch } from 'react-redux'
import { addOrder } from '../../../store/orders.slice'

import Order from '../../../models/Order'

import { NavigationHeader } from '../../../components/common'
import { OrderResumeCTA } from '../../../components/food'

import theme from '../../../theme'
import { styles } from './styles'

const CheckoutScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  const { restaurant, items, total, address, paymentType } = useSelector(state => state.order)

  const deliveryCost = restaurant?.deliveryCost || 0;
  // State coupon được chọn
  const [selectedCoupon, setSelectedCoupon] = React.useState(null);

  // Áp dụng coupon vào tổng tiền
  let discount = 0;
  let freeShip = false;
  if (selectedCoupon) {
    if (selectedCoupon.type === 'percent') {
      discount = (total * selectedCoupon.value) / 100;
    } else if (selectedCoupon.type === 'freeship') {
      freeShip = true;
    }
  }
  const finalDeliveryCost = freeShip ? 0 : deliveryCost;
  const totalWithDelivery = total + finalDeliveryCost - discount;
  const { user } = useSelector(state => state.auth)

  const handlePlaceOrder = () => {
    if (!address || !paymentType) {
      Alert.alert('Error', 'Please select an address and a payment method', [{ text: 'OK' }], {
        userInterfaceStyle: 'light'
      })
      return
    }

    // Create new order and save it in the database
    const newOrder = new Order(
      user.email,
      { name: restaurant.name, logoUrl: restaurant.logoUrl },
      items,
      total,
      address,
      paymentType === 'card' ? 'Credit/Debit Card' : 'Pay Cash'
    )
    dispatch(addOrder({ order: newOrder }))

    navigation.navigate('Home')
    Alert.alert(
      'Đặt hàng thành công!',
      'Đơn hàng của bạn đang được xử lý, bạn có thể xem nó trong danh sách đơn hàng',
      [{ text: 'Xem đơn hàng', onPress: () => navigation.navigate('Đơn hàng', { screen: 'Home' }) }, { text: 'Close' }],
      { userInterfaceStyle: 'light' }
    )
  }

  return (
    <View style={styles.container}>
      <NavigationHeader text="Thanh toán" logoUrl={restaurant.logoUrl} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Address */}
        <View style={styles.addressContainer}>
          <Text style={styles.addressTitle}>Địa chỉ</Text>
          {address ? (
            <View style={styles.addressSelected}>
              <View style={styles.addressSelectedData}>
                <Text style={styles.addressSelectedTitle}>{address.name}</Text>
                <Text style={styles.addressSelectedStreet}>{address.address}</Text>
              </View>

              <View style={styles.addressSelectedRight}>
                <View style={styles.addressSelectedTag}>
                  <Text style={styles.addressSelectedTagText}>{address.tag}</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Addresses')}>
                  <MaterialCommunityIcons
                    style={styles.addressChangeBtn}
                    name="dots-vertical"
                    size={22}
                    color={theme.colors.gray}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity onPress={() => navigation.navigate('Addresses')}>
              <View style={styles.addAddressBtn}>
                <Text style={styles.addAddressBtnIcon}>+</Text>
                <Text style={styles.addAddressBtnText}>Chọn địa chỉ</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Discount Code */}
        <View style={styles.discountContainer}>
          {!selectedCoupon && (
            <Text style={styles.discountText}>Mã giảm giá</Text>
          )}
          <TouchableOpacity onPress={() => navigation.navigate('Coupon', {
            onSelectCoupon: (coupon) => setSelectedCoupon(coupon)
          })}>
            <View style={styles.discountBtn}>
              <Text style={styles.discountBtnIcon}>+</Text>
              <Text style={styles.discountBtnText}>Thêm mã giảm giá</Text>
            </View>
          </TouchableOpacity>
          {selectedCoupon && (
            <View style={{ marginTop: 8, marginBottom: 4 }}>
              <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                Coupon: {selectedCoupon.label}
              </Text>
            </View>
          )}
        </View>

        {/* Payment Method */}
        <View>
          {paymentType === 'card' ? (
            <View style={styles.paymentContainer}>
              <View style={styles.paymentOption}>
                <MaterialCommunityIcons name="credit-card-outline" size={24} color={theme.colors.black} />
                <Text style={styles.paymentOptionText}>Thẻ tín dụng</Text>
              </View>
              <View style={styles.paymentRight}>
                <Text style={styles.paymentRightText}>Phí giao hàng:</Text>
                <Text style={styles.paymentRightFee}>{deliveryCost === 0 ? 'Free' : `$${deliveryCost.toFixed(2)}`}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Payment')}>
                  <MaterialIcons
                    style={styles.paymentChangeBtn}
                    name="keyboard-arrow-right"
                    size={24}
                    color={theme.colors.black}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : paymentType === 'cash' ? (
            <View style={styles.paymentContainer}>
              <View style={styles.paymentOption}>
                <MaterialCommunityIcons name="cash" size={24} color={theme.colors.black} />
                <Text style={styles.paymentOptionText}>Thanh toán tiền mặt</Text>
              </View>
              <View style={styles.paymentRight}>
                <Text style={styles.paymentRightText}>Delivery:</Text>
                <Text style={styles.paymentRightFee}>{deliveryCost === 0 ? 'Free' : `$${deliveryCost.toFixed(2)}`}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Payment')}>
                  <MaterialIcons
                    style={styles.paymentChangeBtn}
                    name="keyboard-arrow-right"
                    size={24}
                    color={theme.colors.black}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity onPress={() => navigation.navigate('Payment')}>
              <View style={styles.addAddressBtn}>
                <Text style={styles.addAddressBtnIcon}>+</Text>
                <Text style={styles.addAddressBtnText}>Chọn phương thức thanh toán</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.separatorBar}></View>

        {/* Order Data & Details */}
        <View style={styles.orderData}>
          <Text style={styles.orderDataTitle}>Thông tin đơn hàng</Text>
          <View style={styles.orderDataItem}>
            <Text style={styles.orderDataItemText}>Tên quán</Text>
            <Text style={styles.orderDataItemText}>{restaurant.name}</Text>
          </View>
          <View style={styles.orderDataItem}>
            <Text style={styles.orderDataItemText}>Ngày đặt</Text>
            <Text style={styles.orderDataItemText}>{new Date().toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.orderDetails}>
          <View>
            <Text style={styles.orderDataTitle}>Chi tiết đơn hàng</Text>
            {items.map(item => (
              <View key={item.item.name} style={styles.orderDetailsItem}>
                <Text style={styles.orderDetailsItemText}>{item.item.name}</Text>
                <Text style={styles.orderDetailsItemText}>x {item.qty}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <OrderResumeCTA
        text="Đặt hàng"
        total={totalWithDelivery > 0 ? totalWithDelivery : 0}
        navigateTo="Home"
        handlePlaceOrder={handlePlaceOrder}
        itemsLength={items.length}
      />
    </View>
  )
}

export default CheckoutScreen
