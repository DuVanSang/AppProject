import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons'

import { useDispatch, useSelector } from 'react-redux'
import { addAddress } from '../../../store/auth.slice'

import { Input, NavigationHeader } from '../../../components/common'

import { styles } from './styles'
import theme from '../../../theme'

const AddAddressScreen = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)

  const [address, setAddress] = useState({
    name: '',
    address: '',
    tag: '',
    phone: ''
  })

  // Handle pinLocation from MapPicker
  React.useEffect(() => {
    async function updateAddressFromPin() {
      if (route?.params?.pinLocation) {
        const { latitude, longitude } = route.params.pinLocation;
        // Lấy địa chỉ từ toạ độ
        try {
          const { getAddressFromCoords } = await import('../../../services/geocode');
          const addressText = await getAddressFromCoords(latitude, longitude);
          setAddress(prev => ({
            ...prev,
            latitude,
            longitude,
            address: addressText || prev.address,
          }));
        } catch (e) {
          setAddress(prev => ({ ...prev, latitude, longitude }));
        }
      }
    }
    updateAddressFromPin();
  }, [route?.params?.pinLocation]);

  const handleSave = () => {
    if (!address.name || !address.address || !address.tag || !address.phone) {
      return Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin', [{ text: 'OK' }], {
        userInterfaceStyle: 'light'
      })
    }

    dispatch(addAddress({ email: user.email, address }))
    navigation.navigate('Addresses')
  }

  return (
    <View style={styles.container}>
      <NavigationHeader text="Thêm địa chỉ mới" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <Input
            label="Tên"
            value={address.name}
            onChangeText={text => setAddress(prev => ({ ...prev, name: text }))}
            placeholder="Nhập tên"
            placeholderTextColor={theme.colors.black}
            autoCapitalize="words"
            autoComplete="name"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Input
            label="Địa chỉ"
            value={address.address}
            onChangeText={text => setAddress(prev => ({ ...prev, address: text }))}
            placeholder="Nhập địa chỉ"
            placeholderTextColor={theme.colors.black}
            autoComplete="street-address"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity
          style={styles.addressPinPoint}
          onPress={() => navigation.navigate('MapPicker', {
            location: address.latitude && address.longitude
              ? { latitude: address.latitude, longitude: address.longitude }
              : undefined,
            returnScreen: 'AddAddress',
          })}
        >
          <View style={styles.addressPinPointLeft}>
            <MaterialIcons name="location-on" size={24} color={theme.colors.black} />
            <Text style={styles.addressPinPointLeftText}>
              {address.latitude && address.longitude
                ? `Pin: (${address.latitude.toFixed(5)}, ${address.longitude.toFixed(5)})`
                : 'Add pin point'}
            </Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={24} color={theme.colors.black} />
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Input
            label="Tag"
            value={address.tag}
            onChangeText={text => setAddress(prev => ({ ...prev, tag: text }))}
            placeholder="Nhập tag cho địa chỉ"
            placeholderTextColor={theme.colors.black}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Input
            label="Số điện thoại"
            value={address.phone}
            onChangeText={text => setAddress(prev => ({ ...prev, phone: text }))}
            placeholder="Nhập số điện thoại"
            placeholderTextColor={theme.colors.black}
            keyboardType="number-pad"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity onPress={handleSave}>
          <View style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Lưu</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

export default AddAddressScreen
