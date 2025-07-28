import AsyncStorage from '@react-native-async-storage/async-storage';

// Hàm lưu trữ address
import { saveAddressToRealtimeDB } from '../services/addresses';

export const insertAddress = async (userId, address, onSuccess, onError) => {
  try {
    const key = `addresses_${userId}`;
    const addressWithId = { ...address, id: Date.now() };
    const addresses = (await AsyncStorage.getItem(key)) ? JSON.parse(await AsyncStorage.getItem(key)) : [];
    addresses.push(addressWithId);
    await AsyncStorage.setItem(key, JSON.stringify(addresses));
    // Save to Firebase Realtime Database
    await saveAddressToRealtimeDB(userId, addressWithId);
    onSuccess && onSuccess();
  } catch (e) {
    onError && onError(e);
  }
};

// Cập nhật address theo id
import { db } from '../firebase';
import { ref, set } from 'firebase/database';

export const updateAddress = async (userId, id, newAddress, onSuccess, onError) => {
  try {
    const key = `addresses_${userId}`;
    let addresses = (await AsyncStorage.getItem(key)) ? JSON.parse(await AsyncStorage.getItem(key)) : [];
    const index = addresses.findIndex(a => a.id === id);
    if (index !== -1) {
      addresses[index] = { ...newAddress, id };
      await AsyncStorage.setItem(key, JSON.stringify(addresses));
      // Đồng bộ lên Firebase Realtime Database
      const safeUserId = userId.replace(/\./g, '_');
      const addressRef = ref(db, `addresses/${safeUserId}/${id}`);
      await set(addressRef, { ...newAddress, id });
      onSuccess && onSuccess();
    } else {
      throw new Error('Address not found');
    }
  } catch (e) {
    onError && onError(e);
  }
};

// getUserAddresses không thay đổi
export const getUserAddresses = async (userId, onSuccess, onError) => {
  try {
    const key = `addresses_${userId}`;
    const addresses = (await AsyncStorage.getItem(key)) ? JSON.parse(await AsyncStorage.getItem(key)) : [];
    onSuccess && onSuccess(addresses);
  } catch (e) {
    onError && onError(e);
  }
};

export const deleteAddress = async (userId, id, onSuccess, onError) => {
  try {
    const key = `addresses_${userId}`;
    let addresses = (await AsyncStorage.getItem(key)) ? JSON.parse(await AsyncStorage.getItem(key)) : [];
    addresses = addresses.filter(a => a.id !== id);
    await AsyncStorage.setItem(key, JSON.stringify(addresses));
    onSuccess && onSuccess();
  } catch (e) {
    onError && onError(e);
  }
};

export const insertCard = async (userId, card, onSuccess, onError) => {
  try {
    const key = `cards_${userId}`;
    let cards = [];
    try {
      const raw = await AsyncStorage.getItem(key);
      cards = raw ? JSON.parse(raw) : [];
    } catch (parseErr) {
      console.log('Parse cards error, resetting:', parseErr);
      await AsyncStorage.removeItem(key); // Xóa dữ liệu lỗi
      cards = [];
    }
    cards.push({ ...card, id: Date.now() });
    await AsyncStorage.setItem(key, JSON.stringify(cards));
    onSuccess && onSuccess();
  } catch (e) {
    console.log('InsertCard Error:', e);
    onError && onError(e);
    Alert.alert('InsertCard Error', e.message || JSON.stringify(e));
  }
};

export const getUserCards = async (userId, onSuccess, onError) => {
  try {
    const key = `cards_${userId}`;
    const cards = (await AsyncStorage.getItem(key)) ? JSON.parse(await AsyncStorage.getItem(key)) : [];
    onSuccess && onSuccess(cards);
  } catch (e) {
    onError && onError(e);
  }
};

export const deleteCard = async (userId, id, onSuccess, onError) => {
  try {
    const key = `cards_${userId}`;
    let cards = (await AsyncStorage.getItem(key)) ? JSON.parse(await AsyncStorage.getItem(key)) : [];
    cards = cards.filter(c => c.id !== id);
    await AsyncStorage.setItem(key, JSON.stringify(cards));
    onSuccess && onSuccess();
  } catch (e) {
    onError && onError(e);
  }
};
