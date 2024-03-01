!(function () {
  const dim = dimension.create({
    mapSize: 2500,
    name: "wastelands",
    type: "4tdm",
    freeJoin: true,
    displayName: "Wastelands",
    displayColor: 8,
    //[x, y , w, l]
    walls: [],
    gates: [],
    background: {
      r: 255,
      g: 222,
      b: 102,
    },
    grid: {
      r: 255,
      g: 214,
      b: 102,
    },
    gridSize: 25,
    maxPolygonSides: 3,
    minPolygonSides: 3,
    maxPolygonCount: 200,
    spawnPlayer: function (team, tank) {
      let s = dim.mapSize;
      if (tank.team > 4) {
        s -= 2000;
      }
      return [(2 * Math.random() - 1) * s, (2 * Math.random() - 1) * s];
    },
  });
})();
