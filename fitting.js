import * as THREE from "./assets/vendor/three.module.min.js";

const sphere = new THREE.SphereGeometry(1, 24, 16);
const material = (color, roughness = 0.83) => new THREE.MeshStandardMaterial({ color, roughness });

function oval(parent, finish, position, scale, tilt = 0) {
  const mesh = new THREE.Mesh(sphere, finish);
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.rotation.z = tilt;
  parent.add(mesh);
  return mesh;
}

// Each ring defines the height, width radius, depth radius and optional center offsets.
function sculpt(parent, finish, rings) {
  const segments = 40;
  const vertices = [];
  const indices = [];
  for (const [height, width, depth, centerX = 0, centerZ = 0] of rings) {
    for (let segment = 0; segment < segments; segment += 1) {
      const angle = 2 * Math.PI * segment / segments;
      vertices.push(
        centerX + Math.cos(angle) * Math.max(width, 0.001),
        height,
        centerZ + Math.sin(angle) * Math.max(depth, 0.001)
      );
    }
  }

  for (let row = 0; row < rings.length - 1; row += 1) {
    for (let segment = 0; segment < segments; segment += 1) {
      const a = row * segments + segment;
      const b = row * segments + (segment + 1) % segments;
      indices.push(a, a + segments, b, b, a + segments, b + segments);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, finish);
  parent.add(mesh);
  return mesh;
}

function stitch(parent, finish, points, thickness = 0.008) {
  const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 14, thickness, 6, false), finish);
  parent.add(mesh);
}

function badge(parent, finish, x, y, z, style) {
  if (style === "circle") {
    const mark = new THREE.Mesh(new THREE.TorusGeometry(0.044, 0.006, 7, 24), finish);
    mark.position.set(x, y, z);
    parent.add(mark);
    return;
  }
  stitch(parent, finish, [[x, y - .053, z], [x, y, z + .008], [x, y + .055, z]], .006);
  stitch(parent, finish, [[x - .035, y, z], [x, y, z + .008], [x + .035, y, z]], .006);
}

function makeCharacter(model) {
  const skin = material(0x965b41, .68);
  const lips = material(0x733a3a, .65);
  const hair = material(0x1d1419);
  const curls = material(0x2b1f24);
  const eyes = material(0xf1d9cc);
  const pupils = material(0x281815, .45);
  const earrings = new THREE.MeshStandardMaterial({ color: 0xffcc83, metalness: .62, roughness: .31 });
  const sock = material(0xd7cdc3);
  const sole = material(0xb3a6a3);
  const leather = material(0x27252b, .53);
  const laces = material(0x8d7f84);

  sculpt(model, skin, [
    [1.54, 0, 0], [1.61, .31, .18], [1.79, .329, .20], [2.02, .255, .148],
    [2.22, .259, .153], [2.42, .32, .202, 0, .026], [2.62, .354, .164],
    [2.74, .257, .114], [2.79, .114, .104], [2.99, .11, .095], [3.01, 0, 0]
  ]);
  const head = new THREE.Group();
  model.add(head);
  sculpt(head, skin, [
    [2.96, 0, 0, 0, .07], [2.99, .112, .105, 0, .063], [3.065, .188, .153, 0, .044],
    [3.175, .229, .176, 0, .027], [3.30, .227, .187, 0, .015], [3.41, .209, .165],
    [3.51, .141, .114], [3.545, 0, 0]
  ]);
  oval(head, hair, [0, 3.35, -.063], [.246, .226, .204]);
  oval(head, hair, [0, 3.484, .019], [.226, .097, .171]);
  oval(head, skin, [0, 3.168, .212], [.042, .055, .057]);
  oval(head, skin, [0, 3.133, .228], [.053, .023, .038]);
  oval(head, lips, [0, 3.067, .192], [.069, .022, .026]);
  stitch(head, hair, [[-.061, 3.070, .205], [0, 3.067, .218], [.061, 3.070, .205]], .003);

  for (const side of [-1, 1]) {
    oval(head, skin, [side * .225, 3.176, .008], [.039, .065, .04], side * -.19);
    const hoop = new THREE.Mesh(new THREE.TorusGeometry(.027, .006, 8, 24), earrings);
    hoop.position.set(side * .245, 3.119, .027);
    hoop.rotation.y = side * .44;
    head.add(hoop);
    oval(head, eyes, [side * .095, 3.235, .188], [.058, .022, .017], side * .105);
    oval(head, pupils, [side * .09, 3.235, .203], [.020, .020, .012]);
    oval(head, eyes, [side * .09 - .006, 3.242, .214], [.004, .004, .002]);
    stitch(head, hair, [
      [side * .045, 3.241, .202], [side * .092, 3.256, .206], [side * .145, 3.243, .188]
    ], .006);
    stitch(head, hair, [
      [side * .04, 3.285, .196], [side * .094, 3.304, .190], [side * .153, 3.287, .174]
    ], .009);

    const bunX = side * .229;
    oval(head, hair, [bunX, 3.43, -.14], [.151, .156, .151]);
    for (let index = 0; index < 24; index += 1) {
      const vertical = 1 - (2 * (index + .5)) / 24;
      const radius = Math.sqrt(1 - vertical * vertical);
      const angle = index * 2.39996;
      const size = .035 + .014 * (index % 4) / 3;
      oval(head, index % 3 === 0 ? curls : hair, [
        bunX + Math.cos(angle) * radius * .129,
        3.43 + vertical * .132,
        -.14 + Math.sin(angle) * radius * .128
      ], [size, size, size]);
    }
    for (let index = 0; index < 6; index += 1) {
      oval(head, curls, [side * (0.047 + index * .027), 3.435 - index * .004, .148 - index * .005],
        [.032, .026, .024]);
    }

    sculpt(model, skin, [
      [1.44, 0, 0, side * .51, .065], [1.47, .055, .043, side * .51, .065],
      [1.57, .074, .050, side * .528, .065], [1.69, .055, .055, side * .523, .048],
      [1.88, .073, .070, side * .544, .048], [2.08, .087, .082, side * .545, .018],
      [2.30, .103, .095, side * .462], [2.52, .123, .111, side * .380],
      [2.67, .094, .091, side * .34], [2.71, 0, 0, side * .33]
    ]);
    oval(model, skin, [side * .473, 1.56, .09], [.032, .082, .038], side * -.2);

    sculpt(model, skin, [
      [.11, 0, 0, side * .246], [.18, .072, .068, side * .246], [.35, .077, .08, side * .239],
      [.58, .108, .103, side * .226], [.86, .105, .111, side * .206], [1.19, .133, .135, side * .177, .022],
      [1.55, .151, .157, side * .155], [1.80, .154, .158, side * .149], [1.85, 0, 0, side * .149]
    ]);
    oval(model, sock, [side * .245, .218, -.006], [.082, .14, .083]);
    oval(model, sole, [side * .254, .064, .089], [.132, .055, .233]);
    oval(model, leather, [side * .253, .129, .089], [.126, .097, .222]);
    oval(model, leather, [side * .251, .173, -.023], [.102, .104, .124]);
    for (let index = 0; index < 3; index += 1) {
      const y = .2 - .008 * index;
      const z = .115 + .034 * index;
      const x = side * .251;
      stitch(model, laces, [[x - .063, y, z], [x, y + .009, z + .005], [x + .063, y, z]], .006);
    }
  }
}

function makeWardrobe(model) {
  const warmWhite = material(0xe2d8c7);
  const shortsColor = material(0x383039);
  const fadedBlack = material(0x343038);
  const teeSeam = material(0x59525c);
  const wine = material(0x72263e);
  const wineRib = material(0x531c2b);
  const burgundySeam = material(0x8d4558);
  const denim = material(0x2d2933);
  const denimSeam = material(0x574e5c);
  const pocket = material(0x39343e);

  const tank = new THREE.Group();
  model.add(tank);
  sculpt(tank, warmWhite, [
    [2.10, .266, .158], [2.16, .274, .173], [2.36, .301, .199, 0, .029],
    [2.49, .288, .189, 0, .025], [2.55, .257, .151, 0, .026]
  ]);
  for (const side of [-1, 1]) {
    stitch(tank, warmWhite, [
      [side * .216, 2.52, .132], [side * .226, 2.675, .091],
      [side * .227, 2.702, -.013], [side * .216, 2.52, -.116]
    ], .034);
  }

  const shorts = new THREE.Group();
  model.add(shorts);
  sculpt(shorts, shortsColor, [
    [1.46, .31, .186], [1.62, .334, .205], [1.79, .333, .205], [1.96, .271, .168]
  ]);
  for (const side of [-1, 1]) {
    sculpt(shorts, shortsColor, [
      [1.19, .146, .148, side * .178, .02], [1.37, .154, .166, side * .164, .014],
      [1.59, .171, .179, side * .157]
    ]);
  }

  const tee = new THREE.Group();
  model.add(tee);
  sculpt(tee, fadedBlack, [
    [1.78, .371, .221], [1.82, .373, .224], [2.07, .354, .215],
    [2.32, .373, .239, 0, .019], [2.55, .432, .217], [2.68, .405, .184],
    [2.718, .318, .163], [2.755, .134, .117]
  ]);
  sculpt(tee, teeSeam, [[2.744, .164, .122], [2.758, .143, .119], [2.764, .117, .099]]);
  for (const side of [-1, 1]) {
    sculpt(tee, fadedBlack, [
      [2.23, .143, .138, side * .493], [2.27, .15, .145, side * .482],
      [2.52, .161, .155, side * .41], [2.65, .139, .135, side * .37], [2.7, 0, 0, side * .34]
    ]);
    sculpt(tee, teeSeam, [[2.229, .143, .138, side * .493], [2.247, .146, .141, side * .49]]);
  }
  badge(tee, warmWhite, .179, 2.424, .245, "circle");

  const hoodie = new THREE.Group();
  model.add(hoodie);
  sculpt(hoodie, wine, [
    [1.76, .354, .221], [1.88, .385, .243], [2.16, .400, .247], [2.41, .422, .25, 0, .019],
    [2.61, .427, .226], [2.72, .356, .193], [2.79, .139, .124]
  ]);
  sculpt(hoodie, wineRib, [[1.748, .351, .217], [1.767, .356, .223], [1.856, .378, .238]]);
  oval(hoodie, wineRib, [0, 2.676, -.125], [.25, .195, .198]);
  oval(hoodie, wine, [0, 2.62, -.192], [.233, .143, .157]);
  const pouch = oval(hoodie, wine, [0, 1.99, .237], [.246, .13, .037]);
  pouch.rotation.x = .08;
  for (const side of [-1, 1]) {
    sculpt(hoodie, wine, [
      [1.61, .079, .074, side * .525, .052], [1.76, .103, .099, side * .544, .049],
      [2.02, .124, .113, side * .551, .028], [2.26, .144, .13, side * .509, .006],
      [2.49, .158, .152, side * .451], [2.69, .13, .134, side * .361], [2.74, 0, 0, side * .34]
    ]);
    sculpt(hoodie, wineRib, [
      [1.605, .078, .074, side * .525, .052], [1.69, .09, .088, side * .541, .051]
    ]);
    stitch(hoodie, burgundySeam, [[side * .167, 2.084, .254], [side * .211, 2.016, .245], [side * .204, 1.957, .239]]);
    stitch(hoodie, warmWhite, [[side * .058, 2.744, .137], [side * .067, 2.636, .198], [side * .083, 2.502, .249]], .008);
  }
  badge(hoodie, warmWhite, .201, 2.393, .242, "star");

  const baggy = new THREE.Group();
  model.add(baggy);
  sculpt(baggy, denim, [
    [1.43, .357, .218], [1.60, .388, .226], [1.79, .364, .217],
    [1.95, .299, .183], [1.99, .280, .174]
  ]);
  sculpt(baggy, pocket, [[1.944, .301, .187], [1.965, .291, .185], [1.986, .282, .178]]);
  oval(baggy, denimSeam, [0, 1.96, .189], [.023, .023, .011]);
  stitch(baggy, denimSeam, [[0, 1.925, .193], [.033, 1.82, .215], [.023, 1.69, .226]], .005);

  for (const side of [-1, 1]) {
    sculpt(baggy, denim, [
      [.13, .253, .178, side * .266, .028], [.18, .254, .19, side * .266, .018],
      [.28, .244, .176, side * .263, -.01], [.51, .226, .185, side * .242],
      [.77, .213, .176, side * .225, .005], [1.03, .212, .174, side * .214, .022],
      [1.30, .207, .182, side * .194, .025], [1.55, .191, .188, side * .175], [1.73, .165, .181, side * .168]
    ]);
    oval(baggy, pocket, [side * .361, 1.16, .127], [.086, .152, .074], side * .05);
    oval(baggy, denimSeam, [side * .361, 1.255, .148], [.095, .027, .064], side * .035);
    stitch(baggy, denimSeam, [
      [side * .505, .193, .061], [side * .459, .53, .055], [side * .422, .80, .061],
      [side * .412, 1.26, .054], [side * .363, 1.68, .056]
    ], .007);
    stitch(baggy, denimSeam, [
      [side * .105, .222, .146], [side * .26, .243, .181], [side * .402, .21, .17]
    ], .007);
  }

  return { tank, shorts, tee, hoodie, baggy };
}

function makeStage(scene) {
  const base = new THREE.Mesh(new THREE.CylinderGeometry(.87, .94, .11, 64), material(0x302a31, .61));
  base.position.y = -.058;
  scene.add(base);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(.85, .006, 8, 64), material(0x9f6675, .6));
  rim.rotation.x = -Math.PI / 2;
  rim.position.y = .002;
  scene.add(rim);

  const shadowMap = document.createElement("canvas");
  shadowMap.width = shadowMap.height = 64;
  const canvas = shadowMap.getContext("2d");
  const gradient = canvas.createRadialGradient(32, 32, 2, 32, 32, 32);
  gradient.addColorStop(0, "#100b12b0");
  gradient.addColorStop(1, "#100b1200");
  canvas.fillStyle = gradient;
  canvas.fillRect(0, 0, 64, 64);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.72, 1.1),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shadowMap), transparent: true, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = .007;
  scene.add(shadow);
}

export function createFittingRoom(container) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  const canvas = renderer.domElement;
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "Personagem feminina 3D com as peças selecionadas");
  container.append(canvas);

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffebdf, 0x958599, 2.25));
  const key = new THREE.DirectionalLight(0xffe4d3, 2.5);
  key.position.set(-3, 5, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xc9b3ea, 1.65);
  fill.position.set(2, 4, -3);
  scene.add(fill);
  makeStage(scene);

  const avatar = new THREE.Group();
  scene.add(avatar);
  makeCharacter(avatar);
  const wardrobe = makeWardrobe(avatar);

  const camera = new THREE.PerspectiveCamera(30, 1, .1, 40);
  const initialAngle = -.26;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let goal = initialAngle;
  let frame;
  let pointer;
  avatar.rotation.y = goal;

  function render() {
    frame = undefined;
    const delta = goal - avatar.rotation.y;
    avatar.rotation.y += motion.matches || Math.abs(delta) < .001 ? delta : delta * .27;
    renderer.render(scene, camera);
    if (avatar.rotation.y !== goal) draw();
  }

  function draw() {
    if (frame === undefined) frame = requestAnimationFrame(render);
  }

  new ResizeObserver(() => {
    const { clientWidth: width, clientHeight: height } = container;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.position.set(0, 2.45, Math.max(8.47, 4.65 / camera.aspect));
    camera.lookAt(0, 1.61, 0);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    draw();
  }).observe(container);

  canvas.addEventListener("pointerdown", (event) => {
    if (pointer || (event.pointerType === "mouse" && event.button !== 0)) return;
    pointer = { id: event.pointerId, x: event.clientX };
    canvas.setPointerCapture(event.pointerId);
    canvas.classList.add("dragging");
  });
  canvas.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointer?.id) return;
    goal += (event.clientX - pointer.x) * .012;
    pointer.x = event.clientX;
    draw();
  });
  canvas.addEventListener("lostpointercapture", (event) => {
    if (event.pointerId !== pointer?.id) return;
    pointer = undefined;
    canvas.classList.remove("dragging");
  });

  return {
    setOutfit(outfit) {
      wardrobe.tee.visible = outfit.upper === "camiseta-asfalto";
      wardrobe.hoodie.visible = outfit.upper === "moletom-concreto";
      wardrobe.tank.visible = !outfit.upper;
      wardrobe.baggy.visible = outfit.lower === "cargo-subsolo";
      wardrobe.shorts.visible = !outfit.lower;
      draw();
    },
    rotate(direction) {
      goal += direction * Math.PI / 4;
      draw();
    },
    resetView() {
      const fullTurn = Math.PI * 2;
      goal = initialAngle + Math.round((avatar.rotation.y - initialAngle) / fullTurn) * fullTurn;
      draw();
    }
  };
}
