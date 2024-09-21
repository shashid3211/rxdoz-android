import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {TextInput} from 'react-native-paper';
import React from 'react';
import {theme} from '../../Constants/theme';
import {useTranslation} from 'react-i18next';

const TextInputComponent = ({
  value,
  error,
  label,
  onChangeText,
  reset,
  img,
}) => {
  const {t} = useTranslation();
  const pic = img || require('../../Assets/profile.jpg');
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image
        source={pic}
        resizeMode="contain"
        style={{
          width: '15%',
          height: '75%',
          marginHorizontal: 15,
          marginTop: 10,
        }}
      />

      <TextInput
        mode="outlined"
        value={value}
        error={error}
        label={label}
        outlineColor={theme.COLORS.darkBlue_gradient2}
        activeOutlineColor={theme.COLORS.darkBlue_gradient2}
        outlineStyle={{borderRadius: 100}}
        textColor={theme.COLORS.darkBlue_gradient1}
        style={{...styles.input, width: '70%'}}
        onChangeText={onChangeText}
      />
      <TouchableOpacity
        style={{padding: 10, marginTop: 10}}
        onPress={() => reset(null)}>
        <Text style={styles.btnText1}>{t('reset')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TextInputComponent;

const styles = StyleSheet.create({
  input: {
    width: '100%',
    marginTop: 10,
    backgroundColor: theme.COLORS.white,
  },
  btnText1: {
    color: theme.COLORS.darkBlue_gradient2,
    textDecorationLine: 'underline',
  },
});
