import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  CameraRoll,
  StatusBar
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Camera, Permissions } from 'expo'
import FitImage from 'react-native-fit-image'

class CameraScreen extends Component {
  state = {
    hasCameraPermissions: null,
    type: Camera.Constants.Type.back,
    flash: Camera.Constants.FlashMode.off,
    pictureTaken: false,
    picture: null
  }

  componentWillMount = async () => {
    const camera = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({
      hasCameraPermissions: camera.status === 'granted'
    })
  }

  render() {
    const { hasCameraPermissions, type, flash, pictureTaken, picture } = this.state
    if (hasCameraPermissions === null) {
      return <View />
    } else if (hasCameraPermissions === false) {
      return <Text>No Access to Camera, check your settings</Text>
    } else {
      return (
        <View style={styles.container}>
          <StatusBar hidden={true} />
          {pictureTaken ? (
            <View style={{ flex: 2 }}>
              <FitImage source={{ uri: picture }} style={{ flex: 1 }} />
            </View>
          ) : (
            <Camera
              type={type}
              flashMode={flash}
              ref={camera => (this.camera = camera)}
              style={styles.camera}
            >
              <TouchableOpacity onPress={this._changeType}>
                <View style={styles.action}>
                  <MaterialIcons
                    name={type === Camera.Constants.Type.back ? 'camera-front' : 'camera-rear'}
                    color="white"
                    size={40}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this._changeFlash}>
                <View style={styles.action}>
                  {flash === Camera.Constants.FlashMode.off && (
                    <MaterialIcons name={'flash-off'} color="white" size={40} />
                  )}
                  {flash === Camera.Constants.FlashMode.on && (
                    <MaterialIcons name={'flash-on'} color="white" size={40} />
                  )}
                  {flash === Camera.Constants.FlashMode.auto && (
                    <MaterialIcons name={'flash-auto'} color="white" size={40} />
                  )}
                </View>
              </TouchableOpacity>
            </Camera>
          )}
          <View style={styles.btnContainer}>
            {pictureTaken ? (
              <View style={styles.photoActions}>
                <TouchableOpacity onPress={this._rejectPhoto}>
                  <MaterialIcons name={'cancel'} size={60} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={this._approvePhoto}>
                  <MaterialIcons name={'check-circle'} size={60} color="black" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={this._takePhoto}>
                <View style={styles.btn} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )
    }
  }
  _changeType = () => {
    this.setState(prevState => {
      if (prevState.type === Camera.Constants.Type.back) {
        return { type: Camera.Constants.Type.front }
      } else {
        return { type: Camera.Constants.Type.back }
      }
    })
  }
  _changeFlash = () => {
    this.setState(prevState => {
      if (prevState.flash === Camera.Constants.FlashMode.off) {
        return { flash: Camera.Constants.FlashMode.on }
      } else if (prevState.flash === Camera.Constants.FlashMode.on) {
        return { flash: Camera.Constants.FlashMode.auto }
      } else if (prevState.flash === Camera.Constants.FlashMode.auto) {
        return { flash: Camera.Constants.FlashMode.off }
      }
    })
  }
  _takePhoto = async () => {
    console.log('_takePhoto !!! ', this.state)
    const { pictureTaken } = this.state
    if (!pictureTaken) {
      if (this.camera) {
        console.log('_takeingPhoto !!! ')
        const takenPhoto = await this.camera.takePictureAsync({
          quality: 0.5,
          exif: true
        })

        console.log(takenPhoto)
        this.setState({ picture: takenPhoto.uri, pictureTaken: true })
      }
    }
  }
  _rejectPhoto = () => {
    this.setState({
      picture: null,
      pictureTaken: false
    })
  }
  _approvePhoto = async () => {
    const { picture } = this.state
    const {
      navigation: { navigate }
    } = this.props
    const saveResult = await CameraRoll.saveToCameraRoll(picture, 'photo')
    navigate('UploadPhoto', { url: picture })
    this.setState({
      picture: null,
      pictureTaken: false
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  camera: {
    flex: 2,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  btnContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btn: {
    width: 100,
    height: 100,
    backgroundColor: 'white',
    borderColor: '#bbb',
    borderWidth: 15,
    borderRadius: 50
  },
  action: {
    backgroundColor: 'transparent',
    height: 40,
    width: 40,
    margin: 10
  },
  photoActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
    alignItems: 'center',
    width: 250
  }
})

export default CameraScreen
