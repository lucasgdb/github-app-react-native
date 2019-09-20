/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  Image,
  Alert,
  StatusBar,
} from 'react-native';
import FA5 from 'react-native-vector-icons/FontAwesome5';
import ADIcon from 'react-native-vector-icons/AntDesign';
import styles from './styles';
import axios from 'axios';

export default () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');

  const handleOnChangeText = text => {
    setUsername(text);
  };

  const handleOnPress = async () => {
    if (username !== '') {
      const user = await axios.get(`https://api.github.com/users/${username}`);

      if (users.findIndex(element => element.id === user.data.id) === -1) {
        setUsers([...users, user.data]);
        setUsername('');
      } else {
        Alert.alert('Erro', 'Usuário já adicionado!');
      }
    }
  };

  const handleDelete = id => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <ScrollView style={styles.scrollView}>
      <StatusBar backgroundColor="#8A05BE" barStyle="light-content" />
      <View style={styles.center}>
        <Text style={styles.h1}>
          <FA5 name="github" size={30} /> Github API
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={{ ...styles.center, ...styles.padding }}>
        <Text style={{ ...styles.whiteColor, alignSelf: 'flex-start' }}>
          Username
        </Text>

        <TextInput
          placeholder="Type the username here"
          autoCompleteType="username"
          onChangeText={text => handleOnChangeText(text)}
          defaultValue={username}
          style={styles.textInput}
        />

        <View style={{ width: '100%', marginBottom: 8 }}>
          <ADIcon.Button
            name="adduser"
            style={{ ...styles.button, justifyContent: 'center' }}
            onPress={handleOnPress}
            backgroundColor="#50046e">
            <Text style={styles.whiteColor}>Add User</Text>
          </ADIcon.Button>
        </View>

        {users.map(user => (
          <View key={user.id} style={styles.userBox}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginBottom: 5,
              }}>
              <Image style={styles.imgSize} source={{ uri: user.avatar_url }} />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.whiteColor}> {user.name}</Text>
                <Text style={{ color: '#ccc' }}> {user.login}</Text>
              </View>
            </View>

            <Text
              style={{
                color: '#ccc',
                marginBottom: 10,
                borderLeftWidth: 4,
                borderLeftColor: '#50046e',
                paddingLeft: 12,
              }}>
              {user.bio ? `"${user.bio}"` : 'This user does not have a bio.'}
            </Text>

            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: '#50046e' }}>Followers: </Text>
                <Text style={{ color: '#ccc' }}>{user.followers}</Text>
              </View>

              <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                <Text style={{ color: '#50046e' }}>Following: </Text>
                <Text style={{ color: '#ccc' }}>{user.following}</Text>
              </View>
            </View>

            <ADIcon.Button
              name="deleteuser"
              style={{ justifyContent: 'center' }}
              onPress={() => handleDelete(user.id)}
              backgroundColor="#c62828">
              <Text style={styles.whiteColor}>Remove {user.name}</Text>
            </ADIcon.Button>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
