import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Header from './Header';
export default class RefereeList extends Component {
  static navigationOptions = {
    header: null,
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
        <ScrollView style={{width: '100%'}}>
          <View style={styles.ViewAllInformation}>
            <View style={styles.ViewDetail}>
              <View style={styles.ViewNamedetailArbitration}>
                <Text style={styles.textLable}>Tên: </Text>
                <Text style={styles.textLable}>Vũ Trung Kiên</Text>
              </View>
              <View style={styles.ViewNamedetailArbitration}>
                <Text style={styles.textLable}>Tuổi: </Text>
                <Text style={styles.textLable}>26</Text>
              </View>
              <View style={styles.ViewNamedetailArbitration}>
                <Text style={styles.textLable}>Số trận đã bắt: </Text>
                <Text style={styles.textLable}>0</Text>
              </View>
              <View style={styles.ViewNamedetailArbitration}>
                <Text style={styles.textLable}>Giá: </Text>
                <Text style={styles.textLable}>1000$</Text>
              </View>
            </View>

            <View style={styles.viewButton}>
              <Image
                source={require ('../images/avatar.png')}
                style={styles.images}
              />

              <TouchableOpacity
                style={styles.btnOrder}
                onPress={() => {
                  this.setState ({order: !this.state.order});
                }}
              >

                {order == false
                  ? <Text style={styles.textOrder}>Đặt</Text>
                  : <Image
                      source={require ('../images/Order.png')}
                      style={{height: 50, width: 90}}
                    />}

              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.ViewAllInformation}>
            <View style={styles.ViewDetail}>
              <View style={styles.ViewNamedetailArbitration}>
                <Text style={styles.textLable}>Tên: </Text>
                <Text style={styles.textLable}>Vũ Trung Kiên</Text>
              </View>
              <View style={styles.ViewNamedetailArbitration}>
                <Text style={styles.textLable}>Tuổi: </Text>
                <Text style={styles.textLable}>26</Text>
              </View>
              <View style={styles.ViewNamedetailArbitration}>
                <Text style={styles.textLable}>Số trận đã bắt: </Text>
                <Text style={styles.textLable}>0</Text>
              </View>
              <View style={styles.ViewNamedetailArbitration}>
                <Text style={styles.textLable}>Giá: </Text>
                <Text style={styles.textLable}>1000$</Text>
              </View>
            </View>

            <View style={styles.viewButton}>
              <Image
                source={require ('../images/avatar.png')}
                style={styles.images}
              />

              <TouchableOpacity
                style={styles.btnOrder}
                onPress={() => {
                  this.setState ({order: !this.state.order});
                }}
              >

                {order == false
                  ? <Text style={styles.textOrder}>Đặt</Text>
                  : <Image
                      source={require ('../images/Order.png')}
                      style={{height: 50, width: 90}}
                    />}

              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.ViewAllInformation}>
            <View style={styles.ViewDetail}>
              <View style={styles.ViewNamedetailArbitration}>
                <Text style={styles.textLable}>Tên: </Text>
                <Text style={styles.textLable}>Vũ Trung Kiên</Text>
              </View>
              <View style={styles.ViewNamedetailArbitration}>
                <Text style={styles.textLable}>Tuổi: </Text>
                <Text style={styles.textLable}>26</Text>
              </View>
              <View style={styles.ViewNamedetailArbitration}>
                <Text style={styles.textLable}>Số trận đã bắt: </Text>
                <Text style={styles.textLable}>0</Text>
              </View>
              <View style={styles.ViewNamedetailArbitration}>
                <Text style={styles.textLable}>Giá: </Text>
                <Text style={styles.textLable}>1000$</Text>
              </View>
            </View>

            <View style={styles.viewButton}>
              <Image
                source={require ('../images/avatar.png')}
                style={styles.images}
              />

              <TouchableOpacity
                style={styles.btnOrder}
                onPress={() => {
                  this.setState ({order: !this.state.order});
                }}
              >

                {order == false
                  ? <Text style={styles.textOrder}>Đặt</Text>
                  : <Image
                      source={require ('../images/Order.png')}
                      style={{height: 50, width: 90}}
                    />}

              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.ViewAllInformation}>
            <View style={styles.ViewDetail}>
              <View style={styles.ViewNamedetailArbitration}>
                <Text style={styles.textLable}>Tên: </Text>
                <Text style={styles.textLable}>Vũ Trung Kiên</Text>
              </View>
              <View style={styles.ViewNamedetailArbitration}>
                <Text style={styles.textLable}>Tuổi: </Text>
                <Text style={styles.textLable}>26</Text>
              </View>
              <View style={styles.ViewNamedetailArbitration}>
                <Text style={styles.textLable}>Số trận đã bắt: </Text>
                <Text style={styles.textLable}>0</Text>
              </View>
              <View style={styles.ViewNamedetailArbitration}>
                <Text style={styles.textLable}>Giá: </Text>
                <Text style={styles.textLable}>1000$</Text>
              </View>
            </View>

            <View style={styles.viewButton}>
              <Image
                source={require ('../images/avatar.png')}
                style={styles.images}
              />

              <TouchableOpacity
                style={styles.btnOrder}
                onPress={() => {
                  this.setState ({order: !this.state.order});
                }}
              >

                {order == false
                  ? <Text style={styles.textOrder}>Đặt</Text>
                  : <Image
                      source={require ('../images/Order.png')}
                      style={{height: 50, width: 90}}
                    />}

              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.ViewAllInformation}>
            <View style={styles.ViewDetail}>
              <View style={styles.ViewNamedetailArbitration}>
                <Text style={styles.textLable}>Tên: </Text>
                <Text style={styles.textLable}>Vũ Trung Kiên</Text>
              </View>
              <View style={styles.ViewNamedetailArbitration}>
                <Text style={styles.textLable}>Tuổi: </Text>
                <Text style={styles.textLable}>26</Text>
              </View>
              <View style={styles.ViewNamedetailArbitration}>
                <Text style={styles.textLable}>Số trận đã bắt: </Text>
                <Text style={styles.textLable}>0</Text>
              </View>
              <View style={styles.ViewNamedetailArbitration}>
                <Text style={styles.textLable}>Giá: </Text>
                <Text style={styles.textLable}>1000$</Text>
              </View>
            </View>

            <View style={styles.viewButton}>
              <Image
                source={require ('../images/avatar.png')}
                style={styles.images}
              />

              <TouchableOpacity
                style={styles.btnOrder}
                onPress={() => {
                  this.setState ({order: !this.state.order});
                }}
              >

                {order == false
                  ? <Text style={styles.textOrder}>Đặt</Text>
                  : <Image
                      source={require ('../images/Order.png')}
                      style={{height: 50, width: 90}}
                    />}

              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  },
  btnOrder: {
    width: 90,
    height: 50,
    borderRadius: 2,
    backgroundColor: '#dcdcdc',
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
    marginVertical: 20,
  },
  textSubmit: {
    height: 60,
    lineHeight: 60,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});
