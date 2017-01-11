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
    const { data } = this.props
    return (
      <View style={ styles.container }>
        <View style={ styles.row }>
          <View style={ styles.stat } key={ data[0].IndexName }>
            <Text style={ styles.statTitle }>{ data[0].IndexName }</Text>
            <Circle size={ 120 } progress={ Number(data[0].IndexValue / 100) } showsText formatText={ () => this.formatCircleText(data[0].IndexValue / 100) } />
          </View>
          <View style={ styles.stat } key={ data[1].IndexName }>
            <Text style={ styles.statTitle }>{ data[1].IndexName }</Text>
            <Circle size={ 120 } progress={ Number(data[1].IndexValue / 100) } showsText formatText={ () => this.formatCircleText(data[1].IndexValue / 100) } />
          </View>
        </View>
        <View style={ styles.row }>
          <View style={ styles.stat } key={ data[2].IndexName }>
            <Text style={ styles.statTitle }>{ data[2].IndexName }</Text>
            <Circle size={ 120 } progress={ Number(data[2].IndexValue / 100) } showsText formatText={ () => this.formatCircleText(data[2].IndexValue / 100) } />
          </View>
          <View style={ styles.stat } key={ data[3].IndexName }>
            <Text style={ styles.statTitle }>{ data[3].IndexName }</Text>
            <Circle size={ 120 } progress={ Number(data[3].IndexValue / 100) } showsText formatText={ () => this.formatCircleText(data[3].IndexValue / 100) } />
          </View>
        </View>
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
    justifyContent: 'space-around',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
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
