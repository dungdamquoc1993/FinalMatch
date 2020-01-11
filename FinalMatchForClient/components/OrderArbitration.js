import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Header from './Header'
export default class OrderArbitration extends Component {
  static navigationOptions = {
    header: null,
  };
  render () {
    return (
      <SafeAreaView style={styles.container}>
      <Header title="Đặt Trọng Tài" hideBack={true} pressBackButton={() => {
        this.props.navigation.navigate('Service')
        }}/>
        <View style={styles.personalInformation}>
          <TextInput style={styles.textInput} placeholder={'Nhập tên'} />
        </View>
        <View style={styles.personalInformation}>
          <TextInput
            style={styles.textInput}
            placeholder={'Nhập số điện thoại'}
          />
        </View>
        <View style={{borderBottomWidth:1,backgroundColor:'#a9a9a9',width:'80%',marginVertical:25}} />
        <View style={styles.personalInformation}>
          <TextInput
            style={styles.textInputPosition}
            placeholder={'Địa điểm thi đấu'}
          />
        </View>
        <View style={styles.personalInformation}>
          <TextInput
            style={styles.textInputPosition}
            placeholder={'Thời gian thi đấu'}
          />
        </View>
        <TouchableOpacity style={styles.buttonSubmit}>
          <Text style={styles.textSubmit}>
            Gửi yêu cầu
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create ({
  container: {
    marginTop:20,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  personalInformation: {
    height: 75,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    width: '90%',
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    borderColor: '#a9a9a9',
    borderWidth: 1,
    paddingStart:15,
    fontSize: 17,
  },
  textInputPosition: {
    width: '90%',
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    borderColor: '#a9a9a9',
    borderWidth: 1,
    paddingStart:15,
    fontSize: 17,
  },
  buttonSubmit: {
    height: 50,
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 17,
    backgroundColor: '#00CCFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  textSubmit: {
    height: 60,
    lineHeight: 60,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
});
