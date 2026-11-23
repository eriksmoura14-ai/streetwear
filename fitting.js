import * as THREE from "./assets/vendor/three.module.min.js";

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
  oval(parent, finish, center, [size * .82, size * .85, size * .81]);
  const curl = new THREE.IcosahedronGeometry(1, 2);
  const count = 160;
  const surface = new THREE.InstancedMesh(curl, finish, count);
  const pose = new THREE.Object3D();
  const tint = new THREE.Color();
  for (let index = 0; index < count; index += 1) {
    const vertical = 1 - 2 * (index + .5) / count;
    const radius = Math.sqrt(1 - vertical * vertical);
    const angle = index * 2.39996;
    const distance = size * (.76 + .16 * Math.sin(index * 5.901));
    pose.position.set(center[0] + Math.cos(angle) * radius * distance,
      center[1] + vertical * distance, center[2] + Math.sin(angle) * radius * distance);
    const width = size * (.14 + .06 * (index % 7) / 6);
    pose.scale.set(width, width * .85, width * 1.13);
    pose.rotation.set(index * .29, angle, index * .38);
    pose.updateMatrix();
    surface.setMatrixAt(index, pose.matrix);
    surface.setColorAt(index, tint.setScalar(.65 + .35 * (index % 9) / 8));
  }
  parent.add(surface);
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
    ? [-.145, .03, .052]
    : [-.036, -.058, -.058]);
}

function posedLeg(parent, side) {
  return posedPart(parent, [side * .16, 1.63, .01], side < 0
    ? [-.050, -.085, -.033]
    : [.042, .11, .033]);
}

function makeCharacter(model) {
  const skin = material(0x86503c, .64);
  const shadowSkin = material(0x603629, .76);
  const cheek = material(0x8a4a39, .69);
  const lash = material(0x291c1c, .78);
  const lips = material(0x682f31, .51);
  const lowerLip = material(0x894c43, .56);
  const hair = material(0x211815, .67);
  const curls = material(0x2f2119, .72);
  const eyes = material(0xcfb6a9, .45);
  const pupils = material(0x281815, .45);
  const earrings = new THREE.MeshStandardMaterial({ color: 0xffcc83, metalness: .62, roughness: .31 });
  const sock = material(0xd7cdc3);
  const sole = material(0xb3a6a3);
  const leather = material(0x27252b, .53);
  const laces = material(0x8d7f84);

  sculpt(model, skin, [
    [1.54, 0, 0], [1.61, .31, .18], [1.79, .329, .20], [2.02, .255, .148],
    [2.22, .259, .153], [2.42, .32, .202, 0, .026], [2.62, .337, .158],
    [2.74, .214, .108], [2.79, .114, .104], [2.99, .11, .095], [3.01, 0, 0]
  ]);
  const head = posedPart(model, [0, 2.96, .07], [-.035, .089, .054]);
  sculpt(head, skin, [
    [2.96, 0, 0, 0, .07], [2.99, .103, .099, 0, .066], [3.045, .158, .137, 0, .054], [3.115, .189, .154, 0, .04],
    [3.18, .216, .172, 0, .028], [3.24, .224, .179, 0, .020], [3.30, .225, .182, 0, .015], [3.41, .209, .165],
    [3.51, .141, .114], [3.545, 0, 0]
  ]);
  oval(head, hair, [0, 3.35, -.063], [.246, .226, .204]);
  sculpt(head, hair, [
    [3.315, .218, .157, 0, -.022], [3.365, .235, .183, 0, -.007],
    [3.43, .235, .192, 0, -.006], [3.515, .170, .153, 0, -.014], [3.554, .112, .133, 0, -.024], [3.583, 0, 0, 0, -.035]
  ]);
  oval(head, skin, [0, 3.188, .204], [.031, .067, .047]);
  oval(head, skin, [0, 3.143, .235], [.045, .031, .036]);
  oval(head, lowerLip, [0, 3.066, .183], [.059, .015, .028]);
  stitch(head, lips, [[-.054, 3.077, .183], [-.019, 3.086, .205],
    [0, 3.082, .211], [.019, 3.086, .205], [.054, 3.077, .183]], .008);
  stitch(head, shadowSkin, [[-.057, 3.074, .187], [0, 3.073, .211], [.057, 3.074, .187]], .003);

  for (const side of [-1, 1]) {
    oval(head, skin, [side * .225, 3.176, .008], [.039, .065, .04], side * -.19);
    oval(head, shadowSkin, [side * .242, 3.18, .041], [.014, .032, .008]);
    oval(head, skin, [side * .034, 3.126, .221], [.019, .016, .024]);
    oval(head, shadowSkin, [side * .027, 3.118, .24], [.010, .006, .010]);
    const hoop = new THREE.Mesh(new THREE.TorusGeometry(.047, .0045, 8, 32), earrings);
    hoop.position.set(side * .239, 3.085, .033);
    hoop.rotation.y = side * .56;
    head.add(hoop);
    oval(head, cheek, [side * .132, 3.165, .155], [.068, .043, .029], side * .19);
    oval(head, eyes, [side * .099, 3.232, .183], [.054, .014, .021], side * .105);
    oval(head, pupils, [side * .096, 3.233, .200], [.016, .016, .010]);
    oval(head, eyes, [side * .096 - .006, 3.239, .209], [.003, .003, .002]);
    stitch(head, lash, [
      [side * .045, 3.241, .202], [side * .092, 3.256, .206], [side * .145, 3.243, .188]
    ], .005);
    stitch(head, hair, [
      [side * .04, 3.285, .196], [side * .094, 3.304, .190], [side * .153, 3.287, .174]
    ], .009);

    curlPuff(head, curls, [side * .248, 3.504, -.125], side < 0 ? .186 : .173);
    stitch(head, hair, [[side * .022, 3.417, .164], [side * .059, 3.452, .172],
      [side * .111, 3.47, .157]], .006);
    for (let index = 0; index < 7; index += 1) {
      const x = side * (.019 + index * .025);
      stitch(head, curls, [[x, 3.403 - index * .009, .164],
        [x + side * .014, 3.430 - index * .007, .177], [x + side * .028, 3.45, .160]], .0035);
    }

    const arm = posedArm(model, side);
    sculpt(arm, skin, [
      [1.44, 0, 0, side * .51, .065], [1.47, .055, .043, side * .51, .065],
      [1.57, .074, .050, side * .528, .065], [1.69, .055, .055, side * .523, .048],
      [1.88, .073, .070, side * .544, .048], [2.08, .087, .082, side * .545, .018],
      [2.30, .103, .095, side * .462], [2.52, .123, .111, side * .380],
      [2.65, .074, .077, side * .322], [2.695, 0, 0, side * .312]
    ]);
    oval(arm, skin, [side * .484, 1.564, .091], [.024, .067, .027], side * -.22);
    for (let finger = 0; finger < 4; finger += 1) {
      const x = side * (.496 + finger * .022);
      oval(arm, skin, [x, 1.467 + Math.abs(finger - 1) * .011, .070 - finger * .009],
        [.0148, .053 - Math.abs(finger - 1) * .007, .018], side * -.09);
    }

    const leg = posedLeg(model, side);
    sculpt(leg, skin, [
      [.11, 0, 0, side * .246], [.18, .072, .068, side * .246], [.35, .077, .08, side * .239],
      [.58, .108, .103, side * .226], [.86, .105, .111, side * .206], [1.19, .133, .135, side * .177, .022],
      [1.55, .151, .157, side * .155], [1.80, .154, .158, side * .149], [1.85, 0, 0, side * .149]
    ]);
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
    sculpt(posedLeg(shorts, side), shortsColor, [
      [1.19, .146, .148, side * .178, .02], [1.37, .154, .166, side * .164, .014],
      [1.59, .171, .179, side * .157]
    ]);
  }

  const tee = new THREE.Group();
  model.add(tee);
  sculpt(tee, fadedBlack, [
    [1.59, .351, .225, .012, .014, .032, .108], [1.63, .380, .234, .012, .013, .039, .097],
    [1.80, .385, .240, .002, .025, .042], [1.93, .373, .225, -.008, .012, .034],
    [2.13, .366, .240, 0, .005, .020], [2.37, .400, .236, .005, .028, .023],
    [2.52, .451, .219, 0, 0, .012], [2.66, .428, .193],
    [2.71, .35, .162], [2.744, .227, .143], [2.761, .135, .119, 0, .007]
  ]);
  sculpt(tee, teeSeam, [
    [2.745, .160, .131, 0, .010], [2.759, .14, .124, 0, .008],
    [2.769, .121, .109, 0, .008]
  ]);
  for (const side of [-1, 1]) {
    const sleeve = posedArm(tee, side);
    sculpt(sleeve, fadedBlack, [
      [2.128, .157, .153, side * .507, .008, .016, -.057],
      [2.162, .164, .154, side * .500, .008, .016, -.053],
      [2.315, .173, .168, side * .464, .014, .011],
      [2.498, .183, .171, side * .418, 0, .013],
      [2.645, .146, .145, side * .374], [2.68, 0, 0, side * .36]
    ]);
    stitch(sleeve, teeSeam, [[side * .392, 2.61, .141], [side * .432, 2.53, .177],
      [side * .457, 2.396, .171], [side * .416, 2.283, .154]], .004);
  }
  badge(tee, warmWhite, .209, 2.441, .251, "circle");

  const hoodie = new THREE.Group();
  model.add(hoodie);
  sculpt(hoodie, wine, [
    [1.69, .344, .205, 0, 0, .020], [1.78, .382, .234, 0, 0, .035],
    [1.91, .408, .264, 0, .008, .034], [2.06, .401, .27, 0, .005, .029],
    [2.25, .416, .259, 0, .015, .021], [2.45, .435, .249, 0, .027, .015],
    [2.60, .455, .227, 0, .005, .014], [2.73, .362, .191], [2.82, .15, .131]
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
      [1.593, .073, .071, side * .530, .058, .011],
      [1.69, .097, .086, side * .535, .054, .023],
      [1.82, .126, .119, side * .548, .042, .029],
      [2.04, .135, .119, side * .550, .038, .022],
      [2.25, .153, .134, side * .516, .012, .018],
      [2.49, .178, .161, side * .456, .008, .014],
      [2.67, .145, .135, side * .387], [2.74, 0, 0, side * .37]
    ]);
    sculpt(sleeve, wineRib, [
      [1.590, .077, .075, side * .529, .057],
      [1.634, .083, .077, side * .530, .057, .009],
      [1.694, .100, .091, side * .536, .055, .020]
    ]);
    stitch(hoodie, burgundySeam, [[side * .162, 2.031, .273],
      [side * .206, 1.995, .280], [side * .224, 1.928, .276]], .006);
  }
  badge(hoodie, warmWhite, .223, 2.469, .257, "star");

  const baggy = new THREE.Group();
  model.add(baggy);
  sculpt(baggy, denim, [
    [1.34, .328, .195, 0, -.004, .009], [1.52, .379, .232, 0, .001, .012],
    [1.71, .378, .218, 0, 0, .014], [1.86, .324, .194, 0, .003, .006],
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
      [.545, .248, .197, side * .242, .015, .032],
      [.718, .236, .188, side * .228, .010, .023],
      [.89, .233, .198, side * .215, .030, .029],
      [1.07, .238, .201, side * .207, .012, .019],
      [1.245, .227, .197, side * .191, .019, .023],
      [1.46, .201, .192, side * .173, .001, .013], [1.70, .183, .169, side * .155, .01]
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

export function createFittingRoom(container) {
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
    if (!focus) {
      camera.position.set(0, 2.45, Math.max(8.47, 4.65 / camera.aspect));
      camera.lookAt(0, 1.61, 0);
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
