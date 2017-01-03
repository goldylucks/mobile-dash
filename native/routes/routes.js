import React, { Component } from 'react'
import { Scene, Router } from 'react-native-router-flux'

import Home from '../pages/Home'
import Login from '../pages/Login'

export default class Routes extends Component {

  render () {
    return (
      <Router hideNavBar>
        <Scene key='root'>
          <Scene key='home' component={ Home } initial />
          <Scene key='login' component={ Login } />
        </Scene>
      </Router>
    )
  }

}
