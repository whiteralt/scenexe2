!function() {
  const dim = dimension.create({
    mapSize: 2000,                        // mapsize
    name: 'test',                         // internal name of dim
    type: '4teams',                       // leave this
    freeJoin: true,                       // whether tank can join from server select
    allowScale: true,                     // allow use of /mapsize command
    removeFallens: true,                  // remove tanks that go fallen
    displayName: '4 Teams',               // name of dim shown on server select
    displayRadiant: 0.3,                  // make color radiant on server select
    displayColor: -6,                     // color on server select
    walls: [                              // [ [x, y, w, h] ]
      [0, -500, 250, 250],                // regular wall
      [1000, -500, 250, 250],             // regular wall
      [-625, -375, 125, 125],             // regular wall
      [-625, -875, 125, 125],             // regular wall
      [-1125, -875, 125, 125],            // regular wall
      [-125, -125, 125, 125, 1],          // blue team base
      [125, -125, 125, 125, 2],           // red team base
      [-125, 125, 125, 125, 3],           // green team base
      [125, 125, 125, 125, 4],            // purple team base
    ],
    gates: [
      [1, 500, -500, 1, 250, false, 0],   // radiant gate
      [0, -375, -375, 1, 125, false, 0],  // ascention gate
      [2, -625, -625, 0, 125, false, 0],  // one way gate
      [3, -875, -875, 1, 125, false, 0],  // sanctuary gate
    ],
    background: {                         // background color
      r: 205,
      g: 205,
      b: 205
    },
    grid: {                               // grid color
      r: 200,
      g: 200,
      b: 200
    },
    gridSize: 25,
    maxPolygonSides: 8,
    maxPolygonCount: 30,
    spawnPlayer: function(team, tank) {
      tank.invincible = false             // remove spawn invincibility
      tank.invincibleTime = 0             // remove spawn invincibility timer
      setTimeout(function() {
        if(tank.ws.sendPacket) {          // send a notification
          tank.ws.sendPacket('announcement', 'Welcome to a scenexe2 private server! Type /a to get command access')
        }
      })
      return [0, 0]                       // spawn all tanks at center
    }
  })
  
  generator.wormhole({                    // create a portal
    x: 500,
    y: 0,
    size: 75,
    type: 2,
    dim: dim,
    action: function(tank) {              // executed on tank when hit
      tank.radiant ++                     // increase tank radiance by 1
      dimension.sendTankTo({              // send to dim
        tank: tank,
        dim: 'test',
      })
    }
  })
  
  setTimeout(function() {
    
    generator.polygon({                   // spawn a polygon
      x: 500,
      y: 0,
      d: 2 * Math.PI * Math.random(),     // direction polygon initially points toward
      sides: -1,                          // internal for tetrahedron
      dim: dim,
      radiant: 4
    })
    
    const bot = generator.tank({          // create a tank
      dim: dim,
      x: -1000,
      y: 0,
      name: 'Test Bot',                   // display name
      weapon: 'quad',                     // weapon
      body: 'repeller',                   // body
      score: 0,
      radiant: 3,
      static: true,                       // make bot unpushable and unable to gain xp
      team: 8                             // 8 is yellow team
    })
    bot.firing = true                     // make bot shoot
    let passive = false
    setInterval(function() {
      bot.passive = passive = !passive    // toggle passive every second
    }, 1000)
    setInterval(function() {
      bot.d += 0.1                        // rotate at 1 radian per second
    }, 100)
    
  }, 1000)
}()