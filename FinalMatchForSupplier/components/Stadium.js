import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Header from './Header';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
export default class Stadium extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    isFee: false,
    isFree: false,
  };
  _isOnpressSubmit = () =>{
      alert('hihi')
  }
  render () {
    const {isFee, isFree} = this.state;
    return (
      <View style={styles.container}>
        <Header title={'Stadium'} />
        <Text style={{fontSize: 20,marginVertical:20}}>Đăng ký sân bóng</Text>
        <View style={styles.personalInformation}>
          <Text style={styles.textLabel}>
            Tên:
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder={'Please enter name'}
          />
        </View>
        <View style={styles.personalInformation}>
          <Text style={styles.textLabel}>
            Đ/C:
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder={'Please enter Address'}
          />
        </View>
        <Text style={{fontSize: 20, fontWeight: 'bold', marginVertical: 20}}>
          Loại hình
        </Text>
        <View style={styles.positions}>
          <TouchableOpacity
            style={styles.eachPosition}
            onPress={() => {
              this.setState ({isFree: !this.state.isFree});
            }}
          >
            <Text>Miễn phí</Text>
            <FontAwesome5
              name={isFree == true ? 'check-square' : 'square'}
              size={35}
              color={'black'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.eachPosition}
            onPress={() => {
              this.setState ({isFee: !this.state.isFee});
            }}
          >
            <Text>Thu phí</Text>
            <FontAwesome5
              name={isFee == true ? 'check-square' : 'square'}
              size={35}
              color={'black'}
            />
          </TouchableOpacity>
        </View>

        {isFee === true &&
          <View style={styles.personalInformation}>
            <Text style={styles.textLabel}>
              SĐT:
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder={'Please enter phone number'}
              keyboardType={'number-pad'}
            />
          </View>}
        <TouchableOpacity style={styles.btnSubmit} onPress={()=>{
            this._isOnpressSubmit()
        }}>
          <Text style={styles.txtSubmit}>Submit</Text>
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  personalInformation: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLabel: {
    width: '20%',
    height: 40,
    lineHeight: 40,
    paddingStart: 30,
  },
  textInput: {
    width: '80%',
    height: 40,
    borderRadius: 5,
    borderColor: 'black',
    marginEnd: 30,
    borderWidth: 1,
    paddingHorizontal: 10,
    color: 'black',
  },
  positions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 70,
    width: '100%',
  },
  btnSubmit:{
      height:60,
      width:200,
      backgroundColor:'#7FFFD4',
      borderRadius:7,
      alignItems:'center',
      marginTop:30,
  },
  txtSubmit:{
      lineHeight:60,
        fontWeight:'bold',
        fontSize:20,
        color:'white'
  }
});
