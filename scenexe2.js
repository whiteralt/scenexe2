const { pack, unpack } = require("msgpackr"),
  WebSocket = require("ws"),
  { WebSocketServer } = WebSocket,
  fs = require("fs"),
  http = require("http"),
  url = require("url"),
  { performance } = require("perf_hooks");
let secret = {};
const checkName = function (e) {
    return !0;
  },
  access = {
    testing: [],
    p2: [
      "tp",
      "team",
      "dim",
      "weapon",
      "body",
      "kick",
      "ban",
      "kill",
      "remove",
      "ascend",
      "vanish",
      "drag",
      "getip",
      "god",
      "name",
    ],
  };
console.log = new Proxy(console.log, {
  apply: function (e, t, a) {
    let n = new Date();
    return (
      a.unshift(`[${n.toDateString()} ${n.toTimeString().split(" ")[0]}]`),
      Reflect.apply(e, t, a)
    );
  },
});
const main = function (tankData, args) {
  process.on("uncaughtException", function (e) {
    console.log(e);
  });
let app = function(e, t) {
    let a = url.parse(e.url),
        n = a.pathname;
    if ("/tankData.json" === n) {
        t.setHeader("Access-Control-Allow-Origin", "*");
        t.writeHead(200, {
            "Content-Type": "application/json"
        });
        t.end(JSON_tankData);
    } else {
        t.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8"
        });
        const redirectUrl = 'https://scenexe2.io?s=' + e.headers.host;
        const htmlContent = `
            <button id="redirectButton">Go to server!</button>
            <script>
                document.getElementById('redirectButton').addEventListener('click', function() {
                    window.location.href = "${redirectUrl}";
                });
            </script>
        `;
        t.end(htmlContent);
    }
},
    httpServer =
      secret.key && secret.cert
        ? http.createServer(
            {
              key: fs.readFileSync(secret.key),
              cert: fs.readFileSync(secret.cert),
            },
            app,
          )
        : http.createServer(app);
  args.port >= 0 ? httpServer.listen(args.port) : httpServer.listen();
  let server = new WebSocketServer({ noServer: !0 });
  httpServer.on("upgrade", (e, t, a) => {
    let n = !0,
      i = url.parse(e.url);
    Object.fromEntries(new url.URLSearchParams(i.query));
    let l = i.pathname,
      s = !0,
      o;
    if (l.startsWith("/ws-")) {
      if (6 === (o = l.slice(4)).length) {
        let r = 0;
        for (let d = 0; d < 5; d++) {
          let $ = "0123456789abcdef".indexOf(o[d]);
          if ($ < 0) {
            s = !1;
            break;
          }
          r += $;
        }
        "0123456789abcdef".indexOf(o[5]) !== r % 16 && (s = !1);
      } else s = !1;
    } else s = !1;
    if (s) {
      for (let c = clients.length - 1; c >= 0; c--)
        if (clients[c].joinToken === o) {
          s = !1;
          break;
        }
    }
    s
      ? server.handleUpgrade(e, t, a, (e) => {
          n ? (e.joinToken = o) : (e.failedHeaderCheck = !0),
            server.emit("connection", e);
        })
      : t.destroy();
  });
  let JSON_tankData = JSON.stringify(tankData),
    Detector = (function () {
      let e = {
        sliceWidth: 100,
        canCollide: function (e, t) {
          return (
            !e.noCollide &&
            !t.noCollide &&
            {
              tank: {
                tank: !0,
                detectEnemies: !0,
                detectFriends: !0,
                bullet: !0,
                polygon: !0,
                wall: !0,
                gate: !0,
                wormhole: !0,
              },
              detectEnemies: { tank: !0, polygon: !0, bullet: !0 },
              bullet: {
                tank: !0,
                bullet: !0,
                polygon: !0,
                wall: !0,
                gate: !0,
                wormhole: !0,
                detectEnemies: !0,
              },
              polygon: {
                tank: !0,
                bullet: !0,
                detectEnemies: !0,
                polygon: !0,
                wall: !0,
                gate: !0,
                wormhole: !0,
              },
              detectFriends: { tank: !0 },
              wall: { tank: !0, bullet: !0, polygon: !0 },
              gate: { tank: !0, bullet: !0, polygon: !0 },
              wormhole: { tank: !0, bullet: !0, polygon: !0 },
            }[e.type][t.type]
          );
        },
        checkCircle: function (e, t) {
          let a = {
            dx: e.x - t.x,
            dy: e.y - t.y,
            distance: 0,
            size: e.size + t.size,
            colliding: !1,
          };
          return (
            (a.distance = a.dx * a.dx + a.dy * a.dy),
            a.distance < a.size * a.size && (a.colliding = !0),
            0 === a.dx && 0 === a.dy && (a.dy = 1),
            a
          );
        },
        checkRect: function (e, t) {
          t.rectangular && ([e, t] = [t, e]);
          let a = {
            dx: t.x - e.x,
            dy: t.y - e.y,
            colliding: !0,
            rect: e,
            circle: t,
          };
          e.noClip
            ? (a.size = t.size)
            : (a.size = t.size < 100 ? t.size / 2 : t.size - 50),
            (a.inX = t.x + a.size > e.left && t.x - a.size < e.right),
            (a.inY = t.y + a.size > e.bottom && t.y - a.size < e.top);
          let n = t.size - a.size;
          return ((a.cinX = t.x > e.left + n && t.x < e.right - n),
          (a.cinY = t.y > e.bottom + n && t.y < e.top - n),
          (a.inX && a.cinY) + (a.inY && a.cinX))
            ? ((a.hitSide = !0), a)
            : ((a.cx = t.x < e.x ? e.left + n : e.right - n),
              (a.cy = t.y < e.y ? e.bottom + n : e.top - n),
              (a.dcx = t.x - a.cx),
              (a.dcy = t.y - a.cy),
              (a.distance = a.dcx * a.dcx + a.dcy * a.dcy),
              a.distance >= t.size * t.size && (a.colliding = !1),
              a);
        },
        detectCollisions: function (t, a) {
          let n = {},
            i = {},
            l = 1 / e.sliceWidth,
            s = t.length;
          for (let o = 0; o < s; o++) {
            let r = t[o],
              d = r.w || r.size,
              $ = r.h || r.size;
            (r.left = r.x - d),
              (r.right = r.x + d),
              (r.bottom = r.y - $),
              (r.top = r.y + $),
              (r.w = d),
              (r.h = $),
              (r.internalId = o);
            let c = 1 + Math.floor(r.left * l),
              u = 1 + Math.floor(r.right * l);
            for (let p = c; p <= u; p++) p in i ? i[p].push(r) : (i[p] = [r]);
          }
          let m = (e, t) => e.bottom - t.bottom,
            g = function (e, t) {
              let a = n[e];
              return a || (a = n[e] = {}), !(t in a) && ((a[t] = !0), !0);
            },
            f = 0;
          for (let _ in i) {
            let y = i[_];
            y.sort(m);
            for (let h = 0, k = y.length - 1; h < k; h++) {
              let b = y[h];
              for (let v = h + 1; v <= k; v++) {
                let x = y[v];
                if (x.bottom > b.top) break;
                if (
                  b.right >= x.left &&
                  b.left <= x.right &&
                  (b.object,
                  x.object,
                  e.canCollide(b, x) && g(b.internalId, x.internalId))
                ) {
                  if (b.rectangular || x.rectangular) {
                    if (b.rectangular ^ x.rectangular) {
                      let w = e.checkRect(b, x);
                      w.colliding && a(w.circle, w.rect, w);
                    }
                  } else {
                    let T = e.checkCircle(b, x);
                    T.colliding && a(b, x, T);
                  }
                }
                f++;
              }
            }
          }
          return f;
        },
      };
      return e;
    })(),
    View = (function () {
      let e = {
        sliceWidth: 100,
        canCollide: function (e, t) {
          return { fov: { bullet: !0 }, bullet: { fov: !0 } }[e.type][t.type];
        },
        checkCircle: function (e, t) {
          let a = {
            dx: e.x - t.x,
            dy: e.y - t.y,
            distance: 0,
            size: e.size + t.size,
            colliding: !1,
          };
          return (
            (a.distance = a.dx * a.dx + a.dy * a.dy),
            a.distance < a.size * a.size && (a.colliding = !0),
            0 === a.dx && 0 === a.dy && (a.dy = 1),
            a
          );
        },
        detectCollisions: function (t, a) {
          let n = {},
            i = {},
            l = 1 / e.sliceWidth,
            s = t.length;
          for (let o = 0; o < s; o++) {
            let r = t[o],
              d = r.w || r.size,
              $ = r.h || r.size;
            (r.left = r.x - d),
              (r.right = r.x + d),
              (r.bottom = r.y - $),
              (r.top = r.y + $),
              (r.w = d),
              (r.h = $),
              (r.internalId = o);
            let c = 1 + Math.floor(r.left * l),
              u = 1 + Math.floor(r.right * l);
            for (let p = c; p <= u; p++) p in i ? i[p].push(r) : (i[p] = [r]);
          }
          let m = (e, t) => e.bottom - t.bottom,
            g = function (e, t) {
              let a = n[e];
              return a || (a = n[e] = {}), !(t in a) && ((a[t] = !0), !0);
            },
            f = 0;
          for (let _ in i) {
            let y = i[_];
            y.sort(m);
            for (let h = 0, k = y.length - 1; h < k; h++) {
              let b = y[h];
              for (let v = h + 1; v <= k; v++) {
                let x = y[v];
                if (x.bottom > b.top) break;
                if (
                  b.right >= x.left &&
                  b.left <= x.right &&
                  (b.object,
                  x.object,
                  e.canCollide(b, x) && g(b.internalId, x.internalId))
                ) {
                  let w = e.checkCircle(b, x);
                  w.colliding && a(b, x, w);
                }
                f++;
              }
            }
          }
          return f;
        },
      };
      return e;
    })(),
    game = {
      tokens: {},
      tokenUses: {},
      generateToken: function () {
        let e = "scenexe2-";
        for (let t = 0; t < 55; t++)
          e += "0123456789abcdef"[Math.floor(16 * Math.random())];
        return e in game.tokens ? game.generateToken() : e;
      },
      codes:
        args.codes ||
        (function () {
          let e = {
            recieve: {
              ready: 0,
              gameUpdate: 1,
              gameStart: 2,
              announcement: 3,
              death: 4,
              setStats: 5,
              test: 6,
              flag: 7,
            },
            send: {
              joinGame: 0,
              chat: 1,
              typing: 2,
              passive: 3,
              firing: 4,
              controlPosition: 5,
              upgradeStat: 6,
              upgradeWeapon: 7,
              upgradeBody: 8,
              restore: 9,
              direction: 10,
              d: 11,
              token: 12,
              result: 13,
              ping: 14,
              captcha: 15,
              login: 16,
            },
          };
          for (let t in e.send) e.send[e.send[t]] = t;
          for (let a in e.recieve) e.recieve[e.recieve[a]] = a;
          return e;
        })(),
      c: {
        recieve: {
          0: "ready",
          ready: 0,
          1: "gameUpdate",
          gameUpdate: 1,
          2: "gameStart",
          gameStart: 2,
          3: "announcement",
          announcement: 3,
          4: "death",
          death: 4,
          5: "setStats",
          setStats: 5,
          6: "test",
          test: 6,
          7: "flag",
          flag: 7,
        },
        send: {
          joinGame: 14,
          14: "joinGame",
          chat: 1,
          1: "chat",
          typing: 2,
          2: "typing",
          passive: 3,
          3: "passive",
          firing: 4,
          4: "firing",
          controlPosition: 5,
          5: "controlPosition",
          upgradeStat: 6,
          6: "upgradeStat",
          upgradeWeapon: 7,
          7: "upgradeWeapon",
          upgradeBody: 8,
          8: "upgradeBody",
          restore: 9,
          9: "restore",
          direction: 10,
          10: "direction",
          d: 11,
          11: "d",
          token: 17,
          17: "token",
          result: 29,
          29: "result",
          ping: 31,
          31: "ping",
          captcha: 79,
          79: "captcha",
        },
      },
      token: secret.token,
    },
    createMessage = function () {
      args.parentPort.postMessage(["createMessage", Array.from(arguments)]);
    },
    dimension = {
      tickTime: 0.02,
      tickRate: 50,
      tickMultiplier: 2,
      power97: 0.9409,
      power96: 0.9216,
      antilag: function () {
        for (let e in dimension.dims) {
          let t = dimension.dims[e],
            a = t.tanks;
          for (let n = a.length - 1; n >= 0; n--) {
            let i = a[n];
            i.static || i.ws.data.isPlayer || i.remove();
          }
          for (let l = t.tanks.length - 1; l >= 0; l--)
            t.tanks[l].removeBullets();
          for (let s = t.polygons.length - 1; s >= 0; s--)
            t.polygons[s].remove();
        }
      },
      antibot: function () {
        for (let e in dimension.dims) {
          let t = dimension.dims[e].tanks;
          for (let a = t.length - 1; a >= 0; a--) {
            let n = t[a];
            !n.static &&
              n.ws.data.isPlayer &&
              n.score < 1e4 &&
              (n.remove(), n.ws.close());
          }
        }
      },
      sendTankTo: function (e) {
        let t = e.dim;
        e.dim = dimension.dims[t];
        let a = {
          dim: e.dim,
          ai: e.tank.aiInput,
          aiRam: e.tank.aiRam,
          polygon: e.tank.polygon,
          invisible: e.tank.invisible,
          noKillNotification: e.tank.noKillNotification,
          forceDeathScore: e.tank.forceDeathScore,
          x: e.x || 0,
          y: e.y || 0,
          d: e.tank.d,
          upgrades: e.tank.upgrades,
          upgradeCount: e.tank.upgradeCount,
          radiant: e.tank.radiant,
          name: e.tank.name,
          team: e.tank.team,
          score: e.tank.score,
          weapon: e.tank.weapon,
          body: e.tank.body,
          passive: e.tank.passive,
        };
        e.tank.team && (e.tank.ws.data.lastTeam = e.tank.team),
          e.dim
            ? (e.dim.newTanks.push([a, e.tank.ws, e.tank.dim.name]),
              e.tank.remove(!0))
            : (e.tank.ws.data.isPlayer
                ? e.tank.ws.data.uid >= 0 &&
                  (delete a.aiRam,
                  delete a.ai,
                  delete a.dim,
                  (a.commands = e.tank.ws.data.commands),
                  args.parentPort.postMessage([
                    "send",
                    [e.tank.ws.data.uid, t, [a, e.tank.dim.name]],
                  ]))
                : ("string" != typeof e.tank.ai && e.tank.ai) ||
                  (delete a.dim,
                  (a.commands = {}),
                  args.parentPort.postMessage([
                    "sendBot",
                    [t, [a, e.tank.dim.name]],
                  ])),
              e.tank.remove(!0));
      },
      getBulletSpeed: function (e, t) {
        let a = 4.5 * e.speed * (1 + t.upgrades[1] / 30);
        return (
          1 === e.type || 3 === e.type
            ? (a *= 1.5)
            : (2 === e.type || 4 === e.type) && (a *= 0.5),
          a
        );
      },
      getBulletData: function (e) {
        let t = 1,
          a = 1;
        return (
          0 === e
            ? ((a = 1.5), (t = 100))
            : 1 === e
              ? ((a = 12), (t = 800))
              : 2 === e
                ? ((a = 0), (t = 100))
                : 3 === e
                  ? ((a = 12), (t = 800))
                  : 4 === e && ((a = 0), (t = 100)),
          [a, t]
        );
      },
      aimAtTarget: function (e, t, a) {
        a *= 2;
        let n = t.x - e.x,
          i = t.y - e.y,
          l = t.xv * t.xv + t.yv * t.yv - a * a,
          s = 2 * (n * t.xv + i * t.yv),
          o = s * s - 4 * l * (n * n + i * i);
        if (!(o > 0)) return [n, i];
        {
          let r = Math.sqrt(o),
            d = [(-s + r) / (2 * l), (-s - r) / (2 * l)];
          if (d[0] > 0 && d[1] > 0) d = d[0] < d[1] ? d[0] : d[1];
          else if (d[0] > 0) d = d[0];
          else {
            if (!(d[1] > 0)) return [n, i];
            d = d[1];
          }
          let $;
          return [n + d * t.xv, i + d * t.yv];
        }
      },
      wallRestitution: 0.1,
      averageAngles: function (e, t, a) {
        let n = 2 * Math.PI;
        e = ((e % n) + n) % n;
        let i = (n + t - e) % n;
        return i > Math.PI
          ? (((e + (i - n) / (a + 1)) % n) + n) % n
          : (((e + i / (a + 1)) % n) + n) % n;
      },
      confine: function (e, t) {
        e.x < -t
          ? ((e.x = -t), (e.xv = Math.abs(e.xv * dimension.wallRestitution)))
          : e.x > t &&
            ((e.x = t), (e.xv = -Math.abs(e.xv * dimension.wallRestitution))),
          e.y < -t
            ? ((e.y = -t), (e.yv = Math.abs(e.yv * dimension.wallRestitution)))
            : e.y > t &&
              ((e.y = t), (e.yv = -Math.abs(e.yv * dimension.wallRestitution)));
      },
      getRadiantMultiplier: function (e) {
        return e <= 0 ? 1 : e <= 1 ? 25 : 25 * Math.pow(4, e - 1);
      },
      dims: {},
      isSameTeam: function (e, t) {
        return (
          e &&
          t &&
          (e === t ||
            (e.team && e.team === t.team) ||
            (e.parent && (e.parent === t.parent || e.parent === t)) ||
            (t.parent && t.parent === e))
        );
      },
      create: function (e) {
        if (!(e.name in dimension.dims)) {
          let t = e.darkness > 0 ? Math.round(100 * e.darkness) : 0,
            a = e.maxPolygonCount || 0;
          args.lessPolygons && (a *= 0.1);
          let n = {
            playerCount: function () {
              let e = 0;
              for (let t = n.tanks.length - 1; t >= 0; t--) {
                let a = n.tanks[t];
                a.ws && a.ws.data && a.ws.data.isPlayer && e++;
              }
              return e;
            },
            onDeath: e.onDeath || function () {},
            freeJoin: e.freeJoin || !1,
            fillWalls: !!e.fillWalls,
            displayName: e.displayName || "",
            displayColor: e.displayColor || 0,
            displayRadiant: e.displayRadiant || 0,
            friction: !0,
            nextSpawnPolyhedra: !1,
            lastPolyhedra: 0,
            mapSize: e.mapSize || 100,
            gridSize: e.gridSize || 30,
            background: e.background,
            grid: e.grid,
            maxPolygonSides: e.maxPolygonSides || 0,
            maxPolygonCount: a,
            name: e.name,
            tanks: [],
            type: e.type || "ffa",
            ids: { tank: [], bullet: [], polygon: [], wormhole: [] },
            spawnPlayer:
              e.spawnPlayer ||
              function () {
                return [0, 0];
              },
            spawnPolygon: e.spawnPolygon || !1,
            newTanks: [],
            darkness: t,
            darknessUpdated: !1,
            setDarkness: function (e) {
              let t = e > 0 ? Math.round(100 * e) : 0;
              t !== n.darkness && ((n.darkness = t), (n.darknessUpdated = !0));
            },
            resizedWormholes: {},
            rupturedWormholes: {},
            fadeTimeChanges: {},
            removedWormholes: {},
            addedWormholes: {},
            updatedTanks: {},
            updatedGates: {},
            updatedPortals: {},
            updatedWalls: {},
            bullets: [],
            polygons: [],
            bases: [],
            walls: e.walls || [],
            gates: e.gates || [],
            wormholes: {},
            chatMessages: {},
            leaderboard: [],
            leaderboardChanges: {},
            remove: function () {
              dimension.dims[n.name] === n && delete dimension.dims[n.name];
            },
            add: function (e, t) {
              let a = n[e];
              0 > a.indexOf(t) && a.push(t);
            },
            delete: function (e, t) {
              let a = n[e],
                i = a.indexOf(t);
              i >= 0 && a.splice(i, 1);
            },
            broadcast: function (e) {
              for (let t = n.tanks.length - 1; t >= 0; t--) {
                let a = n.tanks[t];
                a.ws && a.ws.sendPacket && a.ws.sendPacket("announcement", e);
              }
            },
          };
          if ("ffa" === n.name || "4teams" === n.name || "2teams" === n.name) {
            let i = function () {
              let e = { data: {}, sendPacket: function () {} },
                t = Math.floor(4 * Math.pow(Math.random(), 2)),
                a = `crasher${t + 3}-0`,
                l = 0;
              if (4096 * Math.random() < 1)
                for (l++; 9 * Math.random() < 1; ) l++;
              let s = generator.tank(
                {
                  dim: n,
                  x: (1 - 2 * Math.random()) * (n.mapSize - 2e3),
                  y: (1 - 2 * Math.random()) * (n.mapSize - 2e3),
                  name:
                    "an Awakened " +
                    ["Triangle", "Square", "Pentagon", "Hexagon"][t],
                  weapon: a,
                  body: a,
                  noKillNotification: !0,
                  score: 5250 * Math.pow(4, t),
                  radiant: l,
                  team: 5,
                  ai: "fallen",
                  aiRam: !0,
                  invincible: !1,
                  onDeath: function () {
                    setTimeout(i, 1e4 + 2e4 * Math.random());
                  },
                  polygon: !0,
                },
                e,
              );
              e.data.tank = s;
            };
            for (let l = 0; l < 10; l++) i();
          }
          return (dimension.dims[n.name] = n), startTick(n), n;
        }
      },
      reset: function (e) {
        for (let t = e.tanks.length - 1; t >= 0; t--) {
          let a = e.tanks[t];
          (a._d = []),
            (a.firedBarrels = {}),
            a.lastLevelSent !== a.level && (a.lastLevelSent = a.level);
        }
        (e.updatedTanks = {}),
          (e.chatMessages = {}),
          (e.updatedGates = {}),
          (e.resizedWormholes = {}),
          (e.rupturedWormholes = {}),
          (e.fadeTimeChanges = {}),
          (e.removedWormholes = {}),
          (e.addedWormholes = {}),
          (e.updatedPortals = {}),
          (e.updatedWalls = {}),
          (e.darknessUpdated = !1);
      },
      bounceCircles: function (e, t, a, n, i) {
        let l = Math.sqrt(a.distance) || 0;
        l <= 1 && (l = 1);
        let s = (a.size - l + 1) * 0.01 * n;
        s > 0.5 ? (s = 0.5) : s < i && (s = i);
        let o = ((e.x - t.x) / l) * s,
          r = ((e.y - t.y) / l) * s,
          d = 1,
          $ = 1,
          c = e.size * (e.weight || 1),
          u = t.size * (t.weight || 1);
        t.size > e.size ? ($ = ($ = c / u) * $) : (d = (d = u / c) * d),
          e.static ||
            ((d *= dimension.tickMultiplier / (e.density || 1)),
            (e.xv += o * d),
            (e.yv += r * d)),
          t.static ||
            (($ *= dimension.tickMultiplier / (t.density || 1)),
            (t.xv += -o * $),
            (t.yv += -r * $));
      },
      collideWall: function (e) {
        let t = e.rect,
          a = e.circle.object;
        if (e.cinX || e.cinY)
          e.cinX && e.cinY
            ? (Math.abs((a.y - t.y) * t.w) > Math.abs((a.x - t.x) * t.h)
                ? a.y > t.y
                  ? (a.y = e.rect.top + e.size)
                  : (a.y = e.rect.bottom - e.size)
                : a.x > t.x
                  ? (a.x = e.rect.right + e.size)
                  : (a.x = e.rect.left - e.size),
              "tank" !== a.objectType && a.remove())
            : (e.cinY &&
                e.inX &&
                (a.x > t.x
                  ? (a.x = e.rect.right + e.size)
                  : (a.x = e.rect.left - e.size),
                (a.xv = -a.xv * dimension.wallRestitution)),
              e.cinX &&
                e.inY &&
                (a.y > t.y
                  ? (a.y = e.rect.top + e.size)
                  : (a.y = e.rect.bottom - e.size),
                (a.yv = -a.yv * dimension.wallRestitution)));
        else {
          let n = Math.sqrt(e.distance);
          n < 0.1 && (n = 0.1);
          let i = a.size / n;
          (a.x = e.cx + (a.x - e.cx) * i), (a.y = e.cy + (a.y - e.cy) * i);
        }
      },
      bounceGate: function (e, t, a) {
        (a *= dimension.tickMultiplier),
          (0 === e.d) + (2 === e.d)
            ? t.xv > 0
              ? ((t.xv = -a), (t.x = e.left - t.size - 1))
              : ((t.xv = a), (t.x = e.right + t.size + 1))
            : t.yv > 0
              ? ((t.yv = -a), (t.y = e.bottom - t.size - 1))
              : ((t.yv = a), (t.y = e.top + t.size + 1));
      },
      collideGate: function (e, t) {
        let a = e.rect,
          n = a.object[5];
        if (2 === a.gateType) {
          let i = a.d < 2 ? 50 : -50;
          0 === a.d || 2 === a.d ? (t.xv = i) : (t.yv = i);
        } else
          1 === a.gateType
            ? n ||
              (t.parent && t.parent.radiant > 0) ||
              (t.radiant > 0
                ? ((a.object[5] = !0), (a.object[6] = 15))
                : 0 === a.d || 2 === a.d
                  ? t.xv > 0
                    ? ((t.xv = -50), (t.x = a.left - t.size - 1))
                    : ((t.xv = 50), (t.x = a.right + t.size + 1))
                  : t.yv > 0
                    ? ((t.yv = -50), (t.y = a.bottom - t.size - 1))
                    : ((t.yv = 50), (t.y = a.top + t.size + 1)))
            : 0 === a.gateType
              ? t.level >= 60 && 7 !== t.team
                ? 6 !== t.team &&
                  (t.ascend(),
                  t.ws &&
                    t.ws.sendPacket &&
                    t.ws.sendPacket("setStats", t.upgrades))
                : dimension.bounceGate(a, t, 50)
              : 3 !== a.gateType ||
                n ||
                ([t.xv > 0, t.yv > 0, t.xv < 0, t.yv < 0][a.d]
                  ? ((a.object[5] = !0),
                    (a.object[6] = 15),
                    0 === a.d || 2 === a.d
                      ? (t.xv = 2 === a.d ? -100 : 100)
                      : (t.yv = 3 === a.d ? -100 : 100))
                  : 0 === a.d || 2 === a.d
                    ? 2 === a.d
                      ? ((t.xv = -50), (t.x = a.left - t.size - 1))
                      : ((t.xv = 50), (t.x = a.right + t.size + 1))
                    : 3 === a.d
                      ? ((t.yv = -50), (t.y = a.bottom - t.size - 1))
                      : ((t.yv = 50), (t.y = a.top + t.size + 1)));
      },
      polygonDamage: 3,
      checkAngle: function (e, t, a, n) {
        return dimension.validateAngle(Math.atan2(-a, n), e, t);
      },
      validateAngle: function (e, t, a) {
        return (
          !(a <= 0) &&
          ((!(t <= 0) && !(t >= 0)) ||
            !(a > 0) ||
            Math.abs(
              ((((e - t + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) %
                (2 * Math.PI)) -
                Math.PI,
            ) <= a)
        );
      },
      clampAngle: function (e, t, a) {
        if ((t <= 0 || t >= 0) && a > 0) {
          let n =
            ((((e - t + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) %
              (2 * Math.PI)) -
            Math.PI;
          if (!(Math.abs(n) <= a)) return n < 0 ? t - a : t + a;
        }
        return e;
      },
      collide: function (e, t, a) {
        let n = {
            tank: 0,
            detectEnemies: 1,
            bullet: 2,
            polygon: 3,
            detectFriends: 4,
            wall: 5,
            gate: 6,
            wormhole: 7,
          },
          i = e.object,
          l = t.object;
        if (
          (n[e.type] > n[t.type] && (([e, t] = [t, e]), ([i, l] = [l, i])),
          "tank" === e.type)
        ) {
          if ("tank" === t.type)
            dimension.bounceCircles(i, l, a, 1, 0.2),
              dimension.isSameTeam(i, l) ||
                i.invincible ||
                l.invincible ||
                (i.inBase ||
                  i.prevInBase ||
                  i.damage(
                    10 *
                      dimension.tickMultiplier *
                      l.bodyDamage *
                      l.levelMultiplier *
                      l.bodyDamageMultiplier,
                    l,
                    "tanks",
                  ),
                l.inBase ||
                  l.prevInBase ||
                  l.damage(
                    10 *
                      dimension.tickMultiplier *
                      i.bodyDamage *
                      i.levelMultiplier *
                      i.bodyDamageMultiplier,
                    i,
                    "tanks",
                  ));
          else if ("detectEnemies" === t.type) {
            if (
              !dimension.isSameTeam(t.parent, i) &&
              !(i.invincible || i.inBase || i.prevInBase) &&
              dimension.checkAngle(t.d, t.range, i.x - t.x, i.y - t.y)
            ) {
              t.objects.push(i);
              let s = Math.sqrt(a.distance) - a.size;
              t.distances.push(s),
                (s < t.closest || !1 === t.closest) &&
                  ((t.closest = s), (t.closestObject = i)),
                (s < t.closestTankDistance || !1 === t.closestTank) &&
                  ((t.closestTankDistance = s), (t.closestTank = i));
            }
          } else if ("bullet" === t.type) {
            if (
              !dimension.isSameTeam(i, l.parent) &&
              !(i.inBase || i.prevInBase)
            ) {
              if (i.invincible) l.remove();
              else {
                i.damage(
                  3 *
                    dimension.tickMultiplier *
                    l.damageMultiplier *
                    l.barrel.data.damage *
                    l.parent.levelMultiplier,
                  l.parent,
                  "tanks",
                ),
                  l.damage(
                    10 *
                      dimension.tickMultiplier *
                      (i.bodyDamage >= 0 ? i.bodyDamage : 1) *
                      i.levelMultiplier *
                      (i.bodyDamageMultiplier >= 0
                        ? i.bodyDamageMultiplier
                        : 1),
                  );
                let o = [0, 1, 2, 1, 2, 0][l.type];
                0 === o
                  ? dimension.bounceCircles(i, l, a, 0.02, 0)
                  : 1 === o
                    ? dimension.bounceCircles(i, l, a, 0.5, 0)
                    : dimension.bounceCircles(i, l, a, 0.02, 0);
              }
            }
          } else if ("polygon" === t.type)
            dimension.bounceCircles(i, l, a, 1, 0.2),
              i.invincible ||
                5 === i.team ||
                (i.inBase ||
                  i.prevInBase ||
                  i.ignorePolygonDamage ||
                  i.damage(
                    dimension.tickMultiplier * dimension.polygonDamage,
                    l,
                    "polygons",
                  ),
                l.damage(
                  10 *
                    dimension.tickMultiplier *
                    i.bodyDamage *
                    i.levelMultiplier *
                    i.bodyDamageMultiplier,
                  i,
                  "tanks",
                ));
          else if ("detectFriends" === t.type) {
            if (dimension.isSameTeam(t.parent, i)) {
              t.objects.push(i);
              let r = Math.sqrt(a.distance) - a.size;
              t.distances.push(r),
                (r < t.closest || !1 === t.closest) &&
                  ((t.closest = r), (t.closestObject = i));
            }
          } else if ("wall" !== t.type || i.clip) {
            if ("gate" === t.type) dimension.collideGate(a, i);
            else if ("wormhole" === t.type) {
              if (0 === l.type) {
                if (
                  (i.level >= 60 || l.ruptured) &&
                  !((i.invincible && i.invincibleTime) || i.static)
                ) {
                  l._objects[i.id] = i;
                  let d = l.x - i.x,
                    $ = l.y - i.y,
                    c = d * d + $ * $,
                    u = 0.01 * (c > 1 ? 1 / Math.sqrt(c) : 1);
                  (i.xv += d * u), (i.yv += $ * u);
                } else dimension.bounceCircles(i, l, a, 1, 0.5);
              } else if (1 === l.type) {
                if (
                  (i.radiant > 0 || l.ruptured) &&
                  !((i.invincible && i.invincibleTime) || i.static)
                ) {
                  l._objects[i.id] = i;
                  let p = l.x - i.x,
                    m = l.y - i.y,
                    g = p * p + m * m,
                    f = 0.01 * (g > 1 ? 1 / Math.sqrt(g) : 1);
                  (i.xv += p * f), (i.yv += m * f);
                } else dimension.bounceCircles(i, l, a, 1, 0.5);
              } else l._objects[i.id] = i;
            }
          } else
            dimension.isSameTeam(i, l)
              ? t.noInvincibility || (i.inBase = !0)
              : (dimension.collideWall(a, i),
                t.object.team >= 0 &&
                  !(i.inBase || i.prevInBase || i.static || i.invincible) &&
                  i.maxHealth &&
                  ((i.health -= dimension.tickMultiplier * i.maxHealth * 0.003),
                  (i.regenTime = 0)));
        } else if ("detectEnemies" === e.type) {
          if ("polygon" === t.type) {
            if (
              5 !== e.parent.team &&
              dimension.checkAngle(e.d, e.range, l.x - e.x, l.y - e.y)
            ) {
              e.objects.push(l);
              let _ = Math.sqrt(a.distance) - a.size;
              e.distances.push(_),
                (_ < e.closest || !1 === e.closest) &&
                  ((e.closest = _), (e.closestObject = l));
            }
          } else if (
            "bullet" === t.type &&
            !dimension.isSameTeam(e.parent, l.parent)
          ) {
            e.bullets && e.objects.push(l);
            let y = Math.sqrt(a.distance) - a.size;
            e.bullets && e.distances.push(y),
              (y < e.closestBulletDistance || !1 === e.closestBullet) &&
                ((e.closestBulletDistance = y), (e.closestBullet = l));
          }
        } else if ("bullet" === e.type) {
          if ("bullet" === t.type) {
            if (dimension.isSameTeam(i.parent, l.parent)) {
              let h = [0, 1, 2, 1, 2, 0][i.type];
              h === [0, 1, 2, 1, 2, 0][l.type] &&
                (0 === h ||
                  (1 === h
                    ? dimension.bounceCircles(i, l, a, 0.5, 0.1)
                    : dimension.bounceCircles(i, l, a, 1, 0)));
            } else if (i.health >= 0 && l.health >= 0) {
              dimension.bounceCircles(i, l, a, 0.5, 0.1);
              let k = 5,
                b =
                  3 *
                  dimension.tickMultiplier *
                  l.barrel.data.damage *
                  l.parent.levelMultiplier *
                  k,
                v =
                  3 *
                  dimension.tickMultiplier *
                  i.barrel.data.damage *
                  i.parent.levelMultiplier *
                  k,
                x = b > i.health,
                w = v > l.health;
              x ^ w &&
                (x && b > 0
                  ? (v *= i.health / b)
                  : w && v > 0 && (b *= l.health / v)),
                i.damage(b),
                l.damage(v);
            }
          } else if ("polygon" === t.type) {
            let T = [0, 1, 2, 1, 2, 0][i.type];
            0 === T
              ? dimension.bounceCircles(i, l, a, 0.02, 0)
              : 1 === T
                ? dimension.bounceCircles(i, l, a, 0.1, 0)
                : dimension.bounceCircles(i, l, a, 0.2, 0.05),
              5 !== i.parent.team &&
                (i.damage(dimension.tickMultiplier * dimension.polygonDamage),
                l.damage(
                  3 *
                    dimension.tickMultiplier *
                    i.damageMultiplier *
                    i.barrel.data.damage *
                    i.parent.levelMultiplier,
                  i.parent,
                  "tanks",
                ));
          } else
            "wall" === t.type
              ? dimension.isSameTeam(i.parent, l) ||
                t.noInvincibility ||
                (dimension.collideWall(a, i),
                !(t.object.team >= 0) ||
                  i.inBase ||
                  i.prevInBase ||
                  i.static ||
                  i.invincible ||
                  (i.damage(dimension.tickMultiplier * i.maxHealth * 0.003),
                  (i.regenTime = 0)))
              : "gate" === t.type
                ? dimension.collideGate(a, i)
                : "wormhole" === t.type &&
                  2 === l.type &&
                  dimension.bounceCircles(i, l, a, 1, 0.5);
        } else
          "polygon" === e.type
            ? "polygon" === t.type
              ? dimension.bounceCircles(i, l, a, 1, 0.2)
              : "wall" === t.type
                ? (dimension.collideWall(a, i),
                  t.object.team >= 0 &&
                    ((i.health -=
                      dimension.tickMultiplier * i.maxHealth * 0.003),
                    (i.regenTime = 0)))
                : "gate" === t.type
                  ? dimension.collideGate(a, i)
                  : "wormhole" === t.type &&
                    dimension.bounceCircles(i, l, a, 1, 0.5)
            : e.type;
      },
      getRadiantName: function (e) {
        return e < 1
          ? ""
          : e < 5
            ? ["Radiant", "Gleaming", "Luminous", "Lustrous"][e - 1]
            : `Highly Radiant (${e})`;
      },
      getPolygonName: function (e) {
        return e < 0
          ? [
              "Tetrahedron",
              "Cube",
              "Octahedron",
              "Dodecahedron",
              "Icosahedron",
            ][-e - 1]
          : e < 3
            ? "???"
            : e < 21
              ? [
                  "Triangle",
                  "Square",
                  "Pentagon",
                  "Hexagon",
                  "Heptagon",
                  "Octagon",
                  "Nonagon",
                  "Decagon",
                  "Hendecagon",
                  "Dodecagon",
                  "Tridecagon",
                  "Tetradecagon",
                  "Pentadecagon",
                  "Hexadecagon",
                  "Heptadecagon",
                  "Octadecagon",
                  "Nonadecagon",
                  "Icosagon",
                ][e - 3]
              : `Circle (${e})`;
      },
      getFullPolygonName: function (e) {
        let t = dimension.getPolygonName(e.sides),
          a;
        return (
          (a =
            e.radiant < 1
              ? 0 > "AEIOU".indexOf(t[0])
                ? "a "
                : "an "
              : `a ${dimension.getRadiantName(e.radiant)} `) + t
        );
      },
      update: function (e, t, a) {
        if (e.tanks.length > 500)
          for (let n = e.tanks.length - 1; n >= 0; n--) {
            let i = e.tanks[n];
            i.static || i.ws.data.isPlayer || i.remove();
          }
        if (
          (a - e.lastPolyhedra > 12e4 &&
            ((e.lastPolyhedra = a),
            0.01 > Math.random() && (e.nextSpawnPolyhedra = !0)),
          t.gameUpdate)
        ) {
          for (let l = e.newTanks.length - 1; l >= 0; l--) {
            let s = e.newTanks[l],
              o = s[1],
              r = 0,
              d = 0,
              $ = 0;
            (r =
              s[0].team >= 5 && !(dimension.noPinkTeam && 6 === s[0].team)
                ? s[0].team
                : "2teams" === e.type
                  ? o.data.lastTeam > 0 && o.data.lastTeam < 3
                    ? o.data.lastTeam
                    : 1 + Math.floor(2 * Math.random())
                  : "ffa" === e.type
                    ? 0
                    : o.data.lastTeam > 0 && o.data.lastTeam < 5
                      ? o.data.lastTeam
                      : 1 + Math.floor(4 * Math.random())),
              (o.data.lastTeam = r),
              (s[0].team = r),
              (s[1].data.tank = generator.tank(s[0], s[1])),
              ([d, $] = e.spawnPlayer(r, s[1].data.tank, s[2])),
              (s[1].data.tank.x = d),
              (s[1].data.tank.y = $),
              console.log(
                "dim",
                `name:${s[0].name} score:${Math.round(s[0].score)} dim:${e.name}`,
              ),
              (s[1].data.waiting = !1),
              s[1].sendPacket(
                "gameStart",
                packer.gameStart({
                  tank: s[1].data.tank,
                  dim: s[0].dim,
                  upgrades: s[1].data.tank.upgrades,
                  saveCode: s[1].data.saveCode,
                }),
              ),
              s[1].data.isPlayer &&
                !s[1].data.tank.invisible &&
                s[0].dim.broadcast(`${s[1].data.tank.name} has spawned.`);
          }
          e.newTanks = [];
        }
        let c = [],
          u = [];
        for (let p = e.gates.length - 1; p >= 0; p--) {
          let m = e.gates[p];
          1 === m[0] || 3 === m[0]
            ? (m[6] > 0 &&
                ((m[6] -= 0.01 * dimension.tickMultiplier),
                m[6] <= 0 && (m[6] = 0)),
              (m[5] = 0 !== m[6]))
            : ((m[5] = !1), (m[6] = 0));
        }
        let g = [];
        for (let f = e.tanks.length - 1; f >= 0; f--) {
          let _ = e.tanks[f];
          if (
            (_.score >= 0 ||
              ((_.score = 0), _.update(), (_.dim.updatedTanks[_.id] = _)),
            _.xv || (_.xv = 0),
            _.yv || (_.yv = 0),
            _.x || (_.x = 0),
            _.y || (_.y = 0),
            _.d || (_.d = 0),
            _.ai && "function" == typeof _.ai)
          )
            try {
              _.ai({ now: a, options: t });
            } catch (y) {}
          if (((!_.regen || _.regen < 1) && (_.regen = 1), _.regenTime < 1)) {
            let h = 16 - _.upgrades[6] / 1.5;
            (_.regenTime += ((0.01 * dimension.tickMultiplier) / h) * _.regen),
              _.regenTime > 1 && (_.regenTime = 1);
          } else if (_.health < _.maxHealth) {
            let k = 18 - _.upgrades[6] / 2;
            (_.health +=
              ((dimension.tickMultiplier * _.maxHealth * 0.01) / k) *
              (1 + (_.levelMultiplier - 1) / 10) *
              _.regen),
              _.health > _.maxHealth && (_.health = _.maxHealth);
          }
          (_.regen = 1), (_.bodyDamageMultiplier = 1 + _.upgrades[5] / 17.6);
          let b =
            800 *
            _.levelMultiplier *
            _.maxHealthMultiplier *
            (_.celestial ? 4 : 1) *
            (1 + _.upgrades[7] / 22.5);
          if (
            (b != _.maxHealth && _.setMaxHealth(b),
            (_.mousePosition[0] = _.x + _.controlPosition[0]),
            (_.mousePosition[1] = _.y + _.controlPosition[1]),
            _.dragTarget)
          )
            for (let v = _.dragTarget.length - 1; v >= 0; v--) {
              let x = _.dragTarget[v];
              x.static ||
                ((x.x = _.mousePosition[0]), (x.y = _.mousePosition[1]));
            }
          t.updateFinalDamage &&
            ((_.finalDamage.tanks = generator.updateFinalDamage(
              _.finalDamage.tanks,
            )),
            (_.finalDamage.polygons = generator.updateFinalDamage(
              _.finalDamage.polygons,
            ))),
            (_.x += _.xv),
            (_.y += _.yv),
            _.invincibleTime &&
              (_.invincibleTime > a
                ? (_.firing || _.input.movement[0] || _.input.movement[1]) &&
                  _.invincibleTime - a > 5e3 &&
                  (_.invincibleTime = a + 5e3)
                : ((_.invincibleTime = !1), (_.invincible = !1)));
          let w =
              _.speed *
              dimension.tickMultiplier *
              0.14 *
              (_.size > 30 ? 10 / (_.size - 20) : 1) *
              (1 + 0.1 * _.upgrades[4]) *
              _.movementSpeed,
            T = e.friction ? dimension.power96 : 1;
          (_.xv =
            _.xv * T + dimension.tickMultiplier * _.input.movement[0] * w),
            (_.yv =
              _.yv * T + dimension.tickMultiplier * _.input.movement[1] * w),
            t.recordDirection &&
              _._d.push(
                ((Math.round((_.d / Math.PI) * 1e3) % 2e3) + 2e3) % 2e3,
              );
          let z = !_.static && !_.fullFov,
            P = {
              x: _.x,
              y: _.y,
              size: _.size,
              object: _,
              type: "tank",
              noCollide: _.noHitBox,
            },
            S = {
              x: _.x,
              y: _.y,
              size: 1.5 * _.size + 200,
              object: _,
              type: "bullet",
              str: "tanks",
            };
          if ((c.push(P), z)) {
            u.push(S);
            let j = {
              x: _.x,
              y: _.y,
              size: 2e3 * Math.sqrt(_.size / 75),
              object: _,
              type: "fov",
              fov: { tanks: {}, polygons: {}, bullets: {} },
            };
            u.push(j), g.push(j);
          }
          {
            let C = {
              x: _.x,
              y: _.y,
              size: 300 + _.size * _.range,
              object: _,
              type: "detectEnemies",
              parent: _,
              objects: [],
              distances: [],
              closest: !1,
              closestObject: !1,
              closestTank: !1,
              closestTankDistance: !1,
              closestBullet: !1,
              closestBulletDistance: !1,
              possible: [],
            };
            (_.detector = C), c.push(C);
          }
          let M = Math.sin(_.d),
            B = Math.cos(_.d);
          for (let D = 0, I = _._turrets.length; D < I; D++) {
            let W = _._turrets[D],
              H = {
                x: _.x + _.size * (W.x * B + W.y * M),
                y: _.y - _.size * (W.y * B - W.x * M),
                d: _.d + (W.angle >= 0 || W.angle <= 0 ? W.angle : 0),
                range: W.angleRange,
                size: 10 * _.size * W.size + 400,
                object: W,
                type: "detectEnemies",
                parent: _,
                objects: [],
                distances: [],
                closest: !1,
                closestObject: !1,
                closestTank: !1,
                closestTankDistance: !1,
                closestBullet: !1,
                closestBulletDistance: !1,
                possible: [],
              };
            (W.detector = H), (W.gameX = H.x), (W.gameY = H.y), c.push(H);
          }
          for (let R = 0, O = _.auras.length; R < O; R++) {
            let Y = _.auras[R];
            if (((Y.gameSize = _.size * Y.auraSize), !1 === _.passive)) {
              let U = {
                x: _.x + _.size * (Y.x * B + Y.y * M),
                y: _.y - _.size * (Y.y * B - Y.x * M),
                size: Y.gameSize,
                object: Y,
                type: "detectEnemies",
                parent: _,
                objects: [],
                distances: [],
                closest: !1,
                closestObject: !1,
                closestTank: !1,
                closestTankDistance: !1,
                closestBullet: !1,
                closestBulletDistance: !1,
                possible: [],
              };
              if (2 === Y.type) U.bullets = !0;
              else if (1 === Y.type) U.type = "detectFriends";
              else if (0 !== Y.type) continue;
              U.x,
                U.y,
                U.size,
                (Y.detector = U),
                (Y.gameX = U.x),
                (Y.gameY = U.y),
                c.push(U);
            }
          }
        }
        for (let F = e.bullets.length - 1; F >= 0; F--) {
          let N = e.bullets[F],
            A = N.parent;
          (N.x += N.xv), (N.y += N.yv);
          let X = Math.sin(N.d),
            q = Math.cos(N.d);
          (1 === N.type || 2 === N.type || 3 === N.type || 4 === N.type) &&
            e.friction &&
            ((N.xv *= dimension.power96), (N.yv *= dimension.power96));
          let E = { x: N.x, y: N.y, size: N.size, object: N, type: "bullet" },
            G = {
              x: N.x,
              y: N.y,
              size: 1.5 * N.size + 200,
              object: N,
              type: "bullet",
              str: "bullets",
            };
          if ((c.push(E), u.push(G), N.auras))
            for (let L = 0, K = N.auras.length; L < K; L++) {
              let J = N.auras[L];
              if (((J.gameSize = N.size * J.auraSize), !1 === A.passive)) {
                let V = {
                  x: N.x + N.size * (J.x * q + J.y * X),
                  y: N.y - N.size * (J.y * q - J.x * X),
                  size: J.gameSize,
                  object: J,
                  type: "detectEnemies",
                  parent: A,
                  objects: [],
                  distances: [],
                  closest: !1,
                  closestObject: !1,
                  closestTank: !1,
                  closestTankDistance: !1,
                  closestBullet: !1,
                  closestBulletDistance: !1,
                  possible: [],
                };
                if (2 === J.type) V.bullets = !0;
                else if (1 === J.type) V.type = "detectFriends";
                else if (0 !== J.type) continue;
                V.x,
                  V.y,
                  V.size,
                  (J.detector = V),
                  (J.gameX = V.x),
                  (J.gameY = V.y),
                  c.push(V);
              }
            }
          if (
            ((N.timeExisted += 0.01 * dimension.tickMultiplier),
            ((N.timeExisted > N.lifeTime && 2 !== N.type && 4 !== N.type) ||
              N.health <= 0) &&
              N.remove(),
            N.turrets && N.turrets[0])
          )
            for (let Q = 0, Z = N.turrets.length; Q < Z; Q++) {
              let ee = N.turrets[Q],
                et = {
                  x: N.x - N.size * (ee.x * q + ee.y * X),
                  y: N.y + N.size * (ee.y * q - ee.x * X),
                  size: 10 * N.size * ee.size + 400,
                  object: ee,
                  type: "detectEnemies",
                  parent: N.parent,
                  objects: [],
                  distances: [],
                  closest: !1,
                  closestObject: !1,
                  closestTank: !1,
                  closestTankDistance: !1,
                  closestBullet: !1,
                  closestBulletDistance: !1,
                  possible: [],
                };
              (ee.detector = et),
                (ee.gameX = et.x),
                (ee.gameY = et.y),
                c.push(et);
            }
        }
        for (let ea = e.polygons.length - 1; ea >= 0; ea--) {
          let en = e.polygons[ea];
          if (
            ((en.finalDamage.tanks = generator.updateFinalDamage(
              en.finalDamage.tanks,
            )),
            en.regenTime < 1)
          )
            (en.regenTime +=
              (0.02 * dimension.tickMultiplier) / (9 + 2 * Math.abs(en.sides))),
              en.regenTime > 1 && (en.regenTime = 1);
          else if (en.health < en.maxHealth) {
            let ei = en.sides >= 3 ? en.sides : 10 - en.sides;
            (en.health +=
              (dimension.tickMultiplier * en.maxHealth * 0.004) /
              (ei * ei * 0.1 - 0.15)),
              en.health > en.maxHealth && (en.health = en.maxHealth);
          }
          (en.x += en.xv),
            (en.y += en.yv),
            e.friction &&
              ((en.xv *= dimension.power97), (en.yv *= dimension.power97));
          let el = 0.005 * dimension.tickMultiplier * en.speed;
          (en.d += el),
            en.d >= 2 * Math.PI && (en.d -= 2 * Math.PI),
            (el *= 8),
            (en.xv += Math.sin(en.d) * el),
            (en.yv -= Math.cos(en.d) * el);
          let es = {
              x: en.x,
              y: en.y,
              size: en.size,
              object: en,
              type: "polygon",
            },
            eo = {
              x: en.x,
              y: en.y,
              size: 1.5 * en.size + 200,
              object: en,
              type: "bullet",
              str: "polygons",
            };
          c.push(es),
            u.push(eo),
            en.removeTime++,
            en.removeTime >= 600 * dimension.tickRate &&
              en.health >= en.maxHealth &&
              en.remove();
        }
        for (let er = e.walls.length - 1; er >= 0; er--) {
          let ed = e.walls[er];
          if (ed[5] && ed[5].noHitBox) continue;
          let e$ = {
            x: ed[0],
            y: ed[1],
            w: ed[2],
            h: ed[3],
            type: "wall",
            rectangular: !0,
            object: { team: ed[4] || -1 },
            noInvincibility: !!ed[5] && ed[5].noInvincibility,
          };
          c.push(e$);
        }
        for (let ec = e.gates.length - 1; ec >= 0; ec--) {
          let eu = e.gates[ec],
            ep,
            em;
          0 === eu[3] || 2 === eu[3]
            ? ((ep = 30), (em = eu[4]))
            : ((ep = eu[4]), (em = 30));
          let eg = {
            gateType: eu[0],
            x: eu[1],
            y: eu[2],
            d: eu[3],
            noClip: !0,
            object: eu,
            w: ep,
            h: em,
            type: "gate",
            rectangular: !0,
          };
          c.push(eg);
        }
        for (let ef in e.wormholes) {
          let e_ = e.wormholes[ef];
          if (e_.type < 2) {
            let ey = Object.keys(e_._objects).length + 1;
            if (
              (e_.time < 10
                ? (e_.time -= 0.01 * dimension.tickMultiplier)
                : (e_.time -= 0.01 * dimension.tickMultiplier * (1 + ey)),
              e_.time < 0)
            ) {
              for (let eh in e_._objects) e_.action(e_._objects[eh]);
              e_.remove();
              continue;
            }
            e_.time < 10 &&
              ((e_.fadeTime = (10 - e_.time) / 10),
              (e.fadeTimeChanges[e_.id] = e_));
          } else e_.time = 0;
          let ek = {
            x: e_.x,
            y: e_.y,
            object: e_,
            objects: {},
            size: e_.size,
            type: "wormhole",
          };
          (e_._objects = {}), c.push(ek);
        }
        for (let eb = c.length - 1; eb >= 0; eb--) {
          let ev = c[eb],
            ex = ev.object;
          "tank" === ev.type &&
            ((ex.fov.tanks = e.tanks),
            (ex.fov.bullets = e.bullets),
            (ex.fov.polygons = e.polygons));
        }
        try {
          Detector.detectCollisions(c, function (e, t, a) {
            dimension.collide(e, t, a);
          });
        } catch (ew) {
          return dimension.antilag();
        }
        if (t.gameUpdate) {
          View.detectCollisions(u, function (e, t, a) {
            if (("fov" === t.type && ([e, t] = [t, e]), "fov" === e.type)) {
              let n = e.fov,
                i = t.object;
              "bullet" === t.type && (n[t.str][i.id] = i);
            }
          });
          for (let eT = g.length - 1; eT >= 0; eT--) {
            let e0 = g[eT],
              ez = e0.object;
            (ez.fov.bullets = Object.values(e0.fov.bullets)),
              (ez.fov.polygons = Object.values(e0.fov.polygons));
          }
        }
        for (let eP in e.wormholes) {
          let e3 = e.wormholes[eP],
            eS = e3._objects;
          if (e3.type < 2) {
            let e1 = 0;
            for (let ej in eS) {
              let eC = eS[ej].size;
              (e1 += eC * eC * 2),
                !(ej in e3.objects) &&
                  (!e3.ruptured &&
                    Math.random() < 0.03 + 0.07 * e3.entries &&
                    e3.rupture(),
                  e3.entries++);
            }
            (e3.objects = e3._objects),
              e1 !== e3.contents &&
                ((e3.contents = e1),
                (e3.size = Math.sqrt(e3.defaultSize + e1)),
                (e.resizedWormholes[e3.id] = e3));
          } else {
            for (let eM in eS) {
              let eB = eS[eM];
              e3.action(eB),
                eM in e3.objects ||
                  !(eB.team >= 0) ||
                  ((e3.color = eB.team),
                  (e3.radiant = eB.radiant || 0),
                  (e.updatedPortals[e3.id] = e3));
            }
            e3.objects = e3._objects;
          }
        }
        for (let eD = e.bullets.length - 1; eD >= 0; eD--) {
          let eI = e.bullets[eD],
            e4 = eI.parent;
          if (
            (dimension.confine(
              eI,
              e.mapSize - (eI.size < 100 ? eI.size / 2 : 50),
            ),
            2 === eI.type || 4 === eI.type)
          ) {
            let e2 = dimension.tickMultiplier * eI.speed * 0.05,
              e5 = 1,
              eW = [e4.x, e4.y],
              e9 = !1;
            (eI.target = !1),
              e4.firing || e4.droneControl
                ? ((eW = e4.mousePosition),
                  (e9 = !0),
                  e4.droneControl && (e2 = -e2))
                : !1 == e4.passive &&
                  e4.detector &&
                  (e4.detector.closestObject
                    ? ((eI.target = e4.detector.closestObject),
                      (eW = [eI.target.x, eI.target.y]),
                      (e9 = !0))
                    : (eI.target = !1));
            let eH;
            if (e2 >= 0) {
              if (
                ((eH = Math.atan2(eI.x - eW[0], eW[1] - eI.y)),
                4 === eI.type && e9 && 2 !== eI.visualType)
              ) {
                let eR = [eI.x - eW[0], eI.y - eW[1]];
                (eR =
                  Math.sqrt(eR[0] * eR[0] + eR[1] * eR[1]) -
                  eI.size -
                  (eI.target ? eI.target.size : 0)) <
                  (e4.size + 0.5 * eI.size) * (e4.firing ? 2.5 : 0.5) +
                    eI.size && (e5 = -1);
              }
            } else (eH = Math.atan2(eW[0] - eI.x, eI.y - eW[1])), (e2 = -e2);
            if (eI.timeExisted < 1.5) {
              let eO = 10 * (1 - eI.timeExisted / 1.5);
              eI.d = dimension.averageAngles(eI.d, eH, eO);
            } else eI.d = eH;
            (e2 *= 1.2),
              (eI.xv += -dimension.tickMultiplier * Math.sin(eI.d) * e2 * e5),
              (eI.yv += dimension.tickMultiplier * Math.cos(eI.d) * e2 * e5);
          }
          if (3 === eI.type || 4 === eI.type) {
            for (let e8 = 0, eY = eI._barrels.length; e8 < eY; e8++) {
              let e7 = eI._barrels[e8];
              if (6 === e7.data.type || 7 === e7.data.type || e7.data.type >= 9)
                continue;
              e7.current += 0.01 * dimension.tickMultiplier;
              let e6 = 0.5 * e7.data.reload * (1 - e4.upgrades[3] / 30),
                eU;
              if (
                (2 === e7.data.type || 4 === e7.data.type
                  ? (eU = !(
                      e7.bullets.length >=
                      e7.data.drones * (1 + e4.upgrades[0] / 30)
                    ))
                  : ((eU =
                      4 === eI.type
                        ? e4.firing ||
                          e4.droneControl ||
                          (!e4.passive && eI.target)
                        : !e4.passive),
                    e7.turret && !e7.turret.active && (eU = !1)),
                eU)
              ) {
                if (e7.current >= e6) {
                  e6
                    ? ((e7.current -= e6),
                      e7.current >= e6 && (e7.current = e7.current % e6))
                    : (e7.current = 0),
                    (1 === e7.data.type || 3 === e7.data.type) &&
                      e7.bullets.length > e7.maxTraps &&
                      e7.bullets[0].remove();
                  let eF = (e7.turret ? e7.turret.d : eI.d) + e7.data.d,
                    eN = eI.x,
                    eA = eI.y,
                    eX = -e7.data.x,
                    eq = -e7.data.y + 2 * e7.data.height,
                    eE = Math.sin(eF),
                    eG = Math.cos(eF),
                    eL = dimension.getBulletSpeed(e7.data, eI.parent),
                    eK = eI.parent,
                    [eJ, eV] = dimension.getBulletData(e7.data.type),
                    eQ = e7.data.relativeSize * eK.size,
                    eZ =
                      (e7.data.relativeSizeS || e7.data.relativeSize) *
                      e7.data.width;
                  if (8 === e7.data.type) {
                    let te = generator.polygon({
                      x: eN + eQ * (eG * eX - eE * eq),
                      y: eA + eQ * (eG * eq + eE * eX),
                      d: eF,
                      sides: 3,
                      dim: eK.dim,
                      radiant: 1,
                    });
                    (te.xv = -eE * eL), (te.yv = eG * eL);
                  } else
                    generator.bullet({
                      dim: e,
                      parent: eK,
                      barrelId: e7.id,
                      size: eZ,
                      d: eF,
                      damage: 1 + eK.upgrades[2] / 22.5,
                      health:
                        e7.data.penetration * eV * (1 + eK.upgrades[0] / 17.6),
                      lifeTime: e7.data.time * eJ,
                      x: eN + eQ * (eG * eX - eE * eq),
                      y: eA + eQ * (eG * eq + eE * eX),
                      xv: -eE * eL,
                      yv: eG * eL,
                      speed: eL,
                      barrel: e7,
                    });
                  if (e7.data.recoil) {
                    let tt =
                      0.6 *
                      e7.data.recoil *
                      eZ *
                      eZ *
                      (1 + eK.upgrades[1] / 30);
                    (eI.xv += tt * eE), (eI.yv -= tt * eG);
                  }
                }
              } else {
                let ta = e6 * (1 - e7.data.delay);
                e7.current > ta && (e7.current = ta);
              }
            }
            for (let tn = 0, ti = eI.auras.length; tn < ti; tn++) {
              let tl = eI.auras[tn],
                ts =
                  (1 + e4.upgrades[3] / 15) *
                  (1 + e4.upgrades[2] / 15) *
                  (1 + e4.upgrades[0] / 15);
              if (
                tl.detector &&
                !1 === e4.passive &&
                tl.detector &&
                tl.detector.objects
              ) {
                if (0 === tl.type)
                  for (let to = tl.detector.objects.length - 1; to >= 0; to--) {
                    let tr = tl.detector.objects[to];
                    if (
                      !(
                        tr.invincible ||
                        tr.inBase ||
                        tr.prevInBase ||
                        tr.static
                      )
                    ) {
                      let td = 2 * tr.size,
                        t$ = tl.detector.distances[to] + td,
                        tc = t$ < 0 ? 1 : 1 - t$ / td;
                      tr.damage(
                        dimension.tickMultiplier *
                          tc *
                          ts *
                          tl.auraDamage *
                          5 *
                          e4.levelMultiplier,
                        e4,
                        "tanks",
                      );
                    }
                  }
                else if (1 === tl.type && tl.healing)
                  for (let tu = tl.detector.objects.length - 1; tu >= 0; tu--)
                    tl.detector.objects[tu].regen +=
                      tl.healing *
                        (1 + e4.upgrades[3] / 20) *
                        0.7 *
                        (1 + e4.upgrades[6] / 15) -
                      1;
                else if (2 === tl.type && tl.auraPull)
                  for (let tp = tl.detector.objects.length - 1; tp >= 0; tp--) {
                    let tm = tl.detector.objects[tp];
                    if (
                      !(
                        tm.invincible ||
                        tm.inBase ||
                        tm.prevInBase ||
                        tm.static
                      )
                    ) {
                      let tg = tm.x - tl.gameX,
                        tf = tm.y - tl.gameY,
                        t_ = Math.sqrt(tg * tg + tf * tf),
                        ty =
                          (0.3 * tl.auraPull * (eI.size * e4.weight)) /
                          (tm.size * (tm.weight || 1));
                      (t_ = t_ < 1 ? ty : ty / t_),
                        (tm.xv -= tg * t_),
                        (tm.yv -= tf * t_);
                    }
                  }
              }
            }
          }
          if (eI.turrets && eI.turrets[0])
            for (let th = 0, tk = eI.turrets.length; th < tk; th++) {
              let tb = eI.turrets[th],
                tv = tb.detector.closestTank || tb.detector.closestObject;
              if (tv) {
                let tx = dimension.aimAtTarget(
                  { x: tb.gameX, y: tb.gameY },
                  tv,
                  dimension.getBulletSpeed(tb.barrels[0].data, e4),
                );
                (tb.d =
                  e4.d +
                  dimension.clampAngle(
                    Math.atan2(-tx[0], tx[1]) - e4.d,
                    tb.angle,
                    tb.angleRange,
                  )),
                  (tb.active = !e4.passive);
              } else {
                tb.active = !1;
                let tw = eI.parent,
                  tT = !0;
                if (tw.firing) {
                  let t0,
                    tz =
                      Math.atan2(
                        tb.gameX - tw.mousePosition[0],
                        tw.mousePosition[1] - tb.gameY,
                      ) - tw.d;
                  dimension.validateAngle(tz, tb.angle, tb.angleRange) &&
                    ((tb.d = tw.d + tz), (tT = !1));
                }
                if (tT) {
                  if (tb.angle >= 0 || tb.angle <= 0) {
                    let tP = (tb.angle + tw.d) % (2 * Math.PI);
                    tb.d = dimension.averageAngles(tb.d, tP, 2);
                  } else
                    (tb.d += 0.01 * dimension.tickMultiplier),
                      tb.d >= 2 * Math.PI && (tb.d -= 2 * Math.PI);
                }
              }
            }
        }
        for (let t3 = e.tanks.length - 1; t3 >= 0; t3--) {
          let tS = e.tanks[t3];
          dimension.confine(tS, e.mapSize - (tS.size < 100 ? tS.size / 2 : 50)),
            (tS.prevInBase = tS.inBase),
            (tS.inBase = !1);
          let t1 = !1;
          if (
            (tS.detector &&
              tS.detector.closestObject &&
              (t1 = tS.detector.closestObject),
            (7 === tS.team && !tS.ws.data.isPlayer) || "fallen" === tS.ai)
          ) {
            tS.passive = !1;
            let tj = tankData.bodyUpgradeMap[tS.body],
              tC = tankData.weaponUpgradeMap[tS.weapon];
            if (tC && tS.level >= tC.level) {
              let tM =
                tC.upgrades[Math.floor(Math.random() * tC.upgrades.length)];
              tS.removeBullets(),
                generator.setTankWeapon(tS, tM),
                (tS.firedBarrels = {}),
                generator.updateTank(tS),
                tS.update(),
                (tS.dim.updatedTanks[tS.id] = tS);
            }
            if (tj && tS.level >= tj.level) {
              let tB =
                tj.upgrades[Math.floor(Math.random() * tj.upgrades.length)];
              tS.removeBullets(),
                generator.setTankBody(tS, tB),
                (tS.firedBarrels = {}),
                generator.updateTank(tS),
                tS.update(),
                (tS.dim.updatedTanks[tS.id] = tS);
            }
            if (tS.upgradeCount < 120 && tS.upgradeCount < tS.level - 1) {
              tS.upgradeCount++;
              let tD = [];
              for (let tI = 0; tI < 8; tI++)
                tS.upgrades[tI] < 15 && tD.push(tI);
              tS.upgrades[tD[Math.floor(Math.random() * tD.length)]]++;
            }
            let t4 = !1;
            if (
              (tS.health < 0.5 * tS.maxHealth &&
                tS.detector.closestTank &&
                ((t1 = tS.detector.closestTank), (t4 = !0)),
              !tS.aiRam &&
                tS.health < 0.75 * tS.maxHealth &&
                tS.detector.closestBulletDistance < 200 &&
                tS.detector.closestBullet &&
                ((t1 = tS.detector.closestBullet), (t4 = !0)),
              t1 && (t1.x >= 0 || t1.x <= 0) && (t1.y >= 0 || t1.y <= 0))
            ) {
              tS.mousePosition = [t1.x, t1.y];
              let t2 = [t1.x - tS.x, t1.y - tS.y];
              tS.controlPosition = [t2[0], t2[1]];
              let t5 = Math.sqrt(t2[0] * t2[0] + t2[1] * t2[1]) || 1;
              (t5 < t1.size + tS.size + 100 || t4) && !tS.aiRam && (t5 = -t5),
                (tS.input.movement = [t2[0] / t5, t2[1] / t5]),
                (tS.firing = !0);
              let tW = tankData.bodies[tS.body];
              (tW = tW && tW.celestial ? Math.PI : 0),
                (tS.d = Math.atan2(-t2[0], t2[1]) + tW);
            } else {
              let t9 = -Math.sin(tS.d),
                tH = Math.cos(tS.d);
              (tS.mousePosition = [0, 0]),
                (tS.controlPosition = [0, 0]),
                tS.aiRam
                  ? ((tS.input.movement = [0.3 * t9, 0.3 * tH]),
                    (tS.d += 0.01),
                    tS.d > 2 * Math.PI && (tS.d -= 2 * Math.PI))
                  : ((tS.input.movement = [t9, tH]),
                    (tS.firing = !1),
                    t.gameUpdate &&
                      0.01 > Math.random() &&
                      (tS.d = 2 * Math.random() * Math.PI));
            }
            (tS.droneControl = !1), tS.aiRam && (tS.firing = !0);
          }
          for (let tR = 0, tO = tS._turrets.length; tR < tO; tR++) {
            let t8 = tS._turrets[tR];
            (t8.position = "weaponTurret"), (t8.active = !tS.passive);
            let tY = t8.detector.closestTank || t8.detector.closestObject;
            if (tY) {
              let t7 = dimension.aimAtTarget(
                { x: t8.gameX, y: t8.gameY },
                tY,
                dimension.getBulletSpeed(t8.barrels[0].data, tS),
              );
              t8.d =
                tS.d +
                dimension.clampAngle(
                  Math.atan2(-t7[0], t7[1]) - tS.d,
                  t8.angle,
                  t8.angleRange,
                );
            } else {
              t8.active = !1;
              let t6 = !0;
              if (tS.firing) {
                let tU,
                  tF =
                    Math.atan2(
                      t8.gameX - tS.mousePosition[0],
                      tS.mousePosition[1] - t8.gameY,
                    ) - tS.d;
                dimension.validateAngle(tF, t8.angle, t8.angleRange) &&
                  ((t8.d = tS.d + tF), (t6 = !1));
              }
              if (t6) {
                if (t8.angle >= 0 || t8.angle <= 0) {
                  let tN = (t8.angle + tS.d) % (2 * Math.PI);
                  t8.d = dimension.averageAngles(t8.d, tN, 2);
                } else
                  (t8.d += 0.01 * dimension.tickMultiplier),
                    t8.d >= 2 * Math.PI && (t8.d -= 2 * Math.PI);
              }
            }
          }
          for (let tA = 0, tX = tS.auras.length; tA < tX; tA++) {
            let tq = tS.auras[tA],
              tE =
                (1 + tS.upgrades[3] / 15) *
                (1 + tS.upgrades[2] / 15) *
                (1 + tS.upgrades[0] / 15);
            if (
              tq.detector &&
              !1 === tS.passive &&
              tq.detector &&
              tq.detector.objects
            ) {
              if (0 === tq.type)
                for (let tG = tq.detector.objects.length - 1; tG >= 0; tG--) {
                  let tL = tq.detector.objects[tG];
                  if (
                    !(tL.invincible || tL.inBase || tL.prevInBase || tL.static)
                  ) {
                    let tK = 2 * tL.size,
                      tJ = tq.detector.distances[tG] + tK,
                      tV = tJ < 0 ? 1 : 1 - tJ / tK;
                    tL.damage(
                      dimension.tickMultiplier *
                        tV *
                        tE *
                        tq.auraDamage *
                        5 *
                        tS.levelMultiplier,
                      tS,
                      "tanks",
                    );
                  }
                }
              else if (1 === tq.type && tq.healing)
                for (let tQ = tq.detector.objects.length - 1; tQ >= 0; tQ--)
                  tq.detector.objects[tQ].regen +=
                    tq.healing *
                      (1 + tS.upgrades[3] / 20) *
                      0.7 *
                      (1 + tS.upgrades[6] / 15) -
                    1;
              else if (2 === tq.type && tq.auraPull)
                for (let tZ = tq.detector.objects.length - 1; tZ >= 0; tZ--) {
                  let ae = tq.detector.objects[tZ];
                  if (
                    !(ae.invincible || ae.inBase || ae.prevInBase || ae.static)
                  ) {
                    let at = ae.x - tq.gameX,
                      aa = ae.y - tq.gameY,
                      an = Math.sqrt(at * at + aa * aa),
                      ai =
                        (0.3 * tq.auraPull * (tS.size * tS.weight)) /
                        (ae.size * (ae.weight || 1));
                    (an = an < 1 ? ai : ai / an),
                      (ae.xv -= at * an),
                      (ae.yv -= aa * an);
                  }
                }
            }
          }
          for (let al = 0, as = tS._barrels.length; al < as; al++) {
            let ao = tS._barrels[al];
            if (
              6 === ao.data.type ||
              7 === ao.data.type ||
              ao.data.type >= 9 ||
              ao.child
            )
              continue;
            ao.current += 0.01 * dimension.tickMultiplier;
            let ar = 0.5 * ao.data.reload * (1 - tS.upgrades[3] / 30),
              ad = tS.firing;
            if (
              (ao.turret &&
                (ad = !!ao.turret.detector.closest && ao.turret.active),
              (2 === ao.data.type || 4 === ao.data.type) &&
                (ad =
                  !(
                    ao.bullets.length >=
                    ao.data.drones * (1 + tS.upgrades[0] / 30)
                  ) &&
                  (!tS.passive || tS.firing)),
              ad)
            ) {
              if (ao.current >= ar) {
                ar
                  ? ((ao.current -= ar),
                    ao.current >= ar && (ao.current = ao.current % ar))
                  : (ao.current = 0),
                  (1 === ao.data.type || 3 === ao.data.type) &&
                    ao.bullets.length > ao.maxTraps &&
                    ao.bullets[0].remove();
                let a$ = (ao.turret ? ao.turret.d : tS.d) + ao.data.d,
                  ac = ao.turret ? ao.turret.gameX : tS.x,
                  au = ao.turret ? ao.turret.gameY : tS.y,
                  ap = Math.sin(a$),
                  am = Math.cos(a$),
                  ag = -ao.data.x,
                  af = -ao.data.y + 2 * ao.data.height,
                  a_ = dimension.getBulletSpeed(ao.data, tS),
                  [ay, ah] = dimension.getBulletData(ao.data.type),
                  ak = ao.data.relativeSize * tS.size;
                tS.firedBarrels[al] = al;
                let ab =
                  (ao.data.relativeSizeS || ao.data.relativeSize) *
                  ao.data.width;
                if (8 === ao.data.type) {
                  let av = generator.polygon({
                    x: ac + ak * (am * ag - ap * af),
                    y: au + ak * (am * af + ap * ag),
                    d: a$,
                    sides: ao.data.polygonSides,
                    dim: tS.dim,
                    radiant: 1 + tS.radiant,
                  });
                  (av.xv = -ap * a_ * 5), (av.yv = am * a_ * 5);
                } else
                  generator.bullet({
                    dim: e,
                    parent: tS,
                    barrelId: al,
                    size: ab,
                    d: a$,
                    damage: 1 + tS.upgrades[2] / 22.5,
                    health:
                      ao.data.penetration * ah * (1 + tS.upgrades[0] / 17.6),
                    lifeTime: ao.data.time * ay,
                    x: ac + ak * (am * ag - ap * af),
                    y: au + ak * (am * af + ap * ag),
                    xv: -ap * a_,
                    yv: am * a_,
                    speed: a_,
                    barrel: ao,
                  });
                if (ao.data.recoil && !tS.static) {
                  let ax =
                    0.6 * ao.data.recoil * ab * (1 + tS.upgrades[1] / 30);
                  (tS.xv += ax * ap), (tS.yv -= ax * am);
                }
              }
            } else {
              let aw = ar * (1 - ao.data.delay);
              ao.current > aw && (ao.current = aw);
            }
          }
          if (tS.health <= 0) {
            let aT = !0;
            if (
              (tS.onDeath &&
                tS.onDeath({
                  tank: tS,
                  preventDefault: function () {
                    aT = !1;
                  },
                }),
              tS.dim.onDeath &&
                tS.dim.onDeath({
                  tank: tS,
                  preventDefault: function () {
                    aT = !1;
                  },
                }),
              aT)
            ) {
              tS.remove(),
                tS.noKillNotification ||
                  console.log(
                    "killedTank",
                    `name:${tS.name} score:${tS.score} dim:${tS.dim.name}`,
                  ),
                tS.forceDeathScore >= 0 && (tS.score = tS.forceDeathScore);
              let a0 = 0,
                az =
                  tS.score * dimension.getRadiantMultiplier(tS.radiant) * 0.8,
                aP = {},
                a3 = {},
                aS = [],
                a1 = {},
                aj = {},
                aC = {};
              for (let aM = tS.dim.tanks.length - 1; aM >= 0; aM--) {
                let aB = tS.dim.tanks[aM];
                aj[aB.id] = aB;
              }
              for (let aD = tS.dim.polygons.length - 1; aD >= 0; aD--) {
                let aI = tS.dim.polygons[aD];
                aC[aI.id] = aI;
              }
              let a4 = 0;
              for (let a2 in tS.finalDamage.tanks) {
                let a5 = aj[a2];
                if (a5 && !a5.static) {
                  let aW = tS.finalDamage.tanks[a2],
                    a9 = 0;
                  for (let aH = 0; aH < 16; aH++) a9 += aW[aH];
                  (aP[a2] = a9),
                    aS.push(a5.name),
                    (a1[a2] = a4),
                    a4++,
                    (a0 += a9);
                }
              }
              for (let aR in tS.finalDamage.polygons) {
                let aO = aC[aR];
                if (aO) {
                  let a8 = tS.finalDamage.polygons[aR],
                    aY = 0;
                  for (let a7 = 0; a7 < 16; a7++) aY += a8[a7];
                  (a3[aR] = aY),
                    aS.push(dimension.getFullPolygonName(aO)),
                    (a0 += aY);
                }
              }
              for (let a6 in aP) {
                let aU = aP[a6] / a0,
                  aF = aj[a6],
                  aN = aU * az;
                if (
                  aN &&
                  ((aF.score += aN),
                  e.skinwalkers &&
                    (aF.removeBullets(),
                    generator.setTankWeapon(aF, tS.weapon),
                    generator.setTankBody(aF, tS.body),
                    (aF.firedBarrels = {}),
                    generator.updateTank(aF),
                    (aF.dim.updatedTanks[aF.id] = aF)),
                  aF.update(),
                  aF.ws.sendPacket && !tS.noKillNotification)
                ) {
                  let aA = a1[a6],
                    aX = aS.slice(0, aA).concat(aS.slice(aA + 1)),
                    aq = aX.length;
                  0 === aq
                    ? aF.ws.sendPacket("announcement", `You killed ${tS.name}.`)
                    : 1 === aq
                      ? aF.ws.sendPacket(
                          "announcement",
                          `You and ${aX[0]} killed ${tS.name}.`,
                        )
                      : aF.ws.sendPacket(
                          "announcement",
                          `You, ${aX.slice(0, aq - 1).join(", ")}, and ${aX[aq - 1]} killed ${tS.name}.`,
                        );
                }
              }
              for (let aE in a3) {
                let aG = a3[aE] / a0,
                  aL = aC[aE],
                  aK =
                    (aG * az) /
                    (2 *
                      (aL.radiant < 1 ? 1 : 15 * Math.pow(3, aL.radiant - 1)));
                aK && ((aL.score += aK), aL.update());
              }
              if (tS.ws.sendPacket) {
                let aJ = Math.round(0.2 * tS.score);
                a0 <= 0 && (aJ = Math.round(0.8 * tS.score)),
                  tS.dim.name.startsWith("pvp") && (aJ = 0),
                  (tS.ws.data.respawnScore = aJ),
                  tS.ws.data.isPlayer &&
                    (tS.ws.data.uid >= 0 || args.standalone) &&
                    (args.standalone
                      ? (console.log("death", [aS, aJ]),
                        tS.ws.sendPacket("death", [aS, aJ]))
                      : ((tS.ws.data.ready = !1),
                        args.parentPort.postMessage([
                          "death",
                          [tS.ws.data.uid, aJ, [aS, aJ]],
                        ])));
              }
            }
          }
        }
        e.polygons.length < e.maxPolygonCount && spawnPolygon(e);
        for (let aV = e.polygons.length - 1; aV >= 0; aV--) {
          let aQ = e.polygons[aV];
          if (
            (dimension.confine(
              aQ,
              e.mapSize - (aQ.size < 100 ? aQ.size / 2 : 50),
            ),
            aQ.health <= 0)
          ) {
            let aZ = 0,
              ne = aQ.score * dimension.getRadiantMultiplier(aQ.radiant),
              nt = ne >= 1e8 || aQ.radiant > 3,
              na = {},
              nn = [],
              ni = {},
              nl = {},
              ns = dimension.getFullPolygonName(aQ);
            for (let no = aQ.dim.tanks.length - 1; no >= 0; no--) {
              let nr = aQ.dim.tanks[no];
              nl[nr.id] = nr;
            }
            let nd = 0;
            for (let n$ in aQ.finalDamage.tanks) {
              let nc = nl[n$];
              if (nc && !nc.static) {
                let nu = aQ.finalDamage.tanks[n$],
                  np = 0;
                for (let nm = 0; nm < 16; nm++) np += nu[nm];
                (na[n$] = np),
                  nn.push(nc.name),
                  (ni[n$] = nd),
                  nd++,
                  (aZ += np);
              }
            }
            for (let ng in na) {
              let nf = na[ng] / aZ,
                n_ = nl[ng],
                ny = nf * ne;
              if (
                ny &&
                ((n_.score += ny), n_.update(), n_.ws.sendPacket && nt)
              ) {
                let nh = ni[ng],
                  nk = nn.slice(0, nh).concat(nn.slice(nh + 1)),
                  nb = nk.length;
                0 === nb
                  ? n_.ws.sendPacket("announcement", `You killed ${ns}.`)
                  : 1 === nb
                    ? n_.ws.sendPacket(
                        "announcement",
                        `You and ${nk[0]} killed ${ns}.`,
                      )
                    : n_.ws.sendPacket(
                        "announcement",
                        `You, ${nk.slice(0, nb - 1).join(", ")}, and ${nk[nb - 1]} killed ${ns}.`,
                      );
              }
            }
            aQ.remove();
          }
        }
        if (t.gameUpdate) {
          for (let nv = e.gates.length - 1; nv >= 0; nv--) {
            let nx = e.gates[nv];
            nx[5] !== nx[7] &&
              ((nx[7] = nx[5]), (e.updatedGates[nv] = [nv, nx[5]]));
          }
          let nw = dimension.leaderboard(e),
            nT = [],
            n0 = {};
          for (let nz = 0; nz < 8; nz++) {
            let nP = nw[nz],
              n3;
            n3 = nP
              ? {
                  place: nz,
                  id: nP.id,
                  type: "tank" === nP.objectType ? 1 : 0,
                  score: Math.round(nP.score),
                  sides: nP.sides,
                  radiant: nP.radiant,
                }
              : {
                  place: nz,
                  id: -nz - 1,
                  type: 0,
                  score: 1,
                  sides: 0,
                  radiant: 0,
                };
            let nS = e.leaderboard[nz];
            nS &&
              (nS.id !== n3.id ||
                Math.round(nS.score) !== n3.score ||
                nS.type !== n3.type ||
                nS.radiant !== n3.radiant) &&
              (n0[nz] = n3),
              nT.push(n3);
          }
          e.leaderboard = nT;
          let n1 = [];
          for (let nj in n0) {
            let nC = n0[nj];
            n1.push([
              nj,
              nC.id,
              nC.type ? 0 : [nC.sides, nC.radiant],
              Math.round(nC.score),
            ]);
          }
          e.leaderboardChanges = n1;
        }
      },
      leaderboard: function (e) {
        let t = e.tanks
            .concat(e.polygons)
            .sort((e, t) =>
              e.displayScore === t.displayScore
                ? t.radiant - e.radiant
                : t.displayScore - e.displayScore,
            ),
          a = [],
          n = 0;
        for (
          let i = 0, l = t.length;
          i < l &&
          !(!t[i].static && !t[i].invisible && (a.push(t[i]), ++n >= 10));
          i++
        );
        return a;
      },
    },
    generator = {
      getId: function (e, t) {
        let a = t.ids[e],
          n = a.length;
        if (0 === n) return a.push(0), 0;
        let i = 0;
        for (; a[i] === i && i < n; ) i++;
        return a.splice(i, 0, i), i;
      },
      removeId: function (e, t, a) {
        setTimeout(function () {
          let n = a.ids[e],
            i = n.indexOf(t);
          i >= 0 && n.splice(i, 1);
        }, 1e3);
      },
      updateTank: function (e) {
        e._barrels = [];
        let t = function (a) {
          e._barrels.push(a),
            (1 === a.data.type || 3 === a.data.type) &&
              (a.maxTraps = (12 / a.data.reload) * 2);
          let n = a.data.relativeSizeS * a.data.width;
          if (a.data && (3 === a.data.type || 4 === a.data.type)) {
            let i = a.data.bulletWeapon;
            if (i)
              for (let l = 0, s = i.barrels.length; l < s; l++) {
                let o = i.barrels[l];
                (o.relativeSize = n),
                  (o.relativeSizeS = n * (("size" in o && o.size) || 1)),
                  t({ data: o, child: !0 });
              }
            let r = a.data.bulletBody;
            if (r)
              for (let d = 0, $ = r.turrets.length; d < $; d++) {
                let c = r.turrets[d],
                  u = c,
                  p = c.barrels || [];
                for (let m = 0, g = p.length; m < g; m++) {
                  let f = p[m];
                  (f.relativeSize = n * u.size),
                    (f.relativeSizeS =
                      f.relativeSize * (("size" in f && f.size) || 1)),
                    t({ data: f, turret: u, child: !0 });
                }
              }
          }
        };
        for (let a = 0, n = e.barrels.length; a < n; a++) t(e.barrels[a]);
        e._turrets = e.weaponTurrets.concat(e.turrets);
        for (let i = 0, l = e._turrets.length; i < l; i++) {
          let s = e._turrets[i];
          for (let o = 0, r = s.barrels.length; o < r; o++) t(s.barrels[o]);
        }
        e.removeBullets();
      },
      setTankWeapon: function (e, t) {
        let a = t;
        if ((t = tankData.weapons[t])) {
          (e.weapon = a),
            (e.weaponData = t),
            (e.weaponCameraSize = t.cameraSizeMultiplier),
            (e.barrels = []),
            (e.weaponTurrets = []);
          for (let n = 0, i = t.barrels.length; n < i; n++) {
            let l = t.barrels[n];
            (l.relativeSize = 1),
              (l.relativeSizeS = ("size" in l && l.size) || 1),
              e.barrels.push({
                current:
                  0.5 * l.reload * (1 - e.upgrades[3] / 30) * (1 - l.delay) -
                  0.1,
                bullets: [],
                data: l,
              });
          }
          for (let s = 0, o = t.weaponTurrets.length; s < o; s++) {
            let r = { ...t.weaponTurrets[s] };
            (r.gameX = e.x),
              (r.gameY = e.y),
              (r.detector = {}),
              (r.d = e.d),
              (r.position = "weaponTurret");
            let d = r.barrels;
            r.barrels = [];
            for (let $ = 0, c = d.length; $ < c; $++) {
              let u = d[$];
              (u.relativeSize = 0.5 * r.size),
                (u.relativeSizeS =
                  u.relativeSize * (("size" in u && u.size) || 1)),
                r.barrels.push({
                  current:
                    0.5 * u.reload * (1 - e.upgrades[3] / 30) * (1 - u.delay) -
                    0.1,
                  bullets: [],
                  data: u,
                  turret: r,
                  active: !1,
                });
            }
            e.weaponTurrets.push(r);
          }
          generator.updateTank(e);
        }
      },
      setTankBody: function (e, t) {
        let a = t;
        if ((t = tankData.bodies[t])) {
          (e.celestial = !!t.celestial),
            (e.body = a),
            (e.bodyData = t),
            (e.maxHealthMultiplier = t.maxHealth),
            (e.movementSpeed = t.movementSpeed * (e.celestial ? 1.5 : 1)),
            (e.bodyDamage = t.bodyDamage),
            (e.bodyCameraSize = t.cameraSizeMultiplier),
            (e.turrets = []),
            (e.auras = []),
            (e.noHitBox = !!t.noHitBox);
          for (let n = 0, i = t.turrets.length; n < i; n++) {
            let l = { ...t.turrets[n] };
            (l.gameX = e.x),
              (l.gameY = e.y),
              (l.detector = {}),
              (l.d = e.d),
              (l.position = "turret");
            let s = l.barrels;
            l.barrels = [];
            for (let o = 0, r = s.length; o < r; o++) {
              let d = s[o];
              (d.relativeSize = 0.5 * l.size),
                (d.relativeSizeS =
                  d.relativeSize * (("size" in d && d.size) || 1)),
                l.barrels.push({
                  current:
                    0.5 * d.reload * (1 - e.upgrades[3] / 30) * (1 - d.delay) -
                    0.1,
                  bullets: [],
                  data: d,
                  turret: l,
                  active: !1,
                });
            }
            e.turrets.push(l);
          }
          for (let $ = 0, c = t.auras.length; $ < c; $++) {
            let u = { ...t.auras[$] };
            (u.gameX = e.x),
              (u.gameY = e.y),
              (u.detector = {}),
              e.auras.push(u);
          }
          generator.updateTank(e);
        }
      },
      updateFinalDamage: function (e) {
        let t = {};
        for (let a in e) {
          let n = e[a];
          Math.max(...n) > 0 && (t[a] = n.slice(1).concat(0));
        }
        return t;
      },
      log1: 1 / Math.log(1.2),
      log2: 1 / Math.log(4),
      getLevel: function (e) {
        return (
          Math.floor(
            Math.round(1e6 * Math.log(e / 500 + 1) * generator.log1) / 1e6,
          ) + 1
        );
      },
      getCelestialLevel: function (e) {
        return (
          Math.floor(
            Math.round(
              1e6 * Math.log((e - 23477631) / 5e6 + 1) * generator.log1,
            ) / 1e6,
          ) + 75
        );
      },
      getAbyssalLevel: function (e) {
        return (
          Math.floor(
            Math.round(
              1e6 * Math.log((e - 23477631) / 5e6 + 1) * generator.log1,
            ) / 1e6,
          ) + 75
        );
      },
      getSides: function (e) {
        return (
          Math.floor(
            Math.round(
              1e6 * Math.log(1 + (3 * (e - 250)) / 1e3) * generator.log2,
            ) / 1e6,
          ) + 3
        );
      },
      tank: function (e, t) {
        let a = {
          id: generator.getId("tank", e.dim),
          lastChat: 0,
          chat: function (e) {
            (a.lastChat = performance.now()), (a.dim.chatMessages[a.id] = e);
          },
          alwaysShowOnMinimap: e.alwaysShowOnMinimap || !1,
          polygon: e.polygon || !1,
          noKillNotification: e.noKillNotification || !1,
          invisible: e.invisible || !1,
          dim: e.dim || !1,
          ignorePolygonDamage: e.ignorePolygonDamage || !1,
          weight: e.weight || 1,
          density: e.density || 1,
          speed: e.speed || 1,
          onDeath: e.onDeath || function () {},
          forceDeathScore: e.forceDeathScore >= 0 ? e.forceDeathScore : -1,
          x: e.x || 0,
          y: e.y || 0,
          d: e.d || 0,
          fullFov: !1,
          _d: [],
          xv: 0,
          yv: 0,
          range: "range" in e ? e.range : 12,
          static: e.static || !1,
          clip: e.clip || !1,
          firing: !1,
          droneControl: !1,
          firedBarrels: {},
          upgrades: e.upgrades || [0, 0, 0, 0, 0, 0, 0, 0],
          maxHealthMultiplier: 1,
          upgradeCount: e.upgradeCount || 0,
          alive: !0,
          countUpgrades: function () {
            let e = 0;
            for (let t = 0; t < 8; t++) e += a.upgrades[t];
            a.upgradeCount = e;
          },
          bodyDamageMultiplier: 1,
          radiant: e.radiant || 0,
          controlPosition: [0, 0],
          mousePosition: [0, 0],
          name: e.name || "",
          team: e.team || 0,
          score: e.score || 0,
          displayScore: e.score || 0,
          level: 0,
          lastSendLevel: 0,
          levelMultiplier: 1,
          health: 800,
          maxHealth: 800,
          regenTime: 1,
          size: 30,
          detector: !1,
          input: { movement: [0, 0] },
          typing: e.typing || !1,
          passive: e.passive || !1,
          invincible: !("invincible" in e) || e.invincible,
          invincibleTime: performance.now() + 3e4,
          weapon: e.weapon || "node",
          body: e.body || "base",
          turrets: [],
          auras: [],
          bullets: {},
          ascend: function () {
            (a.upgrades = [0, 0, 0, 0, 0, 0, 0, 0]),
              a.countUpgrades(),
              (a.weapon = "nova"),
              (a.body = "celestial"),
              7 !== a.team && (a.team = 6),
              (a.dim.updatedTanks[a.id] = a),
              a.update(),
              a.removeBullets(),
              generator.setTankWeapon(a, a.weapon),
              generator.setTankBody(a, a.body),
              (a.firedBarrels = {}),
              generator.updateTank(a),
              (t.data.tank.dim.updatedTanks[t.data.tank.id] = t.data.tank);
          },
          surge: function () {
            (a.upgrades = [0, 0, 0, 0, 0, 0, 0, 0]),
              a.countUpgrades(),
              (a.weapon = "novus"),
              (a.body = "abyssal"),
              7 !== a.team && (a.team = 8),
              (a.dim.updatedTanks[a.id] = a),
              a.update(),
              a.removeBullets(),
              generator.setTankWeapon(a, a.weapon),
              generator.setTankBody(a, a.body),
              (a.firedBarrels = {}),
              generator.updateTank(a),
              (t.data.tank.dim.updatedTanks[t.data.tank.id] = t.data.tank);
          },
          fov: { tanks: [], polygons: [], bullets: [] },
          finalDamage: { tanks: {}, polygons: {} },
          removeBullets: function () {
            for (let e in a.bullets) a.bullets[e].remove();
          },
          setMaxHealth: function (e) {
            (a.health = (a.health / a.maxHealth) * e), (a.maxHealth = e);
          },
          damage: function (e, t, n) {
            if (e > 0) {
              (a.health -= e),
                a.health < 0 && (a.health = 0),
                (a.regenTime = 0);
              let i = a.finalDamage[n];
              i &&
                (i[t.id]
                  ? (i[t.id][15] += e)
                  : (i[t.id] = [
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      e,
                    ]));
            }
          },
          remove: function (e) {
            (a.alive = !1), a.removeBullets();
            let n = a.dim.tanks.indexOf(a);
            n >= 0 && a.dim.tanks.splice(n, 1),
              generator.removeId("tank", a.id, a.dim),
              t && t.data && t.data.tank === a && (t.data.tank = !1);
          },
          update2: function () {
            let e = tankData.bodies[a.body],
              t = 1;
            if (
              (e && e.celestial && (a.celestial = !0),
              e && e.size && (t = e.size),
              a.celestial
                ? (a.score < 18312227059 && (a.score = 18312227059),
                  (a.level = generator.getCelestialLevel(a.score)))
                : (a.level = generator.getLevel(a.score)),
              (a.displayScore =
                a.score * dimension.getRadiantMultiplier(a.radiant)),
              (a.levelMultiplier = Math.pow(1.01, a.level - 1)),
              (a.size = 30 * a.levelMultiplier * (a.celestial ? 1.5 : 1) * t),
              a.size > 1e3 && (a.size = 1e3),
              a.barrels)
            )
              for (let n = a.barrels.length - 1; n >= 0; n--) {
                let i = a.barrels[n].bullets;
                for (let l = i.length - 1; l >= 0; l--)
                  i[l].size = a.size * i[l].rawSize;
              }
            7 !== a.team ||
              a.ws.data.isPlayer ||
              (a.name = `Fallen ${a.weapon && a.weapon[0] ? a.weapon[0].toUpperCase() + a.weapon.slice(1) : "???"}-${a.body && a.body[0] ? a.body[0].toUpperCase() + a.body.slice(1) : "???"}`);
          },
          update: function () {
            let e = tankData.bodies[a.body],
              t = 1;
            if (
              (e && e.celestial && (a.celestial = !0),
              e && e.size && (t = e.size),
              a.celestial
                ? (a.score < 23477631 && (a.score = 23477631),
                  (a.level = generator.getCelestialLevel(a.score)))
                : (a.level = generator.getLevel(a.score)),
              (a.displayScore =
                a.score * dimension.getRadiantMultiplier(a.radiant)),
              (a.levelMultiplier = Math.pow(1.01, a.level - 1)),
              (a.size = 30 * a.levelMultiplier * (a.celestial ? 1.5 : 1) * t),
              a.size > 1e3 && (a.size = 1e3),
              a.barrels)
            )
              for (let n = a.barrels.length - 1; n >= 0; n--) {
                let i = a.barrels[n].bullets;
                for (let l = i.length - 1; l >= 0; l--)
                  i[l].size = a.size * i[l].rawSize;
              }
            7 !== a.team ||
              a.ws.data.isPlayer ||
              (a.name = `Fallen ${a.weapon && a.weapon[0] ? a.weapon[0].toUpperCase() + a.weapon.slice(1) : "???"}-${a.body && a.body[0] ? a.body[0].toUpperCase() + a.body.slice(1) : "???"}`);
          },
          ws: t,
          setWs: function (e) {
            a.ws = t = e;
          },
          objectType: "tank",
          aiInput: e.ai,
        };
        if ("fallen" === e.ai) (a.ai = "fallen"), (a.aiRam = !!e.aiRam);
        else if ("defender" === e.ai) {
          a.range = 5;
          let n = 2 * Math.random() * Math.PI,
            i = 0;
          a.ai = function (e) {
            (a.d = dimension.averageAngles(a.d, n, 100)),
              i < e.now &&
                ((i = e.now + 1e4 + 1e4 * Math.random()),
                (n = 2 * Math.random() * Math.PI));
          };
        } else e.ai && (a.ai = e.ai);
        return (
          a.update(),
          generator.setTankWeapon(a, a.weapon),
          generator.setTankBody(a, a.body),
          a.dim && ((a.dim.updatedTanks[a.id] = a), a.dim.add("tanks", a)),
          a
        );
      },
      bullet: function (e) {
        let t = e.parent._barrels[e.barrelId],
          a = e.barrel || t,
          n = {
            id: generator.getId("bullet", e.dim),
            type: t.data.type,
            visualType: t.data.visualType || t.data.type,
            parent: e.parent,
            parentId: e.parent.id,
            barrelId: e.barrelId,
            barrel: t,
            barrels: [],
            dim: e.dim || !1,
            damageMultiplier: e.damage || 1,
            timeExisted: 0,
            target: !1,
            lifeTime: e.lifeTime || 1,
            health: e.health || 125,
            maxHealth: e.health || 125,
            damage: function (e) {
              e > 0 && ((n.health -= e), n.health < 0 && (n.health = 0));
            },
            d: e.d || 0,
            x: e.x || 0,
            y: e.y || 0,
            xv: dimension.tickMultiplier * (e.xv || 0),
            yv: dimension.tickMultiplier * (e.yv || 0),
            speed: e.speed || 0,
            size: e.size * e.parent.size,
            rawSize: e.size,
            remove: function () {
              if (
                (n === e.parent.bullets[n.id] && delete e.parent.bullets[n.id],
                n.barrels)
              )
                for (let t = n.barrels.length - 1; t >= 0; t--) {
                  let i = n.barrels[t].bullets;
                  for (let l = i.length - 1; l >= 0; l--) i[l].remove();
                }
              let s = n.dim.bullets.indexOf(n);
              s >= 0 && n.dim.bullets.splice(s, 1),
                generator.removeId("bullet", n.id, n.dim),
                (s = a.bullets.indexOf(n)) >= 0 && a.bullets.splice(s, 1);
            },
          };
        if (3 === t.data.type || 4 === t.data.type) {
          let i = t.data.bulletWeapon;
          if (i) {
            n.barrels = [];
            for (let l = 0, s = i.barrels.length; l < s; l++) {
              let o = i.barrels[l],
                r = -1;
              for (
                r = e.parent._barrels.length - 1;
                r >= 0 && e.parent._barrels[r].data !== o;
                r--
              );
              n.barrels.push({
                current:
                  0.5 *
                    o.reload *
                    (1 - n.parent.upgrades[3] / 30) *
                    (1 - o.delay) -
                  0.1,
                bullets: [],
                data: o,
                id: r,
              });
            }
          }
          n._barrels = n.barrels.slice(0);
          let d = t.data.bulletBody;
          if (d) {
            (n.bodyData = d),
              (n.speed *= d.movementSpeed),
              (n.health *= d.maxHealth),
              (n.damageMultiplier *= d.bodyDamage),
              (n.bodyCameraSize = d.cameraSizeMultiplier),
              (n.turrets = []),
              (n.auras = []);
            for (let $ = 0, c = d.turrets.length; $ < c; $++) {
              let u = { ...d.turrets[$] };
              (u.gameX = n.x),
                (u.gameY = n.y),
                (u.detector = {}),
                (u.d = n.d),
                (u.position = "turret");
              let p = u.barrels || [];
              u.barrels = [];
              for (let m = 0, g = p.length; m < g; m++) {
                let f = p[m];
                (f.relativeSize = 0.25 * u.size),
                  (f.relativeSizeS =
                    f.relativeSize * (("size" in f && f.size) || 1));
                let _ = -1;
                for (
                  _ = e.parent._barrels.length - 1;
                  _ >= 0 && e.parent._barrels[_].data !== f;
                  _--
                );
                let y = {
                  current:
                    0.5 *
                      f.reload *
                      (1 - n.parent.upgrades[3] / 30) *
                      (1 - f.delay) -
                    0.1,
                  bullets: [],
                  data: f,
                  turret: u,
                  active: !1,
                  id: _,
                };
                u.barrels.push(y), n._barrels.push(y);
              }
              n.turrets.push(u);
            }
            for (let h = 0, k = d.auras.length; h < k; h++) {
              let b = { ...d.auras[h] };
              (b.gameX = n.x),
                (b.gameY = n.y),
                (b.detector = {}),
                n.auras.push(b);
            }
          }
        }
        return (
          a.bullets.push(n),
          (e.parent.bullets[n.id] = n),
          n.dim && n.dim.add("bullets", n),
          n
        );
      },
      polygon: function (e) {
        e.sides < 0
          ? createMessage(
              "1187917859742027786",
              `\`[${new Date().toTimeString().split(" ")[0]}] Spawned ${dimension.getFullPolygonName(e)} in ${e.dim.name}!\``,
            )
          : e.radiant > 4 &&
            createMessage(
              "1187917859742027786",
              `\`[${new Date().toTimeString().split(" ")[0]}] Spawned ${dimension.getFullPolygonName(e)} in ${e.dim.name}!\``,
            );
        let t = {
          id: generator.getId("polygon", e.dim),
          dim: e.dim || !1,
          x: e.x || 0,
          y: e.y || 0,
          d: e.d || 0,
          xv: 0,
          yv: 0,
          alive: !0,
          radiant: e.radiant || 0,
          sides: e.sides || 3,
          score: 0,
          health: 0,
          maxHealth: 0,
          regenTime: 1,
          removeTime: 0,
          size: 0,
          finalDamage: { tanks: {} },
          damage: function (e, a, n) {
            if (e > 0) {
              (t.removeTime = 0),
                (t.health -= e),
                t.health < 0 && (t.health = 0),
                (t.regenTime = 0);
              let i = t.finalDamage[n];
              i &&
                (i[a.id]
                  ? (i[a.id][15] += e)
                  : (i[a.id] = [
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      e,
                    ]));
            }
          },
          remove: function () {
            t.alive = !1;
            let e = t.dim.polygons.indexOf(t);
            e >= 0 && t.dim.polygons.splice(e, 1),
              generator.removeId("polygon", t.id, t.dim);
          },
          update: function () {
            if (t.sides < 0) return;
            t.score < 150 && (t.score = 250),
              (t.displayScore =
                t.score * dimension.getRadiantMultiplier(t.radiant));
            let e = generator.getSides(t.score),
              a = t.dim.maxPolygonSides + 1;
            if ((e > a && (e = a), e !== t.sides)) {
              (t.sides = e), (t.size = generator.getPolygonSize(t.sides));
              let n = generator.getPolygonHealth(t.sides);
              (t.speed =
                dimension.tickMultiplier * generator.getPolygonSpeed(t.sides)),
                (t.health *= n / t.maxHealth),
                (t.maxHealth = n);
            }
          },
        };
        return (
          t.sides < 0
            ? (t.score = 1e9 * Math.pow(3, -t.sides - 1))
            : (t.score = 250 + (1e3 * (Math.pow(4, t.sides - 3) - 1)) / 3),
          (t.displayScore =
            t.score * dimension.getRadiantMultiplier(t.radiant)),
          (t.size = generator.getPolygonSize(t.sides)),
          (t.speed =
            dimension.tickMultiplier * generator.getPolygonSpeed(t.sides)),
          (t.health = t.maxHealth = generator.getPolygonHealth(t.sides)),
          t.dim && t.dim.add("polygons", t),
          t
        );
      },
      getPolygonSize: function (e) {
        return e >= 3 ? 20 * Math.pow(1.5, e - 3) : 50 * Math.pow(1.4, -e - 1);
      },
      getPolygonSpeed: function (e) {
        return e >= 3 ? Math.pow(0.6, e - 3) : 0.5 * Math.pow(0.4, -e - 1);
      },
      getPolygonHealth: function (e) {
        return e >= 3 ? 35 * Math.pow(3.6, e - 3) : 5e4 * Math.pow(2, -e - 1);
      },
      wormhole: function (e) {
        let t = e.size || 75,
          a = {
            id: generator.getId("wormhole", e.dim),
            dim: e.dim || !1,
            type: e.type || 0,
            color: e.color >= 0 ? e.color : 8,
            radiant: e.radiant >= 0 || e.radiant <= 0 ? e.radiant : 1,
            x: e.x || 0,
            y: e.y || 0,
            objects: {},
            _objects: {},
            time: e.time || 30,
            fadeTime: 0,
            action: e.action || function () {},
            onRupture: e.onRupture,
            ruptured: e.ruptured || !1,
            entries: 0,
            contents: 0,
            size: t,
            defaultSize: t * t,
            remove: function () {
              a.dim.wormholes[a.id] === a && delete a.dim.wormholes[a.id],
                (a.dim.removedWormholes[a.id] = a),
                generator.removeId("wormhole", a.id, a.dim);
            },
            rupture: function () {
              !a.ruptured &&
                ((a.ruptured = !0),
                (a.time = 30 + 20 * Math.random()),
                (a.dim.rupturedWormholes[a.id] = a),
                a.onRupture && a.onRupture(a));
            },
          };
        return (
          a.dim &&
            ((a.dim.wormholes[a.id] = a), (a.dim.addedWormholes[a.id] = a)),
          a
        );
      },
    },
    packer = {
      gameStart: function (e) {
        let t = e.dim,
          a = [];
        for (let n = t.tanks.length - 1; n >= 0; n--) {
          let i = t.tanks[n];
          a.push([i.id, i.name, i.team, i.radiant, i.weapon, i.body]);
        }
        let l = dimension.leaderboard(t),
          s = [];
        for (let o = 0; o < 8; o++) {
          let r = l[o];
          r
            ? s.push([
                r.id,
                "tank" === r.objectType ? 0 : [r.sides, r.radiant],
                Math.round(r.score),
              ])
            : s.push([-o - 1, [0, 0], 1]);
        }
        let d = [];
        for (let $ = 0, c = t.gates.length; $ < c; $++)
          d.push(t.gates[$].slice(0, 6));
        let u = [];
        for (let p in t.wormholes) {
          let m = t.wormholes[p];
          u.push([
            m.id,
            m.x,
            m.y,
            m.type,
            m.size,
            m.ruptured || !1,
            Math.round(100 * m.fadeTime),
            m.color,
            m.radiant,
          ]);
        }
        return [
          a,
          t.mapSize,
          s,
          t.walls,
          d,
          u,
          e.upgrades,
          Math.round(t.darkness),
          [
            t.background.r,
            t.background.g,
            t.background.b,
            t.grid.r,
            t.grid.g,
            t.grid.b,
            t.gridSize,
          ],
          e.saveCode,
          !!t.fillWalls,
        ];
      },
      gameUpdate: function (e) {
        let t = [e.id, e.score];
        if (Object.keys(e.tanks)[0] >= 0) {
          let a = [0];
          for (let n in e.tanks) {
            let i = e.tanks[n],
              l = ((Math.round((i.d / Math.PI) * 1e3) % 2e3) + 2e3) % 2e3,
              s = [],
              o = i._d.length;
            if (o <= 1) s = l;
            else {
              let r = !0;
              for (let d = 0; d < 5; d++)
                d < o
                  ? (s.push(i._d[d]),
                    r && d > 0 && i._d[d] !== s[d - 1] && (r = !1))
                  : s.push(l);
              r && (s = l);
            }
            let $ = [];
            for (let c = 0, u = i._turrets.length; c < u; c++) {
              let p = i._turrets[c];
              $.push(((Math.round((p.d / Math.PI) * 50) % 100) + 100) % 100);
            }
            let m = [
                i.id,
                Math.round(i.x),
                Math.round(i.y),
                s,
                $,
                Math.floor((1 - i.health / i.maxHealth) * 100),
                (i.typing ? 1 : 0) +
                  (i.passive ? 2 : 0) +
                  (i.invincible ? 4 : 0) +
                  (i.invisible ? 8 : 0) +
                  (i.alwaysShowOnMinimap ? 16 : 0),
                i.level,
              ],
              g = Object.values(i.firedBarrels);
            g[0] >= 0 && m.push(g), a.push(m);
          }
          t.push(a);
        }
        if (Object.keys(e.dim.updatedTanks)[0] >= 0) {
          let f = [1];
          for (let _ in e.dim.updatedTanks) {
            let y = e.dim.updatedTanks[_],
              h = [y.id, y.name, y.team, y.radiant, y.weapon, y.body];
            f.push(h);
          }
          t.push(f);
        }
        if (Object.keys(e.dim.chatMessages)[0] >= 0) {
          let k = [2];
          for (let b in e.dim.chatMessages) k.push([b, e.dim.chatMessages[b]]);
          t.push(k);
        }
        if (Object.keys(e.bullets)[0] >= 0) {
          let v = [3],
            x = {},
            w = {};
          for (let T in e.bullets) {
            let z = e.bullets[T],
              P = z.parentId,
              S = z.barrelId;
            P in x || ((x[P] = {}), (w[P] = P));
            let j = x[P],
              C = [
                z.id,
                Math.round(z.x),
                Math.round(z.y),
                ((Math.round((z.d / Math.PI) * 100) % 200) + 200) % 200,
              ];
            if (z.turrets && z.turrets[0]) {
              let M = [];
              for (let B in z.turrets) {
                let D = z.turrets[B];
                M.push(((Math.round((D.d / Math.PI) * 100) % 200) + 200) % 200);
              }
              C.push(M);
            }
            S in j ? j[S].push(C) : (j[S] = [S, C]);
          }
          for (let I in x) {
            let W = x[I],
              H = [w[I]];
            for (let R in W) H.push(W[R]);
            v.push(H);
          }
          t.push(v);
        }
        if (Object.keys(e.polygons)[0] >= 0) {
          let O = [4],
            Y = {},
            U = {},
            F = {};
          for (let N in e.polygons) {
            let A = e.polygons[N],
              X = Y[A.radiant];
            if (
              (X || ((X = Y[A.radiant] = {}), (U[A.radiant] = A.radiant)),
              X[A.sides])
            )
              X[A.sides][A.id] = A;
            else {
              let q = {};
              (q[A.id] = A), (X[A.sides] = q), (F[A.sides] = A.sides);
            }
          }
          for (let E in Y) {
            let G = Y[(E = U[E])],
              L = [E];
            for (let K in G) {
              let J = G[K],
                V = [F[K]];
              for (let Q in J) {
                let Z = J[Q];
                V.push([
                  Z.id,
                  Math.round(Z.x),
                  Math.round(Z.y),
                  ((Math.round((Z.d / Math.PI) * 500) % 1e3) + 1e3) % 1e3,
                  Math.floor((1 - Z.health / Z.maxHealth) * 500),
                ]);
              }
              L.push(V);
            }
            O.push(L);
          }
          t.push(O);
        }
        if (Object.keys(e.dim.leaderboardChanges)[0] >= 0) {
          let ee = [5].concat(e.dim.leaderboardChanges);
          t.push(ee);
        }
        if (Object.keys(e.dim.updatedGates)[0] >= 0) {
          let et = [6];
          for (let ea in e.dim.updatedGates) {
            let en = e.dim.updatedGates[ea];
            et.push(en);
          }
          t.push(et);
        }
        if (Object.keys(e.dim.resizedWormholes)[0] >= 0) {
          let ei = [7];
          for (let el in e.dim.resizedWormholes) {
            let es = e.dim.resizedWormholes[el];
            ei.push([es.id, Math.round(es.size)]);
          }
          t.push(ei);
        }
        if (Object.keys(e.dim.rupturedWormholes)[0] >= 0) {
          let eo = [8];
          for (let er in e.dim.rupturedWormholes) {
            let ed = e.dim.rupturedWormholes[er];
            eo.push(ed.id);
          }
          t.push(eo);
        }
        if (Object.keys(e.dim.fadeTimeChanges)[0] >= 0) {
          let e$ = [9];
          for (let ec in e.dim.fadeTimeChanges) {
            let eu = e.dim.fadeTimeChanges[ec];
            e$.push([eu.id, Math.round(100 * eu.fadeTime)]);
          }
          t.push(e$);
        }
        if (Object.keys(e.dim.removedWormholes)[0] >= 0) {
          let ep = [10];
          for (let em in e.dim.removedWormholes) {
            let eg = e.dim.removedWormholes[em];
            ep.push(eg.id);
          }
          t.push(ep);
        }
        if (Object.keys(e.dim.addedWormholes)[0] >= 0) {
          let ef = [11];
          for (let e_ in e.dim.addedWormholes) {
            let ey = e.dim.addedWormholes[e_];
            ef.push([
              ey.id,
              ey.x,
              ey.y,
              ey.type,
              ey.size,
              ey.ruptured || !1,
              Math.round(100 * ey.fadeTime),
              ey.color,
            ]);
          }
          t.push(ef);
        }
        if (
          (e.dim.darknessUpdated && t.push([12, e.dim.darkness]),
          Object.keys(e.dim.updatedPortals)[0] >= 0)
        ) {
          let eh = [13];
          for (let ek in e.dim.updatedPortals) {
            let eb = e.dim.updatedPortals[ek];
            eh.push([eb.id, eb.color, eb.radiant]);
          }
          t.push(eh);
        }
        if (Object.keys(e.dim.updatedWalls)[0] >= 0) {
          let ev = [14];
          for (let ex in e.dim.updatedWalls) {
            let ew = e.dim.updatedWalls[ex];
            ev.push([parseInt(ex), ew[4] || !1]);
          }
          t.push(ev);
        }
        return t;
      },
    },
    commands = {
      getTargets: function (e, t) {
        if (!e) return;
        let a = [],
          n = t.dim.tanks;
        switch (e) {
          case "all":
            return t.dim.tanks.concat(t.dim.polygons).concat(t.dim.bullets);
          case "bullets":
            return t.dim.bullets.slice();
          case "tanks":
            let i = [];
            for (let l = n.length - 1; l >= 0; l--) {
              let s = n[l];
              s.polygon || i.push(s);
            }
            return i;
          case "polygons":
            return t.dim.polygons.slice();
          case "me":
            return [t];
          case "fallens":
            for (let o = n.length - 1; o >= 0; o--) {
              let r = n[o];
              7 !== r.team || r.ws.data.isPlayer || a.push(r);
            }
            return a;
          case "pinks":
          case "celes":
          case "celestials":
            for (let d = n.length - 1; d >= 0; d--) {
              let $ = n[d];
              6 === $.team && a.push($);
            }
            return a;
          case "blues":
            for (let c = n.length - 1; c >= 0; c--) {
              let u = n[c];
              1 === u.team && a.push(u);
            }
            return a;
          case "reds":
            for (let p = n.length - 1; p >= 0; p--) {
              let m = n[p];
              2 === m.team && a.push(m);
            }
            return a;
          case "greens":
            for (let g = n.length - 1; g >= 0; g--) {
              let f = n[g];
              3 === f.team && a.push(f);
            }
            return a;
          case "purples":
            for (let _ = n.length - 1; _ >= 0; _--) {
              let y = n[_];
              4 === y.team && a.push(y);
            }
            return a;
          case "yellows":
            for (let h = n.length - 1; h >= 0; h--) {
              let k = n[h];
              8 === k.team && a.push(k);
            }
            return a;
          case "others":
            for (let b = n.length - 1; b >= 0; b--) {
              let v = n[b];
              v !== t && a.push(v);
            }
            return a;
          case "polyps":
            for (let x = n.length - 1; x >= 0; x--) {
              let w = n[x];
              5 === w.team && a.push(w);
            }
            return a;
          default:
            let T = e[0],
              z = parseInt(e.slice(1));
            if (z >= 0) {
              if ("t" === T) {
                let P = t.dim.tanks;
                for (let S = P.length - 1; S >= 0; S--) {
                  let j = P[S];
                  if (j.id === z) return [j];
                }
              }
              if ("p" === T) {
                let C = t.dim.polygons;
                for (let M = C.length - 1; M >= 0; M--) {
                  let B = C[M];
                  if (B.id === z) return [B];
                }
              }
            }
        }
      },
      parse: function (e, t, a) {
        let n = [];
        for (let i = 0, l = e.length; i < l; i++) {
          let s = e[i];
          if ("position" === s) {
            let o = t.splice(0, 1)[0],
              r = commands.getTargets(o, a);
            if (r && 1 === r.length) n.push([r[0].x, r[0].y]);
            else {
              o = parseFloat(o);
              let d = parseFloat(t.splice(0, 1)[0]);
              if ((!(o >= 0) && !(o <= 0)) || (!(d >= 0) && !(d <= 0)))
                return {
                  ok: !1,
                  error: `Failed to parse position '${o} ${d}'`,
                };
              n.push([o, d]);
            }
          } else if ("targets" === s) {
            let $ = t.splice(0, 1)[0],
              c = commands.getTargets($, a);
            if (!c || !(c.length > 0))
              return {
                ok: !1,
                error: `Cannot find targets with selector '${$}'`,
              };
            n.push(c);
          } else if ("int" === s) {
            let u = t.splice(0, 1)[0],
              p = parseInt(u);
            if (!(p >= 0) && !(p <= 0))
              return { ok: !1, error: `Cannot parse int '${u}'` };
            n.push(p);
          } else if ("float" === s) {
            let m = t.splice(0, 1)[0],
              g = parseFloat(m);
            if (!(g >= 0) && !(g <= 0))
              return { ok: !1, error: `Cannot parse float '${m}'` };
            n.push(g);
          } else if ("string" === s) n.push(t.splice(0, 1)[0]);
          else if ("*" === s) {
            n.push(t.join(" ")), (t = []);
            break;
          }
        }
        return t.length > 0
          ? { ok: !1, error: `Too many arguments! '${t.join(" ")}'` }
          : n;
      },
      rules: {
        name: [
          [
            ["targets", "*"],
            function (e, t, a) {
              let n = e[0],
                i = e[1];
              for (let l = n.length - 1; l >= 0; l--) {
                let s = n[l];
                "tank" === s.objectType &&
                  ((s.name = i), (s.dim.updatedTanks[s.id] = s));
              }
            },
          ],
          [
            ["*"],
            function (e, t, a) {
              (t.name = e[0]), (t.dim.updatedTanks[t.id] = t);
            },
          ],
        ],
        radiant: [
          [
            ["int"],
            function (e, t, a) {
              (t.radiant = e[0]), (t.dim.updatedTanks[t.id] = t), t.update();
            },
          ],
          [
            ["targets", "int"],
            function (e, t, a) {
              let n = e[0],
                i = e[1];
              for (let l = n.length - 1; l >= 0; l--) {
                let s = n[l];
                "radiant" in s &&
                  ((s.radiant = i),
                  "tank" === s.objectType && (s.dim.updatedTanks[s.id] = s),
                  s.update && s.update());
              }
            },
          ],
        ],
        missile: [
          [
            ["targets", "position"],
            function (e, t, a) {
              let n = e[0],
                i = e[1];
              for (let l = n.length - 1; l >= 0; l--) {
                let s = n[l];
                s.static ||
                  createAbyssling({ dim: s.dim, tank: s, x: i[0], y: i[1] });
              }
            },
          ],
        ],
        fallen: [
          [
            ["targets"],
            function (e, t, a) {
              let n = e[0];
              for (let i = n.length - 1; i >= 0; i--) {
                let l = n[i];
                "tank" !== l.objectType ||
                  l.static ||
                  ((l.invisible || l.noHitBox) && l.remove(),
                  (l.team = 7),
                  (l.invincible = !1),
                  (l.invincibleTime = 0),
                  l.ws.sendPacket &&
                    l.ws.data.isPlayer &&
                    (l.ws.data.uid >= 0 || args.standalone) &&
                    (args.standalone
                      ? l.ws.sendPacket("death", [["/fallen"], 0])
                      : ((t.ws.data.ready = !1),
                        args.parentPort.postMessage([
                          "death",
                          [l.ws.data.uid, 0, [["/fallen"], 0]],
                        ]))),
                  l.ws &&
                    ((l.ws.data.tank = !1),
                    (l.ws.data.respawnScore = 0),
                    (l.ws = {
                      data: { isPlayer: !1 },
                      sendPacket: function () {},
                    })),
                  (l.dim.updatedTanks[l.id] = l));
              }
            },
          ],
        ],
        bot: [
          [
            ["position", "*"],
            function (e, t) {
              let a = e[0],
                n = { data: {}, sendPacket: function () {} },
                i = generator.tank(
                  {
                    dim: t.dim,
                    x: a[0],
                    y: a[1],
                    name: e[1],
                    weapon: "node",
                    body: "base",
                    score: 0,
                    radiant: 0,
                    team: 8,
                    clip: !0,
                  },
                  n,
                );
              n.data.tank = i;
            },
          ],
        ],
        fallenbot: [
          [
            ["position", "*"],
            function (e, t) {
              let a = e[0],
                n = { data: {}, sendPacket: function () {} },
                i = generator.tank(
                  {
                    dim: t.dim,
                    x: a[0],
                    y: a[1],
                    name: e[1],
                    weapon: "node",
                    body: "base",
                    score: 0,
                    radiant: 0,
                    team: 7,
                    clip: !0,
                  },
                  n,
                );
              n.data.tank = i;
            },
          ],
        ],
        defenderblue: [
            [
              ["position", "*"],
              function (e, t) {
                let a = e[0],
                  n = { data: {}, sendPacket: function () {} },
                  i = generator.tank(
                    {
                      dim: t.dim,
                      x: a[0],
                      y: a[1],
                      name: e[1],
                      weapon: "defender",
                      body: "defender",
                      score: 18260456834587259673,
                      radiant: 0,
                      team: 1,
                      clip: !0,
                    },
                    n,
                  );
                n.data.tank = i;
              },
            ],
          ],
          defenderred: [
            [
              ["position", "*"],
              function (e, t) {
                let a = e[0],
                  n = { data: {}, sendPacket: function () {} },
                  i = generator.tank(
                    {
                      dim: t.dim,
                      x: a[0],
                      y: a[1],
                      name: e[1],
                      weapon: "defender",
                      body: "defender",
                      score: 18260456834587259673,
                      radiant: 0,
                      team: 2,
                      clip: !0,
                    },
                    n,
                  );
                n.data.tank = i;
              },
            ],
          ],
          defendergreen: [
            [
              ["position", "*"],
              function (e, t) {
                let a = e[0],
                  n = { data: {}, sendPacket: function () {} },
                  i = generator.tank(
                    {
                      dim: t.dim,
                      x: a[0],
                      y: a[1],
                      name: e[1],
                      weapon: "defender",
                      body: "defender",
                      score: 18260456834587259673,
                      radiant: 0,
                      team: 3,
                      clip: !0,
                    },
                    n,
                  );
                n.data.tank = i;
              },
            ],
          ],
          defenderpurple: [
            [
              ["position", "*"],
              function (e, t) {
                let a = e[0],
                  n = { data: {}, sendPacket: function () {} },
                  i = generator.tank(
                    {
                      dim: t.dim,
                      x: a[0],
                      y: a[1],
                      name: e[1],
                      weapon: "defender",
                      body: "defender",
                      score: 18260456834587259673,
                      radiant: 0,
                      team: 4,
                      clip: !0,
                    },
                    n,
                  );
                n.data.tank = i;
              },
            ],
          ],
        peacekeeper1: [
            [
              ["position", "*"],
              function (e, t) {
                let a = e[0],
                  n = { data: {}, sendPacket: function () {} },
                  i = generator.tank(
                    {
                      dim: t.dim,
                      x: a[0],
                      y: a[1],
                      name: e[1],
                      weapon: "peacekeeper1",
                      body: "peacekeeper1",
                      ai: "fallen",
                      aiRam: !1,
                      score: 3791350,
                      radiant: 1,
                      team: 8,
                      clip: !1,
                    },
                    n,
                  );
                n.data.tank = i;
              },
            ],
          ],
          peacekeeper2: [
            [
              ["position", "*"],
              function (e, t) {
                let a = e[0],
                  n = { data: {}, sendPacket: function () {} },
                  i = generator.tank(
                    {
                      dim: t.dim,
                      x: a[0],
                      y: a[1],
                      name: e[1],
                      weapon: "peacekeeper2",
                      body: "peacekeeper2",
                      ai: "fallen",
                      aiRam: !1,
                      score: 3225203312,
                      radiant: 1,
                      team: 8,
                      clip: !1,
                    },
                    n,
                  );
                n.data.tank = i;
              },
            ],
          ],
          peacekeeper3: [
            [
              ["position", "*"],
              function (e, t) {
                let a = e[0],
                  n = { data: {}, sendPacket: function () {} },
                  i = generator.tank(
                    {
                      dim: t.dim,
                      x: a[0],
                      y: a[1],
                      name: e[1],
                      weapon: "peacekeeper3",
                      body: "peacekeeper3",
                      ai: "fallen",
                      aiRam: !1,
                      score: 3225203312,
                      radiant: 1,
                      team: 8,
                      clip: !1,
                    },
                    n,
                  );
                n.data.tank = i;
              },
            ],
          ],          
        drag: [
          [
            [],
            function (e, t, a) {
              t.dragTarget = !1;
            },
          ],
          [
            ["targets"],
            function (e, t, a) {
              let n = e[0];
              t.dragTarget = n;
            },
          ],
        ],
        kill: [
          [
            ["targets"],
            function (e, t, a) {
              let n = e[0];
              for (let i = n.length - 1; i >= 0; i--) {
                let l = n[i];
                (l.static && (l.invincible || l.inBase || l.prevInBase)) ||
                  ((l.health = 0), "regenTime" in l && (l.regenTime = 0));
              }
            },
          ],
        ],
        maxstats: [
          [
            [],
            function (e, t, a) {
              e[0],
                (t.upgrades = [15, 15, 15, 15, 15, 15, 15, 15]),
                t.ws.sendPacket("setStats", t.upgrades);
            },
          ],
          [
            ["targets"],
            function (e, t, a) {
              let n = e[0];
              for (let i = n.length - 1; i >= 0; i--) {
                let l = n[i];
                l.static ||
                  "tank" !== l.objectType ||
                  ((l.upgrades = [15, 15, 15, 15, 15, 15, 15, 15]),
                  l.ws.sendPacket("setStats", l.upgrades));
              }
            },
          ],
        ],
        ascend: [
          [
            [],
            function (e, t, a) {
              t.ascend(),
                t.update(),
                (t.dim.updatedTanks[t.id] = t),
                t.ws.sendPacket("setStats", t.upgrades);
            },
          ],
          [
            ["targets"],
            function (e, t, a) {
              let n = e[0];
              for (let i = n.length - 1; i >= 0; i--) {
                let l = n[i];
                "tank" === l.objectType &&
                  !l.static &&
                  (l.ascend(),
                  l.update(),
                  (l.dim.updatedTanks[l.id] = l),
                  l.ws && l.ws.sendPacket("setStats", l.upgrades));
              }
            },
          ],
        ],
        surge: [
          [
            [],
            function (e, t, a) {
              t.surge(),
                t.update2(),
                (t.dim.updatedTanks[t.id] = t),
                t.ws.sendPacket("setStats", t.upgrades);
            },
          ],
          [
            ["targets"],
            function (e, t, a) {
              let n = e[0];
              for (let i = n.length - 1; i >= 0; i--) {
                let l = n[i];
                "tank" === l.objectType &&
                  !l.static &&
                  (l.surge(),
                  l.update(),
                  (l.dim.updatedTanks[l.id] = l),
                  l.ws && l.ws.sendPacket("setStats", l.upgrades));
              }
            },
          ],
        ],
        announce: [
          [
            ["*"],
            function (e, t, a) {
              let n = t.dim.tanks;
              for (let i = n.length - 1; i >= 0; i--) {
                let l = n[i];
                l.ws && l.ws.sendPacket("announcement", e[0]);
              }
            },
          ],
        ],
        globalannounce: [
          [
            ["*"],
            function (e, t, a) {
              args.parentPort.postMessage(["globalAnnounce", e[0]]);
            },
          ],
        ],
        pulltanks: [
          [
            [],
            function (e, t, a) {
              for (let n in dimension.dims)
                if (!n.startsWith("pvp")) {
                  let i = dimension.dims[n].tanks;
                  for (let l = i.length - 1; l >= 0; l--) {
                    let s = i[l];
                    !s ||
                      "tank" !== s.objectType ||
                      s.static ||
                      s.dim === t.dim ||
                      t.polygon ||
                      dimension.sendTankTo({ tank: s, dim: t.dim.name });
                  }
                }
            },
          ],
        ],
        ban: [[["targets"], function (e, t, a) {}]],
        kick: [[["targets"], function (e, t, a) {}]],
        remove: [
          [
            ["targets"],
            function (e, t, a) {
              let n = e[0];
              for (let i = n.length - 1; i >= 0; i--) {
                let l = n[i];
                l.remove &&
                  !l.static &&
                  (l.remove(),
                  l.ws &&
                    l.ws.sendPacket &&
                    ((l.ws.data.respawnScore = 0),
                    (l.ws.data.tank = !1),
                    l.ws.data.isPlayer &&
                      (l.ws.data.uid >= 0 || args.standalone) &&
                      (args.standalone
                        ? l.ws.sendPacket("death", [["/remove"], 0])
                        : ((t.ws.data.ready = !1),
                          args.parentPort.postMessage([
                            "death",
                            [l.ws.data.uid, 0, [["/remove"], 0]],
                          ])))));
              }
            },
          ],
        ],
        wormhole: [
          [
            ["position", "string"],
            function (e, t, a) {
              generator.wormhole({
                x: e[0][0],
                y: e[0][1],
                size: 40,
                type: 1,
                time: 30,
                dim: t.dim,
                ruptured: !0,
                action: function (t) {
                  dimension.sendTankTo({ tank: t, dim: e[1] });
                },
              });
            },
          ],
        ],
        tp: [
          [
            ["targets"],
            function (e, t, a) {
              let n = e[0],
                i = t.mousePosition;
              for (let l = n.length - 1; l >= 0; l--) {
                let s = n[l];
                s.static || ((s.x = i[0]), (s.y = i[1]));
              }
            },
          ],
          [
            ["targets", "position"],
            function (e, t, a) {
              let n = e[0],
                i = e[1];
              for (let l = n.length - 1; l >= 0; l--) {
                let s = n[l];
                s.static || ((s.x = i[0]), (s.y = i[1]));
              }
            },
          ],
        ],
        polygon: [
          [
            ["int"],
            function (e, t, a) {
              let n = e[0];
              n >= 3 &&
                generator.polygon({
                  x: t.x,
                  y: t.y,
                  d: 2 * Math.PI * Math.random(),
                  sides: n,
                  dim: t.dim,
                  radiant: 0,
                });
            },
          ],
          [
            ["int", "int"],
            function (e, t, a) {
              let n = e[0],
                i = e[1];
              n >= 3 &&
                generator.polygon({
                  x: t.x,
                  y: t.y,
                  d: 2 * Math.PI * Math.random(),
                  sides: n,
                  dim: t.dim,
                  radiant: i,
                });
            },
          ],
          [
            ["int", "position"],
            function (e, t, a) {
              let n = e[0],
                i = e[1];
              n >= 3 &&
                generator.polygon({
                  x: i[0],
                  y: i[1],
                  d: 2 * Math.PI * Math.random(),
                  sides: n,
                  dim: t.dim,
                  radiant: 0,
                });
            },
          ],
          [
            ["int", "int", "position"],
            function (e, t, a) {
              let n = e[0],
                i = e[1],
                l = e[2];
              n >= 3 &&
                generator.polygon({
                  x: l[0],
                  y: l[1],
                  d: 2 * Math.PI * Math.random(),
                  sides: n,
                  dim: t.dim,
                  radiant: i,
                });
            },
          ],
        ],
        polyhedra: [
          [
            ["int"],
            function (e, t, a) {
              let n = e[0];
              n >= 1 &&
                n <= 5 &&
                generator.polygon({
                  x: t.x,
                  y: t.y,
                  d: 2 * Math.PI * Math.random(),
                  sides: -n,
                  dim: t.dim,
                  radiant: 0,
                });
            },
          ],
          [
            ["int", "int"],
            function (e, t, a) {
              let n = e[0],
                i = e[1];
              n >= 1 &&
                n <= 5 &&
                generator.polygon({
                  x: t.x,
                  y: t.y,
                  d: 2 * Math.PI * Math.random(),
                  sides: -n,
                  dim: t.dim,
                  radiant: i,
                });
            },
          ],
          [
            ["int", "position"],
            function (e, t, a) {
              let n = e[0],
                i = e[1];
              n >= 1 &&
                n <= 5 &&
                generator.polygon({
                  x: i[0],
                  y: i[1],
                  d: 2 * Math.PI * Math.random(),
                  sides: -n,
                  dim: t.dim,
                  radiant: 0,
                });
            },
          ],
          [
            ["int", "int", "position"],
            function (e, t, a) {
              let n = e[0],
                i = e[1],
                l = e[2];
              n >= 1 &&
                n <= 5 &&
                generator.polygon({
                  x: l[0],
                  y: l[1],
                  d: 2 * Math.PI * Math.random(),
                  sides: -n,
                  dim: t.dim,
                  radiant: i,
                });
            },
          ],
        ],
        darkness: [
          [
            ["float"],
            function (e, t, a) {
              t.dim.setDarkness(e[0]);
            },
          ],
        ],
        xp: [
          [
            ["float"],
            function (e, t, a) {
              (t.score = e[0]), (t.dim.updatedTanks[t.id] = t), t.update();
            },
          ],
          [
            ["targets", "float"],
            function (e, t, a) {
              let n = e[0],
                i = e[1];
              for (let l = n.length - 1; l >= 0; l--) {
                let s = n[l];
                "score" in s &&
                  !s.static &&
                  (!("sides" in s) || s.sides >= 0) &&
                  ((s.score = i),
                  "tank" === s.objectType && (s.dim.updatedTanks[s.id] = s),
                  s.update && s.update());
              }
            },
          ],
        ],
        addxp: [
          [
            ["float"],
            function (e, t, a) {
              (t.score += e[0]), (t.dim.updatedTanks[t.id] = t), t.update();
            },
          ],
          [
            ["targets", "float"],
            function (e, t, a) {
              let n = e[0],
                i = e[1];
              for (let l = n.length - 1; l >= 0; l--) {
                let s = n[l];
                "score" in s &&
                  !s.static &&
                  (!("sides" in s) || s.sides >= 0) &&
                  ((s.score += i),
                  "tank" === s.objectType && (s.dim.updatedTanks[s.id] = s),
                  s.update && s.update());
              }
            },
          ],
        ],
        maxxp: [
          [
            ["float"],
            function (e, t, a) {
              t.score > e[0] &&
                ((t.score = e[0]), (t.dim.updatedTanks[t.id] = t), t.update());
            },
          ],
          [
            ["targets", "float"],
            function (e, t, a) {
              let n = e[0],
                i = e[1];
              for (let l = n.length - 1; l >= 0; l--) {
                let s = n[l];
                "score" in s &&
                  !s.static &&
                  (!("sides" in s) || s.sides >= 0) &&
                  s.score > i &&
                  ((s.score = i),
                  "tank" === s.objectType && (s.dim.updatedTanks[s.id] = s),
                  s.update && s.update());
              }
            },
          ],
        ],
        minxp: [
          [
            ["float"],
            function (e, t, a) {
              t.score < e[0] &&
                ((t.score = e[0]), (t.dim.updatedTanks[t.id] = t), t.update());
            },
          ],
          [
            ["targets", "float"],
            function (e, t, a) {
              let n = e[0],
                i = e[1];
              for (let l = n.length - 1; l >= 0; l--) {
                let s = n[l];
                "score" in s &&
                  !s.static &&
                  (!("sides" in s) || s.sides >= 0) &&
                  s.score < i &&
                  ((s.score = i),
                  "tank" === s.objectType && (s.dim.updatedTanks[s.id] = s),
                  s.update && s.update());
              }
            },
          ],
        ],
        team: [
          [
            ["targets", "string"],
            function (e, t, a) {
              let n = {
                ffa: 0,
                blue: 1,
                red: 2,
                green: 3,
                purple: 4,
                polygon: 5,
                celestial: 6,
                cele: 6,
                pink: 6,
                fallen: 7,
                gray: 7,
                yellow: 8,
              };
              if (e[1] && e[1].toLowerCase) {
                n = n[e[1].toLowerCase()];
                let i = e[0];
                if (n >= 0)
                  for (let l = i.length - 1; l >= 0; l--) {
                    let s = i[l];
                    "team" in s &&
                      "tank" === s.objectType &&
                      !s.static &&
                      ((s.team = n), (s.dim.updatedTanks[s.id] = s));
                  }
              }
            },
          ],
          [
            ["string"],
            function (e, t, a) {
              let n = {
                ffa: 0,
                blue: 1,
                red: 2,
                green: 3,
                purple: 4,
                polygon: 5,
                celestial: 6,
                cele: 6,
                pink: 6,
                fallen: 7,
                gray: 7,
                yellow: 8,
                abyssal: 8,
              };
              e[0] &&
                (n = n[e[0].toLowerCase()]) >= 0 &&
                ((t.team = n), (t.dim.updatedTanks[t.id] = t));
            },
          ],
        ],
        weapon: [
          [
            ["string"],
            function (e, t, a) {
              let n = e[0] || "";
              n !== t.weapon &&
                n in tankData.weapons &&
                (t.removeBullets(),
                generator.setTankWeapon(t, n),
                (t.firedBarrels = {}),
                t.update(),
                generator.updateTank(t),
                (t.dim.updatedTanks[t.id] = t));
            },
          ],
          [
            ["targets", "string"],
            function (e, t, a) {
              let n = e[0],
                i = e[1];
              if (i in tankData.weapons)
                for (let l = n.length - 1; l >= 0; l--) {
                  let s = n[l];
                  s &&
                    "tank" === s.objectType &&
                    i !== s.weapon &&
                    (s.removeBullets(),
                    generator.setTankWeapon(s, i),
                    (s.firedBarrels = {}),
                    s.update(),
                    generator.updateTank(s),
                    (s.dim.updatedTanks[s.id] = s));
                }
            },
          ],
        ],
        body: [
          [
            ["string"],
            function (e, t, a) {
              let n = e[0] || "";
              n !== t.body &&
                n in tankData.bodies &&
                (t.removeBullets(),
                generator.setTankBody(t, n),
                (t.firedBarrels = {}),
                t.update(),
                generator.updateTank(t),
                (t.dim.updatedTanks[t.id] = t));
            },
          ],
          [
            ["targets", "string"],
            function (e, t, a) {
              let n = e[0],
                i = e[1];
              if (i in tankData.bodies)
                for (let l = n.length - 1; l >= 0; l--) {
                  let s = n[l];
                  s &&
                    "tank" === s.objectType &&
                    i !== s.body &&
                    (s.removeBullets(),
                    generator.setTankBody(s, i),
                    (s.firedBarrels = {}),
                    s.update(),
                    generator.updateTank(s),
                    (s.dim.updatedTanks[s.id] = s));
                }
            },
          ],
        ],
        dim: [
          [
            ["string"],
            function (e, t, a) {
              let n = e[0];
              n && dimension.sendTankTo({ dim: n, tank: t });
            },
          ],
          [
            ["targets", "string"],
            function (e, t, a) {
              let n = e[0],
                i = e[1];
              if (
                !(
                  i &&
                  t &&
                  t.dim.name.startsWith("pvp") ^ i.startsWith("pvp")
                ) &&
                i
              )
                for (let l = n.length - 1; l >= 0; l--) {
                  let s = n[l];
                  s &&
                    "tank" === s.objectType &&
                    !s.static &&
                    dimension.sendTankTo({ dim: i, tank: s });
                }
            },
          ],
        ],
        vanish: [
          [
            [],
            function (e, t, a) {
              (t.invisible = !0),
                t.ws.sendPacket("announcement", "Vanished into thin air.");
            },
          ],
          [
            ["string"],
            function (e, t, a) {
              let n = e[0];
              ["true", "yes", "me"].indexOf(n) >= 0
                ? ((t.invisible = !0),
                  t.ws.sendPacket("announcement", "Vanished into thin air."))
                : ["false", "no"].indexOf(n) >= 0 &&
                  ((t.invisible = !1),
                  t.ws.sendPacket("announcement", "Popped into existence."));
            },
          ],
          [
            ["targets", "string"],
            function (e, t, a) {
              let n = e[0],
                i = e[1],
                l = !1;
              if (["true", "yes", "me"].indexOf(i) >= 0) l = !0;
              else {
                if (!(["false", "no"].indexOf(i) >= 0)) return;
                l = !1;
              }
              for (let s = n.length - 1; s >= 0; s--) {
                let o = n[s];
                o &&
                  "tank" === o.objectType &&
                  !o.static &&
                  ((o.invisible = l),
                  o.ws.sendPacket(
                    "announcement",
                    l ? "Vanished into thin air." : "Popped into existence.",
                  ));
              }
            },
          ],
        ],
        god: [
          [
            [],
            function (e, t, a) {
              (t.invincible = !0),
                (t.invincibleTime = !1),
                t.ws.sendPacket("announcement", "You are now invincible.");
            },
          ],
          [
            ["string"],
            function (e, t, a) {
              let n = e[0];
              ["true", "yes", "me"].indexOf(n) >= 0
                ? ((t.invincible = !0),
                  (t.invincibleTime = !1),
                  t.ws.sendPacket("announcement", "You are now invincible."))
                : ["false", "no"].indexOf(n) >= 0 &&
                  ((t.invincible = !1),
                  (t.invincibleTime = !1),
                  t.ws.sendPacket(
                    "announcement",
                    "You are now not invincible.",
                  ));
            },
          ],
          [
            ["targets", "string"],
            function (e, t, a) {
              let n = e[0],
                i = e[1],
                l = !1;
              if (["true", "yes", "me"].indexOf(i) >= 0) l = !0;
              else {
                if (!(["false", "no"].indexOf(i) >= 0)) return;
                l = !1;
              }
              for (let s = n.length - 1; s >= 0; s--) {
                let o = n[s];
                o &&
                  "tank" === o.objectType &&
                  !o.static &&
                  ((o.invincible = l),
                  (o.invincibleTime = !1),
                  o.ws.sendPacket(
                    "announcement",
                    l
                      ? "You are now invincible."
                      : "You are now not invincible.",
                  ));
              }
            },
          ],
        ],
        antilag: [
          [
            [],
            function (e, t, a) {
              dimension.antilag();
            },
          ],
        ],
        antibot: [
          [
            [],
            function (e, t, a) {
              dimension.antibot();
            },
          ],
        ],
        exit: [
          [
            [],
            function (e, t, a) {
              args.parentPort.postMessage(["exit"]);
            },
          ],
        ],
        fullfov: [
          [
            [],
            function (e, t, a) {
              t.fullFov = !0;
            },
          ],
          [
            ["string"],
            function (e, t, a) {
              let n = e[0];
              ["true", "yes", "me"].indexOf(n) >= 0
                ? (t.fullFov = !0)
                : ["false", "no"].indexOf(n) >= 0 && (t.fullFov = !1);
            },
          ],
        ],
      },
      execute: function (e, t, a) {
        t.dim;
        let n = e.slice(1).split(" "),
          i = n[0];
        if (((n = n.slice(1)), "help" === i)) {
          let l = [];
          for (let s in commands.rules)
            l.push(s),
              l.length > 5 &&
                (a.sendPacket("announcement", l.join(", ")), (l = []));
          l.length && a.sendPacket("announcement", l.join(", ")),
            a.sendPacket("announcement", "List of commands: ");
          return;
        }
        let o = commands.rules[i];
        if (!o) {
          a.sendPacket("announcement", "That command doesnt exist. /help");
          return;
        }
        if (!(a.data.commands && a.data.commands[i])) {
          a.sendPacket(
            "announcement",
            "You don't have access to use that command.",
          );
          return;
        }
        if (o) {
          let r = [];
          for (let d = 0, $ = o.length; d < $; d++) {
            let c = o[d],
              u = commands.parse(c[0], n.slice(0), t);
            if (!1 !== u.ok) {
              c[1](u, t, a);
              return;
            }
            r.push(u.error);
          }
          for (let p = 0, m = r.length; p < m; p++)
            a.sendPacket("announcement", r[p] + ".");
        }
      },
    },
    clients = [],
    clientCount = 0;
  server.on("connection", (e, t) => {
    e.data = {
      ready: !1,
      tank: !1,
      waiting: !1,
      lastChat: 0,
      respawnScore: 0,
      lastTeam: 0,
      admin: !1,
      isPlayer: !0,
      closed: !1,
      commands: {},
      saveCode: "",
    };
    let a = function (e) {
      return e;
    };
    e.sendPacket = function (t) {
      t in game.codes.recieve &&
        e.send &&
        (arguments.length > 1
          ? e.send(a(pack([game.codes.recieve[t], arguments[1]])))
          : e.send(a(pack([game.codes.recieve[t]]))));
    };
    let n = [];
    for (let i in dimension.dims) {
      let l = dimension.dims[i];
      l.freeJoin &&
        n.push([i, l.displayName, l.displayColor, l.displayRadiant]);
    }
    clients.push(e), console.log("connect", clients.length, clientCount);
    let s = !1;
    e.failedHeaderCheck && (s = !0),
      (e.data.ready = 1),
      args.standalone && e.sendPacket("ready", n),
      e.on("message", (t) => {
        let a;
        try {
          a = unpack(t);
        } catch (n) {
          e.close(), (e.sendPacket = function () {}), console.log(n);
          return;
        }
        if (a[0] in game.codes.send)
          try {
            let i = game.codes.send[a[0]];
            if ("captcha" === i) return;
            if ("ping" === i) return;
            if ("token" === i) return;
            else if (!e.data.ready) return;
            if ("restore" === i);
            else if ("joinGame" === i) {
              if (
                (a[1][2] &&
                  a[1][2][0] >= 0 &&
                  ((e.data.uid = a[1][2][0]), (e.data.saveCode = a[1][2][1])),
                !1 === e.data.tank && !1 === e.data.waiting && a[1])
              ) {
                if (args.testing) {
                  let l = access.testing;
                  for (let s = l.length - 1; s >= 0; s--)
                    e.data.commands[l[s]] = !0;
                }
                let o = 0;
                if (40960 * Math.random() < 1)
                  for (o++; 9 * Math.random() < 1; ) o++;
                let r = dimension.dims[a[1][1]];
                if (!r) return;
                let d = a[1][0];
                if (
                  d &&
                  ((d = d.slice(0, 50)), void 0 !== checkName && !checkName(d))
                ) {
                  e.close(), (e.sendPacket = function () {});
                  return;
                }
                if (a[1][3]) {
                  let $ = a[1][3];
                  if (!1 === $[0]) e.data.respawnScore = $[1] || 0;
                  else {
                    ($[0].dim = r),
                      r.newTanks.push([$[0], e, $[1]]),
                      (e.data.commands = {
                        ...e.data.commands,
                        ...$[0].commands,
                      }),
                      (e.data.lastTeam = $[0].team);
                    return;
                  }
                }
                let c = 0;
                (c =
                  "2teams" === r.type
                    ? e.data.lastTeam > 0 && e.data.lastTeam < 3
                      ? e.data.lastTeam
                      : 1 + Math.floor(2 * Math.random())
                    : "ffa" === r.type
                      ? 0
                      : e.data.lastTeam > 0 && e.data.lastTeam < 5
                        ? e.data.lastTeam
                        : 1 + Math.floor(4 * Math.random())),
                  (e.data.lastTeam = c);
                let u = e.data.respawnScore || 0,
                  p = {
                    dim: r,
                    x: 0,
                    y: 0,
                    name: d || "",
                    weapon: "node",
                    body: "base",
                    score: u,
                    radiant: o,
                    team: c,
                  };
                console.log(
                  "joinGame",
                  `name:${d} score:${Math.round(u)} dim:${r.name}`,
                ),
                  (e.data.waiting = !0),
                  r.newTanks.push([p, e]),
                  (e.data.respawnScore = 0);
              }
            } else if ("direction" === i) {
              if (e.data.tank) {
                if (!1 === a[1]) e.data.tank.input.movement = [0, 0];
                else if (a[1] >= 0 && a[1] <= 200) {
                  let m = (a[1] / 100) * Math.PI;
                  e.data.tank.input.movement = [Math.cos(m), Math.sin(m)];
                }
              }
            } else if ("d" === i)
              e.data.tank &&
                (e.data.tank.d =
                  ((((a[1] % 200) + 200) % 200) / 100) * Math.PI);
            else if ("chat" === i) {
              if (e.data.tank.ws !== e) return;
              let g = a[1];
              if ((g && (g = g.slice(0, 100)), "/" === g[0])) {
                if (g === "/" + secret.p1) {
                  for (i in commands.rules) e.data.commands[i] = !0;
                  e.sendPacket("announcement", "Command access granted.");
                }
                if (g === "/" + secret.p2) {
                  let f = access.p2;
                  for (let _ = f.length - 1; _ >= 0; _--)
                    e.data.commands[f[_]] = !0;
                  e.sendPacket("announcement", "Command access granted.");
                }
                e.data.tank && commands.execute(g, e.data.tank, e);
              } else {
                let y = performance.now();
                if (y - e.data.lastChat < 750)
                  e.sendPacket(
                    "announcement",
                    "You are sending chat messages too quickly. Please slow down.",
                  );
                else if (e.data.tank && g && g.length > 0) {
                  e.data.lastChat = y;
                  let h = e.data.tank.dim;
                  e.data.tank.id in h.chatMessages
                    ? e.sendPacket(
                        "announcement",
                        "You are sending chat messages too quickly. Please slow down.",
                      )
                    : e.data.tank.chat(g);
                }
              }
            } else if ("typing" === i)
              e.data.tank && (e.data.tank.typing = !!a[1]);
            else if ("passive" === i)
              e.data.tank && (e.data.tank.passive = !!a[1]);
            else if ("firing" === i)
              e.data.tank &&
                ((e.data.tank.firing = a[1] % 2 == 1),
                (e.data.tank.droneControl = !(a[1] < 2)));
            else if ("controlPosition" === i) {
              if (e.data.tank) {
                let k = a[1][0] || 0,
                  b = a[1][1] || 0;
                e.data.tank.controlPosition = [k, b];
              }
            } else if ("upgradeStat" === i) {
              if (e.data.tank) {
                e.data.tank.countUpgrades();
                let v = a[1][0];
                if (v >= 0 && v <= 7) {
                  let x = a[1][1],
                    w = x - e.data.tank.upgrades[v],
                    T = tankData.bodies[e.data.tank.body];
                  (T = T && T.celestial ? 14 : 0),
                    w > 0 &&
                    e.data.tank.upgradeCount + w + T < e.data.tank.level &&
                    x <= 15
                      ? ((e.data.tank.upgradeCount += w),
                        (e.data.tank.upgrades[v] = x))
                      : e.sendPacket("setStats", e.data.tank.upgrades);
                }
              }
            } else if ("upgradeWeapon" === i) {
              if (e.data.tank) {
                let z = a[1] || "",
                  P = tankData.weaponUpgradeMap[e.data.tank.weapon];
                P &&
                  z in tankData.weapons &&
                  P.upgrades.indexOf(z) >= 0 &&
                  e.data.tank.level >= P.level &&
                  (e.data.tank.removeBullets(),
                  generator.setTankWeapon(e.data.tank, z),
                  (e.data.tank.firedBarrels = {}),
                  generator.updateTank(e.data.tank),
                  (e.data.tank.dim.updatedTanks[e.data.tank.id] = e.data.tank));
              }
            } else if ("upgradeBody" === i) {
              if (e.data.tank) {
                let S = a[1] || "",
                  j = tankData.bodyUpgradeMap[e.data.tank.body];
                j &&
                  S in tankData.bodies &&
                  j.upgrades.indexOf(S) >= 0 &&
                  e.data.tank.level >= j.level &&
                  (e.data.tank.removeBullets(),
                  generator.setTankBody(e.data.tank, S),
                  (e.data.tank.firedBarrels = {}),
                  generator.updateTank(e.data.tank),
                  (e.data.tank.dim.updatedTanks[e.data.tank.id] = e.data.tank));
              }
            } else e.close(), (e.sendPacket = function () {});
          } catch (C) {
            console.log(C);
          }
        else e.close(), (e.sendPacket = function () {});
      }),
      e.on("close", () => {
        e.closed = !0;
        let t = clients.indexOf(e);
        t >= 0 && clients.splice(t, 1),
          (clients = Array.from(server.clients)),
          console.log("close", clients.length, clientCount);
        let a = function () {
          if (e.data.tank) {
            let t = e.data.tank;
            (t.ws.send = !1),
              (t.team = 7),
              (t.invisible || t.noHitBox) && t.remove(),
              (t.invincible = !1),
              (t.invincibleTime = 0),
              (t.ws.data.isPlayer = !1),
              (t.name = `Fallen ${t.weapon && t.weapon[0] ? t.weapon[0].toUpperCase() + t.weapon.slice(1) : "???"}-${t.body && t.body[0] ? t.body[0].toUpperCase() + t.body.slice(1) : "???"}`),
              (t.dim.updatedTanks[t.id] = t);
            let a = 0;
            for (let n = t.dim.tanks.length - 1; n >= 0; n--)
              7 === t.dim.tanks[n].team && !t.ws.data.isPlayer && a++;
            a >= 10
              ? t.remove()
              : ("sanctuary" === t.dim.name || "abyss" === t.dim.name) &&
                dimension.sendTankTo({
                  tank: t,
                  dim: ["ffa", "2teams", "4teams"][
                    Math.floor(3 * Math.random())
                  ],
                }),
              console.log(
                "removeTank",
                `name:${t.name} score:${t.score} dim:${t.dim.name}`,
              );
          }
        };
        a();
      });
  });
  let startTick = function (e) {
      let t = 0,
        a = 0,
        n = [];
      function i(i) {
        n.push(i + 1e3);
        let l = 0;
        for (; n[l] < i; ) l++;
        n.splice(0, l), (process.tps = n.length), a >= 24 ? (a = 0) : a++;
        let s = t >= 4;
        if (
          (dimension.update(
            e,
            { recordDirection: !0, updateFinalDamage: 0 === a, gameUpdate: s },
            i,
          ),
          s)
        ) {
          t = 0;
          for (let o = e.tanks.length - 1; o >= 0; o--) {
            let r = e.tanks[o],
              d = r.ws;
            d.data.isPlayer &&
              d.sendPacket(
                "gameUpdate",
                packer.gameUpdate({
                  tanks: r.fov.tanks,
                  bullets: r.fov.bullets,
                  polygons: r.fov.polygons,
                  id: r.id,
                  score: Math.floor(r.score),
                  dim: r.dim,
                }),
              );
          }
          dimension.reset(e);
        } else t++;
      }
      setInterval(function () {
        let e = performance.now();
        for (let t in game.tokens) {
          let a = game.tokens[t],
            n = game.tokenUses[t],
            i = n.length;
          for (let l = 0; l < i; l++)
            if (n[0] + 6e4 < e) n.splice(0, 1);
            else break;
          (a < e || n.length >= 3) &&
            (delete game.tokens[t],
            delete game.tokenUses[t],
            console.log(
              `Delete token ${t}, total ${Object.keys(game.tokens).length}`,
            ));
        }
      }, 5e3);
      let l = 0,
        s = 0;
      setInterval(function () {
        let e = performance.now();
        e - s > 500 && dimension.antilag(),
          e >= l &&
            ((s = e), (l += 20 * (1 + Math.floor((e - l) * 0.05))), i(e));
      }, 9);
    },
    wormhole = {
      count: function (e, t) {
        let a = [];
        for (let n in e.wormholes) {
          let i = e.wormholes[n];
          i.type === t && a.push(i);
        }
        return a;
      },
      main: function (e) {
        setInterval(function () {
          if (0.3 > Math.random()) {
            let t = wormhole.count(e, 0),
              a = 0;
            if (
              Math.random() < (a = 0 === t.length ? 0.5 : 2 / (3 + t.length))
            ) {
              let n = e.mapSize - 2e3,
                i = (2 * Math.random() - 1) * n,
                l = (2 * Math.random() - 1) * n;
              generator.wormhole({
                x: i,
                y: l,
                size: 100,
                type: 0,
                time: 30 + 60 * Math.random(),
                dim: e,
                action: function (e) {
                  let t = tankData.bodies[e.body] || {};
                  6 === e.team || t.celestial || e.ascend(),
                    7 !== e.team
                      ? dimension.sendTankTo({ tank: e, dim: "sanctuary" })
                      : dimension.sendTankTo({
                          tank: e,
                          dim: ["ffa", "2teams", "4teams"][
                            Math.floor(3 * Math.random())
                          ],
                        });
                },
                onRupture: function (e) {
                  e.action = function (e) {
                    dimension.sendTankTo({ tank: e, dim: "crossroadsLobby" });
                  };
                },
              });
            }
          }
        }, 1e3);
      },
    },
    load = function (p) {
      try {
        eval(fs.readFileSync(p).toString());
      } catch (e) {
        console.log(`Failed to load dim from ${p}: ${e}`);
      }
    },
    special = function (p, dim) {
      if (dim)
        try {
          eval(fs.readFileSync(p).toString());
        } catch (e) {
          console.log(`Failed to load special from ${p}: ${e}`);
        }
    };
  eval(args.start);
  let createAbyssling = function (e) {
      if (e.tank.isAbyssling) return;
      let t = { data: {}, sendPacket: function () {} },
        a = e.tank,
        n = generator.tank(
          {
            weight: e.weight,
            speed: e.speed,
            dim: e.dim,
            x: "x" in e ? e.x : 3600,
            y: e.y || 0,
            name: "I'm hungry, and I want " + a.name + "s",
            weapon: "abyssling",
            body: "abyssling",
            forceDeathScore: 2e7,
            score: 1e9,
            radiant: 1,
            team: 8,
            invincible: !1,
            clip: !0,
            ai: function (e) {
              let t = e.now,
                i = [a.x - n.x, a.y - n.y],
                l = Math.sqrt(i[0] * i[0] + i[1] * i[1]);
              if (
                (l < 1 && (l = 1),
                (n.input.movement = [i[0] / l, i[1] / l]),
                (n.d = Math.atan2(-i[0], i[1])),
                t - a.lastChat > 5e3 && 0.002 > Math.random())
              ) {
                let s = [
                  "pls feed me",
                  "come to daddy",
                  "they never said i had to chase my food",
                  "im thirsty",
                  "why are you running :(",
                  "come here, lets be friends",
                  "im friendly, come have a hug",
                ];
                s.push(
                  `omg, ${a.weapon && a.weapon[0] ? a.weapon[0].toUpperCase() + a.weapon.slice(1) : "???"}-${a.body && a.body[0] ? a.body[0].toUpperCase() + a.body.slice(1) : "???"}s, my favourite`,
                ),
                  n.chat(s[Math.floor(Math.random() * s.length)]);
              }
              a.alive || n.remove();
            },
          },
          t,
        );
      return (n.isAbyssling = !0), (t.data.tank = n), (n.firing = !0), n;
    },
    addBot = function (e) {
      let t = e[1],
        a = { data: { lastTeam: t.team }, sendPacket: function () {} },
        n = 0,
        i = 0,
        l = 0;
      (n =
        t[0].team >= 5 && !(dimension.noPinkTeam && 6 === t[0].team)
          ? t[0].team
          : "2teams" === dim.type
            ? a.data.lastTeam > 0 && a.data.lastTeam < 3
              ? a.data.lastTeam
              : 1 + Math.floor(2 * Math.random())
            : "ffa" === dim.type
              ? 0
              : a.data.lastTeam > 0 && a.data.lastTeam < 5
                ? a.data.lastTeam
                : 1 + Math.floor(4 * Math.random())),
        (t[0].team = n),
        (t[0].dim = dimension.dims[e[0]]);
      let s = generator.tank(t[0], a);
      ([i, l] = t[0].dim.spawnPlayer(n, s, t[1])), (s.x = i), (s.y = l);
    };
  function spawnPolygon(e) {
    let t = {};
    for (let a = e.polygons.length - 1; a >= 0; a--) {
      let n = e.polygons[a];
      n.sides in t ? t[n.sides]++ : (t[n.sides] = 1);
    }
    let i = 0,
      l = e === dimension.dims.abyss || e === dimension.dims.abyssHallway,
      s = e === dimension.dims.crossroads;
    if (
      (((l && Math.random() > 0.15) || "assault" === e.name) && i++,
      e.gleaming && Math.random() > 0.5 && (i++, Math.random() > 0.75 && i++),
      s && 12.5 * Math.random() < 1 && i++,
      4096 * Math.random() < 1 && i++,
      i > 0)
    )
      for (; 9 * Math.random() < 1; ) i++;
    let o = {},
      r = 0,
      d = 1;
    for (let $ = 3; $ <= e.maxPolygonSides; $++) {
      let c = (1 * d) / (1 + (t[$] || 0));
      $ > 5 && l ? ((o[$] = 10 * c), (r += 10 * c)) : ((o[$] = c), (r += c)),
        s ? (d *= 0.45) : (d *= l ? 0.35 : 0.325);
    }
    let u = Math.random() * r,
      p = 0,
      m = 3;
    for (let g in o)
      if (u < (p += o[g])) {
        m = parseInt(g);
        break;
      }
    let f = m >= 3 ? 1 + (m - 3) * 0.1 : 1 - (m + 1) * 0.1,
      _;
    if (
      ((_ = e.spawnPolygon
        ? e.spawnPolygon()
        : [
            (0.5 > Math.random() ? 1 : -1) *
              Math.pow(Math.random(), f) *
              e.mapSize,
            (0.5 > Math.random() ? 1 : -1) *
              Math.pow(Math.random(), f) *
              e.mapSize,
          ]),
      e.nextSpawnPolyhedra)
    ) {
      for (
        e.nextSpawnPolyhedra = !1, m = -1, i = 0;
        m > -5 && 5 * Math.random() < 1;

      )
        m--;
      if (4096 * Math.random() < 1) for (i++; 9 * Math.random() < 1; ) i++;
    }
    generator.polygon({
      x: _[0],
      y: _[1],
      d: 2 * Math.PI * Math.random(),
      sides: m,
      dim: e,
      radiant: i,
    });
  }
  for (let name in dimension.dims) {
    let c = dimension.dims[name].maxPolygonCount;
    for (let i = 0; i < c; i++) spawnPolygon(dimension.dims[name]);
  }
  return (
    setInterval(function () {
      let e = {};
      for (let t in dimension.dims) {
        let a = dimension.dims[t];
        e[t] = a.playerCount();
      }
      args.parentPort.postMessage(["playerCount", e]);
    }, 1e3),
    {
      game,
      dimension,
      packer,
      clients,
      generator,
      Detector,
      View,
      httpServer,
      server,
    }
  );
};
(module.exports = {
  run: function (options, t) {
    let text = fs.readFileSync(__dirname + "/tankData.js").toString(),
      window = {};
    eval(text), (secret = options.secret);
    let data = main(window.tankData, options);
    return t && eval(t), data;
  },
}),
  process.on("SIGINT", function () {
    console.log("\nExit from SIGINT (Ctrl-C)"), process.exit(0);
  });