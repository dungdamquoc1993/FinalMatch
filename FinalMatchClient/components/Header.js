import React, {Component} from 'react';
import {translate} from '../languages/languageConfigurations'
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
export default class Header extends Component {
  constructor (props) {
    super (props);
  }
  render () {
    const {title, hideBack = false, pressBackButton} = this.props;
    return (
      <View style={styles.container}>
        {hideBack === false &&
          <TouchableOpacity
          style={{width:'30%'}}
            onPress={async () => {
              await pressBackButton ();
            }}
          >
            <Image
              source={require ('../images/back.png')}
              style={styles.image}
            />
          </TouchableOpacity>}
        <TouchableOpacity
          onPress={async () => {
            await pressBackButton ();
          }}
          style={{width:'30%'}}
        >
          <Image
            source={require ('../images/back.png')}
            style={styles.imagetow}
          />
        </TouchableOpacity>
        <Text style={styles.title}>
          {title}
        </Text>
        <View style={{width: '10%'}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20
  },
  title: {
    lineHeight: 60,
    fontSize: 20,
    width:'60%',
    
  },
  image:{
    width: 30, 
    height: 30
  },
  imagetow:{
    width: 40, 
    height: 40,
    marginLeft:15
  }
});
