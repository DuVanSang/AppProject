import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { filterRestaurantsBySearch, filterRestaurantsByTag } from '../../../store/restaurants.slice';
import { clearOrder } from '../../../store/order.slice';

import { getFavoriteRestaurants, getFeaturedRestaurants, getFastestRestaurants, getFirstName } from '../../../utils';
import { RestaurantsList } from '../../../components/food';
import { DismissKeyboardView, SearchBar } from '../../../components/common';
import theme from '../../../theme';
import GeminiChat from '../../GeminiChat';

const tags = [
  { label: 'Breakfast', icon: 'coffee-outline' },
  { label: 'Lunch', icon: 'food-outline' },
  { label: 'Dinner', icon: 'food-steak' },
  { label: 'Snack', icon: 'food-croissant' },
  { label: 'Dessert', icon: 'ice-cream' },
];

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { filteredItems: filteredRestaurants, loading, error } = useSelector(state => state.restaurants);

  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('Breakfast');
  const [showGemini, setShowGemini] = useState(false);

  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [fastestRestaurants, setFastestRestaurants] = useState([]);

  const restaurantsListRef = useRef();

  useEffect(() => {
    dispatch(filterRestaurantsByTag({ tag: selectedTag }));
    setSearch('');
    restaurantsListRef.current?.scrollTo({ animated: true, y: 0 });
  }, [selectedTag]);

  useEffect(() => {
    dispatch(filterRestaurantsBySearch({ search }));
  }, [search]);

  useEffect(() => {
    const favorite = getFavoriteRestaurants(filteredRestaurants, user.favorites);
    const featured = getFeaturedRestaurants(filteredRestaurants);
    const fastest = getFastestRestaurants(filteredRestaurants);

    setFavoriteRestaurants(favorite);
    setFeaturedRestaurants(featured);
    setFastestRestaurants(fastest);
  }, [filteredRestaurants]);

  useFocusEffect(
    useCallback(() => {
      dispatch(clearOrder());
    }, [dispatch])
  );

  return (
    <>
      <DismissKeyboardView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>Xin chào {getFirstName(user.fullName)},</Text>
          <Text style={styles.headerTitleDecor}>Tận hưởng món ăn ngon miệng</Text>
        </View>

        <View style={{marginTop: 18, marginBottom: 16}}>
          <SearchBar placeholder="Tìm kiếm quán ăn" search={search} setSearch={setSearch} />
        </View>

        <View style={[styles.tagFilterContainer, {marginBottom: 8}]}>
          <ScrollView style={styles.tagFilterScroll} horizontal showsHorizontalScrollIndicator={false}>
            {tags.map((tag, index) => (
              <TouchableWithoutFeedback key={index} onPress={() => setSelectedTag(tag.label)}>
                <View
                  style={[
                    styles.tagFilterItem,
                    selectedTag === tag.label ? { backgroundColor: theme.colors.primary } : {},
                  ]}
                >
                  {selectedTag === tag.label && (
                    <MaterialCommunityIcons
                      style={styles.tagFilterItemIcon}
                      name={tag.icon}
                      size={20}
                      color={theme.colors.black}
                    />
                  )}
                  <Text
                    style={[
                      styles.tagFilterItemText,
                      selectedTag !== tag.label ? { color: theme.colors.gray } : {},
                    ]}
                  >
                    {tag.label}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </ScrollView>
        </View>

        {error ? (
          <View style={styles.loadingErrorContainer}>
            <Text>{error}</Text>
          </View>
        ) : loading ? (
          <View style={styles.loadingErrorContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <RestaurantsList
            listRef={restaurantsListRef}
            navigation={navigation}
            search={search}
            filteredRestaurants={filteredRestaurants}
            favoriteRestaurants={favoriteRestaurants}
            featuredRestaurants={featuredRestaurants}
            fastestRestaurants={fastestRestaurants}
            contentContainerStyle={{paddingBottom: 120}}
          />
        )}
      </DismissKeyboardView>

      {/* Floating Chat AI Bubble */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 32,
          right: 24,
          backgroundColor: '#fff',
          borderRadius: 32,
          elevation: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          padding: 14,
          zIndex: 999,
        }}
        onPress={() => setShowGemini(true)}
        activeOpacity={0.85}
      >
        <MaterialIcons name="smart-toy" size={28} color="#FF5722" />
      </TouchableOpacity>

      {/* Modal Gemini Chat */}
      <Modal
        visible={showGemini}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowGemini(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowGemini(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback>
              <View
                style={{
                  height: '70%',
                  backgroundColor: '#fff',
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  overflow: 'hidden',
                }}
              >
                {/* Chỉ cần 1 nút đóng chat nằm trong header GeminiChat, không cần thêm ở đây */}
                <GeminiChat onClose={() => setShowGemini(false)} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default HomeScreen;

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16, // Thêm padding ngang để tránh content sát lề
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.gray,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  headerTitleDecor: {
    fontSize: 30,
    fontWeight: 'bold',
    color: theme.colors.primary,
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0,0,0,0.08)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 6,
    marginTop: 6,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  tagFilterContainer: {
    marginVertical: 12,
  },
  tagFilterScroll: {
    paddingHorizontal: 16,
  },
  tagFilterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  tagFilterItemIcon: {
    marginRight: 4,
  },
  tagFilterItemText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};
