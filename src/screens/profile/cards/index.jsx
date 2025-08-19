import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { useSelector, useDispatch } from 'react-redux'
import { NavigationHeader } from '../../../components/common'
import { showCardNumberLastDigits, isVisa } from '../../../utils'
import theme from '../../../theme'
import { styles } from './styles'
import { clearOpenAddCard } from '../../../store/ui.slice'
import AddCardInline from '../../food/cards/AddCardInline'

import { Alert } from 'react-native'
import { removeCard } from '../../../store/auth.slice'

const CardsScreen = ({ navigation }) => {
  const { cards, user } = useSelector(state => state.auth)
  const openAddCard = useSelector(state => state.ui.openAddCard)
  const dispatch = useDispatch()
  const [showAddCard, setShowAddCard] = useState(false)

  const handleDeleteCard = (card) => {
    Alert.alert(
      'Xoá',
      'Bạn có chắc chắn muốn xoá thẻ này không?',
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: () => {
            if (user?.email && card?.id) {
              dispatch(removeCard({ email: user.email, id: card.id }))
            }
          }
        }
      ],
      { userInterfaceStyle: 'light' }
    )
  }

  useEffect(() => {
    if (openAddCard) {
      setShowAddCard(true)
      dispatch(clearOpenAddCard())
    }
  }, [openAddCard, dispatch])

  return (
    <View style={styles.container}>
      <NavigationHeader text="Thẻ của bạn" />

      <ScrollView>
        <View>
          {/* Hiện form AddCardInline nếu showAddCard true */}
          {showAddCard && (
            <AddCardInline onClose={() => setShowAddCard(false)} />
          )}

          {cards?.map((card, index) => (
            <View key={index}>
              <View style={styles.cardItem}>
                <View style={styles.cardData}>
                  <Image
                    style={styles.cardDataImg}
                    resizeMode="contain"
                    source={
                      isVisa(card.cardNumber)
                        ? require('../../../assets/images/visa-icon.png')
                        : require('../../../assets/images/master-icon.png')
                    }
                  />
                  <View style={styles.cardDataContent}>
                    <Text style={styles.cardDataNumber}>{showCardNumberLastDigits(card.cardNumber)}</Text>
                    <Text style={styles.cardDataType}>Credit/Debit Card</Text>
                  </View>
                </View>

                <TouchableOpacity onPress={() => handleDeleteCard(card)}>
  <MaterialCommunityIcons name="dots-vertical" size={24} color={theme.colors.gray} />
</TouchableOpacity>
              </View>
            </View>
          ))}

          <View style={styles.separatorBar}></View>

          <TouchableOpacity onPress={() => setShowAddCard(true)}>
            <View style={styles.addCardBtn}>
              <Text style={styles.addCardBtnIcon}>+</Text>
              <Text style={styles.addCardBtnText}>Thêm thẻ mới</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

export default CardsScreen
