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
          <Text style={styles.textLabel}>
            Tên:{' '}
          </Text>
          <TextInput style={styles.textInput} placeholder={'Enter name'} />
        </View>
        <View style={styles.personalInformation}>
          <Text style={styles.textLabel}>
            SĐT:{' '}
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder={'Enter phone number'}
          />
        </View>
        <View style={{borderBottomWidth:1,color:'black',width:'80%',marginVertical:20}} />
        <View style={styles.personalInformation}>
          <Text style={styles.textLabelPosition}>
            Địa điểm thi đấu:
          </Text>
          <TextInput
            style={styles.textInputPosition}
            placeholder={'Enter position'}
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
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  personalInformation: {
    flexDirection: 'row',
    height: 75,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLabel: {
    width: '20%',
    height: 50,
    lineHeight: 50,
    paddingStart: 30,
    fontSize: 20
  },
  textInput: {
    width: '80%',
    height: 50,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginEnd: 30,
    color: 'black',
    fontSize: 20,
  },
  textLabelPosition: {
    width: '45%',
    height: 50,
    lineHeight: 50,
    paddingStart: 30,
    fontSize: 20
  },
  textInputPosition: {
    width: '55%',
    height: 50,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginEnd: 30,
    color: 'black',
    fontSize: 20
  },
  buttonSubmit: {
    width: 200,
    height: 60,
    backgroundColor: '#7FFFD4',
    marginVertical: 30,
    alignItems: 'center',
    borderRadius: 10,
  },
  textSubmit: {
    height: 60,
    lineHeight: 60,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
