import React, { Component } from 'react'
import * as RNLocalize from "react-native-localize"
import {setI18nConfig} from '../languages/languageConfigurations'
import { View } from 'react-native'
export default class MultiLanguageComponent extends Component {
    constructor(props) {
        super(props)
        setI18nConfig() // set initial config
    }
    componentDidMount() {        
        RNLocalize.addEventListener("change", this.handleLocalizationChange);
      }
    
      componentWillUnmount() {
        RNLocalize.removeEventListener("change", this.handleLocalizationChange);
      }
    
      handleLocalizationChange = () => {
        setI18nConfig();
        this.forceUpdate();
      }
      render() {
          return <View>
              {this.props.children}
          </View>
      }
}