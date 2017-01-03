import React, { Component } from 'react'
import { View, Text, TextInput, AsyncStorage } from 'react-native'
import { Actions } from 'react-native-router-flux'
import logger from '../../utils/logger'
import * as soap from '../../utils/soap'

export default class LoginPage extends Component {

  state = {
    error: false,
    isProcessing: false,
    username: '',
    password: '',
    company: '',
  }

  render () {
    const { username, password, company, error, isProcessing } = this.state
    return (
      <View style={ styles.container }>
        <Text style={ styles.label }>Username</Text>
        <TextInput
          style={ styles.input }
          onChangeText={ username => this.setState({ username, error: false }) }
          value={ username }
        />
        <Text style={ styles.label }>Password</Text>
        <TextInput
          style={ styles.input }
          secureTextEntry
          onChangeText={ password => this.setState({ password, error: false }) }
          value={ password }
        />
        <Text style={ styles.label }>Company</Text>
        <TextInput
          style={ styles.input }
          onChangeText={ company => this.setState({ company, error: false }) }
          value={ company }
        />
        <Text style={ styles.button } onPress={ this.onSubmit }>
          <Text style={ styles.buttonText }>Login</Text>
        </Text>
        { isProcessing ? <Text>Processing ...</Text> : null }
        { error ? <Text style={ styles.error }>Invalid credentials</Text> : null }
      </View>
    )
  }

  onSubmit = evt => {
    const { username, password, company } = this.state
    this.setState({ isProcessing: true })
    soap.login(username, password, company)
    .then(token => {
      this.setState({ isProcessing: false })
      this.saveToLs(token)
    })
    .then(this.routeHome)
    .catch(() => this.setState({ error: true }))
  }

  saveToLs (token) {
    logger.log('saving token to ls:', token)
    AsyncStorage.setItem('token', token)
  }

  routeHome () {
    Actions.home()
  }

}

const styles = {
  container: {
    flex: 1,
    paddingTop: 40,
    paddingRight: 40,
    paddingLeft: 40,
  },

  input: {
    height: 40,
    borderColor: 'gray',
    marginBottom: 20,
    borderWidth: 1,
  },

  button: {
    backgroundColor: 'blue',
    color: '#fff',
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: 'center',
  },

  error: {
    color: 'red',
  },

}
