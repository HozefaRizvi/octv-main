import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useAppContext} from '../../services/state/context';
import RenderHTML from 'react-native-render-html';
import {useWindowDimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { useColorContext } from '../../services/state/colorsContext';
const PrivacyPolicy = () => {
  const {state} = useAppContext();
  const {pages} = state;
  const { colors } = useColorContext();
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const aboutUsPage = pages.find(page => page.page_slug === 'privacy-policy');
  if (!aboutUsPage) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Privacy Policy page not found.</Text>
      </View>
    );
  }
  //console.log('Privacy Policy:',aboutUsPage?.page_description)
  return (
    <View style={[styles.main,{backgroundColor: colors.dull,}]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../../assets/images/back.png')}
              style={styles.backButton}
              tintColor={colors.white}
            />
          </TouchableOpacity>
          <Text style={[styles.title,{color: colors.white,}]}>{aboutUsPage.page_title}</Text>
        </View>
        <ScrollView style={styles.container}>
          <View style={{padding: 20}}>
            <RenderHTML
              contentWidth={width}
              source={{html: aboutUsPage.page_description.replace(/<br\s*\/?>/g, ''),}}
              tagsStyles={{
                body: {
                  color: colors.white,
                  textAlign: 'justify',
                  
                },
                p: { fontSize: 16, fontFamily: 'Open Sans',  color: colors.white },
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeArea: {
    padding: '8%',
  },
  container: {
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    marginLeft: 120,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    width: 10,
    height: 17,
  },
});