!function() {
  const dim = dimension.create({
    mapSize: 6000,
    name: '2teams',
    type: '2teams',
    freeJoin: true,
    displayName: '2 Teams',
    displayColor: 4,
    walls: [ [-5200, 0, 800, 6000, 1], [5200, 0, 800, 6000, 2] ],
    gates: [],
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
    maxPolygonCount: 50,
    spawnPlayer: function(team, tank) {
      let s = dim.mapSize
      if(tank.team > 2) { s -= 2000 }
      return [(2 * Math.random() - 1) * s, (2 * Math.random() - 1) * s]
    }
  })
  wormhole.main(dim)
}()
