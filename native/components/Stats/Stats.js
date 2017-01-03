import React, { Component, PropTypes } from 'react'
import { View, Text } from 'react-native'
import Circle from 'react-native-progress/Circle'

export default class Stats extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired,
  }

  render () {
    return (
      <View style={ styles.container }>
        {
          this.props.data.map(({ title, value }) => (
            <View style={ styles.stat } key={ title }>
              <Text style={ styles.statTitle }>{ title }</Text>
              <Circle size={ 120 } progress={ value } showsText formatText={ () => this.formatCircleText(value) } />
            </View>
          ))
        }
      </View>
    )
  }

  formatCircleText = progress => {
    return `${Math.round(progress * 100)}%`
  }
}

const styles = {

  container: {
    flex: 1,
    paddingTop: 10,
  },

  stat: {
    flex: 1,
    alignItems: 'center',
  },

  statTitle: {
    fontSize: 20,
    color: '#000',
  },

}
