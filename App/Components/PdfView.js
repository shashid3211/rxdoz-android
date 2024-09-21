import React, {useRef} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  Text,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Pdf from 'react-native-pdf';
import {theme} from '../Constants/theme';
import {useTranslation} from 'react-i18next';

const PdfView = ({setModalVisible, pdfPath}) => {
  const {t} = useTranslation();
  const pdfref = useRef(null);
  console.log(pdfPath);

  return (
    <View style={styles.centeredView}>
      <TouchableOpacity
        onPress={() => setModalVisible(false)}
        style={{alignSelf: 'flex-end'}}>
        <MaterialCommunityIcons
          name="close"
          size={25}
          color={theme.COLORS.black}
        />
      </TouchableOpacity>
      <View style={styles.pdfContainer}>
        <Text>{t('PDF View')}</Text>
        <Pdf
          ref={pdfref}
          source={{uri: pdfPath}}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(
              `Number of pages: ${numberOfPages}, filePath: ${filePath}`,
            );
          }}
          style={styles.pdf}
          onError={error => {
            console.error('Failed to load PDF:', error);
          }}
        />
      </View>
    </View>
  );
};

export default PdfView;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  pdfContainer: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
