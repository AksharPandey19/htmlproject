import { Pane } from "https://cdn.jsdelivr.net/npm/tweakpane@4.0.5/dist/tweakpane.min.js";


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const defaultConfig = {
  count: 500,
  distance: 12,
  size: 2,
  speed: 0.5
};

const config = structuredClone(defaultConfig);

let centerX = 0,
  centerY = 0,
  points = [];

const init = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  centerX = canvas.width / 2;
  centerY = canvas.height / 2;
  points = Array.from({ length: config.count }).map(() => ({
    x: centerX,
    y: centerY,
    hue: Math.random() * 360,
    speed: Math.random() * .5 + config.speed,
    alpha: Math.random() * .5 + .5
  }));
  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

init();

window.addEventListener("resize", init);

const randomStep = () => (Math.random() - 0.5) * config.distance * 2;

const draw = () => {
  ctx.fillStyle = "rgba(17, 17, 17, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  points.forEach((point) => {
    const { x, y } = point;

    point.x += randomStep() * point.speed;
    point.y += randomStep() * point.speed;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(point.x, point.y);
    ctx.strokeStyle = `hsla(${point.hue}, 72%, 60%, ${point.alpha})`;
    ctx.lineWidth = config.size;
    ctx.stroke();

    point.hue = (point.hue + 0.3) % 360;

    const dx = point.x - centerX;
    const dy = point.y - centerY;
    const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
    if (distanceFromCenter > Math.min(canvas.width, canvas.height) / 2) {
      point.x = centerX;
      point.y = centerY;
    }
  });

  requestAnimationFrame(draw);
};

draw();
// https://tweakpane.github.io/docs/quick-tour/
const pane = new Pane({ title: "Config", expanded: true });

const prop = (name, value) => {
  init();
};

const props = {
  count: { min: 1, max: 10000, step: 1 },
  distance: { min: 1, max: 100, step: 1 },
  size: { min: 1, max: 50, step: 0.5 },
  speed: { min: 0, max: 5, step: 0.01 }
};

Object.entries(props).forEach(([key, propConfig]) => {
  pane
    .addBinding(config, key, propConfig)
    .on("change", ({ value }) => prop(key, value));
});

pane
  .addBlade({
    view: "list",
    label: "scene",
    options: [
      { text: "Default", value: defaultConfig },
      {
        text: "Ball",
        value: {
          count: 10000,
          distance: 5,
          size: 2,
          speed: 0.5
        }
      },
      {
        text: "Confetti",
        value: {
          count: 742,
          distance: 8,
          size: 12,
          speed: 1.41
        }
      },
      {
        text: "80s",
        value: {
          count: 110,
          distance: 76,
          size: 1,
          speed: 0.22
        }
      },
      {
        text: "Atoms",
        value: {
          count: 50,
          distance: 1,
          size: 3,
          speed: 0.22
        }
      }
    ],
    value: defaultConfig
  })
  .on("change", ({ value }) => {
    Object.assign(config, value);
    init();
    pane.refresh();
  });

// apply values from config
Object.keys(config).forEach((section) => {
  Object.keys(config[section]).forEach((key) => {
    const value = config[section][key];
    config[section][key] = undefined;
    pane.refresh();
    config[section][key] = value;
  });
});

pane.refresh();
