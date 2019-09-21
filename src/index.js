/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  Image,
  Alert,
  StatusBar,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { CirclesLoader } from 'react-native-indicator';
import FA5 from 'react-native-vector-icons/FontAwesome5';
import ADIcon from 'react-native-vector-icons/AntDesign';
import styles from './styles';
import axios from 'axios';

const Bio = ({ bio, icons }) =>
  bio
    .split(' ')
    .filter(text => text !== '')
    .map((text, index) => ({ text, id: index }))
    .map((element, elementIndex, array) =>
      element.text[0] === ':' &&
      element.text[element.text.length - 1] === ':' &&
      icons[element.text.replace(/[:]/g, '')] ? (
        <Text key={element.id}>
          <Image
            style={{ width: 16, height: 16 }}
            source={{ uri: icons[element.text.replace(/[:]/g, '')] }}
          />
          {array.length - 1 === elementIndex ? '' : ' '}
        </Text>
      ) : (
        `${element.text}${array.length - 1 === elementIndex ? '' : ' '}`
      ),
    );

export default function App() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [icons, setIcons] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getIcons() {
      const emojis = await axios.get('https://api.github.com/emojis');

      setIcons(emojis.data);
    }

    getIcons();
  }, []);

  console.log('test');

  const handleOnChangeText = text => {
    setUsername(text);
  };

  const handleOnPress = async () => {
    if (username !== '') {
      try {
        setLoading(true);
        const name = username.trim().toLowerCase();
        const user = await axios.get(`https://api.github.com/users/${name}`);

        if (users.findIndex(element => element.id === user.data.id) === -1) {
          setUsers([...users, user.data]);
          setUsername('');
        } else {
          Alert.alert('Erro', `O usuário ${name} já foi adicionado.`);
        }
      } catch (err) {
        Alert.alert('Erro', err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = (id, name) => {
    Alert.alert('Remove', `Are you sure you want to remove ${name}?`, [
      {
        text: 'Yes',
        onPress: () => setUsers(users.filter(user => user.id !== id)),
      },
      { text: 'No' },
    ]);
  };

  return (
    <View style={styles.scrollView}>
      <ScrollView>
        <StatusBar backgroundColor="#8A05BE" barStyle="light-content" />
        <View style={styles.center}>
          <Text style={styles.h1}>
            <FA5 name="github" size={30} /> GitHub API
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={{ ...styles.center, ...styles.padding }}>
          <Text style={{ ...styles.whiteColor, alignSelf: 'flex-start' }}>
            Username
          </Text>

          <TextInput
            placeholder="Type the username here"
            placeholderTextColor="#ccc"
            autoCompleteType="username"
            autoCapitalize="none"
            onChangeText={text => handleOnChangeText(text)}
            onSubmitEditing={handleOnPress}
            defaultValue={username}
            style={styles.textInput}
          />

          <View style={{ width: '100%', marginBottom: 8 }}>
            {loading ? (
              <View style={{ alignItems: 'center' }}>
                <CirclesLoader
                  size={30}
                  color="#50046e"
                  style={{ marginBottom: 5 }}
                />
              </View>
            ) : (
              <ADIcon.Button
                name="adduser"
                style={{ ...styles.button, justifyContent: 'center' }}
                onPress={handleOnPress}
                backgroundColor="#50046e">
                <Text style={styles.whiteColor}>Add User</Text>
              </ADIcon.Button>
            )}
          </View>

          {users.length > 0 ? (
            users.map(user => (
              <View key={user.id} style={styles.userBox}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    marginBottom: 5,
                  }}>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(user.html_url)}>
                    <Image
                      style={styles.imgSize}
                      source={{ uri: user.avatar_url }}
                    />
                  </TouchableOpacity>

                  <View style={{ marginLeft: 8 }}>
                    <Text style={styles.whiteColor}> {user.name}</Text>
                    <Text style={{ color: '#ccc' }}> {user.login}</Text>
                  </View>
                </View>

                <Text
                  style={{
                    color: '#ccc',
                    marginBottom: 10,
                    borderLeftWidth: user.bio ? 4 : 0,
                    borderLeftColor: '#50046e',
                    paddingLeft: user.bio ? 12 : 0,
                  }}>
                  {user.bio ? (
                    <>
                      "<Bio bio={user.bio} icons={icons} />"
                    </>
                  ) : (
                    'This user does not have a bio.'
                  )}
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
                  onPress={() => handleDelete(user.id, user.name)}
                  backgroundColor="#c62828">
                  <Text style={styles.whiteColor}>Remove {user.name}</Text>
                </ADIcon.Button>
              </View>
            ))
          ) : (
            <View>
              <Text style={{ color: '#ededed' }}>
                There are no registered users yet.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View>
        <Text style={{ textAlign: 'center', color: '#ccc', fontSize: 18 }}>
          Made with <ADIcon name="heart" size={15} /> by Lucas Bittencourt
        </Text>
      </View>
    </View>
  );
}
