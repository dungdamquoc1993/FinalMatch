import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Header from './Header'
import { NavigationEvents } from 'react-navigation'
import {translate} from '../languages/languageConfigurations'
import MultiLanguageComponent from './MultiLanguageComponent'
import {
  getCustomerInformation,
  updateCustomerInformation
} from '../server/myServices'
import {getCustomerFromStorage} from '../helpers/Helpers'
export default class OrderPlayer extends MultiLanguageComponent {
  static navigationOptions = {
    headerShown: false,
  };
  constructor (props) {
    super (props);
    this.state = {
      name: '',
      phoneNumber: '',
      isGK: false,
      isCB: false,
      isMF: false,
      isCF: false,
      point: {
        latitude : 0, 
        longitude: 0
      },
      matchTiming: {
        day: 0,
        month: 0,
        year: 0,
        hour: 0,
        minute: 0, 
        gmt: 7
      }
    }
  }
  reloadDataFromServer = async () => {    
    const { customerId, email } = await getCustomerFromStorage()    
    try {
      const { data, message } = await getCustomerInformation(customerId)
      const { 
          name, phoneNumber, tokenKey, userType
      } = data      
      this.setState({
        name, phoneNumber
      })
    } catch (error) {
      alert(`Cannot get customer's information. error = ${JSON.stringify(error)}`)
    }
  }
  sendRequest = async () => {    
    try {
      const {name, phoneNumber} = this.state
      const {navigate} = this.props.navigation
      const {isGK, isCB, isMF, isCF, point, matchTiming} = this.state
      
      //1.Update customer's information
      const { message, error } = await updateCustomerInformation(name, phoneNumber)
      
      if (!error) {
        //2.Tim player, ....truyen param sang PlayerLists
        navigate('PlayersList', {isGK, isCB, isMF, isCF, point, matchTiming});
      } else {
        alert("Cannot update customer's information "+error)
      }
    } catch (error) {
      alert("Cannot update customer's information: "+error)
    }
  }
  render () {
    const {navigate} = this.props.navigation
    const {isGK, isCB, isMF, isCF, point, matchTiming} = this.state
    const {name, phoneNumber} = this.state
    return (
      <SafeAreaView style={styles.container}>
        <NavigationEvents
          onWillFocus={payload => {
            this.reloadDataFromServer()
          }}
        />
      <Header title={translate("Order a player")} hideBack={true} pressBackButton={() => {
        this.props.navigation.navigate('Service')
        }}/>
        <ScrollView>
        <View style={styles.personalInformation}>
          <TextInput style={styles.textInput} 
            value={name}            
            onChangeText={(name) => {
              this.setState({name})
            }}
            placeholder={translate("Enter name: ")} />
        </View>
        <View style={styles.personalInformation}>
          <TextInput
            style={styles.textInput}
            value={phoneNumber}
            onChangeText={(phoneNumber) => {
              this.setState({phoneNumber})
            }}
            placeholder={translate("Enter telephone number: ")}
          />
        </View>
        <View style={{height:40,width:'100%',alignItems:'center'}}>
        <Text style={{height:40,lineHeight:40,fontSize:20,fontFamily: Platform.OS === 'ios' ? 'arial' : 'JosefinSans-Italic'}}>Cầu thủ của bạn:</Text>
        </View>
        
        <View style={styles.positions}>
          <TouchableOpacity
            style={styles.eachPosition}
            onPress={() => {
              this.setState ({isGK: ! this.state.isGK});
            }}
          >
            <Text style={styles.textPosition}>GK</Text>
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
            <Text style={styles.textPosition}>CB</Text>
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
            <Text style={styles.textPosition}>MF</Text>
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
            <Text style={styles.textPosition}>CF</Text>
            <FontAwesome5
              name={isCF == true ? 'check-square' : 'square'}
              size={35}
              color={'black'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.personalInformation}>
          <TextInput
            style={styles.textInput}
            placeholder={translate("Stadium: ")}
          />
        </View>
        <View style={styles.personalInformation}>
          <TextInput
            style={styles.textInput}
            placeholder={translate("Stadium's time : ")}
          />
        </View>
        
        <View style={styles.personalInformation}>
        <TouchableOpacity style={styles.buttonSubmit} onPress={async () => {
          await this.sendRequest()
        }}>
          <Text style={styles.textSubmit}>
            {translate("Send a request")}
          </Text>
        </TouchableOpacity>
        </View>
        
        </ScrollView>
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
    height: 75,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    width: '90%',
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    borderColor: '#a9a9a9',
    borderWidth: 1,
    paddingStart:15,
    fontSize: 17,
    fontFamily: Platform.OS === 'ios' ? 'arial' : 'JosefinSans-Italic'
  },
  positions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 50,
    width: '100%',
    marginVertical:25
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
    fontFamily: Platform.OS === 'ios' ? 'arial' : 'JosefinSans-Italic'
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
  },
  textSubmit: {
    lineHeight: 50,
    fontSize: 20,
    color: 'white',
    alignSelf: 'center',
    fontFamily: Platform.OS === 'ios' ? 'arial' : 'JosefinSans-Bold'
  },
  textPosition:{
    fontFamily: Platform.OS === 'ios' ? 'arial' : 'JosefinSans-Italic',fontSize: 17,
  }
});
