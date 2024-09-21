import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';
import {theme} from '../Constants/theme';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import ButtonComponent from './UI/ButtonComponent';
import {useTranslation} from 'react-i18next';

const PrescriptionList = ({prescription, navigation, removeItem}) => {
  const {t} = useTranslation();
  return (
    <View style={styles.mainView}>
      <Animated.FlatList
        showsVerticalScrollIndicator={false}
        data={prescription}
        ListHeaderComponent={() => {
          return <Text style={styles.title}>{t('myPrescriptions')}</Text>;
        }}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ViewMedicines', {item: item});
              }}
              style={{
                width: '100%',
                // height: 120,
                backgroundColor: theme.COLORS.voilet_light,
                borderRadius: 10,
                marginVertical: 10,
                padding: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{width: '60%', alignItems: 'flex-start'}}>
                <Text style={styles.title1}>
                  {t('dr')} {item.doctor_name}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: 5,
                  }}>
                  <FontAwesome5
                    name="hospital"
                    size={18}
                    color={theme.COLORS.voilet}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: theme.COLORS.voilet,
                      marginLeft: 10,
                    }}>
                    {item.hospital_name}
                  </Text>
                </View>
              </View>
              <View style={{width: '40%', alignItems: 'flex-end'}}>
                <Text></Text>
                <View style={{flexDirection: 'row'}}>
                  <LinearGradient
                    colors={['#F7CB7C', '#ee9f0f']}
                    style={{
                      borderRadius: 100,
                      alignItems: 'center',
                      padding: 5,
                    }}
                    locations={[0, 0.9]}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('AddPrescription', {
                          item_detail: item,
                        });
                      }}>
                      <MaterialCommunityIcons
                        name="circle-edit-outline"
                        color={theme.COLORS.white}
                        size={20}
                      />
                    </TouchableOpacity>
                  </LinearGradient>
                  <LinearGradient
                    colors={['#FF6F6F', '#AE0000']}
                    style={{
                      borderRadius: 100,
                      alignItems: 'center',
                      padding: 5,
                      marginLeft: 10,
                    }}
                    locations={[0, 0.9]}>
                    <TouchableOpacity onPress={() => removeItem(item.id)}>
                      <MaterialCommunityIcons
                        name="close-circle-outline"
                        color={theme.COLORS.white}
                        size={20}
                      />
                      {/* </Text> */}
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={item => item.id}
        style={{marginVertical: 20}}
      />

      <ButtonComponent
        onPress={() => navigation.navigate('AddPrescription')}
        text="ADD PRESCRIPTION"
      />
    </View>
  );
};

export default PrescriptionList;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.COLORS.title,
    alignSelf: 'flex-start',
  },
  title1: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.COLORS.voilet,
  },
});
