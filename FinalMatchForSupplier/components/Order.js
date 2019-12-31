import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Animated,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Header from './Header';
import LinearGradient from 'react-native-linear-gradient';
import Modal, {ModalContent} from 'react-native-modals';
const {width, height} = Dimensions.get ('window');
export default class Order extends Component {
  constructor (props) {
    super (props);
    this.state = {
      fadeIn: new Animated.Value (0),
      showMail: false,
    };
  }
  _pressMail = () => {
    this.setState ({showMail: true});
  };
  componentDidMount () {
    const {fadeIn} = this.state;
    setInterval (() => {
      Animated.timing (fadeIn, {
        toValue: 1,
        duration: 200,
      }).start (() => {
        fadeIn.setValue (0);
      });
    }, 500);
  }
  render () {
    const {showMail, fadeIn} = this.state;
    return (
      <SafeAreaView style={styles.container}>

        <OpacityView
          fadeIn={this.state.fadeIn}
          pressMail={() => {
            this._pressMail ();
          }}
        />
        <Modal
          visible={showMail}
          onTouchOutside={() => {
            this.setState ({showMail: false});
          }}
        >
          <ModalContent
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: 0.6 * width,
            }}
          >
            <ImageBackground
              source={require ('../images/backgroundMail.jpg')}
              style={{width: '100%', height: '100%'}}
            >
              <Text>Inside</Text>
            </ImageBackground>
          </ModalContent>
        </Modal>
        <View style={{marginLeft: 0.3 * width}}>
          <Header title={'Đơn Hàng'} hideBack={true} />
        </View>
      </SafeAreaView>
    );
  }
}
const OpacityView = props => {
  return (
    <LinearGradient
      colors={['black', 'white']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      useAngle={true}
      angle={0}
      angleCenter={{x: 0.5, y: 0.5}}
      style={{
        backgroundColor: 'black',
        opacity: 1,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <TouchableOpacity
        style={{width: 100, height: 100, borderRadius: 50}}
        onPress={props.pressMail}
      >
        <Animated.Image
          source={require ('../images/mail.png')}
          style={{width: 100, height: 100, opacity: props.fadeIn}}
        />
      </TouchableOpacity>
    </LinearGradient>
  );
};
const styles = StyleSheet.create ({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
});
