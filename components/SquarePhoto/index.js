import React from 'react'
import PropTypes from 'prop-types'
import { View, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { withNavigation } from 'react-navigation'
import FitImage from 'react-native-fit-image'

const { width, height } = Dimensions.get('window')

const SquarePhoto = props => (
  <TouchableOpacity onPress={() => props.navigation.navigate('Photo')}>
    <FitImage source={{ uri: props.imageURL }} style={styles.image} />
  </TouchableOpacity>
)

SquarePhoto.propTypes = {
  imageURL: PropTypes.string.isRequired
}

const styles = StyleSheet.create({
  image: {
    height: width / 3 - 4,
    width: width / 3 - 4
  }
})

export default withNavigation(SquarePhoto)
