import Home from './pages/Home';
import UserInformation from './pages/UserInformation';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const App = createAppContainer(
  createStackNavigator({
    Home: {
      screen: Home,
    },
    UserInformation: {
      screen: UserInformation,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.name} - Profile`,
      }),
    },
  }),
);

export default App;
