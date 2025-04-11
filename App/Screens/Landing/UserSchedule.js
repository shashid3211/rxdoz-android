import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import RNFS from 'react-native-fs';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Divider } from 'react-native-paper';
import ModalPanel from '../../Components/Modal';
import ButtonComponent from '../../Components/UI/ButtonComponent';
import IconButonComponent from '../../Components/UI/IconButonComponent';
import ImagePickerRound from '../../Components/UI/ImagePickerRound';
import TextInputComponent from '../../Components/UI/TextInputComponent';
import TimePickerComponent from '../../Components/UI/TimePickerComponent';
import { theme } from '../../Constants/theme';
import { addUser, getUserDetail } from '../../Services/DatabaseService';

const UserSchedule = ({navigation}) => {
  const {t} = useTranslation();
  const [selectName, setSelectName] = useState(null);
  const [selectNameError, setSelectNameError] = useState(null);
  const [selectWTime, setSelectWTime] = useState(
    new Date(new Date().setHours(6, 0, 0, 0)),
  );
  const [selectBTime, setSelectBTime] = useState(
    new Date(new Date().setHours(22, 0, 0, 0)),
  );
  const [selectBFTime, setSelectBFTime] = useState(
    new Date(new Date().setHours(9, 0, 0, 0)),
  );
  const [selectLTime, setSelectLTime] = useState(
    new Date(new Date().setHours(12, 0, 0, 0)),
  );
  const [selectDTime, setSelectDTime] = useState(
    new Date(new Date().setHours(20, 0, 0, 0)),
  );
  const [openCalender1, setOpenCalender1] = useState(false);
  const [openCalender2, setOpenCalender2] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [openCalender3, setOpenCalender3] = useState(false);
  const [openCalender4, setOpenCalender4] = useState(false);
  const [openCalender5, setOpenCalender5] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [base64Image, setBase64Image] = useState(null);

  const windowHeight = Dimensions.get('window').height;

  useEffect(() => {
    getUserData();
  }, []);

  const splitTime = timeString => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return {hours, minutes, seconds};
  };

  const getUserData = async () => {
    try {
      const res = await getUserDetail();
      if (res) {
        setSelectName(res.name);

        console.log(new Date(res.wake_up_time).toTimeString().split(' ')[0]);
        if (res.wake_up_time) {
          const [hours, minutes, seconds] = splitTime(res.wake_up_time);
          const date = new Date();
          date.setHours(...[hours, minutes, seconds, 0]);
          setSelectWTime(date);
        }
        if (res.sleep_time) {
          const [hours, minutes, seconds] = splitTime(res.sleep_time);
          const date = new Date();
          date.setHours(...[hours, minutes, seconds, 0]);
          setSelectBTime(date);
        }
        if (res.dinner_time) {
          const [hours, minutes, seconds] = splitTime(res.dinner_time);
          const date = new Date();
          date.setHours(...[hours, minutes, seconds, 0]);
          setSelectDTime(date);
        }
        if (res.breakfast_time) {
          const [hours, minutes, seconds] = splitTime(res.breakfast_time);
          const date = new Date();
          date.setHours(...[hours, minutes, seconds, 0]);
          setSelectBFTime(date);
        }
        if (res.lunch_time) {
          const [hours, minutes, seconds] = splitTime(res.lunch_time);
          const date = new Date();
          date.setHours(...[hours, minutes, seconds, 0]);
          setSelectLTime(date);
        }
        setSelectedImage(res.photo);
      }
    } catch (e) {
      // error reading value
    }
  };

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, handleResponse);
  };

  const handleCameraLaunch = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchCamera(options, handleResponse);
  };

  const handleResponse = async response => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
      Alert.alert('User cancelled image picker');
    } else if (response.error) {
      console.log('Image picker error: ', response.error);
      Alert.alert('Image picker error: ', response.error);
    } else {
      let imageUri = response.uri || response.assets?.[0]?.uri;

      const fileName =
        response.assets[0].fileName || `profile_${Date.now()}.jpg`;
      const destinationPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      try {
        // Move the file to a local storage directory
        await RNFS.moveFile(imageUri, destinationPath);
        setSelectedImage(destinationPath);
        console.log('Image saved to:', destinationPath);
      } catch (error) {
        console.error('Error saving image:', error);
        Alert.alert('Error saving image:', error.message);
      }
    }
  };

  const handleUserData = async () => {
    if (selectName == null || selectName === '') {
      setSelectNameError('Please enter your name');
      return;
    }

    try {
      const res = await addUser(
        selectName,
        '',
        '',
        '',
        '',
        '',
        selectWTime,
        selectBTime,
        selectBFTime,
        selectLTime,
        selectDTime,
        selectedImage,
      );
      if (res) {
        navigation.navigate('MainTab');
      } else {
        Alert.alert('Something went wrong');
        console.log(res);
      }
    } catch (error) {
      console.error('Error handling user data:', error);
      Alert.alert('Something went wrong');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.mainView}>
        <ImagePickerRound
          onPress={() => setIsBottomSheetOpen(true)}
          image={selectedImage}
        />
        <Text style={styles.subtext}>
          {t('updateTheRoutineForMedicineSuggestions')}
        </Text>

        <Divider
          style={{
            backgroundColor: theme.COLORS.dark_grey,
            marginVertical: 10,
          }}
        />

        <TextInputComponent
          value={selectName}
          error={selectNameError}
          label={t('name')}
          reset={() => setSelectNameError(null)}
          onChangeText={t => setSelectName(t)}
        />

        <TimePickerComponent
          defaultTime={selectWTime}
          openCalender={() => setOpenCalender1(true)}
          onChangeText={t => setSelectWTime(t)}
          label={t('wakeUpTime')}
          mode="time"
          confirmDate={date => {
            setOpenCalender1(false);
            setSelectWTime(date);
          }}
          calender={openCalender1}
          cancelCalender={() => setOpenCalender1(false)}
          img={require('../../Assets/r1.jpg')}
        />
        <TimePickerComponent
          defaultTime={selectBFTime}
          openCalender={() => setOpenCalender2(true)}
          onChangeText={t => setSelectBFTime(t)}
          label={t('breakfastTime')}
          mode="time"
          confirmDate={date => {
            setOpenCalender2(false);
            setSelectBFTime(date);
          }}
          calender={openCalender2}
          cancelCalender={() => setOpenCalender2(false)}
          img={require('../../Assets/r5.png')}
        />

        <TimePickerComponent
          defaultTime={selectLTime}
          openCalender={() => setOpenCalender3(true)}
          onChangeText={t => setSelectLTime(t)}
          label={t('lunchTime')}
          mode="time"
          confirmDate={date => {
            setOpenCalender3(false);
            setSelectLTime(date);
          }}
          calender={openCalender3}
          cancelCalender={() => setOpenCalender3(false)}
          img={require('../../Assets/r2.jpg')}
        />
        <TimePickerComponent
          defaultTime={selectDTime}
          openCalender={() => setOpenCalender4(true)}
          onChangeText={t => setSelectDTime(t)}
          label={t('dinnerTime')}
          mode="time"
          confirmDate={date => {
            setOpenCalender4(false);
            setSelectDTime(date);
          }}
          calender={openCalender4}
          cancelCalender={() => setOpenCalender3(false)}
          img={require('../../Assets/r3.jpg')}
        />
        <TimePickerComponent
          defaultTime={selectBTime}
          openCalender={() => setOpenCalender5(true)}
          onChangeText={t => setSelectBTime(t)}
          label={t('bedTime')}
          mode="time"
          confirmDate={date => {
            setOpenCalender5(false);
            setSelectBTime(date);
          }}
          calender={openCalender5}
          cancelCalender={() => setOpenCalender5(false)}
          img={require('../../Assets/r4.jpg')}
        />

          {/* <ButtonComponent onPress={handleUserData} text="Continue" /> */}
          <View style={styles.buttonWrapper}>
          <ButtonComponent onPress={handleUserData} text="Continue" />
        </View>

        {/* Modal */}

       

        {/*--------- Modal end -----------*/}
      </View>
      </ScrollView>
      <ModalPanel
          animationType="slide"
          modalVisible={isBottomSheetOpen}
          setModalVisible={setIsBottomSheetOpen}>
          <View style={styles.centeredView}>
            <View
              style={[
                styles.bottomSheet,
                {
                  height: windowHeight * 0.3,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                },
              ]}>
              <IconButonComponent
                onPress={() => {
                  handleCameraLaunch();
                  setIsBottomSheetOpen(false);
                }}
                image={require('../../Assets/camera.png')}
                text={t('camera')}
              />
              <IconButonComponent
                onPress={() => {
                  openImagePicker();
                  setIsBottomSheetOpen(false);
                }}
                image={require('../../Assets/gallery.png')}
                text={t('gallery')}
              />
            </View>
          </View>
        </ModalPanel>
      </SafeAreaView>
  );
};

export default UserSchedule;

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: theme.COLORS.white,
  // },
  // mainView: {
  //   flex: 1,
  //   flexGrow: 1,
  //   marginTop: 40,
  //   paddingHorizontal: 20,
  //   // justifyContent: 'center',
  //   // alignItems: 'center',
  // },
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
  },
  mainView: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  buttonWrapper: {
    marginTop: 10,
    marginBottom: 120,
  },
  title: {
    color: theme.COLORS.black,
    fontWeight: '600',
    marginTop: 10,
    fontSize: 18,
    textAlign: 'center',
  },
  subtext: {
    color: theme.COLORS.darkBlue_gradient2,
    fontWeight: '400',
    marginVertical: 5,
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 40,
    borderRadius: 100,
    width: '70%',
    height: 50,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 8,
  },
  btnText: {color: theme.COLORS.white, fontSize: 18, fontWeight: '800'},
  input: {
    width: '100%',
    marginTop: 10,
    backgroundColor: theme.COLORS.white,
  },
  btnText1: {
    color: theme.COLORS.darkBlue_gradient2,
    textDecorationLine: 'underline',
  },
  //--modal--

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  imgSmall: {
    width: '50%',
    height: 60,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: theme.COLORS.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 23,
    paddingHorizontal: 25,
    bottom: 0,
    // borderWidth: 1,
    // borderBottomWidth: 0,
    borderColor: theme.COLORS.black,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 8,
  },
});
