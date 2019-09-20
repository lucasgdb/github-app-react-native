import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#8A05BE',
  },
  center: {
    alignItems: 'center',
  },
  h1: {
    fontSize: 35,
    color: '#ededed',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
  },
  textInput: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    color: '#ededed',
    paddingLeft: 8,
  },
  padding: {
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
  userBox: {
    marginBottom: 8,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  whiteColor: {
    color: '#ededed',
  },
  button: {
    width: '100%',
  },
  imgSize: {
    borderRadius: 10,
    width: 40,
    height: 40,
    resizeMode: 'stretch',
  },
});
