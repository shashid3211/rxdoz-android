import LottieView from 'lottie-react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';

const LoadingModalComponent = ({visible, onClose, text = '', page = false}) => {
  const {t} = useTranslation();
  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={styles.iconContainer}>
            {/* Replace with your actual icon */}

            <LottieView
              source={require('../../Assets/loading.json')} // Path to your JSON file
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
          </View>
          <Text style={styles.message}>Loading...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#f0f0ff',
    borderRadius: 10,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  icon: {
    fontSize: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  button: {
    backgroundColor: '#b399f9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  lottieAnimation: {
    width: 100, // Adjust size according to your need
    height: 100,
  },
});

export default LoadingModalComponent;
