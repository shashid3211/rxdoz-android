import {StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';

const ImagePickerRound = ({onPress, image}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: '30%',
        height: '20%',
        alignSelf: 'center',
      }}>
      <Image
        source={
          image
            ? {uri: `file://${image}`}
            : require('../../Assets/profile_e.jpg')
        }
        resizeMode="contain"
        style={{width: '100%', height: '100%'}}
      />
    </TouchableOpacity>
  );
};

export default ImagePickerRound;

const styles = StyleSheet.create({});
