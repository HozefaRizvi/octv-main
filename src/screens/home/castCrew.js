import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useColorContext } from '../../services/state/colorsContext';
import {useNavigation} from '@react-navigation/native';
export const CastCrewChild = ({
  infoText,
  sectionTitle,
  expandable = true,
  type = '',
}) => {
  const navigation = useNavigation();
  const [expanded, setExpanded] = useState(false);
  const {colors} = useColorContext();
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  if (!infoText) {
    return null;
  }
  const handlePerson = item => {
    if (type === 'cast') {
      navigation.navigate('PersonDetail', {id: item});
    } else if (type === 'language') {
      navigation.navigate('Language', {id: item});
    } else if (type === 'advisory') {
      navigation.navigate('Advisory', {id: item});
    } else if (type === 'tags') {
      navigation.navigate('Tags', {id: item});
    } else if (type === 'genre') {
      navigation.navigate('Genre', {id: item});
    }
  };
  return (
    <View>
      {infoText?.length > 0 &&
        (expandable ? (
          <View>
            <TouchableOpacity
              onPress={toggleExpanded}
              style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle,{ color: colors.theme,}]}>{sectionTitle}</Text>
              <Feather
                name={expanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.theme}
              />
            </TouchableOpacity>
            {expanded && (
              <View style={styles.row}>
                {infoText.map((item, index) => (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    key={item.code}
                    onPress={() => handlePerson(item.code)}>
                    <Text style={[styles.infoText,{color: colors.white,}]}>
                      {item.name || item.title}
                      {', '}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ) : (
          <View>
            <Text style={[styles.sectionTitle,{ color: colors.theme,}]}>{sectionTitle}</Text>
            <View style={styles.row}>
              {infoText.map((item, index) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  key={item.code}
                  onPress={() => handlePerson(item.code)}>
                  <Text style={[styles.infoText,{color: colors.white,}]}>
                    {item.name || item.title}
                    {infoText.length > index + 1 && ', '}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
    </View>
  );
};
const CastCrew = ({movie}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => {
            setExpanded(!expanded);
          }}>
          <Text style={[styles.Overview,{color: colors.theme,}]}>Cast/ Crew</Text>
          <Feather
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.theme}
          />
        </TouchableOpacity>
        {expanded && (
          <View>
            <CastCrewChild
              expandable={false}
              sectionTitle={'Cast:'}
              infoText={movie?.cast}
              type={'cast'}
            />
            <CastCrewChild
              expandable={false}
              sectionTitle={'Writer:'}
              infoText={movie?.writers}
              type={'cast'}
            />
            <CastCrewChild
              expandable={false}
              sectionTitle={'Directors:'}
              infoText={movie?.directors}
              type={'cast'}
            />
            <CastCrewChild
              expandable={false}
              sectionTitle={'Producer:'}
              infoText={movie?.producers}
              type={'cast'}
            />
          </View>
        )}
      </View>
      <CastCrewChild
        sectionTitle={'Language:'}
        infoText={movie?.languages}
        type={'language'}
      />
      <CastCrewChild
        sectionTitle={'Advisory:'}
        infoText={movie?.advisories}
        type={'advisory'}
      />
      <CastCrewChild
        sectionTitle={'Genre:'}
        infoText={movie?.genre}
        type={'genre'}
      />
      <CastCrewChild
        sectionTitle={'Tags:'}
        infoText={movie?.tags}
        type={'tags'}
      />
    </View>
  );
};

export default CastCrew;

const styles = StyleSheet.create({
  container: {
    marginTop: '10%',
  },
  sectionHeader: {
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  Overview: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',

    marginLeft: 30,
  },
  sectionTitle: {
    fontSize: 14,
    lineHeight: 22,
   
    fontWeight: '700',
    marginTop: 5,
    marginLeft: 30,
  },
  infoText: {
    fontSize: 12,
    
    marginTop: 5,
  },
  row: {
    marginLeft: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
