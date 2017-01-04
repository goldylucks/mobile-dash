import React, { Component } from 'react'
import { View, AsyncStorage } from 'react-native'
import { Actions, ActionConst } from 'react-native-router-flux'
import DatePicker from 'react-native-datepicker'
import moment from 'moment'
import logger from '../../utils/logger'
import * as soap from '../../utils/soap'
import AccordionNav from '../../components/AccordionNav'
import Stats from '../../components/Stats'

export default class HomePage extends Component {

  state = {
    token: null,
    stats: [],
    nav: [],
    accordionActiveKey: '',
    accordionTitle: null,
    accordionShowOnlyTitle: true,
    accordionSelectedKey: '0',
    date: moment().format('DD MMM YYYY'),
  }

  componentWillMount () {
    this.authenticateUser()
      .then(token => {
        if (!token) {
          Actions.login({ type: ActionConst.RESET })
          return
        }
        this.setState({ token })
        // get as much data as possible from LS first for better user experience
        // so the user will c something until data comes from server
        // this.syncNavFromLs()
        // this.syncDateFromLs()
        // this.syncStatsFromLs()
        // fetch updated data from server
        this.fetchNav(token)
        this.fetchInitialStats(token)
      })
      .catch(err => logger.error('err', err))
  }

  render () {
    return (
      <View style={ styles.container }>
        <View style={ styles.accordionWrap }>
          <View style={ styles.accordion }>
            <AccordionNav
              showOnlyTitle={ this.state.accordionShowOnlyTitle }
              activeKey={ this.state.accordionActiveKey }
              selectedKey={ this.state.accordionSelectedKey }
              data={ this.state.nav }
              onClick={ this.onAccordionClick }
              onToggle={ this.onAccordionToggle }
            />
          </View>
        </View>
        <View style={ styles.dateContainer }>
          { this.renderDatePicker() }
        </View>
        <Stats data={ this.state.stats } />
      </View>
    )
  }

  renderDatePicker () {
    return (
      <DatePicker
        date={ this.state.date }
        maxDate={ moment().format('DD MMM YYYY') }
        mode='date'
        placeholder='select date'
        format='DD MMM YYYY'
        confirmBtnText='Confirm'
        cancelBtnText='Cancel'
        onDateChange={ this.onDateChange }
      />
    )
  }

  onAccordionClick = (key, title, evt) => {
    logger.log('\n', 'onAccordionClick', 'key', key, ', title', title, ', evt', evt)
    AsyncStorage.setItem('accordionSelectedKey', key)
    AsyncStorage.setItem('accordionSelectedTitle', title)
    const { token, date, accordionShowOnlyTitle } = this.state
    this.setState({
      accordionShowOnlyTitle: !accordionShowOnlyTitle,
      accordionTitle: title,
    })
    if (accordionShowOnlyTitle) {
      return
    }
    this.fetchStats(token, key, title, date)
    this.setState({ accordionSelectedKey: key })
  }

  onAccordionToggle = ({ key, title, nextActiveKey, evt }) => {
    logger.log('\n', 'onAccordionToggle', 'key:', key, ', title:', title, ', evt:', evt)
    this.setState({ accordionActiveKey: nextActiveKey })
  }

  onDateChange = date => {
    logger.log('date changed to:', date)
    const { token, accordionSelectedKey, accordionTitle } = this.state
    this.setState({ date })
    this.fetchStats(token, accordionSelectedKey, accordionTitle, date)
    AsyncStorage.setItem('accordionSelectedDate', date)
  }

  authenticateUser () {
    return AsyncStorage.getItem('token').then(token => {
      logger.log('user detected! token from LS:', token)
      return token
    })
  }

  syncNavFromLs () {
    AsyncStorage.getItem('nav')
      .then(nav => nav && this.setState({ nav: JSON.parse(nav) }))
      .catch(err => logger.error('syncNavFromLs err:', err))
  }

  syncDateFromLs () {
    AsyncStorage.getItem('accordionSelectedDate')
      .then(date => date && this.setState({ date }))
      .catch(err => logger.error('syncDateFromLs err:', err))
  }

  // get stats from ls before we get them from server
  // so user don't have to wait to c something everytime she
  // starts the app
  syncStatsFromLs () {
    AsyncStorage.getItem('stats')
      .then(stats => stats && this.setState({ stats: JSON.parse(stats) }))
      .catch(err => logger.error('syncStatsFromLs err:', err))
  }

  // fetch stats on load, in the meantime user sees stats from LS
  fetchInitialStats (token) {
    Promise.all([
      AsyncStorage.getItem('accordionSelectedKey'),
      AsyncStorage.getItem('accordionSelectedTitle'),
      AsyncStorage.getItem('accordionSelectedDate'),
    ])
    .then(([key, title, date]) => {
      if (!key || !title || !date) {
        return
      }
      this.fetchStats(token, key, title, date)
    })
    .catch(err => logger.error('fetchInitialStats err:', err))
  }

  fetchNav (token) {
    logger.log('fetchNav')
    soap.getNav(token)
      .then(nav => {
        logger.log('fetchNav success:', nav)
        this.setState({ nav })
        return AsyncStorage.setItem('nav', JSON.stringify(nav))
      })
      .catch(err => logger.error('fetchNav err:', err))
  }

  fetchStats (token, key, title, date) {
    logger.log('fetchStats:', 'key:', key, ', title:', title, ', date:', date)
    const companyLevel = key.split('.').length
    soap.getStats(token, companyLevel, title, date)
    .then(stats => {
      logger.log('fetchStats success:', stats)
      this.setState({ stats })
      return AsyncStorage.setItem('stats', JSON.stringify(stats))
    })
    .catch(err => logger.log('fetchStats err:', err))
  }

}

const styles = {
  container: {
    flex: 1,
  },
  accordionWrap: {
    height: 50,
  },
  accordion: {
    position: 'absolute',
    zIndex: 10,
    top: 0,
    right: 0,
    left: 0,
  },
}
