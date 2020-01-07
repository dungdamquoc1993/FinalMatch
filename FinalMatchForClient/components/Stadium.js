import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
export default class Stadium extends Component {
  state = {
    isFee: false,
    isFree: false,
  };
  render () {
    const {isFee, isFree} = this.state;
    return (
      <View style={styles.container}>
        <Text> Tìm sân bóng </Text>
        <TouchableOpacity>
          <Text>Lấy vị trí của bạn</Text>
        </TouchableOpacity>
        <View style={styles.FeeAndFree}>
          <TouchableOpacity
            onPress={() => this.setState ({isFee : !this.state.isFee})}
          >
            <Text>Fee</Text>
            <FontAwesome5
              name={isFee == true ? 'check-square' : 'square'}
              size={35}
              color={'black'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState ({isFree: !this.state.isFree})}
          >
            <Text>Free</Text>
            <FontAwesome5
              name={isFree == true ? 'check-square' : 'square'}
              size={35}
              color={'black'}
            />
          </TouchableOpacity>
        </View>

        {  isFee == true &&
        <View>
        <View style={{flexDirection: 'row'}}>
        <Text>Tên sân</Text>
        <Text>san bong ha noi</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
        <Text>Dia chi</Text>
        <Text>san bong ha noi</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
        <Text>SDT</Text>
        <Text>san bong ha noi</Text>
        </View>
          
        </View>}
        {  (isFree  === true && isFee === false) &&
        <View>
        <View style={{flexDirection: 'row'}}>
        <Text>Tên sân</Text>
        <Text>san bong ha noi</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
        <Text>Dia chi</Text>
        <Text>san bong ha noi</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
        <Text>SDT</Text>
        <Text>san bong ha noi</Text>
        </View>
          
        </View>}
      </View>
    );
  }
}
const styles = StyleSheet.create ({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  FeeAndFree: {
    flexDirection:'row',
    height:60,
    width:'100%',
    justifyContent:'space-around'
  },
});
