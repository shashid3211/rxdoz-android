import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {theme} from '../Constants/theme';
import ButtonComponent from './UI/ButtonComponent';
import {useTranslation} from 'react-i18next';

const PrescriptionGetStart = ({navigation}) => {
  const {t} = useTranslation();
  return (
    <View style={styles.mainView}>
      <Image
        source={require('../Assets/reminder.png')}
        resizeMode="contain"
        style={styles.img}
      />
      <Text style={styles.heading}>{t('getStarted')}</Text>
      <Text style={styles.subtext}>{t('addMedicineQuote')}</Text>

      <ButtonComponent
        text="ADD PRESCRIPTION"
        onPress={() => navigation.navigate('AddPrescription')}
      />
    </View>
  );
};

export default PrescriptionGetStart;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    color: theme.COLORS.darkBlue_gradient2,
    fontWeight: '600',
    marginVertical: 20,
    fontSize: 18,
    textAlign: 'center',
  },
  subtext: {
    color: theme.COLORS.darkBlue_gradient1,
    fontWeight: '400',
    marginVertical: 5,
    fontSize: 14,
    textAlign: 'center',
  },
  img: {width: '20%', height: '20%'},
});
