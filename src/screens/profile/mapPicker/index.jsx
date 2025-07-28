import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

export default function MapPickerScreen({ navigation, route }) {
  // Default location: center of Vietnam, or use current location if available
  const initialRegion = {
    latitude: 16.047079,
    longitude: 108.206230,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  const [marker, setMarker] = useState(route.params?.location || initialRegion);

  const handleConfirm = () => {
    navigation.navigate({
      name: route.params?.returnScreen || 'AddAddress',
      params: { pinLocation: marker },
      merge: true,
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={marker}
        onPress={e => setMarker(e.nativeEvent.coordinate)}
      >
        <Marker coordinate={marker} />
      </MapView>
      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Xác nhận vị trí</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  button: {
    position: 'absolute',
    bottom: 40,
    left: width * 0.1,
    width: width * 0.8,
    backgroundColor: '#2196f3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
