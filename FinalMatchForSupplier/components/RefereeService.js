import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Header from './Header';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
export default class RefereeService extends Component {
  static navigationOptions = {
    header: null,
  };
  state={
      isAddress:false
  }
  _isOnpressSubmit = () =>{
    this.setState({isAddress: !this.state.isAddress
    })
}
  render () {
      const {isAddress} = this.state
    return (
      <View style={styles.container}>
        <Header title={'RefereeService'} />
        <Text style={{fontSize: 20, marginVertical: 20}}>
          Đăng ký dịch vụ trọng tài
        </Text>
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
            SDT:
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder={'Please enter phone number'}
            keyboardType={'number-pad'}
          />
        </View>
        <View style={styles.personalInformation}>
          <Text style={styles.textLabel}>
            Tuổi:
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder={'Please enter age'}
            keyboardType={'number-pad'}
          />
        </View>
        <Text style={{fontSize: 15, marginVertical: 20}}>
          Địa chỉ phục vụ
        </Text>
        {isAddress === true &&
        <View style={styles.personalInformation}>
          <Text style={styles.textLabel}>
            T/P:
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder={'Thành phố'}
            keyboardType={'default'}
          />
        </View>}
        {isAddress === true &&
        <View style={styles.personalInformation}>
          <Text style={styles.textLabel}>
            Tuổi:
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder={'Quận huyện'}
          />
        </View>}
    
        
        <View style={styles.personalInformation}>
        <Text >
            Địa chỉ chi tiết:
          </Text>
        <TouchableOpacity  onPress={()=>{
            this._isOnpressSubmit()
        }}>
            <FontAwesome5 name={ "map-marker-alt"} 
                            size={20} color={"black"}/>
        </TouchableOpacity>
        </View>
       




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
  btnSubmit:{
    height:60,
    width:200,
    backgroundColor:'#7FFFD4',
    borderRadius:7,
    alignItems:'center',
    marginTop:20,
},
txtSubmit:{
    lineHeight:60,
      fontWeight:'bold',
      fontSize:20,
      color:'white'
}
});
