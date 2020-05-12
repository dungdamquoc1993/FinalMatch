import React, {Component} from 'react'
import {translate} from '../languages/languageConfigurations'
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native'
import {COLOR_ITEM_BACKGROUND} from '../colors/colors'
export default class Header extends Component {
  constructor (props) {
    super (props)
  }
  render () {
    const {title, hideBack = false, hideNext = false, pressBackButton} = this.props
    return (
      <View style={{
        height: 60,
        paddingHorizontal: 15,
        width: '100%',        
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      
        <TouchableOpacity
            disabled = {hideBack}   
            style = {{opacity: hideBack ? 0 : 1}}
            onPress={async () => {              
              await pressBackButton ()
            }}
          >
            <Image
              source={require ('../images/back.png')}
              style={{width: 30, height: 30}}
            />
          </TouchableOpacity>
          <Text style={{
            lineHeight: 60,
            fontSize: 20,        
          }}>
          {title}
          </Text>                  
          <TouchableOpacity
            disabled = {hideNext}   
            style = {{opacity: hideNext ? 0 : 1}}
            onPress={async () => {
              await pressBackButton ()
            }}
          >
            <Image
              source={require ('../images/back.png')}
              style={{width: 30, height: 30}}
            />
          </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create ({      
})
