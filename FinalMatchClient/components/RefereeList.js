import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
} from 'react-native';
import Header from './Header';
const DATA = [
  {
    id: '011',
    name: 'Vũ Trung Kiên',
    age: 10,
    matched: 0,
    price: 1200,
    iamgeAvatar: require ('../images/avatar.png'),
    imagechecked: require ('../images/Order.png'),
    orderPlayer: 'Đặt',
  },
  {
    id: '015',
    name: 'acb',
    age: 10,
    matched: 0,
    price: 1200,
    iamgeAvatar: require ('../images/avatar.png'),
    imagechecked: require ('../images/Order.png'),
    orderPlayer: 'Đặt',
  },
  {
    id: '012',
    name: 'Vũ Trung Kiên',
    age: 10,
    matched: 0,
    price: 1200,
    iamgeAvatar: require ('../images/avatar.png'),
    imagechecked: require ('../images/Order.png'),
    orderPlayer: 'Đặt',
  },
  {
    id: '013',
    name: 'Vũ Trung Kiên',
    age: 10,
    matched: 0,
    price: 1200,
    iamgeAvatar: require ('../images/avatar.png'),
    imagechecked: require ('../images/Order.png'),
    orderPlayer: 'Đặt',
  },
];

export default class RefereeList extends Component {
  static navigationOptions = {
    headerShown: false,
  };
  state = {
    order: false,
  };
  render () {
    const {navigate} = this.props.navigation;
    const {order} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Trọng tài gần bạn"
          hideBack={true}
          pressBackButton={() => {
            this.props.navigation.navigate ('OrderReferee');
          }}
        />
        <FlatList
          width={'100%'}
          data={DATA}
          renderItem={({item}) => (
            <Item
              name={item.name}
              age={item.age}
              matched={item.matched}
              price={item.price}
              iamgeAvatar={item.iamgeAvatar}
              orderPlayer={item.orderPlayer}
              imagechecked={item.imagechecked}
            />
          )}
          keyExtractor={item => item.id}
        />
        <TouchableOpacity
          style={styles.buttonSubmit}
          onPress={() => {
            navigate ('Service');
          }}
        >
          <Text style={styles.textSubmit}>
            Xong
          </Text>
        </TouchableOpacity>

      </SafeAreaView>
    );
  }
}
class Item extends Component {
  state = {
    order: false   
    } 
render () {
  const {
    name,
    age,
    price,
    matched,
    iamgeAvatar,
    imagechecked,
    orderPlayer,
    id,
  } = this.props
  const {order} = this.state
  return (
    <View style={styles.ViewAllInformation}>
      <View style={styles.ViewDetail}>
        <View style={styles.ViewNamedetailArbitration}>
          <Text style={styles.textLable}>Tên: </Text>
          <Text style={styles.textLable}>{name}</Text>
        </View>
        <View style={styles.ViewNamedetailArbitration}>
          <Text style={styles.textLable}>Tuổi: </Text>
          <Text style={styles.textLable}>{age}</Text>
        </View>
        <View style={styles.ViewNamedetailArbitration}>
          <Text style={styles.textLable}>Số trận đã đấu: </Text>
          <Text style={styles.textLable}>{matched}</Text>
        </View>
        <View style={styles.ViewNamedetailArbitration}>
          <Text style={styles.textLable}>Giá: </Text>
          <Text style={styles.textLable}>{price}</Text>
          <Text >{id}</Text>
        </View>
      </View>

      <View style={styles.viewButton}>
        <Image source={iamgeAvatar} style={styles.images} />

        <TouchableOpacity
          style={styles.btnOrder}
          onPress={() => this.setState ({order: !this.state.order})}
        >

          {order == false
            ? <Text style={styles.textOrder}>{orderPlayer}</Text>
            : <Image
                source={imagechecked}
                style={{height: 50, width: 90}}
              />}

        </TouchableOpacity>
      </View>
    </View>
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
  ViewAllInformation: {
    flexDirection: 'row',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 15,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  ViewDetail: {
    flexDirection: 'column',
    width: '60%',
    paddingEnd: '10%',
  },
  ViewNamedetailArbitration: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: '4%',
  },
  textLable: {
    fontSize: 17,
    fontFamily: Platform.OS === 'ios' ? 'arial' : 'JosefinSans-Italic',
  },
  btnOrder: {
    width: 90,
    height: 50,
    borderRadius: 2,
    backgroundColor: '#dcdcdc',
    justifyContent: 'center'
  },
  viewButton: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingStart: '5%',
  },
  images: {
    height: 90,
    width: 90,
  },
  textOrder: {
    lineHeight: 50,
    alignSelf: 'center',
    fontSize: 17,
    fontFamily: Platform.OS === 'ios' ? 'arial' : 'JosefinSans-Italic',
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
    borderRadius: 25,
    marginVertical: 20,
  },
  textSubmit: {
    lineHeight: 50,
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'arial' : 'JosefinSans-Bold',
    color: 'white',
    alignSelf: 'center',
  },
});
