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

const AddProfessional = ({navigation}) => {
  const [docName, setDocName] = useState(null);
  const [docError, setDocError] = useState(null);
  const [proffession, setProffession] = useState(null);
  const [proffessionErr, setProffessionErr] = useState(null);
  const [street, setStreet] = useState(null);
  const [pincode, setPincode] = useState(null);
  const [city, setCity] = useState(null);
  const [phone, setPhone] = useState(null);
  const [phoneErr, setPhoneErr] = useState(null);
  const [email, setEmail] = useState(null);

  const saveAppointment = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('appointment_' + docName, jsonValue);
      navigation.navigate('SupportScreen');
    } catch (e) {
      // saving error
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView
        entering={ZoomIn.duration(1000)}
        exiting={ZoomOut.duration(1000)}
        contentContainerStyle={{flex: 1, alignItems: 'center'}}>
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
          <Text style={styles.title}>Add Healthcare Proffessional</Text>
        </TouchableOpacity>

        <Image
          source={require('../../Assets/doctor.png')}
          resizeMode="contain"
          style={{
            width: '30%',
            height: '15%',
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
          label="Name"
          error={docError}
          outlineColor={theme.COLORS.darkBlue_gradient2}
          activeOutlineColor={theme.COLORS.darkBlue_gradient2}
          outlineStyle={{borderRadius: 100}}
          textColor={theme.COLORS.darkBlue_gradient1}
          style={styles.input}
        />
        <TextInput
          mode="outlined"
          value={proffession}
          onChangeText={text => {
            setProffession(text);
          }}
          label="Medical Speciality"
          error={proffessionErr}
          outlineColor={theme.COLORS.darkBlue_gradient2}
          activeOutlineColor={theme.COLORS.darkBlue_gradient2}
          outlineStyle={{borderRadius: 100}}
          textColor={theme.COLORS.darkBlue_gradient1}
          style={styles.input}
        />
        <TextInput
          mode="outlined"
          value={street}
          onChangeText={text => {
            setStreet(text);
          }}
          label="Street"
          outlineColor={theme.COLORS.darkBlue_gradient2}
          activeOutlineColor={theme.COLORS.darkBlue_gradient2}
          outlineStyle={{borderRadius: 100}}
          textColor={theme.COLORS.darkBlue_gradient1}
          style={styles.input}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <TextInput
            mode="outlined"
            value={pincode}
            onChangeText={text => {
              setPincode(text);
            }}
            label="Postcode"
            outlineColor={theme.COLORS.darkBlue_gradient2}
            activeOutlineColor={theme.COLORS.darkBlue_gradient2}
            outlineStyle={{borderRadius: 100}}
            textColor={theme.COLORS.darkBlue_gradient1}
            style={styles.input1}
          />
          <TextInput
            mode="outlined"
            value={city}
            onChangeText={text => {
              setCity(text);
            }}
            label="City"
            outlineColor={theme.COLORS.darkBlue_gradient2}
            activeOutlineColor={theme.COLORS.darkBlue_gradient2}
            outlineStyle={{borderRadius: 100}}
            textColor={theme.COLORS.darkBlue_gradient1}
            style={styles.input1}
          />
        </View>
        <TextInput
          mode="outlined"
          value={phone}
          onChangeText={text => {
            setPhone(text);
          }}
          label="Phone Number"
          error={phoneErr}
          outlineColor={theme.COLORS.darkBlue_gradient2}
          activeOutlineColor={theme.COLORS.darkBlue_gradient2}
          outlineStyle={{borderRadius: 100}}
          textColor={theme.COLORS.darkBlue_gradient1}
          style={styles.input}
        />
        <TextInput
          mode="outlined"
          value={email}
          onChangeText={text => {
            setEmail(text);
          }}
          label="Email Id"
          outlineColor={theme.COLORS.darkBlue_gradient2}
          activeOutlineColor={theme.COLORS.darkBlue_gradient2}
          outlineStyle={{borderRadius: 100}}
          textColor={theme.COLORS.darkBlue_gradient1}
          style={styles.input}
        />

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
              if (proffession == null) {
                setProffessionErr(true);
                return;
              }
              if (phone == null) {
                setPhoneErr(true);
                return;
              }
              let info = {
                id: docName,
                doc_name: docName,
                speciality: proffession,
                address: street,
                city: pincode + ' ' + city,
                phone: phone,
                email: email,
              };
              saveAppointment(info);
            }}>
            <Text style={styles.btnText}>Save</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default AddProfessional;

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
    width: '100%',
    marginTop: 10,
    backgroundColor: theme.COLORS.white,
  },
  input1: {
    width: '45%',
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
