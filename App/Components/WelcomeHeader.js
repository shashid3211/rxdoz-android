import React from 'react';
import {useTranslation} from 'react-i18next';
import {View, Text, StyleSheet, Image} from 'react-native';

const WelcomeHeader = ({name}) => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.greetingText}>{t('hello', {name})}</Text>
      <Text style={styles.welcomeText}>
        {/* Welcome to RxDOZ */}
        {t('welcome')}{' '}
        <Image
          source={require('../Assets/medicine.png')}
          style={styles.icon}
          resizeMode="contain"
        />
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: '#f8f8f8', // or whatever background color you prefer
  },
  greetingText: {
    fontSize: 16,
    color: '#757575', // Light gray color
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000', // Black color
  },
  sparkleEmoji: {
    fontSize: 24,
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default WelcomeHeader;
