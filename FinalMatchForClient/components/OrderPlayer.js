import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
export default class OrderPlayer extends Component {
  constructor (props) {
    super (props);
    this.state = {
      name: '',
      phoneNumber: '',
      isGK: false,
      isCB: false,
      isMF: false,
      isCF: false,
    };
  }
  render () {
    const {isGK, isCB, isMF, isCF} = this.state;
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
        <Text style={{height:40,lineHeight:40,marginTop:10,fontSize:20,fontWeight:'bold'}}>Cầu thủ của bạn:</Text>
        <View style={styles.positions}>
          <TouchableOpacity
            style={styles.eachPosition}
            onPress={() => {
              this.setState ({isGK: ! this.state.isGK});
            }}
          >
            <Text>GK</Text>
            <FontAwesome5
              name={isGK == true ? 'check-square' : 'square'}
              size={35}
              color={'black'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.eachPosition}
            onPress={() => {
              this.setState ({isCB: !this.state.isCB});
            }}
          >
            <Text>CB</Text>
            <FontAwesome5
              name={isCB == true ? 'check-square' : 'square'}
              size={35}
              color={'black'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.eachPosition}
            onPress={() => {
              this.setState ({isMF: !this.state.isMF});
            }}
          >
            <Text>MF</Text>
            <FontAwesome5
              name={isMF == true ? 'check-square' : 'square'}
              size={35}
              color={'black'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.eachPosition}
            onPress={() => {
              this.setState ({isCF: !this.state.isCF});
            }}
          >
            <Text>CF</Text>
            <FontAwesome5
              name={isCF == true ? 'check-square' : 'square'}
              size={35}
              color={'black'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.personalInformation}>
          <Text style={styles.textLabelPosition}>
            Địa điểm thi đấu:
          </Text>
          <TextInput
            style={styles.textInputPosition}
            placeholder={'Enter name'}
          />
        </View>
        <TouchableOpacity style={{width:200,height:60,backgroundColor:'#7FFFD4',marginVertical:30,alignItems:'center',borderRadius:10}}>
          <Text style={{height:60,lineHeight:60,fontSize:20,fontWeight:'bold'}}>Gửi yêu cầu</Text>
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
  positions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 50,
    width: '100%',
    marginVertical:30
  },
  eachPosition: {
    flexDirection: 'column',
    width: 90,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
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
});
