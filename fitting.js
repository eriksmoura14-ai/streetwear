import * as THREE from "./assets/vendor/three.module.min.js";
import { GLTFLoader } from "./assets/vendor/loaders/GLTFLoader.js";

const sphere = new THREE.SphereGeometry(1, 24, 16);
const material = (color, roughness = 0.83) => new THREE.MeshStandardMaterial({ color, roughness });

function fabricNoise(u, v, cells) {
  const x = u * cells;
  const y = v * cells;
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const smooth = (t) => t * t * (3 - 2 * t);
  const sample = (a, b) => {
    const seed = ((a % cells) * 374761393 + (b % cells) * 668265263) | 0;
    const bits = Math.imul(seed ^ (seed >>> 13), 1274126177);
    return ((bits ^ (bits >>> 16)) >>> 0) / 4294967295 - .5;
  };
  const top = THREE.MathUtils.lerp(sample(ix, iy), sample(ix + 1, iy), smooth(x - ix));
  const bottom = THREE.MathUtils.lerp(sample(ix, iy + 1), sample(ix + 1, iy + 1), smooth(x - ix));
  return THREE.MathUtils.lerp(top, bottom, smooth(y - iy));
}

function fabric(color, contrast, weave) {
  const canvas = document.createElement("canvas");
  const size = 256;
  canvas.width = canvas.height = size;
  const context = canvas.getContext("2d");
  const image = context.createImageData(size, size);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const u = x / size;
      const v = y / size;
      const wash = fabricNoise(u, v, 8) + .56 * fabricNoise(u, v, 19) + .34 * fabricNoise(u, v, 57);
      const threads = Math.sin(2 * Math.PI * (72 * u + weave * 61 * v)) * Math.cos(2 * Math.PI * 49 * v);
      const tone = 223 + contrast * wash + threads * 6 + 13 * fabricNoise(u, v, 128);
      const offset = (y * size + x) * 4;
      image.data.set([tone, tone, tone, 255], offset);
    }
  }
  context.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return new THREE.MeshStandardMaterial({
    color, roughness: .94, map: texture, bumpMap: texture, bumpScale: .014
  });
}

function oval(parent, finish, position, scale, tilt = 0) {
  const mesh = new THREE.Mesh(sphere, finish);
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.rotation.z = tilt;
  parent.add(mesh);
  return mesh;
}

// Rings define height, two radii, center offsets and the depth of the fabric folds.
function sculpt(parent, finish, rings) {
  const segments = 64;
  const stride = segments + 1;
  const vertices = [];
  const coordinates = [];
  const indices = [];
  const minHeight = rings[0][0];
  const heightRange = rings.at(-1)[0] - minHeight;

  for (const [height, width, depth, centerX = 0, centerZ = 0, fold = 0, drape = 0] of rings) {
    for (let segment = 0; segment <= segments; segment += 1) {
      const angle = 2 * Math.PI * segment / segments;
      const ripple = fold * (.52 * Math.sin(5 * angle + height * 8)
        + .31 * Math.cos(8 * angle - height * 10) + .17 * Math.sin(13 * angle + height * 16));
      vertices.push(
        centerX + Math.cos(angle) * Math.max(width + ripple, .001),
        height + .32 * fold * Math.sin(3 * angle) + drape * Math.cos(angle) ** 2,
        centerZ + Math.sin(angle) * Math.max(depth + ripple, .001)
      );
      coordinates.push(segment / segments, (height - minHeight) / heightRange);
    }
  }

  for (let row = 0; row < rings.length - 1; row += 1) {
    for (let segment = 0; segment < segments; segment += 1) {
      const a = row * stride + segment;
      indices.push(a, a + stride, a + 1, a + 1, a + stride, a + stride + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(coordinates, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const normals = geometry.getAttribute("normal");
  const joinedNormal = new THREE.Vector3();
  for (let row = 0; row < rings.length; row += 1) {
    const first = row * stride;
    const last = first + segments;
    joinedNormal.set(
      normals.getX(first) + normals.getX(last),
      normals.getY(first) + normals.getY(last),
      normals.getZ(first) + normals.getZ(last)
    ).normalize();
    normals.setXYZ(first, joinedNormal.x, joinedNormal.y, joinedNormal.z);
    normals.setXYZ(last, joinedNormal.x, joinedNormal.y, joinedNormal.z);
  }

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
  let geometry;
  if (style === "circle") {
    geometry = new THREE.RingGeometry(.039, .047, 48, 1, .35, Math.PI * 1.9);
  } else {
    const star = new THREE.Shape();
    star.moveTo(0, .054);
    star.quadraticCurveTo(.007, .007, .039, 0);
    star.quadraticCurveTo(.007, -.006, 0, -.05);
    star.quadraticCurveTo(-.007, -.006, -.039, 0);
    star.quadraticCurveTo(-.007, .007, 0, .054);
    geometry = new THREE.ShapeGeometry(star);
  }
  const mark = new THREE.Mesh(geometry, finish);
  mark.position.set(x, y, z);
  mark.rotation.y = .23;
  mark.rotation.z = style === "circle" ? .13 : -.08;
  parent.add(mark);
}

function curlPuff(parent, finish, center, size) {
  oval(parent, finish, center, [size * .76, size * .79, size * .73]);
  const curl = new THREE.TorusGeometry(.64, .31, 5, 14, Math.PI * 1.72);
  const count = 630;
  const surface = new THREE.InstancedMesh(curl, finish, count);
  const pose = new THREE.Object3D();
  const tint = new THREE.Color();
  for (let index = 0; index < count; index += 1) {
    const vertical = 1 - 2 * (index + .5) / count;
    const radius = Math.sqrt(1 - vertical * vertical);
    const angle = index * 2.39996;
    const bunch = Math.sin(3 * angle + vertical * 11) * Math.cos(vertical * 13);
    const distance = size * (.84 + .07 * bunch + .075 * Math.sin(index * 5.901));
    pose.position.set(center[0] + Math.cos(angle) * radius * distance * 1.04,
      center[1] + vertical * distance * .91, center[2] + Math.sin(angle) * radius * distance * .96);
    const width = size * (.078 + .078 * (index % 11) / 10);
    pose.scale.set(width, width * (.88 + .13 * Math.cos(index)), width * .94);
    pose.rotation.set(index * .29, angle, index * .38);
    pose.updateMatrix();
    surface.setMatrixAt(index, pose.matrix);
    surface.setColorAt(index, tint.setScalar(.66 + .34 * (index % 15) / 14));
  }
  parent.add(surface);
}

function makeEye() {
  const geometry = new THREE.SphereGeometry(1, 64, 48);
  const points = geometry.getAttribute("position");
  const colors = [];
  const sclera = new THREE.Color(0xbeb0a5);
  const corner = new THREE.Color(0x986f66);
  const iris = new THREE.Color(0x563927);
  const rim = new THREE.Color(0x37241d);
  const pupil = new THREE.Color(0x13100f);
  const whitening = THREE.MathUtils.smoothstep;
  const tone = new THREE.Color();

  for (let i = 0; i < points.count; i += 1) {
    const x = points.getX(i);
    const y = points.getY(i);
    const radius = Math.hypot(x - .022, y);
    const front = points.getZ(i) > 0;
    tone.copy(sclera).lerp(corner, .38 * whitening(Math.abs(x), .48, .97));

    if (front && radius < .45) {
      const angle = Math.atan2(y, x - .022);
      const fibers = .86 + .11 * Math.sin(37 * angle + 14 * radius) + .08 * Math.sin(23 * angle - 8 * radius);
      tone.copy(iris).multiplyScalar(fibers);
      tone.lerp(rim, whitening(radius, .31, .41));
      tone.lerp(pupil, 1 - whitening(radius, .140, .181));
    }

    colors.push(tone.r, tone.g, tone.b);
  }

  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const finish = new THREE.MeshPhysicalMaterial({
    vertexColors: true, roughness: .36, clearcoat: .68, clearcoatRoughness: .18
  });
  return new THREE.Mesh(geometry, finish);
}

function panel(parent, finish, outline, position, angle = 0, depth = .014) {
  const shape = new THREE.Shape();
  shape.moveTo(...outline[0]);
  for (const point of outline.slice(1)) shape.lineTo(...point);
  shape.closePath();
  const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, {
    depth, bevelSize: .008, bevelThickness: .008, bevelSegments: 2
  }), finish);
  mesh.position.set(...position);
  mesh.rotation.y = angle;
  parent.add(mesh);
}

function posedPart(parent, [x, y, z], [pitch, yaw, roll]) {
  const pivot = new THREE.Group();
  pivot.position.set(x, y, z);
  pivot.rotation.set(pitch, yaw, roll);
  const part = new THREE.Group();
  part.position.set(-x, -y, -z);
  pivot.add(part);
  parent.add(pivot);
  return part;
}

function posedArm(parent, side) {
  return posedPart(parent, [side * .345, 2.58, 0], side < 0
    ? [-.172, .045, .015]
    : [-.052, -.073, .007]);
}

function posedLeg(parent, side) {
  return posedPart(parent, [side * .16, 1.63, .01], side < 0
    ? [-.054, -.108, -.021]
    : [.037, .16, -.041]);
}

function styleAvatar(model) {
  const hair = material(0x251811, .79);
  const eye = makeEye();
  const earrings = new THREE.MeshStandardMaterial({ color: 0xdca765, metalness: .52, roughness: .28 });
  const sock = material(0x29252a);
  const sole = material(0xb3aaa8);
  const leather = material(0x27252b, .53);
  const laces = material(0x81777a);
  const headAccessories = new THREE.Group();
  headAccessories.position.y = -.115;
  model.add(headAccessories);

  for (const side of [-1, 1]) {
    const x = side * .0734;
    const eyeball = eye.clone();
    eyeball.position.set(x, 3.2481, .1855);
    eyeball.scale.set(.0345, .0345, .0383);
    headAccessories.add(eyeball);

    const hoop = new THREE.Mesh(new THREE.TorusGeometry(.050, .0045, 10, 42), earrings);
    hoop.scale.set(.80, 1.13, 1);
    hoop.position.set(side * .193, 3.131, .119);
    hoop.rotation.y = side * .49;
    headAccessories.add(hoop);

    curlPuff(headAccessories, hair, [side * .206, 3.480 + side * .012, -.017], side < 0 ? .173 : .166);

    const leg = posedLeg(model, side);
    oval(leg, sock, [side * .245, .218, -.006], [.082, .14, .083]);
    oval(leg, sole, [side * .254, .064, .089], [.132, .055, .233]);
    oval(leg, leather, [side * .253, .129, .089], [.126, .097, .222]);
    oval(leg, leather, [side * .251, .173, -.023], [.102, .104, .124]);
    for (let index = 0; index < 3; index += 1) {
      const y = .2 - .008 * index;
      const z = .115 + .034 * index;
      const x = side * .251;
      stitch(leg, laces, [[x - .063, y, z], [x, y + .009, z + .005], [x + .063, y, z]], .006);
    }
  }
}

function makeWardrobe(model) {
  const warmWhite = material(0xe2d8c7);
  const shortsColor = material(0x383039);
  const fadedBlack = fabric(0x373334, 49, .25);
  const teeSeam = material(0x353031);
  const wine = fabric(0x701427, 15, .20);
  const wineRib = fabric(0x591023, 10, 0);
  const burgundySeam = material(0x641b30);
  const denim = fabric(0x383538, 38, 1);
  const denimSeam = material(0x60534b);
  const pocket = fabric(0x302c2d, 24, 1);
  const buttonMetal = new THREE.MeshStandardMaterial({ color: 0x988477, metalness: .72, roughness: .43 });

  const tank = new THREE.Group();
  model.add(tank);
  sculpt(tank, warmWhite, [
    [2.055, .233, .159, 0, .067], [2.14, .24, .163, 0, .067],
    [2.27, .274, .173, 0, .059], [2.34, .302, .188, 0, .062],
    [2.42, .312, .197, 0, .048], [2.49, .304, .187, 0, .030],
    [2.55, .278, .160, 0, .013]
  ]);
  for (const side of [-1, 1]) {
    stitch(tank, warmWhite, [
      [side * .212, 2.52, .151], [side * .209, 2.652, .087],
      [side * .195, 2.700, -.023], [side * .208, 2.54, -.128]
    ], .034);
  }

  const shorts = new THREE.Group();
  model.add(shorts);
  sculpt(shorts, shortsColor, [
    [1.46, .31, .186], [1.62, .334, .205], [1.79, .333, .205], [1.96, .271, .168]
  ]);
  for (const side of [-1, 1]) {
    sculpt(posedLeg(shorts, side), shortsColor, [
      [1.19, .146, .148, side * .178, .02], [1.37, .154, .166, side * .164, .014],
      [1.59, .171, .179, side * .157]
    ]);
  }

  const tee = new THREE.Group();
  model.add(tee);
  sculpt(tee, fadedBlack, [
    [1.66, .335, .222, -.006, .026, .022, .070], [1.70, .365, .237, -.005, .023, .036, .059],
    [1.81, .378, .238, -.009, .024, .032, .029], [1.97, .355, .215, -.002, .014, .034],
    [2.11, .354, .211, .009, .018, .021], [2.23, .364, .231, .010, .023, .022],
    [2.37, .386, .234, .005, .028, .021], [2.49, .405, .214, .001, .021, .012],
    [2.57, .411, .197, -.006, .012, .010], [2.625, .386, .181, -.007, .006],
    [2.665, .328, .159, -.006, .004], [2.702, .223, .129],
    [2.724, .159, .110], [2.735, .129, .096],
    [2.741, .105, .084], [2.744, .097, .077]
  ]);
  for (const side of [-1, 1]) {
    const sleeve = posedArm(tee, side);
    sculpt(sleeve, fadedBlack, [
      [2.149, .145, .133, side * .470, .015, .012, -.050],
      [2.18, .152, .141, side * .467, .014, .013, -.047],
      [2.29, .151, .151, side * .441, .013, .013, -.029],
      [2.42, .158, .154, side * .412, .011, .012],
      [2.53, .156, .151, side * .383, .006, .010],
      [2.61, .123, .133, side * .348, .004], [2.666, .042, .079, side * .321]
    ]);
    stitch(sleeve, teeSeam, [[side * .356, 2.589, .138], [side * .389, 2.507, .159],
      [side * .404, 2.414, .162], [side * .421, 2.295, .158]], .0038);
  }
  badge(tee, warmWhite, .190, 2.419, .239, "circle");

  const hoodie = new THREE.Group();
  model.add(hoodie);
  sculpt(hoodie, wine, [
    [1.69, .344, .205, 0, 0, .020], [1.78, .382, .234, 0, 0, .035],
    [1.91, .408, .264, 0, .008, .034], [2.06, .401, .27, 0, .005, .029],
    [2.25, .405, .249, 0, .015, .024], [2.43, .423, .248, 0, .024, .016],
    [2.54, .436, .215, 0, .014, .012], [2.63, .396, .195, 0, .003, .009],
    [2.71, .296, .163], [2.765, .139, .126]
  ]);
  sculpt(hoodie, wineRib, [
    [1.693, .350, .210, 0, 0, .020], [1.734, .364, .217, 0, 0, .026],
    [1.794, .385, .238, 0, 0, .030]
  ]);
  sculpt(hoodie, wine, [
    [2.54, .03, .07, 0, -.24], [2.60, .17, .127, 0, -.217, .018],
    [2.71, .257, .161, 0, -.173, .025], [2.81, .237, .151, 0, -.116, .023],
    [2.90, .187, .129, 0, -.088, .015]
  ]);
  sculpt(hoodie, wineRib, [
    [2.848, .218, .145, 0, -.103, .02], [2.878, .199, .135, 0, -.09, .016],
    [2.902, .18, .119, 0, -.09, .014]
  ]);
  stitch(hoodie, burgundySeam, [[0, 2.585, -.331], [0, 2.683, -.341],
    [0, 2.784, -.286], [0, 2.889, -.218]], .006);
  for (const side of [-1, 1]) {
    stitch(hoodie, wine, [[side * .20, 2.832, -.025], [side * .155, 2.805, .067],
      [side * .098, 2.768, .135], [0, 2.743, .164]], .029);
  }
  panel(hoodie, wine, [[-.17, .095], [.17, .095], [.233, -.013],
    [.214, -.102], [-.214, -.102], [-.233, -.013]], [0, 1.939, .252]);
  for (const side of [-1, 1]) {
    const sleeve = posedArm(hoodie, side);
    sculpt(sleeve, wine, [
      [1.590, .067, .069, side * .506, .052, .008],
      [1.677, .099, .088, side * .513, .052, .020],
      [1.765, .124, .104, side * .521, .041, .026],
      [1.89, .123, .106, side * .518, .035, .021],
      [2.08, .127, .111, side * .491, .027, .018],
      [2.26, .151, .134, side * .459, .013, .016],
      [2.43, .162, .147, side * .425, .008, .014],
      [2.55, .153, .148, side * .387, .004, .010],
      [2.65, .098, .108, side * .348, .003], [2.72, 0, 0, side * .329]
    ]);
    sculpt(sleeve, wineRib, [
      [1.587, .069, .072, side * .506, .052],
      [1.623, .079, .078, side * .508, .052, .009],
      [1.679, .100, .090, side * .513, .053, .015]
    ]);
    stitch(hoodie, burgundySeam, [[side * .162, 2.031, .273],
      [side * .206, 1.995, .280], [side * .224, 1.928, .276]], .006);
  }
  badge(hoodie, warmWhite, .223, 2.469, .257, "star");

  const baggy = new THREE.Group();
  model.add(baggy);
  sculpt(baggy, denim, [
    [1.508, .340, .140, 0, -.006, .004], [1.557, .355, .182, 0, .003, .009],
    [1.61, .367, .201, 0, .005, .011],
    [1.68, .372, .212, 0, .007, .012], [1.76, .360, .207, 0, .007, .009],
    [1.86, .327, .194, 0, .006, .006],
    [1.98, .287, .176, 0, .002]
  ]);
  sculpt(baggy, pocket, [
    [1.924, .306, .190, 0, .003], [1.962, .293, .184, 0, .003], [1.985, .287, .178, 0, .003]
  ]);
  oval(baggy, buttonMetal, [0, 1.959, .193], [.019, .019, .010]);
  stitch(baggy, denimSeam, [[.012, 1.924, .204], [.059, 1.804, .212], [.044, 1.712, .224]], .0035);

  for (const side of [-1, 1]) {
    const leg = posedLeg(baggy, side);
    sculpt(leg, denim, [
      [.075, .272, .230, side * .277, .049, .023],
      [.132, .276, .226, side * .276, .046, .045],
      [.197, .273, .195, side * .275, .012, .054],
      [.255, .256, .212, side * .270, .025, .045],
      [.345, .272, .200, side * .263, .006, .042],
      [.438, .259, .205, side * .252, .019, .029],
      [.545, .248, .197, side * .241, .015, .032],
      [.718, .242, .189, side * .228, .014, .023],
      [.89, .235, .194, side * .217, .022, .023],
      [1.06, .230, .195, side * .205, .016, .019],
      [1.23, .220, .198, side * .192, .013, .016],
      [1.39, .207, .197, side * .178, .008, .012],
      [1.53, .195, .189, side * .167, .008, .008],
      [1.67, .178, .181, side * .158, .01]
    ]);
    const pocketCenter = [side * .370, 1.03, .142];
    const pocketAngle = side * .82;
    panel(leg, pocket, [[-.122, .156], [.122, .156], [.118, -.143],
      [.088, -.174], [-.093, -.174], [-.114, -.14]], pocketCenter, pocketAngle, .036);
    panel(leg, denim, [[-.135, .028], [.135, .028], [.124, -.054],
      [0, -.086], [-.126, -.055]], [side * .377, 1.186, .172], pocketAngle, .015);
    stitch(baggy, denimSeam, [[side * .174, 1.919, .158],
      [side * .236, 1.818, .164], [side * .319, 1.801, .119]], .004);
    stitch(leg, denimSeam, [[side * .527, .156, .047], [side * .497, .438, .044],
      [side * .463, .718, .046], [side * .436, .94, .054],
      [side * .431, 1.267, .054], [side * .367, 1.628, .070]], .005);
    stitch(leg, denimSeam, [[side * .111, .092, .141], [side * .225, .113, .242],
      [side * .347, .105, .235], [side * .467, .104, .158]], .0034);
    for (let offset = 0; offset < 2; offset += 1) {
      const y = 1.94 + offset * .018;
      stitch(baggy, denimSeam, [[side * .133, y, .164],
        [side * .139, y - .048, .172], [side * .143, y - .070, .177]], .003);
    }
    panel(baggy, pocket, [[-.084, .074], [.084, .074], [.079, -.065],
      [0, -.103], [-.079, -.065]], [side * .175, 1.732, -.194], Math.PI - side * .39, .008);
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

export async function createFittingRoom(container) {
  const asset = new URL("./assets/avatar/streetwaer-portrait-v2.glb", import.meta.url);
  const { scene: character } = await new GLTFLoader().loadAsync(asset.href);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  const canvas = renderer.domElement;
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "Personagem feminina 3D com as peças selecionadas");
  container.append(canvas);

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xfff5ea, 0x9b8d89, 1.85));
  const key = new THREE.DirectionalLight(0xfff0e3, 2.7);
  key.position.set(-3, 5, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xe1d4ed, 1.55);
  fill.position.set(2, 4, -3);
  scene.add(fill);
  const portraitFill = new THREE.DirectionalLight(0xfff6ee, 0);
  portraitFill.position.set(.8, 3.18, 5);
  portraitFill.target.position.set(0, 3.12, 0);
  scene.add(portraitFill, portraitFill.target);
  makeStage(scene);

  const avatar = new THREE.Group();
  scene.add(avatar);
  avatar.add(character);
  styleAvatar(avatar);
  const wardrobe = makeWardrobe(avatar);
  const innerTorso = character.getObjectByName("TorsoUnderOuterwear");

  const camera = new THREE.PerspectiveCamera(30, 1, .1, 40);
  const initialAngle = -.24;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let goal = initialAngle;
  let frame;
  let pointer;
  let focus;
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

  function frameCamera() {
    const portrait = focus === "head";
    camera.fov = portrait ? 25 : 30;
    key.intensity = portrait ? 1.84 : 2.7;
    portraitFill.intensity = portrait ? .86 : 0;
    camera.updateProjectionMatrix();
    if (!focus) {
      camera.position.set(0, 2.22, Math.max(8.48, 4.65 / camera.aspect));
      camera.lookAt(0, 1.63, 0);
      return;
    }
    if (portrait) {
      camera.position.set(0, 3.117, Math.max(2.32, 1.59 / camera.aspect));
      camera.lookAt(0, 3.121, .031);
      return;
    }
    const height = focus === "lower" ? .91 : 2.45;
    camera.position.set(0, height + .24, Math.max(4.40, 3.55 / camera.aspect));
    camera.lookAt(0, height, 0);
  }

  new ResizeObserver(() => {
    const { clientWidth: width, clientHeight: height } = container;
    if (!width || !height) return;
    camera.aspect = width / height;
    frameCamera();
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
      innerTorso.visible = !outfit.upper;
      wardrobe.baggy.visible = outfit.lower === "cargo-subsolo";
      wardrobe.shorts.visible = !outfit.lower;
      draw();
    },
    focusPiece(slot) {
      if (focus === slot) return;
      focus = slot;
      frameCamera();
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
