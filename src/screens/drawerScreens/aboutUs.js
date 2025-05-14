import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import {useWindowDimensions} from 'react-native';
import {useAppContext} from '../../services/state/context';
import { useColorContext } from '../../services/state/colorsContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
const AboutUs = () => {
  const {state} = useAppContext();
  const { colors } = useColorContext();
  const {pages} = state;
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const aboutUsPage = pages.find(page => page.page_slug === 'about-us');
  if (!aboutUsPage) {
    return (
      <View style={[styles.container,{backgroundColor:colors.dull}]}>
        <Text style={[styles.errorText, {color: colors.red}]}>About Us page not found.</Text>
      </View>
    );
  }
  return (
    <View style={[styles.main,{backgroundColor: colors.theme}]}>
      <SafeAreaView style={[styles.safeArea,{backgroundColor: colors.theme}]}>
        <View style={[styles.header, {backgroundColor:colors.dull}]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../../assets/images/back.png')}
              style={styles.backButton}
              tintColor={colors.white}
            />
          </TouchableOpacity>
          <Text style={[styles.title,{color: colors.white}]}>{aboutUsPage.page_title}</Text>
        </View>
        <ScrollView style={[styles.container,{backgroundColor:colors.dull}]}>
          <View style={{padding: 20}}>
            <RenderHTML
              contentWidth={width}
              source={{
                html: aboutUsPage.page_description.replace(/<br\s*\/?>/g, ''),
              }}
              tagsStyles={{
                body: {color: colors.white, margin: 0, padding: 0,},

                blockquote: {marginVertical: 7, paddingVertical: 0},
                h2: {
                  fontSize: 22,
                  fontFamily: 'Open Sans',
                  fontWeight: 'bold',
                  marginBottom: 8,
                  marginTop: 8,
                  color: colors.white,
                },
                h3: {
                  fontSize: 22,
                  fontFamily: 'Open Sans',
                  fontWeight: 'bold',
                  marginBottom: 8,
                  marginTop: 8,
                  color: colors.white,
                },
                strong: {color:colors.white},
                p: { fontSize: 16, fontFamily: 'Open Sans', margin: 0, padding: 0, color: colors.white },
                ul: {listStyleType: 'none'},
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default AboutUs;

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