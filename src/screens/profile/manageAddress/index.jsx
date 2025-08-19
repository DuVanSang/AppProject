import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons'

import { useDispatch, useSelector } from 'react-redux'
import { removeAddress, editAddress } from '../../../store/auth.slice'

import { Input, NavigationHeader } from '../../../components/common'

import theme from '../../../theme'
import { styles } from './styles'

const ManageAddressScreen = ({ route, navigation }) => {
  const { address } = route.params

  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)

  const [newAddress, setNewAddress] = useState({
    name: address.name,
    address: address.address,
    tag: address.tag,
    phone: address.phone
  })

  const handleDelete = () => {
    return Alert.alert(
      'Xoá',
      'Bạn có chắc chắn muốn xoá địa chỉ này không?',
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: () => {
            dispatch(removeAddress({ email: user.email, id: address.id }))
            navigation.goBack()
          }
        }
      ],
      { userInterfaceStyle: 'light' }
    )
  }

  const handleSave = () => {
    if (!newAddress.name || !newAddress.address || !newAddress.tag || !newAddress.phone) {
      return Alert.alert('Error', 'Please fill all the fields', [{ text: 'OK' }], {
        userInterfaceStyle: 'light'
      })
    }

    dispatch(editAddress({ id: address.id, address: newAddress }))
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <NavigationHeader text="Quản lý địa chỉ" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <Input
            label="Tên"
            value={newAddress.name}
            onChangeText={text => setNewAddress(prev => ({ ...prev, name: text }))}
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
            value={newAddress.address}
            onChangeText={text => setNewAddress(prev => ({ ...prev, address: text }))}
            placeholder="Nhập địa chỉ"
            placeholderTextColor={theme.colors.black}
            autoComplete="street-address"
            autoCorrect={false}
          />
        </View>

        <View style={styles.addressPinPoint}>
          <View style={styles.addressPinPointLeft}>
            <MaterialIcons name="location-on" size={24} color={theme.colors.black} />
            <Text style={styles.addressPinPointLeftText}>Add pin point</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={24} color={theme.colors.black} />
        </View>

        <View style={styles.inputContainer}>
          <Input
            label="Tag"
            value={newAddress.tag}
            onChangeText={text => setNewAddress(prev => ({ ...prev, tag: text }))}
            placeholder="Nhập tag"
            placeholderTextColor={theme.colors.black}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Input
            label="Số điện thoại"
            value={newAddress.phone}
            onChangeText={text => setNewAddress(prev => ({ ...prev, phone: text }))}
            placeholder="Nhập số điện thoại"
            placeholderTextColor={theme.colors.black}
            keyboardType="number-pad"
            autoCorrect={false}
          />
        </View>

        <View style={styles.separatorBar}></View>

        <TouchableOpacity onPress={handleDelete}>
          <View style={styles.deleteBtn}>
            <Text style={styles.deleteBtnText}>Xoá</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSave}>
          <View style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Lưu</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

export default ManageAddressScreen
