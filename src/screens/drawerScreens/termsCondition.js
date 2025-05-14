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
const TermsCondition = () => {
  const {state} = useAppContext();
  const {pages} = state;
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const { colors } = useColorContext();
  const aboutUsPage = pages?.find(page => page?.page_slug === 'terms-of-service');
  if (!aboutUsPage) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Terms of Service page not found.</Text>
      </View>
    );
  }
  const cleanedHTML = aboutUsPage.page_description.replace(/<br\s*\/?>/g, '');
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
          <Text style={[styles.title,{ color: colors.white,}]}>{aboutUsPage.page_title}</Text>
        </View>
        <ScrollView style={styles.container}>
          <View style={{padding: 20}}>
            <RenderHTML
              contentWidth={width}
              source={{html: cleanedHTML}}
              tagsStyles={{
                body: {
                  color: colors.white,
                  fontSize: 16,
                  lineHeight: 22,
                  textAlign: 'justify',
                  paddingHorizontal: 10,
                },
                p: {
                  color:colors.white
                },
                h1: {
                  fontSize: 24,
                  fontWeight: 'bold',
                  marginBottom: 10,
                    color:colors.white
                },
                h2: {
                  fontSize: 22,
                  fontWeight: 'bold',
                  marginBottom: 8,
                    color:colors.white
                },
                h3: {
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginBottom: 6,
                    color:colors.white
                },
                ul: {
                  marginVertical: 8,
                  paddingLeft: 20,
                    color:colors.white
                },
                li: {
                  marginBottom: 5,
                    color:colors.white
                },
                a: {
                  color: 'blue',
                  textDecorationLine: 'underline',
                    color:colors.white
                },
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default TermsCondition;

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