import AsyncStorage from '@react-native-community/async-storage';

export async function storeData(key, value) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (err) {
    // saving error
  }
}

export async function getData(key) {
  try {
    const value = await AsyncStorage.getItem(key);

    return value ? value : false;
  } catch (err) {
    // error reading value
  }
}
