import React, {useState} from 'react';
import {View, TouchableOpacity, TextInput} from 'react-native';
import {theme} from '../Constants/theme';
import styles from './path/to/styles';

const ScheduleTime = ({frequency}) => {
  const [selectTimes, setSelectTimes] = useState(
    Array(frequency).fill(new Date()),
  );

  const handleTimeChange = (index, time) => {
    const newSelectTimes = [...selectTimes];
    newSelectTimes[index] = time;
    setSelectTimes(newSelectTimes);
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {Array.from({length: frequency}).map((_, index) => (
        <TouchableOpacity
          key={index}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48%',
            marginVertical: 5, // Add some vertical spacing between inputs
          }}
          onPress={() => setOpenCalender3(true)} // Adjust this logic as per your calendar opening logic
        >
          <TextInput
            mode="outlined"
            value={selectTimes[index].toLocaleString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
            label={`Schedule ${index + 1}`}
            outlineColor={theme.COLORS.darkBlue_gradient1}
            outlineStyle={{borderRadius: 100}}
            activeOutlineColor={theme.COLORS.darkBlue_gradient2}
            textColor={theme.COLORS.darkBlue_gradient2}
            style={{...styles.input}}
            showSoftInputOnFocus={false}
            editable={false}
            onChangeText={t => handleTimeChange(index, t)}
            right={
              <TextInput.Icon
                icon="clock-edit"
                color={theme.COLORS.darkBlue_gradient1}
              />
            }
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ScheduleTime;
