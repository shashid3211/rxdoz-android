import React from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import {Card, Title, Paragraph} from 'react-native-paper';
import {theme} from '../Constants/theme';
import {useTranslation} from 'react-i18next';

const ReportCard = medicineData => {
  const {t} = useTranslation();
  console.log('medicineData', medicineData);
  const renderMedicineItem = ({item}) => (
    <Card style={styles.profileBox}>
      <Card.Content>
        <Title style={styles.title}>{item.medicineName}</Title>
        {/* <Paragraph>{item.description || 'No description available'}</Paragraph> */}
        <View style={styles.dosageInfo}>
          <Paragraph style={styles.para}>
            {t('doseTaken')}: {item.takenDose}
          </Paragraph>
          <Paragraph style={styles.para}>
            {t('doseMissed')}: {item.missedDose}
          </Paragraph>
          <Paragraph style={styles.para}>
            {t('totalDoses')}: {item.totalDose}
          </Paragraph>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <FlatList
      data={medicineData.medicineData}
      renderItem={renderMedicineItem}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
  card: {
    marginBottom: 16,
  },
  dosageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  profileBox: {
    zIndex: 1,
    // position: 'absolute',
    // left: Dimensions.get('window').width * 0.07,
    // top: Dimensions.get('window').height * 0.18,
    borderRadius: 8,
    shadowRadius: 8,
    elevation: 3,
    shadowOpacity: 0.3,
    backgroundColor: theme.COLORS.darkBlue_gradient2,
    width: '100%',
    height: 90,
    marginBottom: 16,
  },
  title: {
    color: theme.COLORS.white,
  },
  para: {
    color: theme.COLORS.white,
  },
});

export default ReportCard;
