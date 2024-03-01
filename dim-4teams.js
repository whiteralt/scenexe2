!function() {
  const dim = dimension.create({
    mapSize: 6000,
    name: '4teams',
    type: '4teams',
    freeJoin: true,
    displayName: '4 Teams',
    displayColor: 3,
    walls: [ [-5200, -5200, 800, 800, 1], [5200, -5200, 800, 800, 2], [5200, 5200, 800, 800, 3], [-5200, 5200, 800, 800, 4] ],
    gates: [],
    bases: [],
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