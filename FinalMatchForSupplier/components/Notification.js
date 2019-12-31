import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  FlatList,
} from 'react-native';
import Header from './Header';
const {width, height} = Dimensions.get ('window');
export default class Notification extends Component {
  render () {
    const DATA = [
      {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'Ronadol đã được đăng ký ',
      },
    ];
    const Item=({ title })=> {
        return (
          <View style={styles.item}>
          <TouchableOpacity>
          <Text style={styles.title}>Bạn đã đăng ký dịch vụ cầu thủ thành công</Text>
            <Text style={styles.title}>{title}</Text>
          </TouchableOpacity>
            
          </View>
        );
      }
    return (
      <SafeAreaView style={styles.container}>
        <View style={{marginLeft: 0.3 * width}}>
          <Header title={'Thông Báo'} hideBack={true} />
        </View>
        <FlatList
        data={DATA}
        renderItem={({ item }) => <Item title={item.title} />}
        keyExtractor={item => item.id}
      />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },item: {
    backgroundColor: '#f0f8ff',
    padding: 10,
    marginVertical: 8,
  },
  title: {
    fontSize: 20,
  },
});
