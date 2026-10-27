(function () {
  var WEATHERS = ["sunny", "cloudy", "rainy", "thunderstorm", "hazy", "snowy", "foggy", "windy"];
  var LANDSCAPES = ["mountain", "cityscape", "beach", "forest", "desert", "lake"];

  var LABELS = {
    sunny: "Sunny",
    cloudy: "Cloudy",
    rainy: "Rainy",
    thunderstorm: "Thunderstorm",
    hazy: "Hazy",
    snowy: "Snowy",
    foggy: "Foggy",
    windy: "Windy",
    mountain: "Mountain",
    cityscape: "Cityscape",
    beach: "Beach",
    forest: "Forest",
    desert: "Desert",
    lake: "Lake",
    night: "Night",
    dawn: "Dawn",
    morning: "Morning",
    noon: "Noon",
    afternoon: "Afternoon"
  };

  var SKY = {
    sunny: ["#1d4f92", "#5eb4ea", "#ffd9a0"],
    cloudy: ["#3c4d5e", "#7e909f", "#d5dee6"],
    rainy: ["#1a2733", "#3c4d5c", "#667583"],
    thunderstorm: ["#070b12", "#141c2a", "#243140"],
    hazy: ["#b7a48c", "#d8c6ae", "#f3e4cf"],
    snowy: ["#6d8eaa", "#b7cbd8", "#f3f7f8"],
    foggy: ["#8b969e", "#c5ced3", "#eef1f3"],
    windy: ["#3c617f", "#86a6bf", "#e6d3b0"]
  };

  var SUN_MUL = {
    sunny: 1,
    windy: 0.82,
    cloudy: 0.38,
    rainy: 0.1,
    thunderstorm: 0,
    hazy: 0.36,
    snowy: 0.7,
    foggy: 0.16
  };

  var STAR_MUL = {
    sunny: 1,
    windy: 0.8,
    cloudy: 0.28,
    rainy: 0.12,
    thunderstorm: 0.22,
    hazy: 0.2,
    snowy: 0.75,
    foggy: 0.08
  };

  var MOON_MUL = {
    sunny: 1,
    windy: 0.85,
    cloudy: 0.4,
    rainy: 0.22,
    thunderstorm: 0.3,
    hazy: 0.28,
    snowy: 0.8,
    foggy: 0.14
  };

  var WEATHER_MIX = {
    sunny: 0.08,
    windy: 0.22,
    cloudy: 0.5,
    rainy: 0.6,
    thunderstorm: 0.78,
    hazy: 0.46,
    snowy: 0.34,
    foggy: 0.52
  };

  function parseColor(color) {
    if (color.charAt(0) === "#") {
      var n = parseInt(color.slice(1), 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    var parts = color.match(/\d+/g);
    return [Number(parts[0]), Number(parts[1]), Number(parts[2])];
  }

  function mixColor(a, b, t) {
    var from = parseColor(a);
    var to = parseColor(b);
    var channels = [0, 1, 2].map(function (i) {
      return Math.round(from[i] + (to[i] - from[i]) * t);
    });
    return "rgb(" + channels.join(",") + ")";
  }

  function mixSky(from, to, t) {
    return [mixColor(from[0], to[0], t), mixColor(from[1], to[1], t), mixColor(from[2], to[2], t)];
  }

  function span(hour, start, end) {
    return Math.max(0, Math.min(1, (hour - start) / (end - start)));
  }

  function hourOf(date) {
    return date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
  }

  function isNightHour(hour) {
    return hour >= 19.5 || hour < 5;
  }

  var NIGHT_WEATHERS = ["cloudy", "rainy", "thunderstorm", "hazy", "snowy", "foggy", "windy"];

  function chooseWeather(rng, date, requested) {
    var night = isNightHour(hourOf(date));
    if (requested && WEATHERS.indexOf(requested) !== -1 && !(night && requested === "sunny")) {
      return requested;
    }
    return pick(rng, night ? NIGHT_WEATHERS : WEATHERS);
  }

  function createDaylight(date, weather) {
    var hour = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
    var phase = "night";
    var sky = ["#070b16", "#10182a", "#1a2438"];
    var sunX = 0.08;
    var sunY = 0.72;
    var sun = 0;
    var moon = 1;
    var stars = 1;
    var glowSide = 0;
    var glow = 0;
    var inner = "#fff6df";
    var mid = "#ffd36a";
    var ray = "255, 214, 140";
    var veil = ["rgba(5, 8, 18, 0.38)"];
    var u;

    if (hour >= 5 && hour < 7) {
      phase = "dawn";
      u = span(hour, 5, 7);
      sky = mixSky(["#10182c", "#2c3358", "#6a4038"], ["#2a4670", "#c47a78", "#ffc49a"], u);
      sunX = 0.08 + u * 0.08;
      sunY = 0.62 - u * 0.12;
      sun = 0.18 + u * 0.28;
      moon = 0.75 - u * 0.7;
      stars = 0.6 - u * 0.6;
      glowSide = -1;
      glow = 0.35 + u * 0.3;
      mid = "#ffb15a";
      ray = "255, 176, 110";
      veil = ["rgba(42, 24, 16, 0.16)"];
    } else if (hour >= 7 && hour < 10.5) {
      phase = "morning";
      u = span(hour, 7, 10.5);
      sky = mixSky(["#35507a", "#8eabc8", "#f0c39a"], ["#2a6cb8", "#8ec4ef", "#f7e4c4"], u);
      sunX = 0.16 + u * 0.22;
      sunY = 0.48 - u * 0.26;
      sun = 0.52 + u * 0.26;
      moon = 0;
      stars = 0;
      glowSide = -1;
      glow = 0.28 * (1 - u);
      mid = "#ffc56a";
      ray = "255, 196, 120";
      veil = [];
    } else if (hour >= 10.5 && hour < 15) {
      phase = "noon";
      u = span(hour, 10.5, 15);
      sky = ["#1a62c4", "#63b7f2", "#e7f3ff"];
      sunX = 0.4 + u * 0.2;
      sunY = 0.15 - Math.sin(u * Math.PI) * 0.03;
      sun = 1;
      moon = 0;
      stars = 0;
      glowSide = 0;
      glow = 0;
      inner = "#fffceb";
      mid = "#ffe08a";
      veil = [];
    } else if (hour >= 15 && hour < 19.5) {
      phase = "afternoon";
      u = span(hour, 15, 19.5);
      sky = mixSky(["#24548f", "#f0a06a", "#ffd09a"], ["#1a2458", "#c24e32", "#ff8a3a"], u);
      sunX = 0.62 + u * 0.28;
      sunY = 0.18 + u * 0.36;
      sun = 0.92 - u * 0.5;
      moon = u > 0.75 ? (u - 0.75) / 0.25 * 0.35 : 0;
      stars = u > 0.8 ? (u - 0.8) / 0.2 * 0.25 : 0;
      glowSide = 1;
      glow = 0.28 + u * 0.45;
      inner = "#fff1d4";
      mid = u < 0.5 ? "#ffb15a" : "#ff7a3a";
      ray = "255, 140, 70";
      veil = u > 0.35 ? ["rgba(72, 28, 8, " + (0.08 + u * 0.12) + ")"] : [];
    } else if (hour >= 19.5 && hour < 20.2) {
      phase = "night";
      u = span(hour, 19.5, 20.2);
      sky = mixSky(["#1a2458", "#c24e32", "#ff8a3a"], ["#070b16", "#10182a", "#1a2438"], u);
      sunX = 0.9;
      sunY = 0.56;
      sun = 0.4 * (1 - u);
      moon = 0.35 + u * 0.65;
      stars = 0.25 + u * 0.75;
      glowSide = 1;
      glow = 0.4 * (1 - u);
      mid = "#ff7a3a";
      ray = "255, 120, 60";
      veil = ["rgba(5, 8, 18, " + (0.12 + u * 0.26) + ")"];
    }

    var mix = WEATHER_MIX[weather];
    var target = SKY[weather];
    if (phase === "night") {
      if (weather === "sunny" || weather === "windy") mix = 0.06;
      else if (weather === "hazy") {
        target = ["#1a2230", "#3a342c", "#6a5a48"];
        mix = 0.28;
      } else if (weather === "snowy") {
        target = ["#152233", "#243246", "#3e5162"];
        mix = 0.42;
      } else if (weather === "foggy") {
        target = ["#242c34", "#3a444e", "#59636c"];
        mix = 0.4;
      }
    }
    sky = mixSky(sky, target, mix);
    sun *= SUN_MUL[weather];
    moon = Math.max(0, moon * MOON_MUL[weather]);
    stars = Math.max(0, stars * STAR_MUL[weather]);
    if (weather === "thunderstorm") veil.push("rgba(0, 0, 0, 0.3)");
    else if (weather === "rainy") veil.push("rgba(8, 14, 22, 0.2)");

    var rayMul = weather === "sunny" || weather === "windy" ? 1 : weather === "snowy" ? 0.3 : 0;
    var dark = phase === "night" || (phase === "dawn" && sun < 0.34) || weather === "thunderstorm";
    return {
      phase: phase,
      dark: dark,
      sky: sky,
      sunX: sunX,
      sunY: sunY,
      sun: sun,
      moon: moon,
      stars: stars,
      glowSide: glowSide,
      glow: glow * (weather === "thunderstorm" ? 0.25 : weather === "rainy" ? 0.45 : 1),
      inner: weather === "snowy" ? "#f7fbff" : inner,
      mid: weather === "hazy" ? "#f0ddc2" : mid,
      ray: ray,
      rays: sun * rayMul,
      veil: veil,
      brightness: sun
    };
  }

  function createRng(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function pick(rng, list) {
    return list[Math.floor(rng() * list.length)];
  }

  function ridgeline(rng, segments, roughness) {
    var pts = new Array(segments + 1);
    var i;
    for (i = 0; i < pts.length; i++) pts[i] = 0;
    pts[0] = 0.35 + rng() * 0.35;
    pts[segments] = 0.35 + rng() * 0.35;
    var step = segments;
    var scale = roughness;
    while (step > 1) {
      var half = step / 2;
      for (i = half; i < segments; i += step) {
        pts[i] = (pts[i - half] + pts[i + half]) / 2 + (rng() - 0.5) * scale;
      }
      step = half;
      scale *= 0.55;
    }
    for (i = 0; i < pts.length; i++) {
      pts[i] = Math.max(0.08, Math.min(1, pts[i]));
    }
    return pts;
  }

  function makeClouds(rng, count, speed) {
    var clouds = [];
    for (var i = 0; i < count; i++) {
      var puffs = [];
      var n = 3 + Math.floor(rng() * 4);
      for (var p = 0; p < n; p++) {
        puffs.push({
          dx: (rng() - 0.5) * 0.14,
          dy: (rng() - 0.5) * 0.035,
          r: 0.028 + rng() * 0.05
        });
      }
      clouds.push({
        x: rng(),
        y: 0.06 + rng() * 0.3,
        speed: speed * (0.7 + rng() * 0.6),
        alpha: 0.45 + rng() * 0.5,
        puffs: puffs
      });
    }
    return clouds;
  }

  function makeDrops(rng, count, kind) {
    var drops = [];
    for (var i = 0; i < count; i++) {
      drops.push({
        x: rng(),
        y: kind === "wind" ? 0.48 + rng() * 0.52 : rng(),
        speed: kind === "snow" ? 0.05 + rng() * 0.08 : kind === "wind" ? 0.02 + rng() * 0.04 : 0.7 + rng() * 0.75,
        drift: kind === "snow" ? 0.012 + rng() * 0.03 : kind === "wind" ? 0.5 + rng() * 0.65 : 0.1 + rng() * 0.16,
        len: kind === "wind" ? 48 + rng() * 80 : 16 + rng() * 24,
        r: kind === "snow" ? 1.4 + rng() * 2.8 : 1,
        phase: rng() * Math.PI * 2,
        wobble: 1.2 + rng() * 2.2,
        alpha: 0.18 + rng() * 0.35
      });
    }
    return drops;
  }

  function makeFog(rng, count, alpha) {
    var bands = [];
    for (var i = 0; i < count; i++) {
      bands.push({
        x: rng(),
        y: 0.35 + rng() * 0.55,
        r: 0.22 + rng() * 0.28,
        a: alpha * (0.5 + rng() * 0.5),
        speed: 0.008 + rng() * 0.02
      });
    }
    return bands;
  }

  function makeBolt(rng) {
    var x = 0.15 + rng() * 0.7;
    var y = 0;
    var main = [{ x: x, y: y }];
    var branches = [];
    while (y < 0.72) {
      x += (rng() - 0.5) * 0.06;
      y += 0.03 + rng() * 0.05;
      main.push({ x: x, y: y });
      if (rng() < 0.25 && branches.length < 3) {
        var branch = [{ x: x, y: y }];
        var bx = x;
        var by = y;
        for (var i = 0; i < 4; i++) {
          bx += (rng() - 0.25) * 0.05;
          by += 0.02 + rng() * 0.035;
          branch.push({ x: bx, y: by });
        }
        branches.push(branch);
      }
    }
    return { main: main, branches: branches };
  }

  function buildCity(rng, distant) {
    var buildings = [];
    var x = 0;
    while (x < 1) {
      var w = (distant ? 0.03 : 0.032) + rng() * (distant ? 0.04 : 0.06);
      var h = distant ? 0.08 + rng() * 0.16 : 0.1 + Math.pow(rng(), 0.65) * 0.4;
      var windows = [];
      if (!distant) {
        var cols = Math.max(2, Math.floor(w * 110));
        var rows = Math.max(2, Math.floor(h * 26));
        for (var r = 0; r < rows; r++) {
          for (var c = 0; c < cols; c++) {
            if (rng() < 0.62) {
              windows.push({
                c: c,
                r: r,
                cols: cols,
                rows: rows,
                phase: rng() * Math.PI * 2,
                twinkle: rng() < 0.35,
                warm: rng() < 0.78
              });
            }
          }
        }
      }
      var width = Math.min(w, 1 - x);
      buildings.push({
        x: x,
        w: width,
        h: h,
        antenna: !distant && rng() < 0.16,
        windows: windows
      });
      x += width + (distant ? 0.008 : 0.004);
    }
    return buildings;
  }

  function buildTrees(rng, countScale, heightMin, heightMax) {
    var trees = [];
    var x = -0.02;
    while (x < 1.04) {
      var w = (0.028 + rng() * 0.04) * countScale;
      trees.push({
        x: x,
        h: heightMin + rng() * (heightMax - heightMin),
        sway: rng() * Math.PI * 2
      });
      x += w * (0.55 + rng() * 0.5);
    }
    return trees;
  }

  function buildCacti(rng) {
    var cacti = [];
    var n = 3 + Math.floor(rng() * 3);
    for (var i = 0; i < n; i++) {
      cacti.push({
        x: 0.08 + rng() * 0.84,
        s: 0.7 + rng() * 0.8,
        arm: rng() < 0.7
      });
    }
    return cacti;
  }

  function Scene(canvas, caption) {
    this.canvas = canvas;
    this.caption = caption;
    this.ctx = canvas.getContext("2d");
    this.rng = createRng((Math.random() * 0xffffffff) >>> 0);
    var params = new URLSearchParams(window.location.search);
    var weatherQuery = params.get("weather");
    var landscapeQuery = params.get("landscape");
    var hourQuery = params.get("hour");
    this.landscape = LANDSCAPES.indexOf(landscapeQuery) === -1 ? pick(this.rng, LANDSCAPES) : landscapeQuery;
    this.hourOverride = hourQuery === null || hourQuery === "" || isNaN(Number(hourQuery)) ? null : Number(hourQuery);
    this.weather = chooseWeather(this.rng, this.clock(), weatherQuery);
    this.time = 0;
    this.last = 0;
    this.flash = 0;
    this.bolt = null;
    this.boltTimer = 1.6 + this.rng() * 3;
    this.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.raf = 0;
    this.w = 1;
    this.h = 1;
    this.loop = this.loop.bind(this);
    this.build();
    this.light = createDaylight(this.clock(), this.weather);
    this.captionText = "";
    this.writeCaption();
  }

  Scene.prototype.clock = function () {
    var now = new Date();
    if (this.hourOverride == null) return now;
    var hour = ((this.hourOverride % 24) + 24) % 24;
    now.setHours(Math.floor(hour), Math.floor((hour % 1) * 60), 0, 0);
    return now;
  };

  Scene.prototype.writeCaption = function () {
    if (!this.caption || !this.light) return;
    var text = LABELS[this.light.phase] + " · " + LABELS[this.weather] + " · " + LABELS[this.landscape];
    if (text === this.captionText) return;
    this.captionText = text;
    this.caption.textContent = text;
  };

  Scene.prototype.build = function () {
    var rng = this.rng;
    var weather = this.weather;
    var wind = weather === "windy" ? 0.055 : weather === "thunderstorm" ? 0.028 : weather === "rainy" ? 0.02 : 0.01;
    var cloudCount = {
      sunny: 3,
      cloudy: 8,
      rainy: 7,
      thunderstorm: 6,
      hazy: 3,
      snowy: 4,
      foggy: 2,
      windy: 5
    }[weather];

    this.clouds = makeClouds(rng, cloudCount, wind);
    this.stars = [];
    var i;
    for (i = 0; i < 70; i++) {
      this.stars.push({
        x: rng(),
        y: rng() * 0.55,
        r: rng() * 1.4 + 0.3,
        phase: rng() * Math.PI * 2
      });
    }

    this.mountains = [
      ridgeline(rng, 64, 0.85),
      ridgeline(rng, 64, 0.7),
      ridgeline(rng, 64, 0.55)
    ];
    this.cityFar = buildCity(rng, true);
    this.city = buildCity(rng, false);
    this.trees = [
      buildTrees(rng, 1.3, 0.1, 0.2),
      buildTrees(rng, 1.1, 0.16, 0.28),
      buildTrees(rng, 0.9, 0.22, 0.38)
    ];
    this.cacti = buildCacti(rng);
    this.palms = [
      { x: 0.08 + rng() * 0.08, s: 0.85 + rng() * 0.25 },
      { x: 0.78 + rng() * 0.12, s: 0.7 + rng() * 0.3 }
    ];

    if (weather === "rainy") this.drops = makeDrops(rng, 170, "rain");
    else if (weather === "thunderstorm") this.drops = makeDrops(rng, 220, "rain");
    else if (weather === "snowy") this.drops = makeDrops(rng, 140, "snow");
    else if (weather === "windy") this.drops = makeDrops(rng, 70, "wind");
    else this.drops = [];

    if (weather === "foggy") this.fog = makeFog(rng, 7, 0.34);
    else if (weather === "hazy") this.fog = makeFog(rng, 5, 0.2);
    else this.fog = [];
  };

  Scene.prototype.resize = function () {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = Math.floor(this.w * dpr);
    this.canvas.height = Math.floor(this.h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  Scene.prototype.cloudColor = function () {
    var dark = this.light && this.light.brightness < 0.35;
    if (dark && this.weather !== "thunderstorm" && this.weather !== "rainy") {
      if (this.weather === "snowy" || this.weather === "foggy") return "rgba(176, 188, 200, 0.32)";
      return "rgba(28, 38, 56, 0.75)";
    }
    switch (this.weather) {
      case "thunderstorm":
        return "rgba(18, 24, 34, 0.92)";
      case "rainy":
        return "rgba(48, 60, 72, 0.8)";
      case "snowy":
      case "foggy":
        return "rgba(244, 247, 249, 0.78)";
      case "hazy":
        return "rgba(236, 226, 210, 0.55)";
      case "sunny":
        return "rgba(255, 255, 255, 0.86)";
      default:
        return "rgba(230, 236, 241, 0.78)";
    }
  };

  Scene.prototype.update = function (dt) {
    var i;
    for (i = 0; i < this.drops.length; i++) {
      var p = this.drops[i];
      p.y += p.speed * dt;
      p.x += p.drift * dt;
      if (this.weather === "windy") {
        if (p.x > 1.25) {
          p.x = -0.25;
          p.y = 0.48 + this.rng() * 0.52;
        }
      } else if (p.y > 1.08) {
        p.y = -0.08;
        p.x = this.rng();
      }
    }

    if (this.weather === "thunderstorm") {
      this.boltTimer -= dt;
      if (this.flash > 0) this.flash *= Math.pow(0.04, dt);
      if (this.boltTimer <= 0) {
        this.flash = 1;
        this.bolt = makeBolt(this.rng);
        this.boltTimer = 2.4 + this.rng() * 4.2;
      }
    }
  };

  Scene.prototype.drawSky = function () {
    var ctx = this.ctx;
    var colors = this.light.sky;
    var g = ctx.createLinearGradient(0, 0, 0, this.h);
    g.addColorStop(0, colors[0]);
    g.addColorStop(0.55, colors[1]);
    g.addColorStop(1, colors[2]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.w, this.h);

    if (this.light.glow > 0.02 && this.light.glowSide !== 0) {
      var gx = this.light.glowSide < 0 ? this.w * 0.08 : this.w * 0.92;
      var gy = this.h * 0.46;
      var warm = this.light.phase === "afternoon" || this.light.phase === "dawn";
      var haze = ctx.createRadialGradient(gx, gy, 20, gx, gy, this.w * 0.58);
      haze.addColorStop(0, warm ? "rgba(255, 150, 70, 0.95)" : "rgba(255, 196, 130, 0.9)");
      haze.addColorStop(0.45, warm ? "rgba(255, 120, 60, 0.28)" : "rgba(255, 186, 120, 0.22)");
      haze.addColorStop(1, "rgba(255, 160, 80, 0)");
      ctx.save();
      ctx.globalAlpha = this.light.glow;
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, this.w, this.h);
      ctx.restore();
    }
  };

  Scene.prototype.drawStars = function () {
    if (!this.light || this.light.stars < 0.04) return;
    var ctx = this.ctx;
    var i;
    for (i = 0; i < this.stars.length; i++) {
      var s = this.stars[i];
      var tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(this.time * 1.6 + s.phase));
      ctx.fillStyle = "rgba(255,255,255," + (this.light.stars * 0.8 * tw) + ")";
      ctx.beginPath();
      ctx.arc(s.x * this.w, s.y * this.h, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  Scene.prototype.drawSun = function () {
    if (!this.light || this.light.sun < 0.05) return;
    var show = this.light.sun;
    var ctx = this.ctx;
    var x = this.light.sunX * this.w;
    var y = this.light.sunY * this.h;
    var r = this.weather === "hazy" ? 54 : this.light.phase === "afternoon" ? 42 : 36;

    ctx.save();
    ctx.globalAlpha = show;
    if (this.light.rays > 0.2) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(this.time * 0.08);
      var count = Math.max(8, Math.round(8 + this.light.rays * 6));
      var ray;
      for (ray = 0; ray < count; ray++) {
        ctx.rotate((Math.PI * 2) / count);
        var rg = ctx.createLinearGradient(r * 0.4, 0, r * 4.2, 0);
        rg.addColorStop(0, "rgba(" + this.light.ray + ", 0.32)");
        rg.addColorStop(1, "rgba(" + this.light.ray + ", 0)");
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.moveTo(r * 0.3, 0);
        ctx.lineTo(r * 4.2, -7);
        ctx.lineTo(r * 4.2, 7);
        ctx.fill();
      }
      ctx.restore();
      ctx.globalAlpha = show;
    }

    var glow = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * (this.light.phase === "noon" ? 3.6 : 2.8));
    glow.addColorStop(0, this.light.inner);
    glow.addColorStop(0.35, this.light.mid);
    glow.addColorStop(1, "rgba(255, 170, 70, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, r * (this.light.phase === "noon" ? 3.6 : 2.8), 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = this.light.inner;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  Scene.prototype.drawMoon = function () {
    if (!this.light || this.light.moon < 0.08) return;
    var ctx = this.ctx;
    var x = this.w * 0.76;
    var y = this.h * 0.16;
    var r = 26;
    ctx.save();
    ctx.globalAlpha = this.light.moon;
    var glow = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * 3);
    glow.addColorStop(0, "rgba(226, 234, 246, 0.9)");
    glow.addColorStop(0.4, "rgba(180, 198, 220, 0.25)");
    glow.addColorStop(1, "rgba(180, 198, 220, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, r * 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = "#e7eef8";
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
    ctx.fillStyle = this.light.sky[0];
    ctx.beginPath();
    ctx.arc(x + 12, y - 6, r * 0.82, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  Scene.prototype.drawVeil = function () {
    if (!this.light || !this.light.veil.length) return;
    var ctx = this.ctx;
    var i;
    for (i = 0; i < this.light.veil.length; i++) {
      ctx.fillStyle = this.light.veil[i];
      ctx.fillRect(0, 0, this.w, this.h);
    }
  };

  Scene.prototype.drawClouds = function () {
    var ctx = this.ctx;
    var color = this.cloudColor();
    var i;
    var j;
    for (i = 0; i < this.clouds.length; i++) {
      var c = this.clouds[i];
      var x = ((c.x + this.time * c.speed) % 1.45) - 0.22;
      ctx.save();
      ctx.globalAlpha = c.alpha;
      ctx.fillStyle = color;
      for (j = 0; j < c.puffs.length; j++) {
        var p = c.puffs[j];
        ctx.beginPath();
        ctx.ellipse(
          (x + p.dx) * this.w,
          (c.y + p.dy) * this.h,
          p.r * this.w,
          p.r * this.w * 0.58,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      ctx.restore();
    }
  };

  function traceRidge(ctx, pts, base, amp, w, h) {
    ctx.beginPath();
    var i;
    for (i = 0; i < pts.length; i++) {
      var x = (i / (pts.length - 1)) * w;
      var y = h * base - pts[i] * h * amp;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
  }

  function snowCaps(ctx, pts, base, amp, w, h) {
    var i;
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    for (i = 1; i < pts.length - 1; i++) {
      if (pts[i] > pts[i - 1] && pts[i] > pts[i + 1] && pts[i] > 0.58) {
        var x = (i / (pts.length - 1)) * w;
        var y = h * base - pts[i] * h * amp;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 16, y + 18);
        ctx.lineTo(x - 16, y + 18);
        ctx.fill();
      }
    }
  }

  Scene.prototype.drawMountains = function () {
    var ctx = this.ctx;
    var layers = [
      { pts: this.mountains[0], base: 0.72, amp: 0.28, color: "#93a4b6" },
      { pts: this.mountains[1], base: 0.8, amp: 0.3, color: "#5d7084" },
      { pts: this.mountains[2], base: 0.9, amp: 0.26, color: "#2a3a48" }
    ];
    if (this.weather === "thunderstorm" || this.weather === "rainy") {
      layers[0].color = "#3d4d5e";
      layers[1].color = "#243240";
      layers[2].color = "#121920";
    } else if (this.weather === "snowy") {
      layers[0].color = "#d5e0e8";
      layers[1].color = "#8ea0b0";
      layers[2].color = "#3e5162";
    } else if (this.weather === "hazy") {
      layers[0].color = "#cbbba6";
      layers[1].color = "#a89480";
      layers[2].color = "#6d5c4d";
    }
    var i;
    for (i = 0; i < layers.length; i++) {
      var layer = layers[i];
      ctx.save();
      if (this.weather === "foggy") ctx.globalAlpha = 0.45 + i * 0.18;
      else if (this.weather === "hazy") ctx.globalAlpha = 0.6 + i * 0.14;
      ctx.fillStyle = layer.color;
      traceRidge(ctx, layer.pts, layer.base, layer.amp, this.w, this.h);
      ctx.fill();
      if (this.weather === "snowy") {
        snowCaps(ctx, layer.pts, layer.base, layer.amp, this.w, this.h);
      }
      ctx.restore();
    }
  };

  Scene.prototype.drawCity = function () {
    var ctx = this.ctx;
    var ground = this.h * 0.8;
    var night = this.light.dark;
    var i;
    ctx.save();
    if (this.weather === "foggy" || this.weather === "hazy") ctx.globalAlpha = 0.55;
    ctx.fillStyle = night ? "#1a222c" : "rgba(96, 110, 124, 0.55)";
    for (i = 0; i < this.cityFar.length; i++) {
      var far = this.cityFar[i];
      var fh = far.h * this.h;
      ctx.fillRect(far.x * this.w, ground - fh - this.h * 0.02, far.w * this.w, fh + this.h);
    }
    ctx.restore();

    for (i = 0; i < this.city.length; i++) {
      var b = this.city[i];
      var bh = b.h * this.h;
      var bw = b.w * this.w;
      var x = b.x * this.w;
      var y = ground - bh;
      ctx.fillStyle = night ? "#121820" : "#2c3846";
      if (this.weather === "hazy") ctx.fillStyle = "#6d6258";
      if (this.weather === "snowy") ctx.fillStyle = "#465564";
      ctx.fillRect(x, y, bw, bh + 2);
      if (b.antenna) {
        ctx.fillStyle = night ? "#9bb0c4" : "#1b242e";
        ctx.fillRect(x + bw * 0.5, y - 16, 2, 16);
      }
      var win;
      for (win = 0; win < b.windows.length; win++) {
        var item = b.windows[win];
        var glow = item.twinkle ? 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(this.time * 3 + item.phase)) : 0.82;
        if (!night && this.weather === "sunny") glow *= 0.45;
        ctx.globalAlpha = glow;
        ctx.fillStyle = item.warm ? "#ffd17a" : "#d5ecff";
        var cellW = (bw - 8) / item.cols;
        var cellH = (bh - 10) / item.rows;
        ctx.fillRect(
          x + 4 + item.c * cellW + cellW * 0.18,
          y + 6 + item.r * cellH + cellH * 0.22,
          Math.max(1.5, cellW * 0.5),
          Math.max(1.5, cellH * 0.42)
        );
      }
      ctx.globalAlpha = 1;
    }

    var street = ctx.createLinearGradient(0, ground, 0, this.h);
    street.addColorStop(0, night ? "#161b22" : "#3a332c");
    street.addColorStop(1, night ? "#0c1014" : "#241e1a");
    ctx.fillStyle = street;
    ctx.fillRect(0, ground, this.w, this.h - ground);

    ctx.strokeStyle = night ? "rgba(255, 214, 120, 0.35)" : "rgba(255,255,255,0.25)";
    ctx.lineWidth = 2;
    ctx.setLineDash([18, 22]);
    ctx.beginPath();
    ctx.moveTo(0, ground + (this.h - ground) * 0.45);
    ctx.lineTo(this.w, ground + (this.h - ground) * 0.62);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  function drawPalm(ctx, x, ground, scale, time) {
    ctx.save();
    ctx.translate(x, ground);
    ctx.rotate(Math.sin(time * 1.2 + x) * 0.035);
    ctx.strokeStyle = "#5c3b24";
    ctx.lineWidth = 8 * scale;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(22 * scale, -54 * scale, 2 * scale, -128 * scale);
    ctx.stroke();
    var topX = 2 * scale;
    var topY = -128 * scale;
    ctx.strokeStyle = "#1c6a3c";
    ctx.lineWidth = 3.2 * scale;
    var i;
    for (i = 0; i < 7; i++) {
      var a = -2.6 + i * 0.42 + Math.sin(time * 1.8 + i) * 0.06;
      ctx.beginPath();
      ctx.moveTo(topX, topY);
      ctx.quadraticCurveTo(
        topX + Math.cos(a) * 36 * scale,
        topY + Math.sin(a) * 14 * scale,
        topX + Math.cos(a) * 74 * scale,
        topY + Math.sin(a) * 34 * scale
      );
      ctx.stroke();
    }
    ctx.restore();
  }

  Scene.prototype.drawBeach = function () {
    var ctx = this.ctx;
    var seaTop = this.h * 0.56;
    var sea = ctx.createLinearGradient(0, seaTop, 0, this.h * 0.84);
    if (this.weather === "sunny" || this.weather === "windy") {
      sea.addColorStop(0, "#1c9ec4");
      sea.addColorStop(1, "#0b4e68");
    } else if (this.weather === "thunderstorm" || this.weather === "rainy") {
      sea.addColorStop(0, "#1a3a4e");
      sea.addColorStop(1, "#0c2430");
    } else {
      sea.addColorStop(0, "#3d8498");
      sea.addColorStop(1, "#1a5164");
    }
    ctx.fillStyle = sea;
    ctx.fillRect(0, seaTop, this.w, this.h);

    var i;
    for (i = 0; i < 5; i++) {
      var yBase = seaTop + 16 + i * (this.h * 0.045);
      ctx.beginPath();
      var x;
      for (x = 0; x <= this.w; x += 10) {
        var y = yBase + Math.sin(x * 0.012 + this.time * (1.1 + i * 0.17) + i) * (5 + i);
        if (x === 0) ctx.moveTo(0, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(255,255,255," + (0.16 + i * 0.05) + ")";
      ctx.lineWidth = i === 4 ? 3 : 1.6;
      ctx.stroke();
    }

    var sandTop = this.h * 0.8;
    ctx.beginPath();
    ctx.moveTo(0, sandTop);
    for (x = 0; x <= this.w; x += 12) {
      ctx.lineTo(x, sandTop + Math.sin(x * 0.008 + 0.6) * 10);
    }
    ctx.lineTo(this.w, this.h);
    ctx.lineTo(0, this.h);
    ctx.closePath();
    ctx.fillStyle = this.weather === "snowy" ? "#e7eef3" : this.weather === "thunderstorm" ? "#b7a07a" : "#efd0a0";
    ctx.fill();

    for (i = 0; i < this.palms.length; i++) {
      var palm = this.palms[i];
      drawPalm(ctx, palm.x * this.w, sandTop + 8, palm.s, this.time);
    }
  };

  function drawTree(ctx, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(-4, -height * 0.34, 8, height * 0.34);
    ctx.beginPath();
    ctx.moveTo(0, -height);
    ctx.lineTo(height * 0.36, -height * 0.32);
    ctx.lineTo(-height * 0.36, -height * 0.32);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, -height * 0.72);
    ctx.lineTo(height * 0.48, -height * 0.12);
    ctx.lineTo(-height * 0.48, -height * 0.12);
    ctx.fill();
  }

  Scene.prototype.drawForest = function () {
    var ctx = this.ctx;
    var colors = ["#7f9474", "#3f6244", "#1d3324"];
    var grounds = [0.68, 0.78, 0.9];
    if (this.weather === "thunderstorm" || this.weather === "rainy") {
      colors = ["#3e5144", "#24362c", "#101910"];
    } else if (this.weather === "snowy") {
      colors = ["#d5ddd8", "#8aa094", "#3d5348"];
    } else if (this.weather === "hazy") {
      colors = ["#cbbba4", "#8d7b68", "#4e4338"];
    }
    var layer;
    for (layer = 0; layer < 3; layer++) {
      var ground = this.h * grounds[layer];
      var trees = this.trees[layer];
      var i;
      ctx.save();
      if (this.weather === "foggy") ctx.globalAlpha = 0.4 + layer * 0.2;
      for (i = 0; i < trees.length; i++) {
        var tree = trees[i];
        ctx.save();
        ctx.translate(tree.x * this.w, ground);
        ctx.rotate(Math.sin(this.time * 1.3 + tree.sway) * (0.012 + layer * 0.008));
        drawTree(ctx, tree.h * this.h, colors[layer]);
        ctx.restore();
      }
      ctx.restore();
    }
    ctx.fillStyle = this.weather === "snowy" ? "#eef3f4" : "#142016";
    ctx.fillRect(0, this.h * 0.9, this.w, this.h * 0.1);
  };

  function duneY(n, base, amp, freq, phase, time, speed, h) {
    return (
      h * base +
      Math.sin(n * freq + phase + time * speed) * amp +
      Math.sin(n * freq * 2.15 + phase * 1.6) * amp * 0.38
    );
  }

  function roundRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  Scene.prototype.drawDesert = function () {
    var ctx = this.ctx;
    var dunes = [
      { base: 0.7, amp: 24, freq: 5.5, phase: 0.4, speed: 0.08, color: "#f0d7ae" },
      { base: 0.8, amp: 32, freq: 4.2, phase: 1.3, speed: 0.05, color: "#e2b880" },
      { base: 0.92, amp: 22, freq: 3.4, phase: 2.2, speed: 0.03, color: "#c48a52" }
    ];
    if (this.weather === "thunderstorm" || this.weather === "rainy") {
      dunes[0].color = "#8d7a64";
      dunes[1].color = "#6a5846";
      dunes[2].color = "#3e3228";
    } else if (this.weather === "snowy") {
      dunes[0].color = "#f4f7f8";
      dunes[1].color = "#d5dee4";
      dunes[2].color = "#a9b8c2";
    }
    var i;
    var x;
    for (i = 0; i < dunes.length; i++) {
      var d = dunes[i];
      ctx.beginPath();
      ctx.moveTo(0, this.h);
      for (x = 0; x <= this.w; x += 8) {
        ctx.lineTo(x, duneY(x / this.w, d.base, d.amp, d.freq, d.phase, this.time, d.speed, this.h));
      }
      ctx.lineTo(this.w, this.h);
      ctx.closePath();
      ctx.fillStyle = d.color;
      ctx.fill();
    }

    var front = dunes[2];
    for (i = 0; i < this.cacti.length; i++) {
      var c = this.cacti[i];
      var gy = duneY(c.x, front.base, front.amp, front.freq, front.phase, this.time, front.speed, this.h);
      var s = c.s;
      ctx.fillStyle = this.weather === "snowy" ? "#dfe8ea" : "#2f7a48";
      roundRectPath(ctx, c.x * this.w - 6 * s, gy - 72 * s, 12 * s, 72 * s, 6 * s);
      ctx.fill();
      if (c.arm) {
        roundRectPath(ctx, c.x * this.w - 28 * s, gy - 52 * s, 24 * s, 8 * s, 4 * s);
        ctx.fill();
        roundRectPath(ctx, c.x * this.w - 28 * s, gy - 78 * s, 8 * s, 30 * s, 4 * s);
        ctx.fill();
      }
    }
  };

  Scene.prototype.drawLake = function () {
    var ctx = this.ctx;
    var ridgeColor = "#6d7f90";
    var ridgeColor2 = "#314252";
    if (this.weather === "thunderstorm" || this.weather === "rainy") {
      ridgeColor = "#2c3a48";
      ridgeColor2 = "#172028";
    } else if (this.weather === "snowy") {
      ridgeColor = "#d7e2ea";
      ridgeColor2 = "#607484";
    } else if (this.weather === "hazy") {
      ridgeColor = "#c9b8a4";
      ridgeColor2 = "#7d6c5c";
    }
    ctx.save();
    if (this.weather === "foggy") ctx.globalAlpha = 0.55;
    ctx.fillStyle = ridgeColor;
    traceRidge(ctx, this.mountains[0], 0.6, 0.22, this.w, this.h);
    ctx.fill();
    ctx.fillStyle = ridgeColor2;
    traceRidge(ctx, this.mountains[1], 0.74, 0.16, this.w, this.h);
    ctx.fill();
    if (this.weather === "snowy") {
      snowCaps(ctx, this.mountains[1], 0.74, 0.16, this.w, this.h);
    }
    ctx.restore();

    var waterTop = this.h * 0.7;
    var water = ctx.createLinearGradient(0, waterTop, 0, this.h);
    if (this.weather === "sunny") {
      water.addColorStop(0, "#2f8fb4");
      water.addColorStop(1, "#0d3f58");
    } else if (this.weather === "thunderstorm" || this.weather === "rainy") {
      water.addColorStop(0, "#1b3344");
      water.addColorStop(1, "#0b1a24");
    } else {
      water.addColorStop(0, "#6e8c9a");
      water.addColorStop(1, "#243c48");
    }
    ctx.fillStyle = water;
    ctx.fillRect(0, waterTop, this.w, this.h - waterTop);

    var lit = this.light.sun > 0.12;
    var sx = (lit ? this.light.sunX : 0.76) * this.w;
    var i;
    if (this.weather !== "rainy" && this.weather !== "foggy") {
      ctx.save();
      ctx.globalAlpha = 0.22 + 0.08 * Math.sin(this.time * 1.8);
      var shine = ctx.createLinearGradient(sx, waterTop, sx, this.h);
      shine.addColorStop(0, lit ? "rgba(255,244,210,0.95)" : "rgba(210,224,240,0.9)");
      shine.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = shine;
      ctx.beginPath();
      ctx.moveTo(sx - 10, waterTop + 2);
      ctx.lineTo(sx + 10, waterTop + 2);
      ctx.lineTo(sx + 64, this.h);
      ctx.lineTo(sx - 64, this.h);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    var shoreX;
    for (shoreX = 0; shoreX <= this.w; shoreX += 12) {
      var shoreY = waterTop + Math.sin(shoreX * 0.02 + this.time * 1.4) * 2.5;
      if (shoreX === 0) ctx.moveTo(shoreX, shoreY);
      else ctx.lineTo(shoreX, shoreY);
    }
    ctx.stroke();

    ctx.strokeStyle = "rgba(40, 70, 50, 0.65)";
    ctx.lineWidth = 2;
    for (i = 0; i < 18; i++) {
      var rx = (i / 18) * this.w + Math.sin(i) * 8;
      ctx.beginPath();
      ctx.moveTo(rx, waterTop + 4);
      ctx.quadraticCurveTo(rx + 4, waterTop - 10, rx + Math.sin(this.time + i) * 3, waterTop - 18);
      ctx.stroke();
    }
  };

  Scene.prototype.drawLandscape = function () {
    switch (this.landscape) {
      case "mountain":
        this.drawMountains();
        break;
      case "cityscape":
        this.drawCity();
        break;
      case "beach":
        this.drawBeach();
        break;
      case "forest":
        this.drawForest();
        break;
      case "desert":
        this.drawDesert();
        break;
      case "lake":
        this.drawLake();
        break;
      default:
        break;
    }
  };

  Scene.prototype.drawDrops = function () {
    if (!this.drops.length) return;
    var ctx = this.ctx;
    var i;
    if (this.weather === "snowy") {
      for (i = 0; i < this.drops.length; i++) {
        var flake = this.drops[i];
        var wobble = Math.sin(this.time * flake.wobble + flake.phase) * 14;
        ctx.fillStyle = "rgba(255,255,255,0.88)";
        ctx.beginPath();
        ctx.arc(flake.x * this.w + wobble, flake.y * this.h, flake.r, 0, Math.PI * 2);
        ctx.fill();
      }
      return;
    }

    ctx.lineCap = "round";
    if (this.weather === "windy") {
      for (i = 0; i < this.drops.length; i++) {
        var gust = this.drops[i];
        ctx.beginPath();
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = "rgba(255, 246, 226," + gust.alpha + ")";
        ctx.moveTo(gust.x * this.w, gust.y * this.h);
        ctx.lineTo(gust.x * this.w + gust.len, gust.y * this.h + 3);
        ctx.stroke();
      }
      return;
    }

    ctx.beginPath();
    ctx.lineWidth = 1.25;
    ctx.strokeStyle = "rgba(186, 208, 222, 0.55)";
    for (i = 0; i < this.drops.length; i++) {
      var p = this.drops[i];
      var x = p.x * this.w;
      var y = p.y * this.h;
      ctx.moveTo(x, y);
      ctx.lineTo(x + p.drift * 22, y + p.len);
    }
    ctx.stroke();
  };

  Scene.prototype.drawFog = function () {
    if (!this.fog.length && this.weather !== "hazy") return;
    var ctx = this.ctx;
    var tint = this.weather === "hazy" ? "232, 214, 190" : "255, 255, 255";
    var i;
    for (i = 0; i < this.fog.length; i++) {
      var b = this.fog[i];
      var x = ((b.x + this.time * b.speed) % 1.5) - 0.25;
      var grd = ctx.createRadialGradient(x * this.w, b.y * this.h, 10, x * this.w, b.y * this.h, b.r * this.w);
      grd.addColorStop(0, "rgba(" + tint + "," + b.a + ")");
      grd.addColorStop(1, "rgba(" + tint + ",0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, this.w, this.h);
    }
    if (this.weather === "hazy") {
      ctx.fillStyle = "rgba(214, 196, 170, 0.22)";
      ctx.fillRect(0, 0, this.w, this.h);
    }
  };

  Scene.prototype.drawLightning = function () {
    if (this.flash < 0.02 || !this.bolt) return;
    var ctx = this.ctx;
    ctx.fillStyle = "rgba(214, 226, 255," + this.flash * 0.42 + ")";
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.save();
    ctx.strokeStyle = "rgba(236, 244, 255," + Math.min(1, this.flash * 1.5) + ")";
    ctx.lineWidth = 2.6;
    ctx.lineJoin = "round";
    ctx.shadowColor = "rgba(180, 205, 255, 0.95)";
    ctx.shadowBlur = 16;
    strokePoly(ctx, this.bolt.main, this.w, this.h);
    ctx.lineWidth = 1.3;
    var i;
    for (i = 0; i < this.bolt.branches.length; i++) {
      strokePoly(ctx, this.bolt.branches[i], this.w, this.h);
    }
    ctx.restore();
  };

  function strokePoly(ctx, pts, w, h) {
    ctx.beginPath();
    var i;
    for (i = 0; i < pts.length; i++) {
      if (i === 0) ctx.moveTo(pts[i].x * w, pts[i].y * h);
      else ctx.lineTo(pts[i].x * w, pts[i].y * h);
    }
    ctx.stroke();
  }

  Scene.prototype.drawVignette = function () {
    var ctx = this.ctx;
    var g = ctx.createRadialGradient(
      this.w * 0.5,
      this.h * 0.48,
      Math.min(this.w, this.h) * 0.2,
      this.w * 0.5,
      this.h * 0.5,
      Math.max(this.w, this.h) * 0.72
    );
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.38)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.w, this.h);
  };

  Scene.prototype.draw = function () {
    if (this.weather === "sunny" && isNightHour(hourOf(this.clock()))) {
      this.weather = pick(this.rng, NIGHT_WEATHERS);
      this.build();
    }
    this.light = createDaylight(this.clock(), this.weather);
    this.writeCaption();
    this.drawSky();
    this.drawStars();
    this.drawSun();
    this.drawMoon();
    this.drawClouds();
    this.drawLandscape();
    this.drawVeil();
    this.drawDrops();
    this.drawFog();
    this.drawLightning();
    this.drawVignette();
  };

  Scene.prototype.loop = function (now) {
    if (!this.last) this.last = now;
    var dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    if (!this.reduce) {
      this.time += dt;
      this.update(dt);
    }
    this.draw();
    if (!this.reduce && !document.hidden) {
      this.raf = requestAnimationFrame(this.loop);
    }
  };

  Scene.prototype.start = function () {
    var scene = this;
    this.resize();
    window.addEventListener("resize", function () {
      scene.resize();
      if (scene.reduce) scene.draw();
    });
    if (this.reduce) {
      this.draw();
      return;
    }
    this.raf = requestAnimationFrame(this.loop);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        cancelAnimationFrame(scene.raf);
      } else {
        scene.last = 0;
        scene.raf = requestAnimationFrame(scene.loop);
      }
    });
  };

  window.PortalBackground = {
    start: function (canvas, caption) {
      var scene = new Scene(canvas, caption);
      scene.start();
      return scene;
    }
  };
})();
