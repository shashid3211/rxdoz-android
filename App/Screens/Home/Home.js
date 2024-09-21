import {SafeAreaView, ScrollView, StyleSheet, View, Button} from 'react-native';
import React, {useCallback, useState} from 'react';
import {theme} from '../../Constants/theme';
import UserProfile from '../../Components/UserProfile';
import WelcomeHeader from '../../Components/WelcomeHeader';
import {useFocusEffect} from '@react-navigation/native';
import {
  getMissedMedicines,
  getUpcomingMedicines,
  getUserDetail,
} from '../../Services/DatabaseService';
import MedicineList from '../../Components/MedicineList';
import ModalPanel from '../../Components/Modal';
import PdfView from '../../Components/PdfView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
// utils

const Home = ({navigation, route}) => {
  const {t} = useTranslation();

  const [personSchedule, setPersonScedule] = useState(null);
  const [pdfPath, setPdfPath] = useState(null);
  const [modalVisible, setModalVisible] = useState(null);
  const [todayMedicines, setTodayMedicines] = useState([]);
  const [nextDayMedicines, setNextDayMedicines] = useState([]);
  const [missedMedicines, setMissedMedicines] = useState([]);

  const getTodaysMedicines = useCallback(async () => {
    try {
      const today = new Date();
      const day = today.toISOString().split('T')[0];
      const medicines = await getUpcomingMedicines(day);
      console.log("Today's medicines:", medicines);
      setTodayMedicines(medicines);
      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayString = nextDay.toISOString().split('T')[0];
      const nextMedicines = await getUpcomingMedicines(nextDayString);
      console.log('Next Day medicines:', nextDayMedicines);
      setNextDayMedicines(nextMedicines);
      const missedTadayMedicines = await getMissedMedicines(day);
      console.log('Missed medicines:', missedTadayMedicines);
      setMissedMedicines(missedTadayMedicines);
    } catch (error) {
      console.error("Error getting today's medicines:", error);
    }
  }, []);

  const getUser = useCallback(async () => {
    try {
      const user = await getUserDetail();
      console.log(user);
      setPersonScedule(user);
      AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error(error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getTodaysMedicines();
      getUser();
    }, [getTodaysMedicines, getUser]),
  );

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <WelcomeHeader name={personSchedule && personSchedule.name} />

        <View style={styles.containerMain}>
          {todayMedicines || nextDayMedicines || missedMedicines ? (
            <View>
              {todayMedicines.length > 0 ? (
                <MedicineList
                  personDosage={todayMedicines}
                  setModalVisible={setModalVisible}
                  setPdfPath={setPdfPath}
                  navigation={navigation}
                  header={t('yoursTodaysMedicines')}
                />
              ) : null}
              {missedMedicines.length > 0 ? (
                <MedicineList
                  personDosage={missedMedicines}
                  setModalVisible={setModalVisible}
                  setPdfPath={setPdfPath}
                  navigation={navigation}
                  header={t('youMissedTodaysMedicines')}
                />
              ) : null}
              {nextDayMedicines.length > 0 ? (
                <MedicineList
                  personDosage={nextDayMedicines}
                  setModalVisible={setModalVisible}
                  setPdfPath={setPdfPath}
                  navigation={navigation}
                  header={t('yoursTomorrowsMedicines')}
                  link={false}
                />
              ) : null}
            </View>
          ) : personSchedule != null ? (
            <UserProfile personSchedule={personSchedule} />
          ) : null}

          {pdfPath != null ? (
            <ModalPanel
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}>
              <PdfView pdfPath={pdfPath} setModalVisible={setModalVisible} />
            </ModalPanel>
          ) : null}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.lightGray,
    paddingTop: 20,
  },
  textColor: {color: theme.COLORS.white, marginVertical: 3},
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#051F25',
  },
  title1: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.COLORS.voilet,
  },
  containerMain: {
    flex: 1,
    paddingHorizontal: 20,
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
    fontWeight: 'bold',
    marginLeft: 6,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    paddingHorizontal: 20,
    backgroundColor: theme.COLORS.white,
  },
  modalView: {
    flex: 1,
    width: '100%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
