import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {theme} from '../../Constants/theme';
import LinearGradient from 'react-native-linear-gradient';
import Animated from 'react-native-reanimated';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  deleteDosageItem,
  deleteMedicineItem,
  deletePrescriptionItem,
  getDBConnection,
} from '../../Database/DbService';
import Pdf from 'react-native-pdf';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {
  getDosageDetails,
  getDose,
  getDoseTakenCount,
  getGroupedMedicineStats,
  getMedicineWiseTakenReport,
  getMissedDosages,
  getMissedDosagesCount,
  getPrescription,
  getTotalCountOfScheduleTimes,
} from '../../Services/DatabaseService';
import ReportCard from '../../Components/ReportCard';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const Report = ({navigation}) => {
  const {t} = useTranslation();
  const pdfref = useRef();
  const [prescription, setPrescription] = useState(null);
  const [dosageTotal, setDosageTotal] = useState(null);
  const [dosagesuccess, setDosageSuccess] = useState(null);
  const [pdfPath, setPdfPath] = useState(null);
  const [modalVisible, setModalVisible] = useState(null);
  const [medicineData, setMedicineData] = useState(null);
  const [missDose, setMissDose] = useState(null);

  const getData = useCallback(async () => {
    try {
      // const totalMedicine = await getTotalCountOfScheduleTimes();
      // console.log('totalMedicine', totalMedicine);
      // const takenMedicine = await getDoseTakenCount();
      // console.log('takenMedicine', takenMedicine);
      // const missMed = await getMissedDosagesCount();
      // console.log('missMed', missMed);
      const res = await getPrescription();
      setPrescription(res);
      const medStat = await getGroupedMedicineStats();
      const totals = medStat.reduce(
        (acc, item) => {
          acc.notTakenCount += item.notTakenCount;
          acc.takenCount += item.takenCount;
          acc.totalDosages += item.totalDosages;
          return acc;
        },
        {notTakenCount: 0, takenCount: 0, totalDosages: 0},
      );
      setDosageTotal(totals.totalDosages);
      setDosageSuccess(totals.takenCount);
      setMissDose(totals.notTakenCount);
      setMedicineData(medStat);
      console.log('medStat', medStat);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const removeItem = async id => {
    try {
      const db = await getDBConnection();
      await deleteDosageItem(db, id);
      await deleteMedicineItem(db, id);
      await deletePrescriptionItem(db, id).then(() => {
        navigation.replace('MainTab');
      });
      navigation.replace('MainTab');
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const categorizeDosages = dosageRecords => {
    const takenDosages = [];
    const missedDosages = [];

    const now = new Date(); // Current date and time

    for (const record of dosageRecords) {
      const dosageDate = new Date(record.dosage_time);

      // Check if dosage is missed or taken
      if (record.taken) {
        takenDosages.push(record);
      } else if (dosageDate <= now) {
        missedDosages.push(record);
      }
    }

    return {takenDosages, missedDosages};
  };

  const getTakenAndMissedDosages = useCallback(async () => {
    try {
      const dosageRecords = await getDosageDetails();
      const categorizedDosages = categorizeDosages(dosageRecords);
      console.log('categorizedDosages', categorizedDosages);
      return categorizedDosages;
    } catch (error) {
      console.error('Error fetching taken and missed dosages:', error);
      throw error;
    }
  }, []);

  const generateMedicineWiseTakenReport = (dosages, medicines) => {
    const report = {};

    // Create a map of medicines for quick lookup
    const medicineMap = new Map();
    for (const medicine of medicines) {
      medicineMap.set(medicine.id, medicine);
      report[medicine.id] = {
        name: medicine.name,
        description: medicine.description,
        totalDosages: 0,
        takenCount: 0,
        notTakenCount: 0,
      };
    }

    // Aggregate dosage information
    for (const dosage of dosages) {
      const medicineReport = report[dosage.medicine_id];
      if (!medicineReport) continue;

      medicineReport.totalDosages += 1;
      if (dosage.taken) {
        medicineReport.takenCount += 1;
      } else {
        medicineReport.notTakenCount += 1;
      }
    }

    return Object.values(report);
  };

  const getMedicineWiseTakenReportDetails = useCallback(async () => {
    try {
      const {dosages, medicines} = await getMedicineWiseTakenReport();
      const report = generateMedicineWiseTakenReport(dosages, medicines);
      console.log('report', report);
      // return report;
      // setMedicineData(report);
    } catch (error) {
      console.error('Error generating medicine-wise taken report:', error);
      throw error;
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getData();
      getTakenAndMissedDosages();
      getMedicineWiseTakenReportDetails();
    }, [getData, getTakenAndMissedDosages, getMedicineWiseTakenReportDetails]),
  );

  const createPDF = async item => {
    try {
      let PDFOptions = {
        html: await htmlContent(item),
        fileName: 'file',
        directory: Platform.OS === 'android' ? 'Downloads' : 'Documents',
      };
      let file = await RNHTMLtoPDF.convert(PDFOptions);
      if (!file.filePath) return;
      //alert(file.filePath);
      // pdfView(file.filePath);

      setPdfPath(file.filePath);
      setModalVisible(true);
    } catch (error) {
      console.log('Failed to generate pdf', error.message);
    }
  };

  const htmlContent = async item => {
    let fromD = new Date(item.fromDate).toDateString();
    let toD = new Date(item.toDate).toDateString();
    try {
      return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Report</title>
        <style>
            body {
              font-size: 16px;
              color: #000000;
            
            }

            h1 {
              text-align: center;
              color: #ffffff;
              
            }
            
            .imgContainer {
              display: flex;
              flex-direction: row;
              background-color: #525399;
              align-items: center;
            }
              
            #pdfMed {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

#pdfMed td, #pdfMed th {
  border: 1px solid #ddd;
  padding: 8px;
}

#pdfMed tr:nth-child(even){background-color: #f2f2f2;}

#pdfMed tr:hover {background-color: #ddd;}

#pdfMed th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #525399;
  color: white;
}

        </style>
    </head>
    <body>
    <div class="imgContainer">

            <h1>${item.hospName}</h1>
          </div>
        
        <div class="confirmationBox_content">
        <h2>${item.docName}</h2>
      <table id="pdfMed">
  <tr>
    <th>Medicine Name</th>
    <th>Course Duration</th>
    <th>Medicine Type</th>
    <th>Frequency</th>
    <th>Consumption</th>
  </tr>
  <tr>
    <td>${item.medName}</td>
    <td>${fromD} to ${toD}</td>
    <td>${item.medType}</td>
    <td>${item.medFrequency}</td>
    <td>${item.medConsumption}</td>
  </tr>
</table>
    </div>
    </body>
    </html>
`;
    } catch (error) {
      console.log('pdf generation error', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {prescription ? (
        <View style={styles.mainView}>
          <Image
            source={require('../../Assets/prescrib1.jpg')}
            resizeMode="contain"
            style={{
              width: '70%',
              height: '25%',
              alignSelf: 'center',
            }}
          />

          <Text style={styles.title}>{t('reports')}</Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 80,
            }}>
            <View
              style={{
                // flexDirection: 'row',
                // justifyContent: 'space-between',
                marginVertical: 40,
                width: '30%',
              }}>
              <View style={styles.profilePhotoContainer}>
                <Image
                  style={styles.profileImage}
                  source={require('../../Assets/back1.png')}
                />
              </View>

              <View style={[styles.profileBox]}>
                <Text style={styles.heading}>
                  {dosageTotal ? dosageTotal : '0'}
                </Text>
                <Text style={styles.textTitle}>{t('totalDoses')}</Text>
              </View>
            </View>
            <View
              style={{
                marginVertical: 40,
                width: '30%',
              }}>
              <View style={styles.profilePhotoContainer}>
                <Image
                  style={styles.profileImage}
                  source={require('../../Assets/back2.png')}
                />
              </View>

              <View style={[styles.profileBox]}>
                <Text style={styles.heading}>
                  {dosagesuccess ? dosagesuccess : '0'}
                </Text>
                <Text style={styles.textTitle}>{t('doseTaken')}</Text>
              </View>
            </View>
            <View
              style={{
                marginVertical: 40,
                width: '30%',
              }}>
              <View style={styles.profilePhotoContainer}>
                <Image
                  style={styles.profileImage}
                  source={require('../../Assets/back3.png')}
                />
              </View>

              <View style={[styles.profileBox]}>
                <Text style={styles.heading}>{missDose}</Text>
                <Text style={styles.textTitle}>{t('doseMissed')}</Text>
              </View>
            </View>
          </View>
          <Text style={{...styles.title, alignSelf: 'flex-start'}}>
            {t('myMedicinesReport')}
          </Text>
          <ReportCard medicineData={medicineData} />
        </View>
      ) : (
        <View
          style={{
            ...styles.mainView,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../Assets/reminder.png')}
            resizeMode="contain"
            style={{width: '20%', height: '20%'}}
          />
          <Text style={styles.heading1}>{t('getStarted')}</Text>
          <Text style={styles.subtext}>{t('addMedicineQuote')}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Report;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  mainView: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
  },
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
    right: 20,
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
  containerSmall: {
    width: '30%',
    height: 100,
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: theme.COLORS.darkBlue_gradient2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: theme.COLORS.darkBlue_gradient2,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.COLORS.white,
    marginTop: 25,
    textAlign: 'center',
  },
  heading1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.COLORS.darkBlue_gradient2,
    marginVertical: 7,
  },
  textTitle: {
    marginVertical: 5,
    color: theme.COLORS.white,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 12,
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
  profilePhotoContainer: {
    zIndex: 50,
    position: 'absolute',
    top: -25,
    left: Dimensions.get('window').width * 0.07,
    elevation: 4,
  },
  profileImage: {
    zIndex: 5,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.COLORS.white,
  },
  profileBox: {
    zIndex: 1,
    position: 'absolute',
    // left: Dimensions.get('window').width * 0.07,
    // top: Dimensions.get('window').height * 0.18,
    borderRadius: 8,
    shadowRadius: 8,
    elevation: 3,
    shadowOpacity: 0.3,
    backgroundColor: theme.COLORS.darkBlue_gradient2,
    width: '100%',
    height: 90,
  },
});
