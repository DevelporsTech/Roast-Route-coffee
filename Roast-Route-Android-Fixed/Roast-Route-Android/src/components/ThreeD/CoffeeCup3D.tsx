import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RefreshCw, Wind } from 'lucide-react';
import clsx from 'clsx';
import * as THREE from 'three';
import { CoffeeCupArtwork, latteCrema } from './CoffeeCupArtwork';

const DRINKS = {
  latte: { label: 'Latte', title: 'Single-Origin Oat Latte', crema: latteCrema },
  cappuccino: { label: 'Cappuccino', title: 'Artisan Microfoam Cappuccino', crema: 'radial-gradient(circle, #B37842 0%, #6C3915 55%, #220E04 100%)' },
  caramel: { label: 'Caramel', title: 'Bourbon Caramel Macchiato', crema: 'radial-gradient(circle, #C27C38 0%, #8A4A1C 50%, #281005 100%)' },
  matcha: { label: 'Matcha', title: 'Kyoto Ceremonial Matcha', crema: 'radial-gradient(circle, #7EA672 0%, #4B7340 50%, #1E3817 100%)' },
  espresso: { label: 'Espresso', title: 'Double Ristretto Crema', crema: 'radial-gradient(circle, #9E5B26 0%, #5C2D0C 50%, #160802 100%)' },
};

export type DrinkFlavor = keyof typeof DRINKS;

const VIEWS = { orbit: '3D Orbit', 'latte-art': 'Latte Art', side: 'Side View' };
export type CameraPreset = keyof typeof VIEWS;

const drinkOptions = Object.entries(DRINKS) as [DrinkFlavor, (typeof DRINKS)[DrinkFlavor]][];
const viewOptions = Object.entries(VIEWS) as [CameraPreset, string][];

const selectionStyle = 'bg-coffee-900 text-white dark:bg-roast-amber dark:text-coffee-950';
const controlStyle = 'rounded-lg border border-coffee-200 bg-white px-2.5 py-2 text-xs font-semibold text-coffee-800 hover:bg-coffee-100 dark:border-coffee-800 dark:bg-coffee-950 dark:text-cream-100 dark:hover:bg-coffee-900';

function createLatteArtTexture(flavor: DrinkFlavor): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const cx = 512;
  const cy = 512;
  const radius = 500;

  // 1. Base espresso crema radial gradient
  const cremaGrad = ctx.createRadialGradient(cx, cy, 50, cx, cy, radius);
  if (flavor === 'matcha') {
    cremaGrad.addColorStop(0, '#7EA672');
    cremaGrad.addColorStop(0.5, '#4B7340');
    cremaGrad.addColorStop(0.85, '#2D4E24');
    cremaGrad.addColorStop(1, '#1E3817');
  } else if (flavor === 'caramel') {
    cremaGrad.addColorStop(0, '#C27C38');
    cremaGrad.addColorStop(0.45, '#8A4A1C');
    cremaGrad.addColorStop(0.85, '#4A210A');
    cremaGrad.addColorStop(1, '#281005');
  } else if (flavor === 'espresso') {
    cremaGrad.addColorStop(0, '#9E5B26');
    cremaGrad.addColorStop(0.5, '#5C2D0C');
    cremaGrad.addColorStop(0.85, '#2E1305');
    cremaGrad.addColorStop(1, '#160802');
  } else if (flavor === 'cappuccino') {
    cremaGrad.addColorStop(0, '#B37842');
    cremaGrad.addColorStop(0.55, '#6C3915');
    cremaGrad.addColorStop(0.85, '#3D1C08');
    cremaGrad.addColorStop(1, '#220E04');
  } else {
    // Classic Latte
    cremaGrad.addColorStop(0, '#A66832');
    cremaGrad.addColorStop(0.5, '#693714');
    cremaGrad.addColorStop(0.85, '#3B1B08');
    cremaGrad.addColorStop(1, '#220D04');
  }

  ctx.fillStyle = cremaGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  // 2. Subtle micro-foam marbled swirls
  ctx.save();
  for (let i = 0; i < 48; i++) {
    const angle = (i / 48) * Math.PI * 2;
    const r1 = 120 + Math.sin(i * 3.5) * 80;
    const r2 = 320 + Math.cos(i * 2.1) * 110;
    const px1 = cx + Math.cos(angle) * r1;
    const py1 = cy + Math.sin(angle) * r1;
    const px2 = cx + Math.cos(angle + 0.3) * r2;
    const py2 = cy + Math.sin(angle + 0.3) * r2;

    const swirlGrad = ctx.createLinearGradient(px1, py1, px2, py2);
    swirlGrad.addColorStop(0, 'rgba(255, 245, 230, 0.25)');
    swirlGrad.addColorStop(0.5, 'rgba(220, 180, 140, 0.15)');
    swirlGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.strokeStyle = swirlGrad;
    ctx.lineWidth = 14 + Math.sin(i) * 8;
    ctx.beginPath();
    ctx.moveTo(px1, py1);
    ctx.quadraticCurveTo(cx + Math.cos(angle + 0.5) * 220, cy + Math.sin(angle + 0.5) * 220, px2, py2);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Iconic Barista Latte Art: Heart / Rosette
  if (flavor !== 'espresso') {
    ctx.save();
    const milkColor = flavor === 'matcha' ? 'rgba(240, 252, 235, 0.95)' : 'rgba(255, 250, 242, 0.95)';
    const milkShadow = flavor === 'matcha' ? 'rgba(50, 80, 40, 0.4)' : 'rgba(80, 35, 10, 0.4)';

    ctx.shadowColor = milkShadow;
    ctx.shadowBlur = 12;

    // Outer leaf heart lobes
    for (let layer = 7; layer >= 1; layer--) {
      const scale = layer / 7;
      const yOffset = cy - 30 + (7 - layer) * 26;
      const lobeWidth = 140 * scale;
      const lobeHeight = 110 * scale;

      ctx.fillStyle = milkColor;
      ctx.beginPath();
      // Left lobe
      ctx.bezierCurveTo(
        cx - lobeWidth * 1.5,
        yOffset - lobeHeight * 0.8,
        cx - lobeWidth * 1.8,
        yOffset + lobeHeight * 0.5,
        cx,
        yOffset + lobeHeight
      );
      // Right lobe
      ctx.bezierCurveTo(
        cx + lobeWidth * 1.8,
        yOffset + lobeHeight * 0.5,
        cx + lobeWidth * 1.5,
        yOffset - lobeHeight * 0.8,
        cx,
        yOffset - lobeHeight * 0.2
      );
      ctx.fill();
    }

    // Central heart pull-through stroke (barista needle drag)
    const dragGrad = ctx.createLinearGradient(cx, cy - 180, cx, cy + 220);
    dragGrad.addColorStop(0, flavor === 'matcha' ? '#2D4E24' : '#3B1B08');
    dragGrad.addColorStop(0.5, flavor === 'matcha' ? '#4B7340' : '#693714');
    dragGrad.addColorStop(1, milkColor);

    ctx.strokeStyle = dragGrad;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 150);
    ctx.lineTo(cx, cy + 180);
    ctx.stroke();

    // Top heart crown drop
    ctx.fillStyle = milkColor;
    ctx.beginPath();
    ctx.arc(cx, cy - 155, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 4. Flavor-specific topping garnishes
  if (flavor === 'cappuccino') {
    // Dusted organic cocoa powder specks
    ctx.save();
    for (let i = 0; i < 900; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.pow(Math.random(), 0.6) * 320;
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist;
      const size = Math.random() * 2.8 + 0.6;
      ctx.fillStyle = Math.random() > 0.4 ? 'rgba(40, 16, 8, 0.88)' : 'rgba(85, 38, 16, 0.7)';
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  } else if (flavor === 'caramel') {
    // Caramel crosshatch syrup drizzle ribbons
    ctx.save();
    ctx.strokeStyle = 'rgba(215, 128, 38, 0.85)';
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(60, 20, 4, 0.5)';
    ctx.shadowBlur = 8;

    for (let d = -3; d <= 3; d++) {
      ctx.beginPath();
      const offset = d * 65;
      ctx.moveTo(cx - 240, cy + offset - 40);
      ctx.bezierCurveTo(cx - 80, cy + offset + 40, cx + 80, cy + offset - 40, cx + 240, cy + offset + 40);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 5. Cup rim crema meniscus shadow
  const rimGrad = ctx.createRadialGradient(cx, cy, radius - 60, cx, cy, radius);
  rimGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  rimGrad.addColorStop(1, 'rgba(25, 8, 2, 0.6)');
  ctx.fillStyle = rimGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

function createGrainTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 1250; i++) {
    ctx.fillStyle = i % 2 ? '#727272' : '#919191';
    ctx.fillRect(Math.random() * 128, Math.random() * 128, 1, 1);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 2);
  return texture;
}

function createCoffeeBeanGeometry() {
  const geometry = new THREE.SphereGeometry(1, 48, 24);
  const positions = geometry.attributes.position;
  const colors = new Float32Array(positions.count * 3);
  const roast = new THREE.Color('#805039');
  const seam = new THREE.Color('#2c170f');
  const color = new THREE.Color();

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);
    const distanceFromSeam = (z - .15 * Math.sin(x * Math.PI)) / .16;
    const crease = Math.exp(-(distanceFromSeam ** 2)) * Math.max(0, y);

    positions.setXYZ(i, x * .17, y * .066 - crease * .027, z * .107 * (1 + .12 * x));
    color.copy(roast).lerp(seam, Math.min(1, crease * 1.45)).toArray(colors, i * 3);
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function lathe(profile: number[][]) {
  return new THREE.LatheGeometry(profile.map(([radius, height]) => new THREE.Vector2(radius, height)), 52);
}

function softTexture(stops: [number, string][]) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  stops.forEach(([position, color]) => gradient.addColorStop(position, color));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

export function CoffeeCup3D({ className }: { className?: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const [flavor, setFlavor] = useState<DrinkFlavor>('latte');
  const [view, setView] = useState<CameraPreset>('orbit');
  const [rotating, setRotating] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [steam, setSteam] = useState(rotating);
  const [ready, setReady] = useState(false);
  const [supported, setSupported] = useState(true);
  const settings = useRef({ flavor, view, rotating, steam });
  settings.current = { flavor, view, rotating, steam };
  const liquidMaterial = useRef<THREE.MeshStandardMaterial | null>(null);
  const startSpin = useRef(() => {});

  useEffect(() => {
    const material = liquidMaterial.current;
    if (!material) return;
    material.map?.dispose();
    material.map = createLatteArtTexture(flavor);
    material.needsUpdate = true;
  }, [flavor]);

  useEffect(() => {
    const host = stage.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      setSupported(false);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, .1, 40);
    const focus = new THREE.Vector3(0, .66, 0);
    const targetFocus = focus.clone();
    const targetPosition = new THREE.Vector3(0, 3.1, 5.8);
    camera.position.copy(targetPosition);
    camera.lookAt(focus);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const canvas = renderer.domElement;
    canvas.className = 'absolute inset-0 block h-full w-full touch-pan-y';
    canvas.setAttribute('aria-label', 'Interactive ceramic coffee cup and saucer');
    host.appendChild(canvas);

    const cup = new THREE.Group();
    const cupScale = .87;
    cup.rotation.y = -.25;
    cup.scale.setScalar(cupScale);
    cup.position.y = -.035 * cupScale;
    scene.add(cup);

    const outerCeramic = new THREE.MeshPhysicalMaterial({
      color: 0x1e100a,
      roughness: .18,
      metalness: .05,
      clearcoat: .88,
      clearcoatRoughness: .08,
      reflectivity: .6,
    });
    const innerCeramic = new THREE.MeshPhysicalMaterial({
      color: 0xfaf5ec,
      roughness: .12,
      metalness: .02,
      clearcoat: .95,
      clearcoatRoughness: .04,
      side: THREE.BackSide,
    });
    const goldTrim = new THREE.MeshStandardMaterial({
      color: 0xd49a6a,
      roughness: .25,
      metalness: .85,
    });

    const body = new THREE.Mesh(lathe([
      [0, .08], [.72, .08], [.78, .14], [.85, .45], [1.02, 1.05],
      [1.22, 1.62], [1.36, 1.96], [1.34, 1.99], [1.31, 1.98],
    ]), outerCeramic);
    body.castShadow = body.receiveShadow = true;

    const lining = new THREE.Mesh(lathe([
      [0, .18], [.64, .18], [.75, .45], [.92, 1.05], [1.12, 1.62],
      [1.28, 1.95], [1.31, 1.98],
    ]), innerCeramic);
    lining.receiveShadow = true;

    const handlePath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.14, 1.62, 0),
      new THREE.Vector3(1.68, 1.52, 0),
      new THREE.Vector3(1.78, 1.08, 0),
      new THREE.Vector3(1.48, .65, 0),
      new THREE.Vector3(.92, .58, 0),
    ]);
    const handle = new THREE.Mesh(new THREE.TubeGeometry(handlePath, 42, .088, 16, false), outerCeramic);
    handle.castShadow = true;

    const saucer = new THREE.Mesh(lathe([
      [0, 0], [1.1, 0], [1.85, .06], [2.18, .24], [2.26, .28],
      [2.24, .25], [1.78, .045], [.85, .045], [0, .045],
    ]), outerCeramic);
    saucer.position.y = .035;
    saucer.castShadow = saucer.receiveShadow = true;

    const saucerTrim = new THREE.Mesh(new THREE.TorusGeometry(1.98, .015, 12, 52), goldTrim);
    saucerTrim.rotation.x = Math.PI / 2;
    saucerTrim.position.y = .175;

    const coffee = new THREE.MeshStandardMaterial({
      map: createLatteArtTexture(settings.current.flavor),
      roughness: .32,
      metalness: .04,
    });
    liquidMaterial.current = coffee;
    const surface = new THREE.Mesh(new THREE.CircleGeometry(1.24, 48), coffee);
    surface.rotation.x = -Math.PI / 2;
    surface.position.y = 1.88;
    surface.receiveShadow = true;

    const meniscusMaterial = new THREE.MeshStandardMaterial({
      color: 0x42200e,
      roughness: .2,
      metalness: .1,
    });
    const meniscus = new THREE.Mesh(new THREE.TorusGeometry(1.23, .022, 12, 48), meniscusMaterial);
    meniscus.rotation.x = Math.PI / 2;
    meniscus.position.y = 1.885;
    cup.add(body, lining, handle, saucer, saucerTrim, surface, meniscus);

    const shadowMap = softTexture([
      [0, 'rgba(43,27,19,.53)'], [.55, 'rgba(43,27,19,.32)'],
      [.78, 'rgba(43,27,19,.11)'], [1, 'rgba(43,27,19,0)'],
    ]);
    const shadowMaterial = new THREE.MeshBasicMaterial({ map: shadowMap, transparent: true, depthWrite: false, toneMapped: false });
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 4.8), shadowMaterial);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(-.16, .003, .16);
    scene.add(shadow);

    const bump = createGrainTexture();
    const beanGeometry = createCoffeeBeanGeometry();
    const beanMaterial = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: .62,
      bumpMap: bump,
      bumpScale: .005,
    });
    const beanPlacements = [
      { x: -1.59, z: 1.55, angle: .46, size: .91 },
      { x: -1.34, z: 1.82, angle: -.58, size: .77 },
      { x: 1.46, z: 1.71, angle: -.44, size: 1.02 },
      { x: 1.71, z: 1.43, angle: .73, size: .83 },
      { x: 1.16, z: 1.94, angle: .16, size: .87 },
    ];

    for (const { x, z, angle, size } of beanPlacements) {
      const bean = new THREE.Mesh(beanGeometry, beanMaterial);
      bean.position.set(x, .064 * size, z);
      bean.rotation.y = angle;
      bean.scale.setScalar(size);
      bean.castShadow = bean.receiveShadow = true;
      scene.add(bean);

      const beanShadow = shadow.clone();
      beanShadow.position.set(x - .018, .005, z + .014);
      beanShadow.rotation.z = angle;
      beanShadow.scale.set(.085 * size, .056 * size, 1);
      scene.add(beanShadow);
    }

    const steamMap = softTexture([
      [0, 'rgba(255,245,227,.46)'], [.5, 'rgba(255,245,227,.15)'], [1, 'rgba(255,245,227,0)'],
    ]);
    const steamGeometry = new THREE.BufferGeometry();
    const steamPositions = new Float32Array(16 * 3);
    const steamAttribute = new THREE.BufferAttribute(steamPositions, 3);
    steamGeometry.setAttribute('position', steamAttribute);
    const steamMaterial = new THREE.PointsMaterial({
      map: steamMap, color: '#f7e9d8', size: .34, opacity: .38,
      transparent: true, depthWrite: false,
    });
    const steamCloud = new THREE.Points(steamGeometry, steamMaterial);
    steamCloud.frustumCulled = false;
    scene.add(steamCloud);

    scene.add(new THREE.AmbientLight(0xfff5ea, 1.4));
    const key = new THREE.DirectionalLight(0xfff0dd, 3.2);
    key.position.set(4.5, 7.5, 4.5);
    key.castShadow = true;
    key.shadow.mapSize.set(768, 768);
    key.shadow.camera.left = key.shadow.camera.bottom = -3.2;
    key.shadow.camera.right = key.shadow.camera.top = 3.2;
    key.shadow.normalBias = .021;
    scene.add(key);
    const edge = new THREE.DirectionalLight(0xe88a38, 2.2);
    edge.position.set(-4.5, 3.5, -3.5);
    const fill = new THREE.PointLight(0xd4752b, 1.4, 8);
    fill.position.set(0, .8, 2.2);
    scene.add(edge, fill);

    let aspect = 1;
    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (width <= 0 || height <= 0) return;
      aspect = width / height;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(host);
    let visible = true;
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibilityObserver.observe(host);

    let activePointer: number | null = null;
    let previousX = 0;
    let previousY = 0;
    let lift = 0;
    let spin: { angle: number; start: number } | null = null;
    startSpin.current = () => {
      spin = { angle: cup.rotation.y, start: performance.now() };
    };
    const pointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || activePointer !== null) return;
      activePointer = event.pointerId;
      previousX = event.clientX;
      previousY = event.clientY;
      spin = null;
      canvas.setPointerCapture(event.pointerId);
    };
    const pointerMove = (event: PointerEvent) => {
      if (activePointer !== event.pointerId) return;
      cup.rotation.y += (event.clientX - previousX) * .011;
      lift = THREE.MathUtils.clamp(lift + (event.clientY - previousY) * .008, -.7, 1.1);
      previousX = event.clientX;
      previousY = event.clientY;
    };
    const pointerUp = (event: PointerEvent) => {
      if (activePointer === event.pointerId) activePointer = null;
    };
    canvas.addEventListener('pointerdown', pointerDown);
    canvas.addEventListener('pointermove', pointerMove);
    canvas.addEventListener('pointerup', pointerUp);
    canvas.addEventListener('pointercancel', pointerUp);
    canvas.addEventListener('lostpointercapture', pointerUp);

    let frame = 0;
    let previousTime = performance.now();
    let contextLost = false;
    const onContextLost = () => {
      contextLost = true;
      cancelAnimationFrame(frame);
      setSupported(false);
      setReady(false);
    };
    canvas.addEventListener('webglcontextlost', onContextLost);

    const draw = (now: number) => {
      if (contextLost) return;
      frame = requestAnimationFrame(draw);
      const delta = Math.min(.05, (now - previousTime) / 1000);
      previousTime = now;
      if (!visible || document.hidden) return;

      const zoom = Math.max(1, 1.37 / aspect);
      const activeView = settings.current.view;
      if (activeView === 'latte-art') {
        targetPosition.set(0, 7.35 * zoom, .04);
        targetFocus.set(0, .81, 0);
      } else if (activeView === 'side') {
        targetPosition.set(0, 1.38, 5.8 * zoom);
        targetFocus.set(0, .65, 0);
      } else {
        targetPosition.set(0, (3.1 + lift) * zoom, 5.8 * zoom);
        targetFocus.set(0, .66, 0);
      }
      const easing = 1 - Math.exp(-8 * delta);
      camera.position.lerp(targetPosition, easing);
      focus.lerp(targetFocus, easing);
      camera.lookAt(focus);

      if (spin) {
        const progress = Math.min(1, (now - spin.start) / 1550);
        cup.rotation.y = spin.angle + Math.PI * (1 - Math.cos(Math.PI * progress));
        if (progress === 1) spin = null;
      } else if (activePointer === null && settings.current.rotating) {
        cup.rotation.y += delta * .36;
      }

      steamCloud.visible = settings.current.steam;
      if (steamCloud.visible) {
        const time = now / 1000;
        for (let i = 0; i < steamPositions.length / 3; i++) {
          const height = (time * .31 + i * .137) % 1;
          steamAttribute.setXYZ(
            i,
            Math.sin(time * 1.2 + i) * (.13 + height * .14),
            1.67 + height * .88,
            Math.cos(i * 2.4) * (.11 + height * .07),
          );
        }
        steamAttribute.needsUpdate = true;
      }
      renderer.render(scene, camera);
    };

    renderer.render(scene, camera);
    setReady(true);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      sizeObserver.disconnect();
      visibilityObserver.disconnect();
      canvas.removeEventListener('pointerdown', pointerDown);
      canvas.removeEventListener('pointermove', pointerMove);
      canvas.removeEventListener('pointerup', pointerUp);
      canvas.removeEventListener('pointercancel', pointerUp);
      canvas.removeEventListener('lostpointercapture', pointerUp);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      const geometries = new Set<THREE.BufferGeometry>();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) geometries.add(object.geometry);
      });
      geometries.forEach((geometry) => geometry.dispose());
      beanMaterial.dispose();
      outerCeramic.dispose();
      innerCeramic.dispose();
      goldTrim.dispose();
      meniscusMaterial.dispose();
      bump.dispose();
      coffee.map?.dispose();
      coffee.dispose();
      shadowMaterial.dispose();
      shadowMap.dispose();
      steamMaterial.dispose();
      steamMap.dispose();
      key.shadow.dispose();
      renderer.dispose();
      canvas.remove();
      liquidMaterial.current = null;
      startSpin.current = () => {};
    };
  }, []);

  return (
    <div className={clsx('w-full min-w-0 overflow-hidden rounded-3xl border border-coffee-200/80 bg-white/75 shadow-xl dark:border-coffee-800 dark:bg-coffee-950/60', className)}>
      <div className="flex min-h-[66px] flex-wrap items-center justify-between gap-2 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-roast-caramel dark:text-roast-amber">Coffee preview</p>
          <h2 className="mt-1 break-words text-sm font-semibold text-coffee-950 dark:text-cream-100">{DRINKS[flavor].title}</h2>
        </div>
        {ready && <span className="text-xs text-coffee-600 dark:text-coffee-300">Drag to rotate</span>}
      </div>

      <div className="relative isolate aspect-[4/3] overflow-hidden border-y border-coffee-200/70 bg-coffee-100/45 dark:border-coffee-800 dark:bg-coffee-900/40 sm:aspect-[3/2]">
        <div className="pointer-events-none absolute inset-x-[9%] bottom-[8%] top-[16%] rounded-full bg-white/75 blur-3xl dark:bg-roast-amber/10" />
        {!ready && <CoffeeCupArtwork crema={DRINKS[flavor].crema} />}
        <div ref={stage} className={clsx('absolute inset-0', ready ? 'cursor-grab active:cursor-grabbing' : 'invisible')} />
      </div>

      <div className="space-y-2 p-3">
        <div className="grid grid-cols-3 gap-1 rounded-xl border border-coffee-200/80 bg-coffee-50/80 p-1 dark:border-coffee-800 dark:bg-coffee-900/40 sm:grid-cols-5" role="group" aria-label="Coffee flavor">
          {drinkOptions.map(([id, drink]) => (
            <button key={id} type="button" aria-pressed={flavor === id} onClick={() => setFlavor(id)}
              className={clsx('rounded-lg px-1 py-2 text-xs font-semibold', flavor === id ? selectionStyle : 'text-coffee-700 hover:bg-coffee-100 dark:text-coffee-300 dark:hover:bg-coffee-800')}>
              {drink.label}
            </button>
          ))}
        </div>
        {supported && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-0.5 rounded-xl border border-coffee-200 bg-coffee-50 p-1 dark:border-coffee-800 dark:bg-coffee-900/40" role="group" aria-label="Cup viewing angle">
              {viewOptions.map(([id, label]) => (
                <button key={id} type="button" aria-pressed={view === id} onClick={() => setView(id)}
                  className={clsx('rounded-lg px-2 py-1.5 text-xs font-semibold', view === id ? selectionStyle : 'text-coffee-700 hover:bg-coffee-100 dark:text-coffee-300 dark:hover:bg-coffee-800')}>
                  {label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5" role="group" aria-label="Cup motion controls">
              <button type="button" onClick={() => startSpin.current()} className={clsx(controlStyle, 'flex items-center gap-1')} aria-label="Spin cup 360 degrees">
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> 360°
              </button>
              <button type="button" onClick={() => setRotating((value) => !value)} className={controlStyle}
                aria-label={rotating ? 'Pause auto-rotation' : 'Resume auto-rotation'} title={rotating ? 'Pause rotation' : 'Resume rotation'}>
                {rotating ? <Pause className="h-3.5 w-3.5" aria-hidden="true" /> : <Play className="h-3.5 w-3.5" aria-hidden="true" />}
              </button>
              <button type="button" onClick={() => setSteam((value) => !value)} className={controlStyle} aria-label="Toggle steam" aria-pressed={steam} title="Toggle steam">
                <Wind className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
