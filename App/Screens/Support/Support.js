import {
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {theme} from '../../Constants/theme';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Support = ({navigation}) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const windowHeight = Dimensions.get('window').height;

  const [appointments, setAppointments] = useState(null);
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const jsonValue1 = await AsyncStorage.getItem('appointments');
      if (jsonValue1 != null) {
        const data1 = JSON.parse(jsonValue1);
        console.log('data1----' + data1);
        setAppointments(data1);
      }
    } catch (e) {
      // error reading value
    }
  };

  const removeItem = async docName => {
    try {
      const posts = await AsyncStorage.getItem('appointments');
      let postsFav = JSON.parse(posts);
      const postsItems = postsFav.filter(function (e) {
        return e.doc_name !== docName;
      });

      // updating 'posts' with the updated 'postsItems'
      await AsyncStorage.setItem('appointments', JSON.stringify(postsItems));
      navigation.replace('MainTab');
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const my_appointments = [
    {
      id: 1,
      docName: 'Dr. Shetty',
      hospName: 'Children Hospital',
      startAt: 'Apr 24, 2024',
      endAt: 'Apr 29, 2024',
    },
    {
      id: 2,
      docName: 'Dr. Kore',
      hospName: 'KLE Hospital',
      startAt: 'Apr 20, 2024',
      endAt: 'Apr 25, 2024',
    },
    {
      id: 3,
      docName: 'Dr. Athani',
      hospName: 'Shah Hospital',
      startAt: 'May 2, 2024',
      endAt: 'May 5, 2024',
    },
    {
      id: 4,
      docName: 'Dr. Shetti',
      hospName: 'Shetti Hospital',
      startAt: 'May 12, 2024',
      endAt: 'May 25, 2024',
    },
    {
      id: 5,
      docName: 'Dr. Neelam',
      hospName: 'Sanjivani Hospital',
      startAt: 'May 21, 2024',
      endAt: 'May 25, 2024',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {appointments != null && appointments.length > 0 ? (
        <View style={styles.mainView}>
          <Animated.FlatList
            showsVerticalScrollIndicator={false}
            data={appointments}
            ListHeaderComponent={() => {
              return <Text style={styles.title}>My Appointments</Text>;
            }}
            renderItem={({item}) => {
              return (
                <View
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
                    <Text style={styles.title1}>{item.doc_name}</Text>
                    <Text style={{color: theme.COLORS.voilet_light1}}>
                      scheduled at{' '}
                      {new Date(item.time).toLocaleString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
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
                        {item.note}
                      </Text>
                    </View>
                  </View>
                  <View style={{width: '40%', alignItems: 'flex-end'}}>
                    <Text
                      style={{
                        backgroundColor: theme.COLORS.voilet,
                        padding: 5,
                        borderRadius: 4,
                        fontSize: 12,
                        color: theme.COLORS.white,
                      }}>
                      Next Visit
                    </Text>
                    <Text
                      style={{
                        color: theme.COLORS.darkBlue_gradient2,
                        fontWeight: 'bold',
                      }}>
                      {new Date(item.date).toDateString()}
                    </Text>
                    <Text></Text>
                    <LinearGradient
                      colors={['#FF6F6F', '#AE0000']}
                      style={{
                        borderRadius: 100,
                        alignItems: 'center',
                      }}
                      locations={[0, 0.9]}>
                      <TouchableOpacity
                        onPress={() => {
                          removeItem(item.doc_name);
                        }}>
                        <Text
                          style={{
                            fontSize: 12,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            color: theme.COLORS.white,
                          }}>
                          Remove{'  '}
                          <MaterialCommunityIcons
                            name="close-circle-outline"
                            color={theme.COLORS.white}
                            size={15}
                          />
                        </Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                </View>
              );
            }}
            keyExtractor={item => item.id}
            style={{marginVertical: 20}}></Animated.FlatList>

          <TouchableOpacity
            onPress={() => {
              setIsBottomSheetOpen(true);
            }}>
            <LinearGradient
              colors={[
                theme.COLORS.darkBlue_gradient1,
                theme.COLORS.darkBlue_gradient2,
              ]}
              style={styles.bottomButton}
              locations={[0, 0.9]}>
              <Text style={styles.btnText}>Add</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.mainView}>
          <Image
            source={require('../../Assets/doctor.png')}
            resizeMode="contain"
            style={{width: '20%', height: '20%'}}
          />
          <Text style={styles.heading}>GET STARTED!</Text>
          <Text style={styles.subtext}>
            Add your healthcare professionals and keep track of your
            appointments.
          </Text>
          <TouchableOpacity onPress={() => setIsBottomSheetOpen(true)}>
            <LinearGradient
              colors={[
                theme.COLORS.darkBlue_gradient1,
                theme.COLORS.darkBlue_gradient2,
              ]}
              style={styles.button}
              locations={[0, 0.9]}>
              <Text style={styles.btnText}>START NOW</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
      {/*--------- Modal -----------*/}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isBottomSheetOpen}
        onRequestClose={() => setIsBottomSheetOpen(false)}>
        <View style={styles.centeredView}>
          <View
            style={[
              styles.bottomSheet,
              {
                height: windowHeight * 0.3,
              },
            ]}>
            <Text
              style={styles.btnText1}
              onPress={() => {
                navigation.navigate('AddAppointment');
                setIsBottomSheetOpen(false);
              }}>
              Add Appointment
            </Text>
            {/* <Text
              style={styles.btnText1}
              onPress={() => {
                navigation.navigate('AddProfessional');
                setIsBottomSheetOpen(false);
              }}>
              Add healthcare professional
            </Text> */}
          </View>
        </View>
      </Modal>
      {/*--------- Modal end -----------*/}
    </SafeAreaView>
  );
};

export default Support;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  mainView: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal: 25,
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
    width: '30%',
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
  btnText: {color: theme.COLORS.white, fontSize: 16, fontWeight: '600'},
  heading: {
    color: theme.COLORS.darkBlue_gradient2,
    fontWeight: '600',
    marginVertical: 20,
    fontSize: 18,
    textAlign: 'center',
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
  subtext: {
    color: theme.COLORS.darkBlue_gradient1,
    fontWeight: '400',
    marginVertical: 5,
    fontSize: 14,
    textAlign: 'center',
  },
  btnText1: {
    color: theme.COLORS.darkBlue_gradient2,
    paddingVertical: 10,
    fontSize: 16,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'flex-start',
    backgroundColor: theme.COLORS.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 23,
    paddingHorizontal: 25,
    bottom: 0,
    borderColor: theme.COLORS.black,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 8,
  },
  centeredView: {
    flex: 1,
    marginTop: 22,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
});
