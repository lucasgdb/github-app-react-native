import React, { memo } from 'react';
import { Text, Image } from 'react-native';
import styles from './styles';

export default memo(({ bio, icons }) =>
  bio
    .split(' ')
    .filter(text => text !== '')
    .map((text, index) => ({ text, id: index }))
    .map((element, elementIndex, array) =>
      element.text[0] === ':' &&
      element.text[element.text.length - 1] === ':' &&
      icons[element.text.replace(/[:]/g, '')] ? (
        <Text key={element.id}>
          <Image
            style={styles.image}
            source={{ uri: icons[element.text.replace(/[:]/g, '')] }}
          />
          {array.length - 1 === elementIndex ? '' : ' '}
        </Text>
      ) : (
        `${element.text}${array.length - 1 === elementIndex ? '' : ' '}`
      ),
    ),
);
