import {StyleSheet, Text, View, Image} from 'react-native';
import {Divider} from 'react-native-paper';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {theme} from '../Constants/theme';
import {useTranslation} from 'react-i18next';

const UserProfile = ({personSchedule}) => {
  const {t} = useTranslation();
  return (
    <View style={{marginVertical: 20, marginBottom: 360}}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          marginVertical: 10,
          alignSelf: 'center',
          backgroundColor: '#49537D',
          borderRadius: 10,
          padding: 15,
        }}>
        <Image
          source={
            personSchedule && personSchedule.photo
              ? {uri: `file://${personSchedule.photo}`}
              : require('../Assets/profile.jpg')
          }
          style={{
            width: '40%',
            height: '100%',
            borderRadius: 6,
          }}
          resizeMode="cover"></Image>
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
              {t('hello', {name: personSchedule.name})}
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
              {t('wakeUpTime')} -{' '}
              {new Date(personSchedule.wake_up_time).toLocaleString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
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
              {t('lunchTime')} -{' '}
              {new Date(personSchedule.lunch_time).toLocaleString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
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
              {t('dinnerTime')} -{' '}
              {new Date(personSchedule.dinner_time).toLocaleString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
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
              name="alarm" //"calendar-month-outline"
              color={theme.COLORS.white}
              size={20}
            />
            <Text
              style={{
                ...styles.textColor,
                fontSize: 12,
                paddingHorizontal: 5,
              }}>
              {t('bedTime')} -{' '}
              {new Date(personSchedule.sleep_time).toLocaleString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  textColor: {color: theme.COLORS.white, marginVertical: 3},
});
