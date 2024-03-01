!function() {
  const dim = dimension.create({
    mapSize: 750,
    name: 'test',
    type: 'ffa',
    freeJoin: true,
    displayName: 'test',
    displayColor: 0,
    walls: [],
    gates: [],
    gleaming: 1,
    background: {
      r: 205,
      g: 205,
      b: 205
    },
    grid: {
      r: 200,
      g: 200,
      b: 200
    },
    gridSize: 25,
    maxPolygonSides: 13,
    minPolygonSides: 3,
    maxPolygonCount: 0,
    spawnPlayer: function(team, tank) {
      let s = dim.mapSize
      if(tank.team > 4) { s -= 2000 }
      return [(2 * Math.random() - 1) * s, (2 * Math.random() - 1) * s]
    }
  })
}()