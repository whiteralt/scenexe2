!function(){
  const dim = dimension.create({
    mapSize : 6000, 
    name: 'sanctuary',
    type: 'ffa',
    freeJoin: false, 
    displayName: 'Sanctuary Test',
    displayColor: 6,
    walls:[ [4000, 4000, 2000, 2000],
          [-4000, 4000, 2000, 2000],
          [4000, -4000, 2000, 2000],
          [-4000, -4000, 2000, 2000],
          [1100, 4000, 900, 2000], 
          [-1100, 4000, 900, 2000],
          [1100, -4000, 900, 2000],
          [-1100, -4000, 900, 2000],
          [4000, 1100, 2000, 900],
          [4000, -1100, 2000, 900],
          [-4000, 1100, 2000, 900],
          [-4000, -1100, 2000, 900],
          [0, 0, 1100, 1100, 6] ],
    gates: [ [3, -2300, 0, 0, 200, false, 0],
           [3, 2300, 0, 2, 200, false, 0],
           [3, 0, -2300, 1, 200, false, 0],
           [3, 0, 2300, 3, 200, false, 0] ],
    background: {
      r: 105,
      g: 105,
      b: 105},
    grid: {
      r: 100,
      g: 100,
      b: 100},
    gridSize: 100,
    maxPolygonSides: 0,
    maxPolygonCount: 0,
    spawnPlayer: function(team, tank) {
      let s = [0, 0]
      if(tank.team > 0) { s -= 2000 }
      return [(2 * Math.random() - 1) * s, (2 * Math.random() - 1) * s]
    }
  })
  wormhole.main(dim)
}()