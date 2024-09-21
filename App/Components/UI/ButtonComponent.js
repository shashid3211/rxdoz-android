import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {theme} from '../../Constants/theme';

const ButtonComponent = ({onPress, text}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={[
          theme.COLORS.darkBlue_gradient1,
          theme.COLORS.darkBlue_gradient2,
        ]}
        style={styles.button}
        locations={[0, 0.9]}>
        <Text style={styles.btnText}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default ButtonComponent;

const styles = StyleSheet.create({
  button: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 40,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    width: '70%',
    height: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 8,
  },
  btnText: {color: theme.COLORS.white, fontSize: 18, fontWeight: '800'},
});
