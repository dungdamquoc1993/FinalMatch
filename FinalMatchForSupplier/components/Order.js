import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Header from './Header';
import Modal from "react-native-modal";
const screenWidth = Math.round (Dimensions.get ('window').width);
const screenHeight = Math.round (Dimensions.get ('window').height);
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
        duration: 1000,
      }).start (() => {
        fadeIn.setValue (1);
        Animated.timing (fadeIn, {
          toValue: 0,
          duration: 2000,
        }).start (() => {
          fadeIn.setValue (0);
        })        
      });
    }, 3000);
  }
  render () {
    const {showMail, fadeIn} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require ('../images/backgroundOrderScreen.jpeg')}
          style={{width:'100%', height:'100%',justifyContent:'center',alignItems:'center'}}
        >
          <OpacityView
            fadeIn={this.state.fadeIn}
            pressMail={() => {
              this._pressMail ();
            }}
          />
          <Modal
            visible={showMail}
            onBackdropPress={() => {
              this.setState ({showMail: false});
            }}
           
            
           
          >
              <ImageBackground
                source={require ('../images/msgOrder.png')}
                style={{width: '100%', height:'80%',alignItems: 'center'}}
              >
              <Text style={{marginTop: 120,marginHorizontal:50,fontSize: 32}}>ĐƠN HÀNG đầu tiên của bạn sẽ đến trong vòng 1 tháng</Text>
              </ImageBackground>
              
          </Modal>
          <View/>

        </ImageBackground>

      </SafeAreaView>
    );
  }
}
const OpacityView = props => {
  return (
    <TouchableOpacity
      style={{width: 200, height: 200, borderRadius: 50}}
      onPress={props.pressMail}
    >
      <Animated.Image
        source={require ('../images/icon_box.jpeg')}
        style={{width: 200, height: 200, opacity: props.fadeIn}}
      />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create ({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
});
