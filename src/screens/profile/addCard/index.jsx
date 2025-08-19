import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { useDispatch, useSelector } from 'react-redux'
import { addCard } from '../../../store/auth.slice'

import { Input, NavigationHeader } from '../../../components/common'

import { isVisa, formatCardNumber } from '../../../utils'
import theme from '../../../theme'
import { styles } from './styles'

const AddCardScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)

  const [card, setCard] = useState({
    cardNumber: '',
    cardHolder: '',
    expirationDate: '',
    cvv: ''
  })

  const handleSave = () => {
    if (!card.cardNumber || !card.cardHolder || !card.expirationDate || !card.cvv) {
      return Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin', [{ text: 'OK' }], {
        userInterfaceStyle: 'light'
      });
    }
    if (!user || !user.email) {
      return Alert.alert('Lỗi', 'Không tìm thấy người dùng, vui lòng đăng nhập lại.', [{ text: 'OK' }]);
    }
    dispatch(addCard({ email: user.email, card }))
      .unwrap()
      .then(() => navigation.navigate('Cards'))
      .catch(error => Alert.alert('Error', error));
  }

  return (
    <View style={styles.container}>
      <NavigationHeader text="Thêm thẻ tín dụng" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.card,
            card.cardNumber
              ? isVisa(card.cardNumber)
                ? { backgroundColor: theme.colors.blue }
                : { backgroundColor: theme.colors.orange }
              : {}
          ]}
        >
          <View style={styles.cardTop}>
            {card.cardNumber !== '' ? (
              isVisa(card.cardNumber) ? (
                <Image
                  style={styles.cardImg}
                  resizeMode="contain"
                  source={require('../../../assets/images/visa-icon.png')}
                />
              ) : (
                <Image
                  style={styles.cardImg}
                  resizeMode="contain"
                  source={require('../../../assets/images/master-icon.png')}
                />
              )
            ) : null}
            <MaterialCommunityIcons
              style={{ transform: [{ rotate: '45deg' }] }}
              name="signal-variant"
              size={24}
              color={theme.colors.white}
            />
          </View>

          <Text style={styles.cardNumber}>{formatCardNumber(card.cardNumber)}</Text>

          <View style={styles.cardBottom}>
            <Text style={styles.cardExpDate}>Valid thru: {card.expirationDate}</Text>
            <Text style={styles.cardHolder}>{card.cardHolder}</Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Input
            label="Số thẻ"
            value={card.cardNumber}
            onChangeText={text => setCard({ ...card, cardNumber: text })}
            placeholder="Nhập số thẻ"
            placeholderTextColor={theme.colors.black}
            keyboardType="number-pad"
            autoComplete="off"
            autoCorrect={false}
            maxLength={16}
          />
        </View>

        <View style={styles.inputContainer}>
          <Input
            label="Tên chủ thẻ"
            value={card.cardHolder}
            onChangeText={text => setCard({ ...card, cardHolder: text })}
            placeholder="Nhập tên chủ thẻ"
            placeholderTextColor={theme.colors.black}
            autoComplete="name"
            autoCapitalize="words"
            autoCorrect={false}
            maxLength={30}
          />
        </View>

        <View style={styles.rowInputContainer}>
          <Input
            label="Ngày hết hạn"
            value={card.expirationDate}
            onChangeText={text => setCard({ ...card, expirationDate: text })}
            placeholder="MM/YY"
            placeholderTextColor={theme.colors.black}
            keyboardType=""
            autoComplete="off"
            autoCorrect={false}
            maxLength={5}
          />
          <Input
            label="CVV"
            value={card.cvv}
            onChangeText={text => setCard({ ...card, cvv: text })}
            placeholder="Nhập CVV"
            placeholderTextColor={theme.colors.black}
            keyboardType="number-pad"
            autoComplete="off"
            autoCorrect={false}
            maxLength={3}
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

export default AddCardScreen
