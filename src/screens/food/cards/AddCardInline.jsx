import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { addCard } from '../../../store/auth.slice'
import theme from '../../../theme'

const AddCardInline = ({ onClose }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const [card, setCard] = useState({
    cardNumber: '',
    cardHolder: '',
    expirationDate: '',
    cvv: ''
  })
  const handleChange = (field, value) => setCard(prev => ({ ...prev, [field]: value }))
  const handleSave = () => {
    if (!card.cardNumber || !card.cardHolder || !card.expirationDate || !card.cvv) {
      return Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin')
    }
    if (!user || !user.email) {
      return Alert.alert('Lỗi', 'Không tìm thấy người dùng, vui lòng đăng nhập lại.')
    }
    dispatch(addCard({ email: user.email, card }))
      .unwrap()
      .then(() => {
        Alert.alert('Thành công', 'Đã thêm thẻ mới!')
        onClose && onClose()
      })
      .catch(error => Alert.alert('Lỗi', error?.message || error))
  }
  return (
    <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, marginVertical: 20 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>Thêm thẻ tín dụng</Text>
      <TextInput
        style={{ borderWidth: 1, borderColor: theme.colors.gray, borderRadius: 6, padding: 8, marginBottom: 10 }}
        placeholder="Số thẻ"
        keyboardType="number-pad"
        value={card.cardNumber}
        onChangeText={v => handleChange('cardNumber', v)}
      />
      <TextInput
        style={{ borderWidth: 1, borderColor: theme.colors.gray, borderRadius: 6, padding: 8, marginBottom: 10 }}
        placeholder="Tên chủ thẻ"
        value={card.cardHolder}
        onChangeText={v => handleChange('cardHolder', v)}
      />
      <TextInput
        style={{ borderWidth: 1, borderColor: theme.colors.gray, borderRadius: 6, padding: 8, marginBottom: 10 }}
        placeholder="Ngày hết hạn (MM/YY)"
        value={card.expirationDate}
        onChangeText={v => handleChange('expirationDate', v)}
      />
      <TextInput
        style={{ borderWidth: 1, borderColor: theme.colors.gray, borderRadius: 6, padding: 8, marginBottom: 10 }}
        placeholder="CVV"
        value={card.cvv}
        keyboardType="number-pad"
        secureTextEntry
        onChangeText={v => handleChange('cvv', v)}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
        <TouchableOpacity onPress={onClose} style={{ padding: 10 }}>
          <Text style={{ color: theme.colors.gray }}>Huỷ</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave} style={{ backgroundColor: theme.colors.primary, padding: 10, borderRadius: 6 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Lưu</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AddCardInline
