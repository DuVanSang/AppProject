import { firestore } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export const getRestaurants = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, 'restaurants'));
    const restaurants = [];
    querySnapshot.forEach((doc) => {
      restaurants.push({ id: doc.id, ...doc.data() });
    });
    return restaurants;
  } catch (error) {
    throw new Error(error.message);
  }
};
