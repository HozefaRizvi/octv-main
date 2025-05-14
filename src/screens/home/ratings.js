import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import {Rating} from 'react-native-ratings';
import { useColorContext } from '../../services/state/colorsContext';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

export const UserRating = ({
  initialRating = 0,
  ratingType = 'stars',
  isReadOnly = true,
  setRatingCount,
  ifUSerDown = false,
}) => {
  const [rating, setRating] = useState(initialRating);

  const handleRating = newRating => {
    if (!isReadOnly) {
      setRating(newRating);
      setRatingCount && setRatingCount(newRating);
    }
  };

   const { colors } = useColorContext();
  return (
    <View style={{flexDirection: 'row'}}>
     {ifUSerDown ? (
      <>
      {Array.from({length: initialRating}).map((_, index) => (
        <TouchableOpacity
          key={index}
          //onPress={() => handleRating(index)}
          disabled={ifUSerDown} style={{marginLeft:5}}>
          <FontAwesomeIcon
            name={
              rating >= index
                ? ratingType === 'stars'
                  ? 'star'
                  : 'heart'
                : ratingType === 'stars'
                ? 'star-o'
                : 'heart-o'
            }
            color={colors.theme}
            size={30}
          />
        </TouchableOpacity>
      ))}
      </>
     ):(<>
      {[1, 2, 3, 4, 5].map(num => (
        <TouchableOpacity
          key={num}
          onPress={() => handleRating(num)}
          disabled={isReadOnly} style={{marginLeft:5}}>
          <FontAwesomeIcon
            name={
              rating >= num
                ? ratingType === 'stars'
                  ? 'star'
                  : 'heart'
                : ratingType === 'stars'
                ? 'star-o'
                : 'heart-o'
            }
            color={colors.theme}
            size={30}
          />
        </TouchableOpacity>
      ))}
     </>)}
    </View>
  );
};

export const ThumbsRating = ({
  initialRating = 5,
  isReadOnly = false,
  setRatingCount,
  ifUSerDown = false,
}) => {
  const [rating, setRating] = useState(initialRating);
  const { colors } = useColorContext();
  const handleRating = newRating => {
    console.log('new Rating', newRating);
    setRating(newRating);
    setRatingCount(newRating);
  };

  if (isReadOnly) {
    return (
      <View style={styles.ThumbBtns}>
        <FontAwesomeIcon
          name={rating < 3 ? 'thumbs-down' : 'thumbs-up'}
          color={colors.theme}
          size={30}
        />
      </View>
    );
  } else {
    return (
      <View style={styles.thumbsContainer}>
        {ifUSerDown ? (
          <>
            {Array.from({length: initialRating}).map((_, index) => (
              <TouchableOpacity
                key={index}
                style={styles.ThumbBtns}
                disabled={ifUSerDown}
                activeOpacity={0.7}>
                <FontAwesomeIcon
                  name={initialRating < 3 ? 'thumbs-down' : 'thumbs-up'}
                  color={colors.theme} // Highlights all previous ratings
                  size={30}
                />
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            {[1, 2, 3, 4, 5].map(num => (
              <TouchableOpacity
                key={num}
                style={styles.ThumbBtns}
                disabled={ifUSerDown}
                activeOpacity={0.7}
                onPress={() =>
                  ifUSerDown ? console.log('hi') : handleRating(num)
                }>
                <FontAwesomeIcon
                  name={rating < 3 && num <= 2 ? 'thumbs-down' : 'thumbs-up'}
                  color={num <= rating ? colors.theme : colors.white} // Highlights all previous ratings
                  size={30}
                />
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>
    );
  }
};
const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    marginVertical: 5,
    marginLeft: 5,
  },
  //Thumbs Rating Styles
  thumbsContainer: {
    flexDirection: 'row',
  },
  ThumbBtns: {
    marginVertical: 10,
    marginHorizontal: 5,
  },
});
