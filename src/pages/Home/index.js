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
import Bio from '../../components/Bio';
import API from '../../services/api';
import { storeData, getData } from '../../services/storage';
import styles from './styles';

export default function Home({ navigation }) {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [icons, setIcons] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getUsers() {
      try {
        const data = await getData('users');

        if (data) {
          setUsers(JSON.parse(data));
        }
      } catch {}
    }

    async function getIcons() {
      try {
        const emojis = await API.get('/emojis');

        setIcons(emojis.data);
      } catch {
      } finally {
        getUsers();
      }
    }

    getIcons();
  }, []);

  const handleOnPress = async () => {
    if (username !== '') {
      try {
        setLoading(true);
        const name = username.trim().toLowerCase();

        if (users.findIndex(element => element.login === name) === -1) {
          const user = await API.get(`/users/${name}`);

          const {
            id,
            login,
            avatar_url,
            html_url,
            name: userName,
            bio,
            public_repos,
            followers,
            following,
          } = user.data;

          const newUsers = [
            ...users,
            {
              id,
              login,
              avatar_url,
              html_url,
              name: userName,
              bio,
              public_repos,
              followers,
              following,
            },
          ];

          setUsers(newUsers);
          storeData('users', JSON.stringify(newUsers));

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
        onPress: () => {
          const newUsers = users.filter(user => user.id !== id);
          setUsers(newUsers);

          storeData('users', JSON.stringify(newUsers));
        },
      },
      { text: 'No' },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#8A05BE' }}>
      <ScrollView>
        <StatusBar backgroundColor="#8A05BE" barStyle="light-content" />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'https://github.com/lucasnaja/github-app-react-native',
              )
            }>
            <FA5 name="github" size={30} color="#ededed" />
          </TouchableOpacity>
          <Text style={styles.h1}> GitHub API</Text>
        </View>

        <View style={styles.divider} />

        <View style={[styles.padding, { alignItems: 'center' }]}>
          <Text style={[styles.whiteColor, { alignSelf: 'flex-start' }]}>
            Username
          </Text>

          <TextInput
            placeholder="Type the username here"
            placeholderTextColor="#ccc"
            autoCompleteType="username"
            autoCapitalize="none"
            onChangeText={text => setUsername(text)}
            onSubmitEditing={handleOnPress}
            defaultValue={username}
            style={styles.textInput}
          />

          <View style={{ width: '100%', marginBottom: 8 }}>
            {loading ? (
              <View style={{ alignItems: 'center' }}>
                <CirclesLoader
                  size={30}
                  color="#ccc"
                  style={{ marginBottom: 5 }}
                />
              </View>
            ) : (
              <ADIcon.Button
                name="adduser"
                style={[styles.button, { justifyContent: 'center' }]}
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
                    onPress={() =>
                      navigation.navigate({
                        routeName: 'UserInformation',
                        params: {
                          login: user.login,
                          name: user.name,
                          html_url: user.html_url,
                          avatar_url: user.avatar_url,
                          public_repos: user.public_repos,
                        },
                      })
                    }>
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

      <View
        style={{ height: 30, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#ccc', fontSize: 18 }}>
          Made with <ADIcon name="heart" size={15} color="#c62828" /> by Lucas
          Bittencourt
        </Text>
      </View>
    </View>
  );
}

Home.navigationOptions = {
  title: 'Home',
  header: null,
};
