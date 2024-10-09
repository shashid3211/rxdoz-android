import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {theme} from '../../Constants/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {getDBConnection, UpdateDosage} from '../../Database/DbService';
import {addDose, updateMedicineStatus} from '../../Services/DatabaseService';
import {useTranslation} from 'react-i18next';
import ConfirmModalComponent from '../../Components/UI/ConfirmModalComponent';
import ModalComponent from '../../Components/UI/ModalComponent';

const ViewDosage = ({navigation, route}) => {
  const {t} = useTranslation();
  const [dose, setDose] = useState(null);
  useEffect(() => {
    let item = route.params.item;
    console.log(item);
    setDose(item);
  }, []);
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [uId, setUId] = useState(null);

  const handleConfirm = async () => {
    const res = await updateMedicineStatus(uId, 'missed'); // Assume this function deletes a prescription by ID.
    if (res) {
      navigation.navigate('TreatmentScreen'); // Re-fetch the updated prescription list after deletion.
    }
    setModalVisible(false);
    navigation.replace('MainTab');
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleClose = () => {
    setSuccessModalVisible(false);
    navigation.replace('MainTab');
  };

  const updateData = async (d, status) => {
    try {
      if (status === 'taken') {
        console.log('dose: ', d);
        const res = await updateMedicineStatus(d, status);
        setSuccessModalVisible(true);
        console.log('res: ', res);
        // navigation.replace('MainTab');
      }
      if (status === 'missed') {
        setModalVisible(true);
        setUId(d);
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {dose ? (
        <View style={styles.mainView}>
          {dose && dose.photo ? (
            <Image
              source={{uri: `file://${dose.photo}`}}
              style={{
                width: '100%',
                height: '50%',
                borderRadius: 6,
              }}
              resizeMode="cover"
            />
          ) : dose.type === 'TAB' ? (
            <Image
              source={require('../../Assets/tab.png')}
              style={{
                width: '100%',
                height: '50%',
                borderRadius: 6,
              }}
              resizeMode="cover"
            />
          ) : dose.type === 'CAP' ? (
            <Image
              source={require('../../Assets/cap.png')}
              style={{
                width: '100%',
                height: '50%',
                borderRadius: 6,
              }}
              resizeMode="cover"
            />
          ) : dose.type === 'Drops' ? (
            <Image
              source={require('../../Assets/drops.png')}
              style={{
                width: '100%',
                height: '50%',
                borderRadius: 6,
              }}
              resizeMode="cover"
            />
          ) : dose.type === 'Syrup' ? (
            <Image
              source={require('../../Assets/syrup.png')}
              style={{
                width: '100%',
                height: '50%',
                borderRadius: 6,
              }}
              resizeMode="cover"
            />
          ) : dose.type === 'Liquid' ? (
            <Image
              source={require('../../Assets/liquid.jpg')}
              style={{
                width: '100%',
                height: '50%',
                borderRadius: 6,
              }}
              resizeMode="cover"
            />
          ) : dose.type === 'Injection' ? (
            <Image
              source={require('../../Assets/injection.png')}
              style={{
                width: '100%',
                height: '50%',
                borderRadius: 6,
              }}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={require('../../Assets//spray.png')}
              style={{
                width: '100%',
                height: '50%',
                borderRadius: 6,
              }}
              resizeMode="cover"
            />
          )}
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: theme.COLORS.darkBlue_gradient2,
              textAlign: 'center',
              marginTop: 50,
            }}>
            {dose.name}
          </Text>
          <Text
            style={{
              color: theme.COLORS.darkBlue_gradient1,
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            <MaterialCommunityIcons
              name="pill"
              color={theme.COLORS.darkBlue_gradient1}
              size={20}
            />
            {' ' + dose.dose + ' ' + dose.type}
          </Text>
          <Text
            style={{
              color: theme.COLORS.darkBlue_gradient1,
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            <MaterialCommunityIcons
              name="food"
              color={theme.COLORS.darkBlue_gradient1}
              size={20}
            />
            {' ' + dose.consumption}
          </Text>
          <TouchableOpacity
            onPress={() => {
              updateData(dose.schedule_id, 'taken');
            }}>
            <LinearGradient
              colors={[
                theme.COLORS.darkBlue_gradient1,
                theme.COLORS.darkBlue_gradient2,
              ]}
              style={styles.button}
              locations={[0, 0.9]}>
              <Text style={styles.btnText}>{t('takeNow')}</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              updateData(dose.schedule_id, 'missed');
            }}>
            <Text style={styles.btnText1}>{t('skip')}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <ConfirmModalComponent
        visible={modalVisible}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title={t('deleteTitle')}
        message={t('skipMessage')}
        icon="❓"
      />
      <ModalComponent
        visible={successModalVisible}
        onClose={handleClose}
        text={t('medicineTakenMessage')}
        // page={redirect}
      />
    </SafeAreaView>
  );
};

export default ViewDosage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  mainView: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
    borderRadius: 100,
    width: '70%',
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
  btnText1: {
    color: theme.COLORS.darkBlue_gradient2,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
