import {Image, SafeAreaView, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {theme} from '../../Constants/theme';

import Animated, {ZoomIn, ZoomOut} from 'react-native-reanimated';

import {
  getDBConnection,
  getPrescriptions,
  savePrescriptions,
} from '../../Database/DbService';
import TextInputComponent from '../../Components/UI/TextInputComponent';
import ButtonComponent from '../../Components/UI/ButtonComponent';
import {
  addPrescription,
  updatePrescription,
} from '../../Services/DatabaseService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';

const AddPrescription = ({navigation, route}) => {
  const {t} = useTranslation();
  const [docName, setDocName] = useState(null);
  const [docError, setDocError] = useState(null);
  const [hospName, setHospName] = useState(null);
  const [hospError, setHospError] = useState(null);
  const [description, setDescription] = useState(null);
  const [prescriptionId, setPrescriptionId] = useState(null);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (route.params) {
      console.log(route.params);
      setDocName(route.params.item_detail.doctor_name);
      setHospName(route.params.item_detail.hospital_name);
      setDescription(route.params.item_detail.description);
      setPrescriptionId(route.params.item_detail.id);
      setUpdate(true);
    }
  }, []);

  const storePrescription = async (docName, hospName) => {
    const db = await getDBConnection();
    let transactions = await getPrescriptions(db);
    const newData = [
      ...transactions,
      {
        id: transactions.length
          ? transactions.reduce((acc, cur) => {
              if (cur.id > acc.id) return cur;
              return acc;
            }).id + 1
          : 0,
        docName: docName,
        hospName: hospName,
      },
    ];

    await savePrescriptions(db, newData).then(() => {
      console.log('success');
      navigation.navigate('AddPrescribeDetail', {
        id: transactions.length
          ? transactions.reduce((acc, cur) => {
              if (cur.id > acc.id) return cur;
              return acc;
            }).id + 1
          : 0,
        d_name: docName,
        h_name: hospName,
      });
    });
  };

  const handleSubmit = async () => {
    if (!docName) {
      setDocError('Please enter Doctor Name');
    } else if (!hospName) {
      setHospError('Please enter Hospital Name');
    } else {
      const userId = AsyncStorage.getItem('user').id;
      if (update) {
        const res = await updatePrescription(
          prescriptionId,
          userId,
          docName,
          hospName,
          description,
        );
        if (res) {
          console.log('Update Res:', res);
          navigation.navigate('TreatmentScreen');
        }
      } else {
        const res = await addPrescription(
          userId,
          docName,
          hospName,
          description,
        );
        if (res) {
          console.log('success');
          console.log('Response Date:', res);
          navigation.navigate('AddPrescribeDetail', {
            id: res.insertId,
            d_name: docName,
            h_name: hospName,
          });
        } else {
          console.log('error');
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        entering={ZoomIn.duration(1000)}
        exiting={ZoomOut.duration(1000)}
        style={{alignItems: 'center'}}>
        <Image
          source={require('../../Assets/prescrib1.jpg')}
          resizeMode="contain"
          style={{
            width: '70%',
            height: '35%',
            marginHorizontal: 15,
          }}
        />

        <TextInputComponent
          value={docName}
          error={docError}
          label={t('doctorName')}
          onChangeText={text => {
            setDocName(text);
          }}
          reset={() => setDocName(null)}
          img={require('../../Assets/p1.jpg')}
        />

        <TextInputComponent
          value={hospName}
          error={hospError}
          label={t('hospitalName')}
          onChangeText={text => {
            setHospName(text);
          }}
          reset={() => setHospName(null)}
          img={require('../../Assets/p2.jpg')}
        />

        <ButtonComponent onPress={handleSubmit} text={t('save')} />
      </Animated.View>
    </SafeAreaView>
  );
};

export default AddPrescription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  title: {
    color: '#202E4E',
    margin: 10,
    fontSize: 20, //18,
    fontWeight: '800',
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
    paddingHorizontal: 35,
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
  btnText: {color: theme.COLORS.white, fontSize: 18, fontWeight: 'bold'},
});
