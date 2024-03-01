!function() {
  const dim = dimension.create({
    mapSize: 4500,
    name: 'abyssHallway',
    type: '4teams',
    freeJoin: false,
    displayName: 'Abyss Hallway Test',
    displayColor: 7,
    walls: [],
    gates: [], 
    background: {
      r: 12,
      g: 12,
      b: 12
    },
    grid: {
      r: 21,
      g: 21,
      b: 21
    },
    gridSize: 25,
    maxPolygonSides: 8,
    maxPolygonCount: 30,
    spawnPlayer: function(team, tank) {
      let s = dim.mapSize
      if(tank.team > 2) { s -= 2000 }
      return [(2 * Math.random() - 1) * s, (2 * Math.random() - 1) * s]
    }
  })
  wormhole.main(dim)
}()