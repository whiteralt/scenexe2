!function() {
  const dim = dimension.create({
    mapSize: 18000,
    name: 'abyss',
    type: '4teams',
    freeJoin: false,
    displayName: 'Abyss Test',
    displayColor: 7,
    walls: [ [450, -700, 300, 150],       
          [650, -700, 200, 150],
          [700, -350, 150, 200],
          [-450, 700, 300, 150],       
          [-650, 700, 200, 150],
          [-700, 350, 150, 200], 
          [-450, -700, 300, 150],
          [-650, -700, 200, 150],
          [-700, -350, 150, 200],
          [450, 700, 300, 150],       
          [650, 700, 200, 150],
          [700, 350, 150, 200] ],
    gates: [ [/* T */ 2, /* X */ -700, /* Y */ 0, /* D */ 0, /* L */ 150, /* O */ false, /*OT*/ 0],
           [/* T */ 2, /* X */ 700, /* Y */ 0, /* D */2, /* L */ 150, /* O */ false, /*OT*/ 0],
           [/* T */ 2, /* X */ 0, /* Y */ -700, /* D */1, /* L */ 150, /* O */ false, /*OT*/ 0],
           [/* T */ 2, /* X */ 0, /* Y */ 700, /* D */3, /* L */ 150, /* O */ false, /*OT*/ 0] ], 
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
    maxPolygonSides: 12,
    maxPolygonCount: 75,
    spawnPlayer: function(team, tank) {
      let s = dim.mapSize
      if(tank.team > 2) { s -= 2000 }
      return [(2 * Math.random() - 1) * s, (2 * Math.random() - 1) * s]
    }
  })
  wormhole.main(dim)
}()