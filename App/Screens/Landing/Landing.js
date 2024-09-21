import {
  Image,
  ImageBackground,
  PermissionsAndroid,
  SafeAreaView,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import React, {useEffect} from 'react';
import {theme} from '../../Constants/theme';

import {getUserDetail} from '../../Services/DatabaseService';

const Landing = ({navigation}) => {
  const getUserData = async () => {
    try {
      const res = await getUserDetail();
      setTimeout(async () => {
        const checkPermission = await checkNotificationPermission();
        if (!checkPermission) {
          navigation.navigate('Permission');
        } else if (res) {
          navigation.navigate('MainTab');
        } else {
          navigation.navigate('UserSchedule');
        }
      }, 2000);
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const checkNotificationPermission = async () => {
    if (Platform.Version < 33) {
      // No need to request permission below Android 13
      navigation.navigate('UserSchedule');
      return true;
    }
    const result = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    console.log(result);
    return result;
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainView}>
        <ImageBackground
          source={require('../../Assets/ellipse.jpg')}
          style={styles.bg}>
          <Image
            source={require('../../Assets/logo1.jpg')}
            resizeMode="contain"
            style={styles.img}
          />
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default Landing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  bg: {width: '100%', height: 400, justifyContent: 'center'},
  img: {
    width: '60%',
    height: '60%',
    alignSelf: 'center',
    marginTop: 73,
  },
  mainView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
