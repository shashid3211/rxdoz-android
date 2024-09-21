import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {theme} from '../../Constants/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Animated, {ZoomIn, ZoomOut} from 'react-native-reanimated';
import {TextInput} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import DatePicker from 'react-native-date-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddAppointment = ({navigation}) => {
  const [docName, setDocName] = useState(null);
  const [docError, setDocError] = useState(null);
  const [addNote, setAddNote] = useState(null);
  const [noteError, setNoteError] = useState(null);
  const [selectDate, setSelectDate] = useState(new Date());
  const [openCalender1, setOpenCalender1] = useState(false);
  const [selectTime, setSelectTime] = useState(new Date());
  const [openCalender2, setOpenCalender2] = useState(false);

  const getTransaction = async () => {
    let transactions = await AsyncStorage.getItem('appointments');
    if (transactions) {
      return JSON.parse(transactions);
    } else {
      return [];
    }
  };

  const saveAppointment = async value => {
    try {
      let existingApointments = await getTransaction();
      if (existingApointments != null) {
        const updatedTransactions = [...existingApointments, value]; // you're having array of string, not array of object
        await AsyncStorage.setItem(
          'appointments',
          JSON.stringify(updatedTransactions),
        );
      } else {
        const jsonValue = JSON.stringify(value);
        console.log(jsonValue);
        await AsyncStorage.setItem('appointments', jsonValue);
      }
      navigation.replace('MainTab');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        entering={ZoomIn.duration(1000)}
        exiting={ZoomOut.duration(1000)}
        style={{alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('SupportScreen');
          }}
          style={{
            alignSelf: 'flex-start',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <FontAwesome6
            name="arrow-left-long"
            size={22}
            color={theme.COLORS.darkBlue_gradient2}
          />
          <Text style={styles.title}>New Appointment</Text>
        </TouchableOpacity>

        {/* <Image
          source={require('../../Assets/prescrib1.jpg')}
          resizeMode="contain"
          style={{
            width: '70%',
            height: '30%',
            marginHorizontal: 15,
            marginTop: 10,
          }}
        /> */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 25,
          }}>
          <Image
            source={require('../../Assets/p2.jpg')}
            resizeMode="contain"
            style={{
              width: '15%',
              height: '75%',
              marginHorizontal: 15,
              marginTop: 10,
            }}
          />
          <TextInput
            mode="outlined"
            value={selectDate.toDateString()}
            label="Date"
            outlineColor={theme.COLORS.darkBlue_gradient1}
            outlineStyle={{borderRadius: 100}}
            activeOutlineColor={theme.COLORS.darkBlue_gradient2}
            textColor={theme.COLORS.darkBlue_gradient2}
            style={styles.input}
            onPressIn={() => setOpenCalender1(true)}
            right={
              <TextInput.Icon
                icon="calendar-blank"
                color={theme.COLORS.darkBlue_gradient1}
              />
            }
          />
          <DatePicker
            modal
            mode="date"
            open={openCalender1}
            date={selectDate}
            onConfirm={date => {
              setOpenCalender1(false);
              setSelectDate(date);
            }}
            onCancel={() => {
              setOpenCalender1(false);
            }}
            buttonColor={theme.COLORS.darkBlue_gradient2}
            dividerColor={theme.COLORS.darkBlue_gradient2}
            minuteInterval={15}
          />

          <TouchableOpacity
            style={{padding: 10, marginTop: 10}}
            onPress={() => setOpenCalender1(null)}>
            <Text style={styles.btnText1}>Reset</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 15,
          }}>
          <Image
            source={require('../../Assets/p2.jpg')}
            resizeMode="contain"
            style={{
              width: '15%',
              height: '75%',
              marginHorizontal: 15,
              marginTop: 10,
            }}
          />

          <TextInput
            mode="outlined"
            value={selectTime.toLocaleString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
            label="Time"
            outlineColor={theme.COLORS.darkBlue_gradient1}
            outlineStyle={{borderRadius: 100}}
            activeOutlineColor={theme.COLORS.darkBlue_gradient2}
            textColor={theme.COLORS.darkBlue_gradient2}
            style={styles.input}
            onPressIn={() => setOpenCalender2(true)}
            right={
              <TextInput.Icon
                icon="clock-edit"
                color={theme.COLORS.darkBlue_gradient1}
              />
            }
          />
          <DatePicker
            modal
            mode="time"
            open={openCalender2}
            date={selectTime}
            onConfirm={date => {
              setOpenCalender2(false);
              setSelectTime(date);
            }}
            onCancel={() => {
              setOpenCalender2(false);
            }}
            buttonColor={theme.COLORS.darkBlue_gradient2}
            dividerColor={theme.COLORS.darkBlue_gradient2}
          />
          <TouchableOpacity
            style={{padding: 10, marginTop: 10}}
            onPress={() => setOpenCalender2(null)}>
            <Text style={styles.btnText1}>Reset</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
          }}>
          <Image
            source={require('../../Assets/p1.jpg')}
            resizeMode="contain"
            style={{
              width: '15%',
              height: '75%',
              marginHorizontal: 15,
              marginTop: 10,
            }}
          />
          <TextInput
            mode="outlined"
            value={docName}
            onChangeText={text => {
              setDocName(text);
            }}
            label="Healthcare Proffessional"
            error={docError}
            outlineColor={theme.COLORS.darkBlue_gradient2}
            activeOutlineColor={theme.COLORS.darkBlue_gradient2}
            outlineStyle={{borderRadius: 100}}
            textColor={theme.COLORS.darkBlue_gradient1}
            style={styles.input}
          />
          <TouchableOpacity
            style={{padding: 10, marginTop: 10}}
            onPress={() => setDocName(null)}>
            <Text style={styles.btnText1}>Reset</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
          }}>
          <Image
            source={require('../../Assets/p1.jpg')}
            resizeMode="contain"
            style={{
              width: '15%',
              height: '75%',
              marginHorizontal: 15,
              marginTop: 10,
            }}
          />
          <TextInput
            mode="outlined"
            value={addNote}
            onChangeText={text => {
              setAddNote(text);
            }}
            label="Note"
            error={noteError}
            outlineColor={theme.COLORS.darkBlue_gradient2}
            activeOutlineColor={theme.COLORS.darkBlue_gradient2}
            outlineStyle={{borderRadius: 100}}
            textColor={theme.COLORS.darkBlue_gradient1}
            style={styles.input}
          />
          <TouchableOpacity
            style={{padding: 10, marginTop: 10}}
            onPress={() => setAddNote(null)}>
            <Text style={styles.btnText1}>Reset</Text>
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={[
            theme.COLORS.darkBlue_gradient1,
            theme.COLORS.darkBlue_gradient2,
          ]}
          style={styles.button}
          locations={[0, 0.9]}>
          <TouchableOpacity
            onPress={() => {
              if (docName == null) {
                setDocError(true);
                return;
              }
              if (addNote == null) {
                setNoteError(true);
                return;
              }
              let info = {
                date: selectDate,
                time: selectTime,
                doc_name: docName,
                note: addNote,
              };
              saveAppointment(info);
            }}>
            <Text style={styles.btnText}>Save</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    </SafeAreaView>
  );
};

export default AddAppointment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  title: {
    color: '#202E4E',
    margin: 10,
    fontSize: 18,
    fontWeight: '400',
  },
  input: {
    width: '70%',
    marginTop: 10,
    backgroundColor: theme.COLORS.white,
  },
  btnText1: {
    color: theme.COLORS.darkBlue_gradient2,
    textDecorationLine: 'underline',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
    borderRadius: 100,
    width: '40%',
    height: 50,
    padding: 5,
    backgroundColor: theme.COLORS.blue,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 8,
  },
  btnText: {color: theme.COLORS.white, fontSize: 18, fontWeight: '600'},
});
