import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {theme} from '../../Constants/theme';
import LinearGradient from 'react-native-linear-gradient';
import Animated from 'react-native-reanimated';

import {deleteMedicineItem, getDBConnection} from '../../Database/DbService';
import {
  deleteMedicine,
  getMedicinesAndSchedulesByPrescriptionId,
} from '../../Services/DatabaseService';
import PrescriptionMedicineList from '../../Components/PrescriptionMedicineList';
import {useTranslation} from 'react-i18next';
import ConfirmModalComponent from '../../Components/UI/ConfirmModalComponent';

const ViewMedicines = ({navigation, route}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const {t} = useTranslation();

  const handleConfirm = async () => {
    const res = await deleteMedicine(deleteId); // Assume this function deletes a prescription by ID.
    if (res) {
      navigation.navigate('TreatmentScreen'); // Re-fetch the updated prescription list after deletion.
    }
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const [prescribe, setPrescrib] = useState(null);
  const [medicines, setMedicines] = useState(null);
  useEffect(() => {
    setPrescrib(route.params.item);
    console.log('prescribe', route.params.item);
    getMed(route.params.item.id);
  }, [route.params.item]);

  const getMed = async id => {
    try {
      const res = await getMedicinesAndSchedulesByPrescriptionId(id);
      setMedicines(res);
      // console.log('res Medicine', JSON.stringify(res));
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const handleDelete = async id => {
    try {
      setDeleteId(id);
      setModalVisible(true);
    } catch (error) {
      console.log('error: ', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {medicines != null && medicines.length > 0 ? (
        <PrescriptionMedicineList
          medicines={medicines}
          navigation={navigation}
          prescribe={prescribe}
          handleDelete={handleDelete}
        />
      ) : (
        <View style={styles.mainView}>
          <Image
            source={require('../../Assets/reminder.png')}
            resizeMode="contain"
            style={{width: '20%', height: '20%'}}
          />
          <Text style={styles.heading}>{t('getStarted')}</Text>
          <Text style={styles.subtext}>{t('addMedicineQuote')}</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AddPrescribeDetail', {
                item_detail: prescribe,
              })
            }>
            <LinearGradient
              colors={[
                theme.COLORS.darkBlue_gradient1,
                theme.COLORS.darkBlue_gradient2,
              ]}
              style={styles.button}>
              <Text style={styles.btnText}>{t('addMedicine')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
      <ConfirmModalComponent
        visible={modalVisible}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title={t('deleteTitle')}
        message={t('deleteMessage')}
        icon="❌"
      />
    </SafeAreaView>
  );
};

export default ViewMedicines;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.lightGray,
  },
  mainView: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textColor: {color: theme.COLORS.white},
  button: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
    borderRadius: 100,
    width: '70%',
    height: 50,
    padding: 5,
    paddingHorizontal: 15,
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
  bottomButton: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 10,
    borderRadius: 25,
    width: '50%',
    height: 45,
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
  btnText: {
    color: theme.COLORS.white,
    fontSize: 18,
    marginLeft: 6,
    fontWeight: 'bold',
  },
  heading: {
    color: theme.COLORS.darkBlue_gradient2,
    fontWeight: '600',
    marginVertical: 20,
    fontSize: 18,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.COLORS.title,
    alignSelf: 'flex-start',
  },
  title1: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.COLORS.voilet,
  },
  subtext: {
    color: theme.COLORS.darkBlue_gradient1,
    fontWeight: '400',
    marginVertical: 5,
    fontSize: 14,
    textAlign: 'center',
  },
});
