import React, { Component } from 'react'
import { View, Image, AsyncStorage, TouchableWithoutFeedback, Dimensions, ActivityIndicator } from 'react-native'
import { Actions, ActionConst } from 'react-native-router-flux'
import DatePicker from 'react-native-datepicker'
import moment from 'moment'
import logger from '../../utils/logger'
import * as soap from '../../utils/soap'
import AccordionNav from '../../components/AccordionNav'
import Stats from '../../components/Stats'

const dateFormat = 'DD MMM YYYY'

export default class HomePage extends Component {

  state = {
    token: null,
    stats: [],
    loadingStats: false,
    isViewLoaded: false,
    nav: [],
    accordionActiveKey: '',
    accordionTitle: null,
    accordionShowOnlyTitle: true,
    accordionSelectedKey: '0',
    date: moment().format(dateFormat),
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
          .then(() => this.setState({ isViewLoaded: true }))
      })
      .catch(err => logger.error('err', err))
  }

  render () {
    return (
      <Image source={ require('../../../assets/images/background.png') } style={ [styles.backgroundImage] }>
        { this.renderContent() }
        { this.renderLoading() }
      </Image>
    )
  }

  renderContent () {
    if (!this.state.isViewLoaded) {
      return
    }
    return (
      <View style={ [styles.container, styles.content] }>
        { this.renderNav() }
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
        <TouchableWithoutFeedback onPress={ this.decreaseDate }>
          <View style={ styles.leftDateArrow }>
            <View style={ styles.leftDateArrowPointer } />
            <View style={ styles.leftDateArrowBase } />
          </View>
        </TouchableWithoutFeedback>
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
        <TouchableWithoutFeedback onPress={ this.increaseDate }>
          <View style={ styles.rightDateArrow } onPress={ this.increaseDate }>
            <View style={ styles.rightDateArrowBase } />
            <View style={ styles.rightDateArrowPointer } />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderLoading () {
    return (
      <View style={ [styles.loading, (this.state.loadingStats || !this.state.isViewLoaded) ? {} : styles.hideLoading] }>
        <ActivityIndicator
          animating
          style={ styles.loadingIndicator }
          color={ '#D0E28D' }
          size={ 100 }
        />
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

  increaseDate = evt => {
    const newDate = moment(this.state.date, dateFormat).add(1, 'day').format(dateFormat)
    this.setState({ date: newDate })
    this.onDateChange(newDate)
  }

  decreaseDate = evt => {
    const newDate = moment(this.state.date, dateFormat).subtract(1, 'day').format(dateFormat)
    this.setState({ date: newDate })
    this.onDateChange(newDate)
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

  fetchNav (token) {
    logger.log('fetchNav')
    return soap.getNav(token)
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
  backgroundImage: {
    flex: 1,
    resizeMode: 'contain',
    // remove width and height to override fixed static size
    width: null,
    height: null,
  },

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

  dateContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
  },

  leftDateArrow: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 20,
  },

  leftDateArrowPointer: {
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#006738',
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderRightWidth: 20,
  },

  leftDateArrowBase: {
    backgroundColor: '#006738',
    height: 10,
    width: 20,
  },

  rightDateArrow: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 15,
  },

  rightDateArrowPointer: {
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#006738',
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 20,
  },

  rightDateArrowBase: {
    backgroundColor: '#006738',
    height: 10,
    width: 20,
  },

  loading: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(50, 50, 50, 0.8)',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // workaround for bug
  hideLoading: {
    top: Dimensions.get('window').height * 2, // multiply by 2 just in case
  },

}
