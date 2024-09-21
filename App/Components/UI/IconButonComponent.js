import {StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';

const IconButonComponent = ({onPress, image, text}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.imgSmall}>
      <Image source={image} style={styles.imgSmall} resizeMode="contain" />
      <Text>{text}</Text>
    </TouchableOpacity>
  );
};

export default IconButonComponent;

const styles = StyleSheet.create({
  imgSmall: {
    width: '50%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
