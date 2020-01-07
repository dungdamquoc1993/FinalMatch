import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
export default class OrderArbitration extends Component {
  render () {
    return (
      <SafeAreaView style={styles.container}>
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

        <Text style={styles.textPlayer}>
          Trọng tài của bạn:
        </Text>
        <View style={styles.personalInformation}>
          <Text style={styles.textLabelPosition}>
            Địa điểm thi đấu:
          </Text>
          <TextInput
            style={styles.textInputPosition}
            placeholder={'input position'}
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
    marginTop: 20,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    borderWidth: 1,
    paddingHorizontal: 10,
    marginEnd: 30,
    color: 'black',
  },
  textLabelPosition: {
    width: '40%',
    height: 40,
    lineHeight: 40,
    paddingStart: 40,
  },
  textInputPosition: {
    width: '60%',
    height: 40,
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginEnd: 30,
    color: 'black',
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
  textPlayer: {
    height: 40,
    lineHeight: 40,
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical:20,
  },
});
