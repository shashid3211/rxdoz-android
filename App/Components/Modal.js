import {StyleSheet, Modal} from 'react-native';
import React from 'react';

const ModalPanel = ({
  children,
  modalVisible,
  setModalVisible,
  animationType = 'fade',
}) => {
  return (
    <Modal
      animationType={animationType}
      transparent={true}
      style={styles.centeredView}
      visible={modalVisible}
      onRequestClose={() => {
        console.log('Modal has been closed.');
        setModalVisible(!modalVisible);
      }}>
      {children}
    </Modal>
  );
};

export default ModalPanel;

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
