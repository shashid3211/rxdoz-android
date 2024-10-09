import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {theme} from '../Constants/theme';
import LinearGradient from 'react-native-linear-gradient';
import Animated from 'react-native-reanimated';
import moment from 'moment-timezone';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';

const PrescriptionMedicineList = ({
  medicines,
  navigation,
  prescribe,
  handleDelete,
}) => {
  const {t} = useTranslation();
  return (
    <View style={styles.mainView}>
      <Animated.FlatList
        showsVerticalScrollIndicator={false}
        data={medicines}
        ListHeaderComponent={() => (
          <Text style={styles.title}>{t('myMedicines')}</Text>
        )}
        renderItem={({item}) => {
          return (
            <View style={styles.madicineContainer}>
              {item && item.photo ? (
                <Image
                  source={{uri: `file://${item.photo}`}}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : item.type === 'TAB' ? (
                <Image
                  source={require('../Assets/tab.png')}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : item.type === 'CAP' ? (
                <Image
                  source={require('../Assets/cap.png')}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : item.type === 'Drops' ? (
                <Image
                  source={require('../Assets/drops.png')}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : item.type === 'Syrup' ? (
                <Image
                  source={require('../Assets/syrup.png')}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : item.type === 'Liquid' ? (
                <Image
                  source={require('../Assets/liquid.jpg')}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : item.type === 'Injection' ? (
                <Image
                  source={require('../Assets/injection.png')}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={require('../Assets/spray.png')}
                  style={styles.image}
                  resizeMode="cover"
                />
              )}
              <View style={styles.detailsBox}>
                <View style={styles.flexboxBtween}>
                  <View style={styles.textBox}>
                    <Text
                      style={{
                        ...styles.textColor,
                      }}>
                      {item.name}
                    </Text>
                  </View>
                  <View style={styles.textBox}>
                    <Text
                      style={{
                        ...styles.textColor,
                      }}>
                      {item.dose + ' ' + item.type}
                    </Text>
                  </View>
                </View>
                <View style={styles.textBox}>
                  <Text
                    style={{
                      ...styles.textColor,
                    }}>
                    {moment(item.form_date).format('DD-MM-YYYY') +
                      ' to ' +
                      moment(item.to_date).format('DD-MM-YYYY')}
                  </Text>
                </View>
                <View style={styles.secBox}>
                  <Text
                    style={{
                      ...styles.textColor,
                    }}>
                    {item.consumption}
                  </Text>
                </View>

                <View style={styles.flexbox}>
                  {item.schedule_times &&
                    item.schedule_times.length > 0 &&
                    item.schedule_times.map((time, index) => {
                      return (
                        <View key={index} style={styles.scheduleBox}>
                          <Text style={styles.scheduleText}>{time}</Text>
                        </View>
                      );
                    })}
                </View>
                <View style={styles.actionBtn}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('AddPrescribeDetail', {
                        prescribe: prescribe,
                        item: item,
                        edit: true,
                      });
                    }}>
                    {/* <Text style={styles.btnText}>Prescribe</Text> */}
                    <FontAwesome5 name="edit" size={14} color="#ff3" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleDelete(item.id);
                    }}>
                    <MaterialCommunityIcons
                      name="delete"
                      size={16}
                      color="#f00"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }}
        keyExtractor={item => item.id}
        style={{marginVertical: 20}}
      />
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('AddPrescribeDetail', {
            item_detail: prescribe,
          });
        }}
        style={{alignSelf: 'flex-end'}}>
        <LinearGradient
          colors={[
            theme.COLORS.darkBlue_gradient1,
            theme.COLORS.darkBlue_gradient2,
          ]}
          style={styles.bottomButton}>
          <Text style={styles.btnText}>{t('addMedicine')}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default PrescriptionMedicineList;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  flexbox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    width: '40%',
    height: '100%',
    borderRadius: 6,
  },
  madicineContainer: {
    width: '100%',
    flexDirection: 'row',
    marginVertical: 7,
    alignSelf: 'center',
    backgroundColor: '#49537D',
    borderRadius: 10,
    padding: 10,
  },
  textColor: {color: theme.COLORS.white, fontSize: 14, paddingHorizontal: 2},
  detailsBox: {width: '60%', height: '100%', paddingHorizontal: 10},
  textBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 5,
    alignItems: 'center',
  },
  secBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 5,
    alignItems: 'center',
  },
  scheduleBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 3,
    alignItems: 'center',
  },
  scheduleText: {
    fontSize: 12,
    marginHorizontal: 3,
    padding: 2,
    backgroundColor: theme.COLORS.white,
    borderRadius: 4,
    color: theme.COLORS.darkBlue_gradient2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.COLORS.title,
    alignSelf: 'flex-start',
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
  flexboxBtween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionBtn: {
    alignSelf: 'flex-end',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '30%',
  },
});
