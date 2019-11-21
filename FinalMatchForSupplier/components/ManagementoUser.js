import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Platform,
  TouchableOpacity,
} from 'react-native';

export default class ManagementoUser extends Component {
  render () {
    state = {
      isAdress: false,
    };
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Text style={styles.txtTitle}>
            Quan ly tai khoan cua ban
          </Text>
        </View>
        <View style={styles.containerInfor}>
          <View style={styles.order}>
            <Text style={styles.txt}>Name</Text>
            <View style={styles.textInfor}>
              <TextInput style={styles.txtInput} placeholder="Enter name" />
              <TouchableOpacity
                style={styles.btnEdit}
                onPress={() => {
                  alert ('You tapped the button!');
                }}
              >
                <Text style={styles.txtEdit}>
                  Edit
                </Text>
              </TouchableOpacity>
            </View>

          </View>
          <View style={styles.order}>
            <Text style={styles.txt}>Name</Text>
            <View style={styles.textInfor}>
              <TextInput style={styles.txtInput} placeholder="Enter name" />
              <TouchableOpacity
                style={styles.btnEdit}
                onPress={() => {
                  alert ('You tapped the button!');
                }}
              >
                <Text style={styles.txtEdit}>
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.order}>
            <Text style={styles.txt}>Name</Text>
            <View style={styles.textInfor}>
              <TextInput style={styles.txtInput} placeholder="Enter name" />
              <TouchableOpacity
                style={styles.btnEdit}
                onPress={() => {
                  alert ('You tapped the button!');
                }}
              >
                <Text style={styles.txtEdit}>
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View>
          <View style={styles.title}>
            <Text style={styles.txtTitle}>
              Dia chi phuc vu
            </Text>
          </View>
          <View style={styles.viewAddress}>
            <TextInput style={styles.btn} placeholder="Lay vi tri cua ban" />
            <TouchableOpacity
              style={styles.btnAddress}
              onPress={() => {
                alert ('You tapped the button!');
              }}
            />

          </View>

          <View style={styles.containerInfor}>
            <View style={styles.order}>
              <Text style={styles.txt}>Thanh pho</Text>
              <TextInput style={styles.textAddress} placeholder="Thanh pho" />
            </View>
            <View style={styles.order}>
              <Text style={styles.txt}>Quan/huyen</Text>
              <TextInput style={styles.textAddress} placeholder="Quan huyen" />
            </View>
            <View style={styles.order}>
              <Text style={styles.txt}>Phuong/Xa</Text>
              <TextInput style={styles.textAddress} placeholder="Phuong xa" />
            </View>
          </View>

        </View>
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
  title: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  txtInput: {
    fontSize: 18,
    padding: 5,
    width: 270,
    height: 40,
  },
  order: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'space-between',
  },
  txt: {
    fontSize: 18,
    marginVertical: 10,
  },
  btn: {
    fontSize: 18,
    height: 30,
    width: 200,
    paddingLeft: 7,
  },
  containerInfor: {
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 10,
    margin: 5,
  },
  textInfor: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 7,
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  btnEdit: {
    height: 40,
    backgroundColor: 'green',
    width: 50,
    borderRadius: 5,
  },
  txtEdit: {
    fontSize: 15,
    textAlign: 'center',
    padding: 9,
  },
  viewAddress: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 7,
    justifyContent: 'space-between',
    marginHorizontal: 20,
    margin: 5,
  },
  btnAddress: {
    height: 30,
    backgroundColor: 'red',
    width: 50,
  },
  textAddress: {
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 5,
    width: 280,
    height: 40,
    padding: 5,
    fontSize: 18,
  },
});
