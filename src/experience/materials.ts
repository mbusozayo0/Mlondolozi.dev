import * as THREE from "three";

type SurfaceStyle = {
  base: string;
  variation: number;
  roughness: number;
  metalness?: number;
  scratches?: number;
  repeat?: [number, number];
};

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function createSurfaceMaps(style: SurfaceStyle, seed: number) {
  const size = 192;
  const random = seededRandom(seed);
  const colorCanvas = document.createElement("canvas");
  const roughnessCanvas = document.createElement("canvas");
  const normalCanvas = document.createElement("canvas");
  const aoCanvas = document.createElement("canvas");
  colorCanvas.width = roughnessCanvas.width = normalCanvas.width = aoCanvas.width = size;
  colorCanvas.height = roughnessCanvas.height = normalCanvas.height = aoCanvas.height = size;

  const colorContext = colorCanvas.getContext("2d")!;
  const roughnessContext = roughnessCanvas.getContext("2d")!;
  const normalContext = normalCanvas.getContext("2d")!;
  const aoContext = aoCanvas.getContext("2d")!;
  const base = new THREE.Color(style.base);

  colorContext.fillStyle = style.base;
  colorContext.fillRect(0, 0, size, size);
  roughnessContext.fillStyle = `rgb(${style.roughness * 255},${style.roughness * 255},${style.roughness * 255})`;
  roughnessContext.fillRect(0, 0, size, size);
  normalContext.fillStyle = "rgb(128,128,255)";
  normalContext.fillRect(0, 0, size, size);
  aoContext.fillStyle = "rgb(238,238,238)";
  aoContext.fillRect(0, 0, size, size);

  for (let index = 0; index < 3200; index += 1) {
    const x = random() * size;
    const y = random() * size;
    const alpha = random() * 0.18;
    const lighter = random() > 0.5;
    const varied = base.clone().offsetHSL(0, 0, (lighter ? 1 : -1) * random() * style.variation);
    colorContext.fillStyle = `rgba(${varied.r * 255},${varied.g * 255},${varied.b * 255},${alpha})`;
    colorContext.fillRect(x, y, random() * 2 + 0.3, random() * 2 + 0.3);

    const roughnessValue = Math.max(0, Math.min(255, style.roughness * 255 + (random() - 0.5) * 72));
    roughnessContext.fillStyle = `rgba(${roughnessValue},${roughnessValue},${roughnessValue},${0.12 + random() * 0.22})`;
    roughnessContext.fillRect(x, y, random() * 2 + 0.4, random() * 2 + 0.4);

    normalContext.fillStyle = `rgba(${122 + random() * 12},${122 + random() * 12},255,${0.1 + random() * 0.12})`;
    normalContext.fillRect(x, y, random() * 1.6 + 0.3, random() * 1.6 + 0.3);

    const occlusion = 90 + random() * 130;
    aoContext.fillStyle = `rgba(${occlusion},${occlusion},${occlusion},${0.025 + random() * 0.07})`;
    aoContext.beginPath();
    aoContext.arc(x, y, 2 + random() * 12, 0, Math.PI * 2);
    aoContext.fill();
  }

  colorContext.lineCap = roughnessContext.lineCap = "round";
  for (let index = 0; index < (style.scratches ?? 0); index += 1) {
    const startX = random() * size;
    const startY = random() * size;
    const length = 8 + random() * 58;
    colorContext.strokeStyle = `rgba(238,220,194,${0.025 + random() * 0.08})`;
    colorContext.lineWidth = 0.35 + random() * 0.7;
    colorContext.beginPath();
    colorContext.moveTo(startX, startY);
    colorContext.lineTo(startX + length, startY + (random() - 0.5) * 5);
    colorContext.stroke();

    roughnessContext.strokeStyle = `rgba(245,245,245,${0.1 + random() * 0.25})`;
    roughnessContext.lineWidth = 0.5 + random();
    roughnessContext.beginPath();
    roughnessContext.moveTo(startX, startY);
    roughnessContext.lineTo(startX + length, startY + (random() - 0.5) * 5);
    roughnessContext.stroke();
  }

  const configureTexture = (canvas: HTMLCanvasElement, color = false) => {
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(...(style.repeat ?? [1, 1]));
    texture.anisotropy = 4;
    if (color) texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };

  const aoMap = configureTexture(aoCanvas);
  aoMap.channel = 0;
  return {
    map: configureTexture(colorCanvas, true),
    roughnessMap: configureTexture(roughnessCanvas),
    normalMap: configureTexture(normalCanvas),
    aoMap,
  };
}

function standardMaterial(style: SurfaceStyle, seed: number, normalScale = 0.22) {
  const maps = createSurfaceMaps(style, seed);
  return new THREE.MeshStandardMaterial({
    color: "#ffffff",
    map: maps.map,
    roughness: style.roughness,
    roughnessMap: maps.roughnessMap,
    normalMap: maps.normalMap,
    normalScale: new THREE.Vector2(normalScale, normalScale),
    aoMap: maps.aoMap,
    aoMapIntensity: 0.42,
    metalness: style.metalness ?? 0,
  });
}

export const materials = {
  wall: standardMaterial({ base: "#aca79d", variation: 0.08, roughness: 0.94, repeat: [5, 3] }, 12, 0.2),
  floor: standardMaterial({ base: "#4a443b", variation: 0.12, roughness: 0.82, scratches: 32, repeat: [6, 10] }, 25, 0.28),
  wood: standardMaterial({ base: "#292b2b", variation: 0.1, roughness: 0.62, scratches: 34, repeat: [4, 1] }, 38, 0.32),
  metal: standardMaterial({ base: "#181a1c", variation: 0.05, roughness: 0.38, metalness: 0.74, scratches: 18 }, 51, 0.18),
  plastic: standardMaterial({ base: "#111417", variation: 0.05, roughness: 0.58, scratches: 10 }, 64, 0.14),
  fabric: standardMaterial({ base: "#252b2c", variation: 0.08, roughness: 0.95, repeat: [3, 3] }, 77, 0.4),
  paper: standardMaterial({ base: "#d8cfb8", variation: 0.08, roughness: 0.88, repeat: [2, 2] }, 90, 0.12),
  ceramic: standardMaterial({ base: "#313738", variation: 0.035, roughness: 0.28 }, 103, 0.1),
};

export const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: "#11181b",
  roughness: 0.18,
  metalness: 0.06,
  transmission: 0.18,
  thickness: 0.16,
  clearcoat: 0.72,
  clearcoatRoughness: 0.22,
});
