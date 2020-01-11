import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  StyleSheet,
  DatePickerAndroid,
  TextInput,
  SafeAreaView,
  PermissionsAndroid,
  ToastAndroid,
  Platform,
  TouchableOpacity,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
export default class Service extends Component {
  constructor (props) {
    super (props);
    this.state = {};
  }
  render () {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 30, fontWeight: 'bold'}}>Dat mot dich vu</Text>
        <TouchableOpacity
          style={{
            height: 100,
            width: '80%',
            backgroundColor: '#33FF99',
            borderRadius: 30,
          }}
          onPress={() => {
            navigate('OrderPlayer')
              
            }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginVertical: 10,
            }}
          >
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              Dang ky mot cau thu
            </Text>
            <Image
              style={{height: 30, width: 30}}
              source={require ('../images/2339949.png')}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}
          >
            <View style={{flexDirection: 'column'}}>
              <Text>CF</Text>
              <FontAwesome5 name={'check-square'} size={20} color={'black'} />
            </View>
            <View style={{flexDirection: 'column'}}>
              <Text>CF</Text>
              <FontAwesome5 name={'check-square'} size={20} color={'black'} />
            </View>
            <View style={{flexDirection: 'column'}}>
              <Text>CF</Text>
              <FontAwesome5 name={'check-square'} size={20} color={'black'} />
            </View>
            <View style={{flexDirection: 'column'}}>
              <Text>CF</Text>
              <FontAwesome5 name={'check-square'} size={20} color={'black'} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            height: 100,
            width: '80%',
            backgroundColor: '#33FF99',
            borderRadius: 30,
          }}
          onPress={() => {
            navigate('OrderArbitration')
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              height: 100,
            }}
          >
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              Dang ky trong tai
            </Text>
            <Image
              style={{height: 30, width: 30}}
              source={require ('../images/whistle.png')}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 100,
            width: '80%',
            backgroundColor: '#33FF99',
            borderRadius: 30,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginVertical: 35,
              height: 100,
            }}
          >
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              Dang ky san bong
            </Text>
            <Image
              style={{height: 30, width: 30}}
              source={require ('../images/404650.png')}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create ({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    flex: 1,
  },
});
