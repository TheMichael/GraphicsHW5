import {OrbitControls} from './OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Set background color
scene.background = new THREE.Color(0x000000);

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLight.position.set(10, 20, 15);
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight2.position.set(-10, 20, -15);
scene.add(directionalLight2);

const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight3.position.set(0, 25, 0);
scene.add(directionalLight3);

renderer.shadowMap.enabled = true;
directionalLight.castShadow = true;
directionalLight2.castShadow = true;
directionalLight3.castShadow = true;

directionalLight.shadow.camera.top = 15;
directionalLight.shadow.camera.left = -20;
directionalLight.shadow.camera.right = 20;
directionalLight.shadow.camera.bottom = -20;
directionalLight.shadow.camera.far = 50;

directionalLight2.shadow.camera.top = 15;
directionalLight2.shadow.camera.left = -20;
directionalLight2.shadow.camera.right = 20;
directionalLight2.shadow.camera.bottom = -20;
directionalLight2.shadow.camera.far = 50;

directionalLight3.shadow.camera.top = 15;
directionalLight3.shadow.camera.left = -20;
directionalLight3.shadow.camera.right = 20;
directionalLight3.shadow.camera.bottom = -20;
directionalLight3.shadow.camera.far = 50;

function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi/180);
}

// Create basketball court
function createBasketballCourt() {
  // Court floor - court with wood textures
  const courtGeometry = new THREE.BoxGeometry(30, 0.2, 15);

  const textureLoader = new THREE.TextureLoader();
  const baseColorMap = textureLoader.load('src/textures/oakfloor_basecolor.png');
  const normalMap = textureLoader.load('src/textures/oakfloor_normal.png');
  const aoMap = textureLoader.load('src/textures/oakfloor_AO.png');
  // Set texture repeat for proper tiling
  baseColorMap.wrapS = baseColorMap.wrapT = THREE.RepeatWrapping;
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
  aoMap.wrapS = aoMap.wrapT = THREE.RepeatWrapping;
  baseColorMap.repeat.set(8, 4); // Repeat 8x4 times
  normalMap.repeat.set(8, 4);
  aoMap.repeat.set(8, 4);
  
  const courtMaterial = new THREE.MeshPhongMaterial({
    map: baseColorMap,
    normalMap: normalMap,
    aoMap: aoMap,
    shininess: 50
  });
  
  const court = new THREE.Mesh(courtGeometry, courtMaterial);
  court.receiveShadow = true;
  scene.add(court);

  //this is the out of bounds area where the base of the basket will be
  const outOfBoundsCourtPartGeometry = new THREE.BoxGeometry(42, 0.1, 21);

  // add different wood texture for the oob 
  const mahoganyBaseColorMap = textureLoader.load('src/textures/mahogfloor_basecolor.png');
  const mahoganyNormalMap = textureLoader.load('src/textures/mahogfloor_normal.png');
  const mahoganyAOMap = textureLoader.load('src/textures/mahogfloor_AO.png');

  // Set texture repeat for proper tiling
  mahoganyBaseColorMap.wrapS = mahoganyBaseColorMap.wrapT = THREE.RepeatWrapping;
  mahoganyNormalMap.wrapS = mahoganyNormalMap.wrapT = THREE.RepeatWrapping;
  mahoganyAOMap.wrapS = mahoganyAOMap.wrapT = THREE.RepeatWrapping;
  mahoganyBaseColorMap.repeat.set(10, 5); // Repeat across the larger area
  mahoganyNormalMap.repeat.set(10, 5);
  mahoganyAOMap.repeat.set(10, 5);

  const outOfBoundsCourtPartMaterial = new THREE.MeshPhongMaterial({
    map: mahoganyBaseColorMap,
    normalMap: mahoganyNormalMap,
    aoMap: mahoganyAOMap,
    shininess: 50
  });

  const outOfBoundsCourt = new THREE.Mesh(outOfBoundsCourtPartGeometry, outOfBoundsCourtPartMaterial);
  outOfBoundsCourt.receiveShadow = true;
  scene.add(outOfBoundsCourt);

  // Note: All court lines, hoops, and other elements have been removed
  // Students will need to implement these features
  createCourtLines()
  createBasketball()
  createBaskets()
  createScoreboards()
}

function createCourtLines() {
  // this is for the court markings - white lines as requested in the guidelines 

  // center line
  const centerLineGeometry = new THREE.BoxGeometry(0.2, 0.01, 15);
  const centerLineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const centerLine = new THREE.Mesh(centerLineGeometry, centerLineMaterial);
  centerLine.position.set(0, 0.1, 0);
  scene.add(centerLine);
  
  // center circle
  const centerCircleGeometry = new THREE.RingGeometry(3.8, 4, 32); 
  const centerCircleMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
  const centerCircle = new THREE.Mesh(centerCircleGeometry, centerCircleMaterial);
  centerCircle.position.set(0, 0.12, 0);
  centerCircle.rotation.x = -Math.PI / 2;
  scene.add(centerCircle)

  // the three point arcs for both sides
  const arcMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide})

  //left arc (negative x)
  const leftArcGeometry = new THREE.RingGeometry(6, 6.2, 32, 0, 1.5*Math.PI, Math.PI);
  const leftArc = new THREE.Mesh(leftArcGeometry, arcMaterial);
  leftArc.position.set(-13, 0.12, 0);
  leftArc.rotation.x = -Math.PI / 2;
  scene.add(leftArc);

  //right arc (positive x)
  const rightArcGeometry = new THREE.RingGeometry(6, 6.2, 32, 0, 0.5*Math.PI, Math.PI);
  const rightArc = new THREE.Mesh(rightArcGeometry, arcMaterial);
  rightArc.position.set(13, 0.12, 0);
  rightArc.rotation.x = -Math.PI / 2;
  scene.add(rightArc);

  //will add small lines to connect the arc to the end of the court 
  const connectiveLineGeometry = new THREE.BoxGeometry(2, 0, 0.2)
  const connectiveLineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

  const conLineOne = new THREE.Mesh(connectiveLineGeometry, connectiveLineMaterial)
  conLineOne.position.set(14, 0.11, 6.1)
  const conLineTwo = new THREE.Mesh(connectiveLineGeometry, connectiveLineMaterial)
  conLineTwo.position.set(14, 0.11, -6.1)
  const conLineThree = new THREE.Mesh(connectiveLineGeometry, connectiveLineMaterial)
  conLineThree.position.set(-14, 0.11, 6.1)
  const conLineFour = new THREE.Mesh(connectiveLineGeometry, connectiveLineMaterial)
  conLineFour.position.set(-14, 0.11, -6.1)

  scene.add(conLineOne)
  scene.add(conLineTwo)
  scene.add(conLineThree)
  scene.add(conLineFour)

  //will add white lines to indicate the end of the real court and the out of bounds area 
  //the 2 shorter lines
  const outOfBoundsLengthLineGeometry = new THREE.BoxGeometry(0.2, 0.01, 15);
  const outOfBoundsLengthLineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const outOfBoundsLineOne = new THREE.Mesh(outOfBoundsLengthLineGeometry, outOfBoundsLengthLineMaterial);
  outOfBoundsLineOne.position.set(15, 0.1, 0);
  const outOfBoundsLineTwo = new THREE.Mesh(outOfBoundsLengthLineGeometry, outOfBoundsLengthLineMaterial);
  outOfBoundsLineTwo.position.set(-15, 0.1, 0);

  //the 2 longer lines
  const outOfBoundsWidthLineGeometry = new THREE.BoxGeometry(30, 0.01, 0.2);
  const outOfBoundsWidthLineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const outOfBoundsLineThree = new THREE.Mesh(outOfBoundsWidthLineGeometry, outOfBoundsWidthLineMaterial);
  outOfBoundsLineThree.position.set(0, 0.1, 7.5);
  const outOfBoundsLineFour = new THREE.Mesh(outOfBoundsWidthLineGeometry, outOfBoundsWidthLineMaterial);
  outOfBoundsLineFour.position.set(0, 0.1, -7.5);

  scene.add(outOfBoundsLineOne);
  scene.add(outOfBoundsLineTwo);
  scene.add(outOfBoundsLineThree);
  scene.add(outOfBoundsLineFour);

  //we will create additional marking for the bonus lol 
  //free throw line
  const freeThrowLineGeometry = new THREE.BoxGeometry(0.2, 0.01, 5);
  const freeThrowLineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

  const freeThrowLineOne = new THREE.Mesh(freeThrowLineGeometry, freeThrowLineMaterial);
  freeThrowLineOne.position.set(10, 0.1, 0);
  const freeThrowLineTwo = new THREE.Mesh(freeThrowLineGeometry, freeThrowLineMaterial);
  freeThrowLineTwo.position.set(-10, 0.1, 0);

  scene.add(freeThrowLineOne);
  scene.add(freeThrowLineTwo);

  //lines of the rest of the free throw rectangle
  const extraLineGeometry = new THREE.BoxGeometry(5, 0.01, 0.2);
  const extraLineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

  //positive x
  const extraLineOne = new THREE.Mesh(extraLineGeometry, extraLineMaterial);
  extraLineOne.position.set(12.5, 0.1, 2.5);
  const extraLineTwo = new THREE.Mesh(extraLineGeometry, extraLineMaterial);
  extraLineTwo.position.set(12.5, 0.1, -2.5);

  scene.add(extraLineOne);
  scene.add(extraLineTwo);

  //negative x
  const extraLineThree = new THREE.Mesh(extraLineGeometry, extraLineMaterial);
  extraLineThree.position.set(-12.5, 0.1, 2.5);
  const extraLineFour = new THREE.Mesh(extraLineGeometry, extraLineMaterial);
  extraLineFour.position.set(-12.5, 0.1, -2.5);

  scene.add(extraLineThree);
  scene.add(extraLineFour);
}

function createBasketball() {
  // this will create the actual ball with leather texture
  const BasketballGeometry = new THREE.SphereGeometry(0.5, 32, 16);

  const textureLoader = new THREE.TextureLoader();
  
  // Load leather texture maps
  const leatherAlbedo = textureLoader.load('src/textures/brown-leather_albedo.png');
  const leatherNormal = textureLoader.load('src/textures/brown-leather_normal-ogl.png');
  const leatherAO = textureLoader.load('src/textures/brown-leather_ao.png');
  
  const BasketballMaterial = new THREE.MeshPhongMaterial({
  map: leatherAlbedo,
  normalMap: leatherNormal,
  aoMap: leatherAO,
  color: 0xff6600,
  emissive: 0xffa431,
  shininess: 5
  });
  
  const Basketball = new THREE.Mesh(BasketballGeometry, BasketballMaterial);
  Basketball.position.set(0, 2, 0);
  Basketball.castShadow = true;
  scene.add(Basketball);
  
  // this will create the lines - important: dont use scene.add() - use basketball.add to make the basketball the parent of the lines
  // this will make it so the lines are in the local coordinates of the basketball instead of the global coordinates
  // and they will move with the ball when it moves 
  // we will use 3 cylinders that surround the ball 
  const ballRingGeometry = new THREE.CylinderGeometry(0.502, 0.502, 0.02, 32, 1, true);
  const ballRingMaterial = new THREE.MeshBasicMaterial({color: 0x000000}); 
  const ballRingOne = new THREE.Mesh(ballRingGeometry, ballRingMaterial);
  const ballRingTwo = new THREE.Mesh(ballRingGeometry, ballRingMaterial);
  const ballRingThree = new THREE.Mesh(ballRingGeometry, ballRingMaterial);
  ballRingTwo.rotation.z = Math.PI / 3;
  ballRingThree.rotation.z = 2 * Math.PI / 3;

  Basketball.add(ballRingOne);
  Basketball.add(ballRingTwo);
  Basketball.add(ballRingThree);
}

function createBaskets() {
  // this creates the baskets which are all connected to the base
  // the direction the basket is facing is decided by the x axis (using "direction" variable)
  createSingleBasket(16.1, 0, 0);
  createSingleBasket(-16.1, 0, 0);
}

function createSingleBasket(baseX, baseY, baseZ) {
  // Create a group to hold all basket components
  const basketGroup = new THREE.Group();
  basketGroup.position.set(baseX, baseY, baseZ);
  
  //this is the base - FOUNDATION OBJECT (at group origin)
  const basketBaseGeometry = new THREE.BoxGeometry(2, 0.5, 2);
  const basketBaseMaterial = new THREE.MeshPhongMaterial({color: 0x044ca4, shininess: 100});
  const basketBase = new THREE.Mesh(basketBaseGeometry, basketBaseMaterial);
  basketBase.position.set(0, 0.25, 0); // Half height above ground
  basketBase.castShadow = true;
  basketGroup.add(basketBase);

  //this is the support pole - relative to base
  const basketPoleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 4.7, 32);
  const basketPoleMaterial = new THREE.MeshPhongMaterial({color: 0x044ca4, shininess: 100});
  const basketPole = new THREE.Mesh(basketPoleGeometry, basketPoleMaterial);
  basketPole.position.set(0, 2.85, 0);
  basketPole.castShadow = true;
  basketGroup.add(basketPole);

  // Determine direction multiplier for left/right baskets
  const direction = baseX > 0 ? 1 : -1; // 1 for right basket, -1 for left basket
  
  //this is the horizontal connector between the pole and the board
  const basketConnectorGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 32);
  const basketConnectorMaterial = new THREE.MeshPhongMaterial({color: 0x044ca4, shininess: 100});
  
  const basketConnectorHorizontal = new THREE.Mesh(basketConnectorGeometry, basketConnectorMaterial);
  basketConnectorHorizontal.position.set(-0.8 * direction, 5.0, 0);
  basketConnectorHorizontal.rotation.z = Math.PI / 2 * direction;
  basketConnectorHorizontal.castShadow = true;
  basketGroup.add(basketConnectorHorizontal);

  //this is the diagonal support connector
  const basketConnectorDiagonal = new THREE.Mesh(basketConnectorGeometry, basketConnectorMaterial);
  basketConnectorDiagonal.position.set(-0.8 * direction, 4.3, 0);
  basketConnectorDiagonal.rotation.z = Math.PI / 4 * direction;
  basketConnectorDiagonal.castShadow = true;
  basketGroup.add(basketConnectorDiagonal);

  //this is the base connector between the poles and the board
  const boardConnectorGeometry = new THREE.BoxGeometry(0.3, 1, 1);
  const boardConnectorMaterial = new THREE.MeshPhongMaterial({color: 0x044ca4, shininess: 100});
  const boardConnector = new THREE.Mesh(boardConnectorGeometry, boardConnectorMaterial);
  boardConnector.position.set(-1.9 * direction, 5.0, 0); 
  boardConnector.castShadow = true;
  basketGroup.add(boardConnector);

  //this is the board - relative to base
  const basketBoardGeometry = new THREE.BoxGeometry(0.1, 3, 4);
  const basketBoardMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, transparent: true, opacity: 0.40});
  const basketBoard = new THREE.Mesh(basketBoardGeometry, basketBoardMaterial);
  basketBoard.position.set(-2.1 * direction, 5.0, 0);
  basketBoard.castShadow = true;
  basketGroup.add(basketBoard);

  // Board markings - small square (relative to board)
  const smallParallelMarkingGeometry = new THREE.BoxGeometry(0.1, 0.2, 1.1); 
  const smallParallelMarkingMaterial = new THREE.MeshBasicMaterial({color: 0xffffff}); 
  
  const smallParallelMarkingTop = new THREE.Mesh(smallParallelMarkingGeometry, smallParallelMarkingMaterial); 
  smallParallelMarkingTop.position.set(-2.1 * direction, 5.5, 0); 
  basketGroup.add(smallParallelMarkingTop);
  
  const smallParallelMarkingBottom = new THREE.Mesh(smallParallelMarkingGeometry, smallParallelMarkingMaterial); 
  smallParallelMarkingBottom.position.set(-2.1 * direction, 4.5, 0);
  basketGroup.add(smallParallelMarkingBottom);

  const smallPerpMarkingGeometry = new THREE.BoxGeometry(0.1, 1.1, 0.2); 
  const smallPerpMarkingMaterial = new THREE.MeshBasicMaterial({color: 0xffffff}); 
  
  const smallPerpMarkingLeft = new THREE.Mesh(smallPerpMarkingGeometry, smallPerpMarkingMaterial); 
  smallPerpMarkingLeft.position.set(-2.1 * direction, 5.0, 0.5);
  basketGroup.add(smallPerpMarkingLeft);
  
  const smallPerpMarkingRight = new THREE.Mesh(smallPerpMarkingGeometry, smallPerpMarkingMaterial); 
  smallPerpMarkingRight.position.set(-2.1 * direction, 5.0, -0.5);
  basketGroup.add(smallPerpMarkingRight);

  // Board markings - large square (outer border)
  const bigParallelMarkingGeometry = new THREE.BoxGeometry(0.1, 0.2, 4.1); 
  const bigParallelMarkingMaterial = new THREE.MeshBasicMaterial({color: 0xffffff}); 
  
  const bigParallelMarkingTop = new THREE.Mesh(bigParallelMarkingGeometry, bigParallelMarkingMaterial); 
  bigParallelMarkingTop.position.set(-2.1 * direction, 6.5, 0);
  basketGroup.add(bigParallelMarkingTop);
  
  const bigParallelMarkingBottom = new THREE.Mesh(bigParallelMarkingGeometry, bigParallelMarkingMaterial); 
  bigParallelMarkingBottom.position.set(-2.1 * direction, 3.5, 0);
  basketGroup.add(bigParallelMarkingBottom);

  const bigPerpMarkingGeometry = new THREE.BoxGeometry(0.1, 3.1, 0.2); 
  const bigPerpMarkingMaterial = new THREE.MeshBasicMaterial({color: 0xffffff}); 
  
  const bigPerpMarkingLeft = new THREE.Mesh(bigPerpMarkingGeometry, bigPerpMarkingMaterial); 
  bigPerpMarkingLeft.position.set(-2.1 * direction, 5.0, 2);
  basketGroup.add(bigPerpMarkingLeft);
  
  const bigPerpMarkingRight = new THREE.Mesh(bigPerpMarkingGeometry, bigPerpMarkingMaterial); 
  bigPerpMarkingRight.position.set(-2.1 * direction, 5.0, -2);
  basketGroup.add(bigPerpMarkingRight);

  //this is the rim - relative to base
  const rimGeometry = new THREE.TorusGeometry(0.7, 0.1, 16, 100); 
  const rimMaterial = new THREE.MeshPhongMaterial({color: 0xff8f19, shininess: 100}); 
  const rim = new THREE.Mesh(rimGeometry, rimMaterial);
  rim.position.set(-3.1 * direction, 4.3, 0);
  rim.rotation.x = Math.PI / 2;
  rim.castShadow = true;
  basketGroup.add(rim);

  // rim to board connector - relative to rim
  const rimConnectorGeometry = new THREE.BoxGeometry(0.1, 0.7, 0.8);
  const rimConnectorMaterial = new THREE.MeshPhongMaterial({color: 0xff8f19, shininess: 100});
  const rimConnector = new THREE.Mesh(rimConnectorGeometry, rimConnectorMaterial);
  rimConnector.position.set(-2.2 * direction, 4.1, 0);
  rimConnector.castShadow = true;
  basketGroup.add(rimConnector);

  // rim support beams - relative to rim
  const rimSupportGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 32); 
  const rimSupportMaterial = new THREE.MeshPhongMaterial({color: 0xff8f19, shininess: 100}); 

  const rimSupportOne = new THREE.Mesh(rimSupportGeometry, rimSupportMaterial);
  rimSupportOne.position.set(-2.5 * direction, 4.0, 0.5);
  rimSupportOne.rotation.z = Math.PI / 3 * direction;
  rimSupportOne.rotation.y = Math.PI / 8;
  rimSupportOne.castShadow = true;
  basketGroup.add(rimSupportOne);

  const rimSupportTwo = new THREE.Mesh(rimSupportGeometry, rimSupportMaterial);
  rimSupportTwo.position.set(-2.5 * direction, 4.0, -0.5);
  rimSupportTwo.rotation.z = Math.PI / 3 * direction;
  rimSupportTwo.rotation.y = -Math.PI / 8;
  rimSupportTwo.castShadow = true;
  basketGroup.add(rimSupportTwo);

  //this is the net - relative to rim
  const netGeometry = new THREE.CylinderGeometry(0.7, 0.5, 1.2, 16, 1, true); 
  const netMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true}); 
  const net = new THREE.Mesh(netGeometry, netMaterial);
  net.position.set(-3.1 * direction, 3.6, 0);
  basketGroup.add(net);

  scene.add(basketGroup);
}


function createScoreboards() {
  createSingleScoreboard(19, 0, 0);
  createSingleScoreboard(-19, 0, 0);
}

function createSingleScoreboard(baseX, baseY, baseZ) {
  // Create a group to hold all scoreboard components
  const scoreboardGroup = new THREE.Group();
  scoreboardGroup.position.set(baseX, baseY, baseZ);

  // rotate them to face the court
  scoreboardGroup.rotation.y = Math.PI / 2; // 90 degrees for both sides
  
  // Determine direction multiplier for left/right scoreboards
  const direction = baseX > 0 ? 1 : -1; // 1 for right, -1 for left
  
  //this is the base
  const scoreboardBaseGeometry = new THREE.BoxGeometry(3, 0.6, 3);
  const scoreboardBaseMaterial = new THREE.MeshPhongMaterial({color: 0x333333, shininess: 80});
  const scoreboardBase = new THREE.Mesh(scoreboardBaseGeometry, scoreboardBaseMaterial);
  scoreboardBase.position.set(0, 0.3, 0); // Half height above ground
  scoreboardBase.castShadow = true;
  scoreboardGroup.add(scoreboardBase);

  //these are the two support poles
  const poleGeometry = new THREE.CylinderGeometry(0.25, 0.25, 8, 32);
  const poleMaterial = new THREE.MeshPhongMaterial({color: 0x444444, shininess: 100});
  
  // Left pole
  const poleLeft = new THREE.Mesh(poleGeometry, poleMaterial);
  poleLeft.position.set(-0.8, 4.3, 0); // Left side, halfway up
  poleLeft.castShadow = true;
  scoreboardGroup.add(poleLeft);
  
  // Right pole
  const poleRight = new THREE.Mesh(poleGeometry, poleMaterial);
  poleRight.position.set(0.8, 4.3, 0); // Right side, halfway up
  poleRight.castShadow = true;
  scoreboardGroup.add(poleRight);

  //horizontal support part between poles
  const horizontalSupportGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.8, 16);
  const horizontalSupportMaterial = new THREE.MeshPhongMaterial({color: 0x444444, shininess: 100});
  const horizontalSupport = new THREE.Mesh(horizontalSupportGeometry, horizontalSupportMaterial);
  horizontalSupport.position.set(0, 6, 0);
  horizontalSupport.rotation.z = Math.PI / 2;
  horizontalSupport.castShadow = true;
  scoreboardGroup.add(horizontalSupport);

  //connectors from poles to scoreboard
  const connectorGeometry = new THREE.BoxGeometry(0.3, 0.8, 0.3);
  const connectorMaterial = new THREE.MeshPhongMaterial({color: 0x555555, shininess: 100});
  
  const connectorLeft = new THREE.Mesh(connectorGeometry, connectorMaterial);
  connectorLeft.position.set(-0.8, 7.8, -0.5 * direction);
  connectorLeft.castShadow = true;
  scoreboardGroup.add(connectorLeft);
  
  const connectorRight = new THREE.Mesh(connectorGeometry, connectorMaterial);
  connectorRight.position.set(0.8, 7.8, -0.5 * direction);
  connectorRight.castShadow = true;
  scoreboardGroup.add(connectorRight);

  //this is the main scoreboard body
  const scoreboardBodyGeometry = new THREE.BoxGeometry(4, 2.5, 0.3);
  const scoreboardBodyMaterial = new THREE.MeshPhongMaterial({color: 0x1a1a1a, shininess: 50});
  const scoreboardBody = new THREE.Mesh(scoreboardBodyGeometry, scoreboardBodyMaterial);
  scoreboardBody.position.set(0, 8, -0.8 * direction); 
  scoreboardBody.castShadow = true;
  scoreboardGroup.add(scoreboardBody);

  //red team score section
  const redSectionGeometry = new THREE.BoxGeometry(1.8, 2.2, 0.31);
  const redSectionMaterial = new THREE.MeshPhongMaterial({color: 0xcc0000, shininess: 80});
  const redSection = new THREE.Mesh(redSectionGeometry, redSectionMaterial);
  redSection.position.set(-1, 8, -0.82 * direction); // Left side
  scoreboardGroup.add(redSection);

  //blue team score section
  const blueSectionGeometry = new THREE.BoxGeometry(1.8, 2.2, 0.31);
  const blueSectionMaterial = new THREE.MeshPhongMaterial({color: 0x0066cc, shininess: 80});
  const blueSection = new THREE.Mesh(blueSectionGeometry, blueSectionMaterial);
  blueSection.position.set(1, 8, -0.82 * direction); // Right side
  scoreboardGroup.add(blueSection);

  //center divider
  const dividerGeometry = new THREE.BoxGeometry(0.1, 2.2, 0.32);
  const dividerMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, shininess: 100});
  const divider = new THREE.Mesh(dividerGeometry, dividerMaterial);
  divider.position.set(0, 8, -0.82 * direction);
  scoreboardGroup.add(divider);

  //score display areas
  const scoreDisplayGeometry = new THREE.BoxGeometry(1.4, 1.6, 0.32);
  const scoreDisplayMaterial = new THREE.MeshPhongMaterial({color: 0x000000, shininess: 10});
  
  // Red team score display
  const redScoreDisplay = new THREE.Mesh(scoreDisplayGeometry, scoreDisplayMaterial);
  redScoreDisplay.position.set(-1, 8, -0.83 * direction);
  scoreboardGroup.add(redScoreDisplay);
  
  // Blue team score display
  const blueScoreDisplay = new THREE.Mesh(scoreDisplayGeometry, scoreDisplayMaterial);
  blueScoreDisplay.position.set(1, 8, -0.83 * direction);
  scoreboardGroup.add(blueScoreDisplay);

  //team color plates
  const colorPlateGeometry = new THREE.BoxGeometry(1.6, 0.4, 0.32);
  const redColorPlateMaterial = new THREE.MeshPhongMaterial({color: 0x880000, shininess: 100});
  const blueColorPlateMaterial = new THREE.MeshPhongMaterial({color: 0x004488, shininess: 100});
  
  // Red team plate
  const redColorPlate = new THREE.Mesh(colorPlateGeometry, redColorPlateMaterial);
  redColorPlate.position.set(-1, 9, -0.83 * direction);
  scoreboardGroup.add(redColorPlate);
  
  // Blue team plate
  const blueColorPlate = new THREE.Mesh(colorPlateGeometry, blueColorPlateMaterial);
  blueColorPlate.position.set(1, 9, -0.83 * direction);
  scoreboardGroup.add(blueColorPlate);

  //decorative corner accents
  const accentGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.33);
  const accentMaterial = new THREE.MeshPhongMaterial({color: 0xffd700, shininess: 120});
  
  // Four corner accents
  const positions = [
    [-1.9, 9.15], [1.9, 9.15], // Top corners
    [-1.9, 6.85], [1.9, 6.85]  // Bottom corners
  ];
  
  positions.forEach(([x, y]) => {
    const accent = new THREE.Mesh(accentGeometry, accentMaterial);
    accent.position.set(x, y, -0.84 * direction);
    scoreboardGroup.add(accent);
  });

  //LED strip around scoreboard (simulated with thin boxes)
  const ledStripMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ffff, 
    emissive: 0x004444, 
    shininess: 150
  });
  
  // Top LED strip
  const topLEDGeometry = new THREE.BoxGeometry(4.2, 0.1, 0.33);
  const topLED = new THREE.Mesh(topLEDGeometry, ledStripMaterial);
  topLED.position.set(0, 9.3, -0.84 * direction);
  scoreboardGroup.add(topLED);
  
  // Bottom LED strip
  const bottomLED = new THREE.Mesh(topLEDGeometry, ledStripMaterial);
  bottomLED.position.set(0, 6.7, -0.84 * direction);
  scoreboardGroup.add(bottomLED);

  //mounting brackets (decorative)
  const bracketGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.4);
  const bracketMaterial = new THREE.MeshPhongMaterial({color: 0x666666, shininess: 80});
  
  const bracketLeft = new THREE.Mesh(bracketGeometry, bracketMaterial);
  bracketLeft.position.set(-0.8, 7.8, -0.3 * direction);
  bracketLeft.castShadow = true;
  scoreboardGroup.add(bracketLeft);
  
  const bracketRight = new THREE.Mesh(bracketGeometry, bracketMaterial);
  bracketRight.position.set(0.8, 7.8, -0.3 * direction);
  bracketRight.castShadow = true;
  scoreboardGroup.add(bracketRight);

  // Add the complete scoreboard assembly to the scene
  scene.add(scoreboardGroup);
}



// Create all elements
createBasketballCourt();

// Set camera position for better view
const cameraTranslate = new THREE.Matrix4();
cameraTranslate.makeTranslation(0, 15, 30);
camera.applyMatrix4(cameraTranslate);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
let isOrbitEnabled = true;

// Score display
const scoreElement = document.createElement('div');
scoreElement.style.position = 'absolute';
scoreElement.style.bottom = '120px';
scoreElement.style.left = '20px';
scoreElement.style.color = 'white';
scoreElement.style.fontSize = '16px';
scoreElement.style.fontFamily = 'Arial, sans-serif';
scoreElement.style.border = '2px solid white';
scoreElement.style.padding = '15px';
scoreElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
scoreElement.style.borderRadius = '5px';
scoreElement.style.width = '200px';
scoreElement.style.height = 'auto';
scoreElement.style.boxSizing = 'border-box';
scoreElement.style.wordWrap = 'break-word';
scoreElement.style.overflow = 'visible';

scoreElement.innerHTML = `
  <h3 style="margin: 0 0 10px 0;">Score:</h3>
  <p style="margin: 0;">Player Score Variable - added later</p>
`;
document.body.appendChild(scoreElement);

// Instructions display
const instructionsElement = document.createElement('div');
instructionsElement.style.position = 'absolute';
instructionsElement.style.bottom = '20px';
instructionsElement.style.left = '20px';
instructionsElement.style.color = 'white';
instructionsElement.style.fontSize = '16px';
instructionsElement.style.fontFamily = 'Arial, sans-serif';
instructionsElement.style.textAlign = 'left';
instructionsElement.style.border = '2px solid white';
instructionsElement.style.padding = '15px';
instructionsElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
instructionsElement.style.borderRadius = '5px';
instructionsElement.style.width = '200px';
instructionsElement.style.height = 'auto';
instructionsElement.style.boxSizing = 'border-box';
instructionsElement.style.wordWrap = 'break-word';
instructionsElement.style.overflow = 'visible';

instructionsElement.innerHTML = `
  <h3 style="margin: 0 0 10px 0;">Controls:</h3>
  <p style="margin: 0;">O - Toggle orbit camera</p>
`;
document.body.appendChild(instructionsElement);



// Handle key events
function handleKeyDown(e) {
  if (e.key === "o") {
    isOrbitEnabled = !isOrbitEnabled;
  }
}

document.addEventListener('keydown', handleKeyDown);

// Animation function
function animate() {
  requestAnimationFrame(animate);
  
  // Update controls
  controls.enabled = isOrbitEnabled;
  controls.update();
  
  renderer.render(scene, camera);
}

function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', handleResize);

animate();