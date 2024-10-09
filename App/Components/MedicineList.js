import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Animated from 'react-native-reanimated';
import {Divider} from 'react-native-paper';
import {theme} from '../Constants/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createPDF} from '../utils/helper';
import {useTranslation} from 'react-i18next';
import {formatTime} from '../utils/helper';

const MedicineList = ({
  personDosage,
  navigation,
  setPdfPath,
  setModalVisible,
  header,
  link = true,
}) => {
  const {t} = useTranslation();
  const handlePdf = item => {
    createPDF(item).then(path => {
      setPdfPath(path);
      setModalVisible(true);
    });
  };
  return (
    <Animated.FlatList
      showsVerticalScrollIndicator={false}
      data={personDosage}
      keyExtractor={item => item.schedule_time}
      ListHeaderComponent={() => {
        return <Text style={styles.title}>{header}</Text>;
      }}
      renderItem={({item}) => {
        return (
          <TouchableOpacity
            onPress={() => {
              link && navigation.navigate('ViewDosage', {item: item});
            }}
            style={{
              width: '100%',
              flexDirection: 'row',
              // height: 200,
              marginVertical: 10,
              alignSelf: 'center',
              backgroundColor: '#49537D',
              borderRadius: 10,
              padding: 15,
            }}>
            {item && item.photo ? (
              <Image
                source={{uri: `file://${item.photo}`}}
                style={{
                  width: '40%',
                  height: '100%',
                  borderRadius: 6,
                }}
                resizeMode="cover"
              />
            ) : item.type === 'TAB' ? (
              <Image
                source={require('../Assets/tab.png')}
                style={{
                  width: '40%',
                  height: '100%',
                  borderRadius: 6,
                }}
                resizeMode="cover"
              />
            ) : item.type === 'CAP' ? (
              <Image
                source={require('../Assets/cap.png')}
                style={{
                  width: '40%',
                  height: '100%',
                  borderRadius: 6,
                }}
                resizeMode="cover"
              />
            ) : item.type === 'Drops' ? (
              <Image
                source={require('../Assets/drops.png')}
                style={{
                  width: '40%',
                  height: '100%',
                  borderRadius: 6,
                }}
                resizeMode="cover"
              />
            ) : item.type === 'Syrup' ? (
              <Image
                source={require('../Assets/syrup.png')}
                style={{
                  width: '40%',
                  height: '100%',
                  borderRadius: 6,
                }}
                resizeMode="cover"
              />
            ) : item.type === 'Liquid' ? (
              <Image
                source={require('../Assets/liquid.jpg')}
                style={{
                  width: '40%',
                  height: '100%',
                  borderRadius: 6,
                }}
                resizeMode="cover"
              />
            ) : item.type === 'Injection' ? (
              <Image
                source={require('../Assets/injection.png')}
                style={{
                  width: '40%',
                  height: '100%',
                  borderRadius: 6,
                }}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={require('../Assets//spray.png')}
                style={{
                  width: '40%',
                  height: '100%',
                  borderRadius: 6,
                }}
                resizeMode="cover"
              />
            )}
            <View
              style={{
                width: '60%',
                height: '100%',
                paddingHorizontal: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  paddingVertical: 5,
                  alignItems: 'center',
                }}>
                <Text style={{...styles.textColor, fontSize: 12}}>
                  {t('yourNextDoseAt')}
                </Text>
                <Text
                  style={{
                    ...styles.textColor,
                    fontSize: 12,
                    marginHorizontal: 6,
                    padding: 5,
                    backgroundColor: theme.COLORS.white,
                    borderRadius: 4,
                    color: theme.COLORS.darkBlue_gradient2,
                  }}>
                  {/* {new Date(item.schedule_time)} */}
                  {formatTime(item.schedule_time)}
                </Text>
              </View>
              <Divider style={{backgroundColor: 'white'}} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  paddingVertical: 5,
                  alignItems: 'center',
                }}>
                <MaterialCommunityIcons
                  name="pill"
                  color={theme.COLORS.white}
                  size={20}
                />
                <Text
                  style={{
                    ...styles.textColor,
                    fontSize: 12,
                    paddingHorizontal: 5,
                  }}>
                  {item.name}
                </Text>
              </View>
              <Divider style={{backgroundColor: 'white'}} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  paddingVertical: 5,
                  alignItems: 'center',
                }}>
                <MaterialCommunityIcons
                  name="alarm"
                  color={theme.COLORS.white}
                  size={20}
                />
                <Text
                  style={{
                    ...styles.textColor,
                    fontSize: 12,
                    paddingHorizontal: 5,
                  }}>
                  {item.consumption}
                </Text>
              </View>
              <Divider style={{backgroundColor: 'white'}} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  paddingVertical: 5,
                  alignItems: 'center',
                }}>
                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  color={theme.COLORS.white}
                  size={20}
                />
                <Text
                  style={{
                    ...styles.textColor,
                    fontSize: 12,
                    paddingHorizontal: 5,
                  }}>
                  {new Date(item.from_date).toDateString() +
                    ' - ' +
                    new Date(item.to_date).toDateString()}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  paddingVertical: 5,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    handlePdf(item);
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 100,
                      backgroundColor: 'white',
                      color: theme.COLORS.darkBlue_gradient2,
                      marginRight: 10,
                    }}>
                    <Feather
                      name="download"
                      color={theme.COLORS.darkBlue_gradient2}
                      size={15}
                      style={{padding: 5}}
                    />
                    {'   '}
                    {t('report')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        );
      }}
      // keyExtractor={item => item.id}
      style={{marginVertical: 20}}
    />
  );
};

export default MedicineList;

const styles = StyleSheet.create({
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
});
