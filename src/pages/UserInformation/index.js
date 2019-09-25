/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import { CirclesLoader } from 'react-native-indicator';
import Bio from '../../components/Bio';
import OctIcon from 'react-native-vector-icons/Octicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import API from '../../services/api';

export default function UserInformation({ navigation }) {
  const {
    login,
    name,
    html_url,
    avatar_url,
    public_repos,
    icons,
  } = navigation.state.params;
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await API.get(`/users/${login}/repos`);

        setRepos(data);
        setLoading(false);
      } catch {}
    }

    fetchData();
  }, [login]);

  return (
    <View style={{ flex: 1, backgroundColor: '#8A05BE' }}>
      {loading ? (
        <View style={{ alignItems: 'center', paddingTop: 10 }}>
          <CirclesLoader size={30} color="#ccc" style={{ marginBottom: 5 }} />
        </View>
      ) : (
        <>
          <View style={{ flexDirection: 'row', padding: 15 }}>
            <TouchableOpacity onPress={() => Linking.openURL(html_url)}>
              <Image
                style={{ width: 60, height: 60 }}
                source={{ uri: avatar_url }}
              />
            </TouchableOpacity>

            <View>
              <Text style={{ color: '#ededed' }}>
                {'  '}
                {name}
              </Text>
              <Text style={{ color: '#ccc' }}>
                {'  '}
                {login}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ color: '#50046e' }}>
                    {'  '}public repositories:
                  </Text>
                  <Text style={{ color: '#ccc' }}> {public_repos}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: '#ccc' }} />

          <ScrollView style={{ padding: 15, paddingTop: 5 }}>
            {repos
              .filter(repo => !repo.archived && !repo.disabled)
              .sort((a, b) => b.stargazers_count - a.stargazers_count)
              .map(repo => (
                <View
                  style={{
                    marginBottom: 4,
                    flex: 1,
                    borderBottomWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                  }}
                  key={repo.id}>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(repo.html_url)}
                    style={{
                      flexDirection: 'row',
                      marginBottom: 6,
                    }}>
                    <OctIcon name="repo" size={40} color="#ededed" />

                    <View>
                      <Text style={{ color: '#ededed' }}>
                        {'   '}
                        {repo.full_name}
                      </Text>

                      <Text style={{ color: '#ccc', fontSize: 12 }}>
                        {repo.language
                          ? `   Language: ${repo.language} `
                          : '   No language '}
                        ({repo.license ? repo.license.name : 'no license'})
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <Text
                    style={{
                      color: '#ccc',
                      marginBottom: 10,
                      borderLeftWidth: repo.description ? 4 : 0,
                      borderLeftColor: '#50046e',
                      paddingLeft: repo.description ? 12 : 0,
                    }}>
                    {repo.description ? (
                      <>
                        "<Bio bio={repo.description} icons={icons} />"
                      </>
                    ) : (
                      'This repository does not have a description.'
                    )}
                  </Text>

                  <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ color: '#50046e' }}>Stars: </Text>
                      <Text style={{ color: '#ccc' }}>
                        {repo.stargazers_count}
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                      <Text style={{ color: '#50046e' }}>Forks: </Text>
                      <Text style={{ color: '#ccc' }}>{repo.forks}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                      <Text style={{ color: '#50046e' }}>Watchers: </Text>
                      <Text style={{ color: '#ccc' }}>{repo.watchers}</Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                    }}>
                    <AntIcon.Button
                      style={{
                        flex: 1,
                      }}
                      borderRadius={0}
                      name="star"
                      color="yellow"
                      backgroundColor="#000"
                      onPress={() =>
                        Linking.openURL(`${repo.html_url}/stargazers`)
                      }>
                      <Text style={{ color: '#ededed' }}>Star</Text>
                    </AntIcon.Button>

                    <AntIcon.Button
                      style={{
                        flex: 1,
                      }}
                      borderRadius={0}
                      name="fork"
                      color="#ccc"
                      backgroundColor="#50046e"
                      onPress={() =>
                        Linking.openURL(`${repo.html_url}/network/members`)
                      }>
                      <Text style={{ color: '#ededed' }}>Fork</Text>
                    </AntIcon.Button>
                  </View>
                </View>
              ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}

UserInformation.navigationOptions = {
  title: 'UserInformation',
  headerStyle: {
    backgroundColor: '#50046e',
  },
  headerTintColor: '#fff',
};
