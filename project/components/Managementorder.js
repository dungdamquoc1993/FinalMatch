import React, {Component} from 'react';
import {Text, View, TextInput, StyleSheet, ScrollView, Platform} from 'react-native';

export default class Managementorder extends Component {
  render () {
    return (
      <View style={styles.container}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            Quan ly don dat hang
          </Text>
        </View>

        <ScrollView>
          <View style={{borderWidth:1,borderColor:'green',borderRadius:10,margin:5}}>
            <View style={styles.order}>
              <Text style={styles.txt}>Name</Text>
              <TextInput style={styles.txtInput} placeholder="Enter name" />
            </View>
            <View style={styles.order}>
              <Text style={styles.txt}>Phone</Text>
              <TextInput
                style={styles.txtInput}
                placeholder="Enter Phone"
                keyboardType="default"
              />
            </View>
            <View style={styles.order}>
              <Text style={styles.txt}>Address</Text>
              <TextInput
                style={styles.txtInput}
                placeholder="Enter Address"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.order}>
            <Text style={styles.txt}>Name</Text>
            <TextInput style={styles.txtInput} placeholder="Enter name" />
          </View>
          <View style={styles.order}>
            <Text style={styles.txt}>Phone</Text>
            <TextInput
              style={styles.txtInput}
              placeholder="Enter Phone"
              keyboardType="default"
            />
          </View>
          <View style={styles.order}>
            <Text style={styles.txt}>Address</Text>
            <TextInput
              style={styles.txtInput}
              placeholder="Enter Address"
              keyboardType="email-address"
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create ({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: Platform.OS == 'ios' ? 40 : 0,
  },
  txtInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    width: 300,
    height: 40,
    padding: 10,
    marginLeft: 20,
  },
  order: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'space-between',
  },
  txt: {
    marginVertical: 10,
  },
});
