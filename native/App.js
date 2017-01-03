import React, { Component } from 'react'
import KeepAwake from 'react-native-keep-awake'

import Routes from './routes'

export default class mobileDashboard extends Component {

  componentWillMount () {
    if (!__DEV__) {
      return
    }
    KeepAwake.activate()
  }

  componentWillUnmount () {
    if (!__DEV__) {
      return
    }
    KeepAwake.deactivate()
  }

  render () {
    return (
      <Routes />
    )
  }

}
