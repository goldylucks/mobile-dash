export default mockStats

function mockStats () {
  return [
    { IndexName: 'Utilisation', IndexValue: randomIndice() },
    { IndexName: 'Efficiency', IndexValue: randomIndice() },
    { IndexName: 'Quality', IndexValue: randomIndice() },
    { IndexName: 'ORE', IndexValue: randomIndice() },
  ]
}

function randomIndice () {
  return String(Math.random() * 200)
}
