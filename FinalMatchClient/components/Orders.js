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
    phone: '015457887',
    adress: 0,
    price: 1200,
    iamgeAvatar: require ('../images/avatar.png'),
    Chat: 'Chat',
  },
  {
    id: '015',
    name: 'Vũ Trung Kiên',
    phone: '015457887',
    adress: 10,
    price: 1200,
    iamgeAvatar: require ('../images/avatar.png'),
    Chat: 'Chat',
  },
  {
    id: '012',
    name: 'Vũ Trung Kiên',
    phone: '015457887',
    adress: 10,
    price: 1200,
    iamgeAvatar: require ('../images/avatar.png'),
    Chat: 'Chat',
  },
  {
    id: '013',
    name: 'Vũ Trung Kiên',
    phone: '015457887',
    adress: 0,
    price: 1200,
    iamgeAvatar: require ('../images/avatar.png'),
    Chat: 'Chat',
  },
];

export default class Orders extends Component {
  static navigationOptions = {
    header: null,
  };
  render () {
    const {navigate} = this.props.navigation;
    return (
      <SafeAreaView style={styles.container}>
      <Header
          title="Dịch vụ của bạn"
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
              phone={item.phone}
              adress={item.adress}
              price={item.price}
              iamgeAvatar={item.iamgeAvatar}
              orderDate={item.orderDate}
              Chat={item.Chat}
            />
          )}
          keyExtractor={item => item.id}
        />
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
    phone,
    adress,
    price,
    iamgeAvatar,
    orderDate,
    Chat
  } = this.props
  return (
    <View style={styles.ViewAllInformation}>
      <View style={styles.ViewDetail}>
        <View style={styles.ViewNamedetailArbitration}>
          <Text style={styles.textLable}>Tên: </Text>
          <Text style={styles.textLable}>{name}</Text>
        </View>
        <View style={styles.ViewNamedetailArbitration}>
          <Text style={styles.textLable}>SĐT: </Text>
          <Text style={styles.textLable}>{phone}</Text>
        </View>
        <View style={styles.ViewNamedetailArbitration}>
          <Text style={styles.textLable}>Điạ chỉ: </Text>
          <Text style={styles.textLable}>{adress}</Text>
        </View>
        <View style={styles.ViewNamedetailArbitration}>
          <Text style={styles.textLable}>Giá: </Text>
          <Text style={styles.textLable}>{price}</Text>
        </View>
        <View style={styles.ViewNamedetailArbitration}>
          <Text style={styles.textLable}>Giờ thi đấu: </Text>
          <Text style={styles.textLable}>{orderDate}</Text>
        </View>
      </View>

      <View style={styles.viewButton}>
        <Image source={iamgeAvatar} style={styles.images} />

        <TouchableOpacity
          style={styles.btnOrder}
        >
           <Text style={styles.textOrder}>{Chat}</Text>
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
  }
});
