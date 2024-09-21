import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {theme} from '../../Constants/theme';

const DropdownComponent = ({data, value, onChange, placeholder, full}) => {
  return (
    <Dropdown
      style={[styles.dropdown, full]}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      iconStyle={styles.iconStyle}
      containerStyle={styles.dropdown_cont}
      itemTextStyle={{color: theme.COLORS.darkBlue_gradient2}}
      data={data}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
    // </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    marginVertical: 20,
    backgroundColor: theme.COLORS.white,
    width: '30%',
    borderWidth: 1,
    borderRadius: 100,
    borderColor: theme.COLORS.darkBlue_gradient1,
    height: 50,
    paddingHorizontal: 10,
  },
  selectedTextStyle: {
    fontSize: 14,
    color: theme.COLORS.darkBlue_gradient2,
  },
  placeholderStyle: {fontSize: 12, color: theme.COLORS.darkBlue_gradient1},
  iconStyle: {tintColor: theme.COLORS.darkBlue_gradient2},
  dropdown_cont: {
    color: theme.COLORS.darkBlue_gradient2,
    borderRadius: 5,
  },
});
