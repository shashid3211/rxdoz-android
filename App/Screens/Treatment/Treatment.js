import {Alert, SafeAreaView, StyleSheet} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {theme} from '../../Constants/theme';

import PrescriptionList from '../../Components/PrescriptionList';
import PrescriptionGetStart from '../../Components/PrescriptionGetStart';
import {
  deletePrescription,
  getPrescription,
} from '../../Services/DatabaseService';
import {useFocusEffect} from '@react-navigation/native';
import WarningModalComponent from '../../Components/UI/WarningModalComponent';

const Treatment = ({navigation}) => {
  const [prescription, setPrescription] = useState(null);

  // Define the function to fetch prescriptions.
  const handleGetPrescription = useCallback(async () => {
    try {
      const res = await getPrescription();
      if (res.length > 0) {
        console.log('res: ', res);
        setPrescription(res);
      } else {
        setPrescription(null);
      }
    } catch (error) {
      console.error(error);
    }
  }, []); // Empty dependency array ensures the function is created only once.

  // Fetch the prescriptions when the screen is focused.
  useFocusEffect(
    useCallback(() => {
      handleGetPrescription();
    }, [handleGetPrescription]), // This ensures the function is stable and doesn’t change unnecessarily.
  );

  const confirmDelete = () => {
    return new Promise(resolve => {
      Alert.alert(
        'Delete Prescription',
        'Are you sure you want to delete this prescription?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve(false),
          },
          {
            text: 'OK',
            onPress: () => resolve(true),
          },
        ],
      );
    });
  };

  // Function to remove an item and refetch the prescription list.
  const removeItem = async id => {
    try {
      const confirm = await confirmDelete();

      if (confirm) {
        const res = await deletePrescription(id); // Assume this function deletes a prescription by ID.
        if (res) {
          await handleGetPrescription(); // Re-fetch the updated prescription list after deletion.
        }
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {prescription != null && prescription.length > 0 ? (
        <PrescriptionList
          navigation={navigation}
          prescription={prescription}
          removeItem={removeItem}
        />
      ) : (
        <PrescriptionGetStart navigation={navigation} />
      )}
    </SafeAreaView>
  );
};

export default Treatment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
});
