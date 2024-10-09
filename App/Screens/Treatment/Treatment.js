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
import ConfirmModalComponent from '../../Components/UI/ConfirmModalComponent';
import {useTranslation} from 'react-i18next';

const Treatment = ({navigation}) => {
  const [prescription, setPrescription] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const {t} = useTranslation();

  const handleConfirm = async () => {
    try {
      const res = await deletePrescription(deleteId); // Delete prescription
      console.log('res: ', res);
      setModalVisible(false);
      // navigation.navigate('TreatmentScreen'); // Navigate to the treatment screen

      // Only re-fetch if the deletion was successful
      if (res) {
        // setPrescription([]); // Re-fetch the updated prescription list after deletion
        await handleGetPrescription();
      }

      // Close the modal after processing
    } catch (error) {
      console.error('Error during deletion:', error);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  // Define the function to fetch prescriptions.
  const handleGetPrescription = useCallback(async () => {
    try {
      const res = await getPrescription();
      if (res.length > 0) {
        console.log('res: ', res);
        setPrescription(res);
      } else {
        setPrescription([]);
      }
    } catch (error) {
      console.error(error);
    }
  }, []); // Empty dependency array ensures the function is created only once.

  // Fetch the prescriptions when the screen is focused.
  useFocusEffect(
    useCallback(() => {
      handleGetPrescription();
    }, []), // This ensures the function is stable and doesn’t change unnecessarily.
  );

  // Function to remove an item and refetch the prescription list.
  const removeItem = async id => {
    try {
      setDeleteId(id);
      setModalVisible(true);
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

export default Treatment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
});
