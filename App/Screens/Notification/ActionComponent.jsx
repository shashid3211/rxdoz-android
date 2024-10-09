import {AppRegistry, Text, View} from 'react-native';

function CustomComponent() {
  return (
    <View>
      <Text>A custom component</Text>
    </View>
  );
}

AppRegistry.registerComponent('custom-component', () => CustomComponent);
