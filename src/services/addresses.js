import { db } from '../firebase';
import { ref, push, set } from 'firebase/database';

import { Alert } from 'react-native';

export const saveAddressToRealtimeDB = async (userId, address) => {
  try {
    const safeUserId = userId.replace(/\./g, '_');
    console.log('Saving address to Realtime DB:', safeUserId, address);
    const addressRef = ref(db, `addresses/${safeUserId}`);
    const newAddressRef = push(addressRef);
    await set(newAddressRef, address);
    console.log('Address saved to Realtime DB');
  } catch (e) {
    console.log('Error saving address to Realtime DB:', e);
    Alert.alert('Firebase Error', e.message || JSON.stringify(e));
  }
};
