import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
export default class Service extends Component {
  constructor (props) {
    super (props);
    this.state = {};
  }
  render () {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text style={styles.textTitle}>Đặt một dịch vụ</Text>

        <LinearGradient
          colors={['#CAF1C1', '#C2F3B7', '#33FF99']}
          style={{
            height: 100,
            width: '80%',
            borderRadius: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigate ('OrderPlayer');
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginVertical: 10,
              }}
            >
              <Text style={styles.textButton}>
                Đăng ký một cầu thủ
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
        </LinearGradient>

        <LinearGradient
          colors={['#CAF1C1', '#C2F3B7', '#33FF99']}
          style={{
            height: 100,
            width: '80%',
            borderRadius: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigate ('OrderReferee');
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
              <Text style={styles.textButton}>
                Đăng ký trọng tài
              </Text>
              <Image
                style={{height: 30, width: 30}}
                source={require ('../images/whistle.png')}
              />
            </View>
          </TouchableOpacity>
        </LinearGradient>

        <LinearGradient
          colors={['#CAF1C1', '#C2F3B7', '#33FF99']}
          style={{
            height: 100,
            width: '80%',
            borderRadius: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigate ('Stadium');
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
              <Text style={styles.textButton}>
                Đăng ký sân bóng
              </Text>
              <Image
                style={{height: 30, width: 30}}
                source={require ('../images/404650.png')}
              />
            </View>
          </TouchableOpacity>
        </LinearGradient>
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
  textTitle: {
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'arial' : 'JosefinSans-Bold',
    textAlign: 'center',
  },
  textButton: {
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'arial' : 'JosefinSans-Italic',
    textAlign: 'center',
  },
});
