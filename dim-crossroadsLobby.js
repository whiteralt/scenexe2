!function() {
  const dim = dimension.create({
    mapSize: 2400,
    name: 'crossroadsLobby',
    type: '4teams',
    freeJoin: false,
    displayName: 'Crossroads Lobby Test',
    displayColor: 7,
    walls: [ 
          [ -2100, -1800, 150, 150 ],
          [ -900, -1800, 150, 150 ],
          [ -600, -1950, 150, 300 ],
          [ -1500, -1200, 450, 150 ],
          [ -1200, -750, 150, 300 ],
          [ -300, -1200, 450, 150 ],
          [ 0, -1500, 150, 150 ],
          [ 450, -1800, 600, 150 ],
          [ 600, -1200, 150, 150 ],
          [ -1800, -450, 150, 300 ],
          [ -1800, 900, 150, 150 ],
          [ -1200, 1650, 150, 600 ],
          [ 1500, -1200, 450, 150 ],
          [ 1200, -900, 150, 150 ],
          [ 1800, -300, 150, 450 ],
          [ 1200, 300, 150, 150 ],
          [ 1650, 600, 600, 150 ],
          [ 750, 1200, 300, 150 ],
          [ 600, 1800, 450, 150 ],
          [ 1200, 2100, 150, 150 ] 
          ],
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
    maxPolygonSides: 0,
    maxPolygonCount: 0,
    spawnPlayer: function(team, tank) {
      let s = dim.mapSize
      if(tank.team > 2) { s -= 2000 }
      return [(2 * Math.random() - 1) * s, (2 * Math.random() - 1) * s]
    }
  })
  wormhole.main(dim)
}()