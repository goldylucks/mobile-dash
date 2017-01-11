import React, { Component } from 'react'
import { View, AsyncStorage, Text } from 'react-native'
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
    loadingStats: false,
    nav: [],
    accordionActiveKey: '',
    accordionTitle: null,
    accordionShowOnlyTitle: true,
    accordionSelectedKey: '0',
    date: moment().format('DD MMM YYYY'),
  }

  componentWillMount () {
    AsyncStorage.getItem('token')
      .then(token => {
        if (!token) {
          Actions.login({ type: ActionConst.RESET })
          return
        }
        logger.log('user detected! token from LS:', token)
        this.setState({ token })
        this.fetchNav(token)
        this.fetchInitialStats(token)
      })
      .catch(err => logger.error('err', err))
  }

  render () {
    return (
      <View style={ styles.container }>
        { this.renderNav() }
        { this.renderLoadingStats() }
        { this.renderDate() }
        { this.renderStats() }
      </View>
    )
  }

  renderNav () {
    return (
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
    )
  }

  renderDate () {
    return (
      <View style={ styles.dateContainer }>
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
      </View>
    )
  }

  renderLoadingStats () {
    if (!this.state.loadingStats) {
      return
    }
    return (
      <View>
        <Text>Loading stats ...</Text>
      </View>
    )
  }

  renderStats () {
    if (!this.state.stats.length) {
      return
    }
    return (
      <Stats data={ this.state.stats } />
    )
  }

  onAccordionClick = (key, title, evt) => {
    logger.log('\n', 'onAccordionClick', 'key', key, ', title', title, ', evt', evt)
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
  }

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
      })
      .catch(err => logger.error('fetchNav err:', err))
  }

  fetchStats (token, key, title, date) {
    this.setState({ loadingStats: true })
    const companyLevel = key.split('.').length
    logger.log('fetchStats:', 'key:', key, ', companyLevel:', companyLevel, ', title:', title, ', date:', date)
    soap.getStats(token, companyLevel, title, date)
    .then(stats => {
      logger.log('fetchStats success:', stats)
      this.setState({
        loadingStats: false,
        stats,
      })
    })
    .catch(err => {
      this.setState({ loadingStats: false })
      logger.error('fetchStats err:', err)
    })
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
