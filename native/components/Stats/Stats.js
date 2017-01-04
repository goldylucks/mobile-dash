import React, { Component, PropTypes } from 'react'
import { View, Text } from 'react-native'
import Circle from 'react-native-progress/Circle'

export default class Stats extends Component {

  static propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        IndexName: PropTypes.string,
        IndexValue: PropTypes.string,
      })
    ).isRequired,
  }

  render () {
    return (
      <View style={ styles.container }>
        {
          this.props.data.map(({ IndexName, IndexValue }) => (
            <View style={ styles.stat } key={ IndexName }>
              <Text style={ styles.statTitle }>{ IndexName }</Text>
              <Circle size={ 80 } progress={ Number(IndexValue) } showsText formatText={ () => this.formatCircleText(IndexValue) } />
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
