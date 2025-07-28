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

const CardsScreen = ({ navigation }) => {
  const { cards } = useSelector(state => state.auth)
  const openAddCard = useSelector(state => state.ui.openAddCard)
  const dispatch = useDispatch()
  const [showAddCard, setShowAddCard] = useState(false)

  useEffect(() => {
    if (openAddCard) {
      setShowAddCard(true)
      dispatch(clearOpenAddCard())
    }
  }, [openAddCard, dispatch])

  return (
    <View style={styles.container}>
      <NavigationHeader text="Your Cards" />

      <ScrollView>
        <View>
          {/* Hiện form AddCardInline nếu showAddCard true */}
          {showAddCard && (
            <AddCardInline onClose={() => setShowAddCard(false)} />
          )}

          {cards?.map((card, index) => (
            <TouchableOpacity key={index} onPress={() => navigation.navigate('ManageCard', { card })}>
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

                <MaterialCommunityIcons name="dots-vertical" size={24} color={theme.colors.gray} />
              </View>
            </TouchableOpacity>
          ))}

          <View style={styles.separatorBar}></View>

          <TouchableOpacity onPress={() => setShowAddCard(true)}>
            <View style={styles.addCardBtn}>
              <Text style={styles.addCardBtnIcon}>+</Text>
              <Text style={styles.addCardBtnText}>Add a new card</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

export default CardsScreen
