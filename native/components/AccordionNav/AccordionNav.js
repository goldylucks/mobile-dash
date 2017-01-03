import React, { Component, PropTypes } from 'react'
import { View, Text } from 'react-native'

export default class AccordionNav extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired,
    activeKey: PropTypes.string.isRequired, // the key of the deepest open row
    onClick: PropTypes.func,
    showOnlyTitle: PropTypes.bool.isRequired,
    selectedKey: PropTypes.string, // last selected key, used to highlight the row when accordion is open
    onToggle: PropTypes.func,
  }

  static defaultProps = {
    activeKey: '',
    showOnlyTitle: true,
  }

  render () {
    if (!this.props.data.length) {
      return null
    }
    if (this.props.showOnlyTitle) {
      return (
        <View style={ styles.container }>
          <View style={ styles.row }>
            <Text
              style={ styles.title }
              onPress={ evt => this.onClick(null, null, evt) }>
              { this.getOnlyTitle() }
            </Text>
          </View>
        </View>
      )
    }
    return (
      <View style={ styles.container }>
        { this.props.data.map((item, idx) => this.renderRecursion(item, idx)) }
      </View>
    )
  }

  renderRecursion = ({ children, title }, idx, parentIdx) => {
    const key = this.getKey(idx, parentIdx)
    if (!children) {
      return (
        <View style={ Object.assign({}, styles.row, this.props.selectedKey === key ? styles.activeRow : {}) } key={ key }>
          <Text
            style={ styles.title }
            onPress={ evt => this.onClick(key, title, evt) }>
            { title }
          </Text>
        </View>
      )
    }

    return (
      <View style={ Object.assign({}, styles.row, this.props.selectedKey === key ? styles.activeRow : {}) } key={ key }>
        <Text
          style={ styles.title }
          onPress={ evt => this.onClick(key, title, evt) }>
          { title }
        </Text>
        <Text
          style={ Object.assign({}, styles.toggle, this.isKeyActive(key) && styles.toggleOpened) }
          onPress={ evt => this.onToggle(key, title, evt) }>
          >
        </Text>
        {
          this.isKeyActive(key) &&
          children.map((item, idx) => this.renderRecursion(item, idx, key))
        }
      </View>
    )
  }

  getOnlyTitle () {
    let selected
    this.props.selectedKey.split('.').forEach((key, idx) => {
      key = Number(key)
      if (idx === 0) {
        selected = this.props.data[key]
        return
      }
      selected = selected.children[key]
    })
    return selected.title
  }

  getKey (idx, parentIdx) {
    if (typeof parentIdx !== 'undefined') {
      return `${parentIdx}.${idx}`
    }
    return String(idx)
  }

  isKeyActive (key) {
    const re = new RegExp('^' + key)
    return this.props.activeKey.match(re)
  }

  onClick (key, title, evt) {
    this.props.onClick(key, title, evt)
  }

  onToggle (key, title, evt) {
    const nextActiveKey = this.isKeyActive(key) ? key.slice(0, -2) : key
    this.props.onToggle({ key, title, nextActiveKey, evt })
  }

}

const styles = {
  row: {
    backgroundColor: '#eee',
    paddingLeft: 5,
  },
  activeRow: {
    backgroundColor: '#dad5d5',
  },
  title: {
    fontSize: 20,
    padding: 10,
  },
  toggle: {
    position: 'absolute',
    top: 0,
    right: 10,
    padding: 10,
    fontSize: 20,
    color: 'black',
  },
  toggleOpened: {
    transform: [{ rotate: '90deg' }],
  },
}
