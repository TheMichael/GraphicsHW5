import {OrbitControls} from './OrbitControls.js'

const scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper(20);
scene.add(axesHelper);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Set background color
scene.background = new THREE.Color(0x000000);

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 15);
scene.add(directionalLight);

// Enable shadows
renderer.shadowMap.enabled = true;
directionalLight.castShadow = true;

function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi/180);
}

// Create basketball court
function createBasketballCourt() {
  // Court floor - just a simple brown surface
  const courtGeometry = new THREE.BoxGeometry(30, 0.2, 15);
  const courtMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xc68642,  // Brown wood color
    shininess: 50
  });
  const court = new THREE.Mesh(courtGeometry, courtMaterial);
  court.receiveShadow = true;
  scene.add(court);

  //this is the out of bounds area where the base of the basket will be
  const outOfBoundsCourtPartGeometry = new THREE.BoxGeometry(36, 0.1, 18)
  const outOfBoundsCourtPartMaterial = new THREE.MeshPhongMaterial({ color: 0xffbc4d, shininess: 50 });
  const outOfBoundsCourt = new THREE.Mesh(outOfBoundsCourtPartGeometry, outOfBoundsCourtPartMaterial);
  outOfBoundsCourt.receiveShadow = true;
  scene.add(outOfBoundsCourt);

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

  // Note: All court lines, hoops, and other elements have been removed
  // Students will need to implement these features
  createCourtLines()
  createBasketball()
  createBaskets()
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
}

function createBasketball() {
  // this will create the actual ball 
  const BasketballGeometry = new THREE.SphereGeometry(0.5, 32, 16); 
  const BasketballMaterial = new THREE.MeshBasicMaterial({color: 0xd35400}); 
  const Basketball = new THREE.Mesh(BasketballGeometry, BasketballMaterial);
  Basketball.position.set(0, 2, 0)
  scene.add(Basketball)
  
  // this will create the lines - important: dont use scene.add() - use basketball.add to make the basketball the parent of the lines
  // this will make it so the lines are in the local coordinates of the basketball instead of the global coordinates
  // and they will move with the ball when it moves 
  // we will use 3 cylinders that surround the ball 
  const ballRingGeometry = new THREE.CylinderGeometry(0.51, 0.51, 0.02, 32, 1, true);
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
  //we will create a base, a pole, a board, a ring and a net 
  // everything is double and mirrored for two side of the court 

  //this is the base 
  const basketBaseGeometry = new THREE.BoxGeometry(2, 0.5, 2);
  const basketBaseMaterial = new THREE.MeshPhongMaterial({color: 0x044ca4, shininess: 100});

  const basketBaseOne = new THREE.Mesh(basketBaseGeometry, basketBaseMaterial);
  basketBaseOne.position.set(16.1, 0, 0);

  const basketBaseTwo = new THREE.Mesh(basketBaseGeometry, basketBaseMaterial);
  basketBaseTwo.position.set(-16.1, 0, 0);

  scene.add(basketBaseOne);
  scene.add(basketBaseTwo);

  //this is the support pole
  const basketPoleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 4.7, 32);
  const basketPoleMaterial = new THREE.MeshPhongMaterial({color: 0x044ca4, shininess: 100});

  const basketPoleOne = new THREE.Mesh(basketPoleGeometry, basketPoleMaterial);
  basketPoleOne.position.set(16.1, 2.5, 0);

  const basketPoleTwo = new THREE.Mesh(basketPoleGeometry, basketPoleMaterial);
  basketPoleTwo.position.set(-16.1, 2.5, 0);

  scene.add(basketPoleOne);
  scene.add(basketPoleTwo);

  //this is the connector between the pole and the board, and a support 45 degree cylinder
  const basketConnectorGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 32);
  const basketConnectorMaterial = new THREE.MeshPhongMaterial({color: 0x044ca4, shininess: 100});

  const basketConnectorOne = new THREE.Mesh(basketConnectorGeometry, basketConnectorMaterial);
  basketConnectorOne.position.set(15.3, 4.7, 0);

  const basketConnectorTwo = new THREE.Mesh(basketConnectorGeometry, basketConnectorMaterial);
  basketConnectorTwo.position.set(-15.3, 4.7, 0);

  basketConnectorOne.rotation.z = Math.PI / 2;
  basketConnectorTwo.rotation.z = -Math.PI / 2;

  const basketConnectorThree = new THREE.Mesh(basketConnectorGeometry, basketConnectorMaterial);
  basketConnectorThree.position.set(15.3, 4, 0);

  const basketConnectorFour = new THREE.Mesh(basketConnectorGeometry, basketConnectorMaterial);
  basketConnectorFour.position.set(-15.3, 4, 0);

  basketConnectorThree.rotation.z = Math.PI / 4;
  basketConnectorFour.rotation.z = -Math.PI / 4;

  scene.add(basketConnectorOne);
  scene.add(basketConnectorTwo);
  scene.add(basketConnectorThree);
  scene.add(basketConnectorFour);

  //this is the base connector between the poles and the board
  const boardConnectorGeometry = new THREE.BoxGeometry(0.3, 1, 1);
  const boardConnectorMaterial = new THREE.MeshPhongMaterial({color: 0x044ca4, shininess: 100});

  const boardConnectorOne = new THREE.Mesh(boardConnectorGeometry, boardConnectorMaterial);
  boardConnectorOne.position.set(14.2, 4.7, 0);

  const boardConnectorTwo = new THREE.Mesh(boardConnectorGeometry, boardConnectorMaterial);
  boardConnectorTwo.position.set(-14.2, 4.7, 0);

  scene.add(boardConnectorOne);
  scene.add(boardConnectorTwo);
  

  //this is the board 
  const basketBoardGeometry = new THREE.BoxGeometry(0.1, 3, 4);
  const basketBoardMaterial = new THREE.MeshPhongMaterial({color: 0xa9a9a9, transparent: true, opacity: 0.40});

  const basketBoardOne = new THREE.Mesh(basketBoardGeometry, basketBoardMaterial);
  basketBoardOne.position.set(14, 4.7, 0);
  const basketBoardTwo = new THREE.Mesh(basketBoardGeometry, basketBoardMaterial);
  basketBoardTwo.position.set(-14, 4.7, 0);

  scene.add(basketBoardOne);
  scene.add(basketBoardTwo);


  //this is the marking on the board itself - the white square in the middle of the board
  
  //the positive x board
  //the parallel to the y axis
  const smallParallelMarkingOneGeometry = new THREE.BoxGeometry(0.1, 0.2, 1.1); 
  const smallParallelMarkingOneMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} ); 

  const smallParallelMarkingOne = new THREE.Mesh(smallParallelMarkingOneGeometry, smallParallelMarkingOneMaterial); 
  smallParallelMarkingOne.position.set(14, 5.2, 0)
  const smallParallelMarkingTwo = new THREE.Mesh(smallParallelMarkingOneGeometry, smallParallelMarkingOneMaterial); 
  smallParallelMarkingTwo.position.set(14, 4.2, 0)

  scene.add(smallParallelMarkingOne)
  scene.add(smallParallelMarkingTwo)

  //the perpendicular to the y axis
  const smallPerpMarkingOneGeometry = new THREE.BoxGeometry(0.1, 1.1, 0.2); 
  const smallPerpMarkingOneMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} ); 

  const smallPerpMarkingOne = new THREE.Mesh(smallPerpMarkingOneGeometry, smallPerpMarkingOneMaterial); 
  smallPerpMarkingOne.position.set(14, 4.7, 0.5)
  const smallPerpMarkingTwo = new THREE.Mesh(smallPerpMarkingOneGeometry, smallPerpMarkingOneMaterial); 
  smallPerpMarkingTwo.position.set(14, 4.7, -0.5)

  scene.add(smallPerpMarkingOne)
  scene.add(smallPerpMarkingTwo)

  //the negative x board
  //the parallel to the y axis
  const smallParallelMarkingthree = new THREE.Mesh(smallParallelMarkingOneGeometry, smallParallelMarkingOneMaterial); 
  smallParallelMarkingthree.position.set(-14, 5.2, 0)
  const smallParallelMarkingfour = new THREE.Mesh(smallParallelMarkingOneGeometry, smallParallelMarkingOneMaterial); 
  smallParallelMarkingfour.position.set(-14, 4.2, 0)

  scene.add(smallParallelMarkingthree)
  scene.add(smallParallelMarkingfour)

  //the perpendicular to the y axis
  const smallPerpMarkingthree = new THREE.Mesh(smallPerpMarkingOneGeometry, smallPerpMarkingOneMaterial); 
  smallPerpMarkingthree.position.set(-14, 4.7, 0.5)
  const smallPerpMarkingFour = new THREE.Mesh(smallPerpMarkingOneGeometry, smallPerpMarkingOneMaterial); 
  smallPerpMarkingFour.position.set(-14, 4.7, -0.5)

  scene.add(smallPerpMarkingthree)
  scene.add(smallPerpMarkingFour)






  
  //the positive x board
  //the parallel to the y axis
  const bigParallelMarkingOneGeometry = new THREE.BoxGeometry(0.1, 0.2, 4.1); 
  const bigParallelMarkingOneMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} ); 

  const bigParallelMarkingOne = new THREE.Mesh(bigParallelMarkingOneGeometry, bigParallelMarkingOneMaterial); 
  bigParallelMarkingOne.position.set(14, 6.2, 0)
  const bigParallelMarkingTwo = new THREE.Mesh(bigParallelMarkingOneGeometry, bigParallelMarkingOneMaterial); 
  bigParallelMarkingTwo.position.set(14, 3.2, 0)

  scene.add(bigParallelMarkingOne)
  scene.add(bigParallelMarkingTwo)

  //the perpendicular to the y axis
  const bigPerpMarkingOneGeometry = new THREE.BoxGeometry(0.1, 3.1, 0.2); 
  const bigPerpMarkingOneMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} ); 

  const bigPerpMarkingOne = new THREE.Mesh(bigPerpMarkingOneGeometry, bigPerpMarkingOneMaterial); 
  bigPerpMarkingOne.position.set(14, 4.7, 2)
  const bigPerpMarkingTwo = new THREE.Mesh(bigPerpMarkingOneGeometry, bigPerpMarkingOneMaterial); 
  bigPerpMarkingTwo.position.set(14, 4.7, -2)

  scene.add(bigPerpMarkingOne)
  scene.add(bigPerpMarkingTwo)

  //the negative x board
  //the parallel to the y axis
  const bigParallelMarkingthree = new THREE.Mesh(bigParallelMarkingOneGeometry, bigParallelMarkingOneMaterial); 
  bigParallelMarkingthree.position.set(-14, 6.2, 0)
  const bigParallelMarkingfour = new THREE.Mesh(bigParallelMarkingOneGeometry, bigParallelMarkingOneMaterial); 
  bigParallelMarkingfour.position.set(-14, 3.2, 0)

  scene.add(bigParallelMarkingthree)
  scene.add(bigParallelMarkingfour)

  //the perpendicular to the y axis
  const bigPerpMarkingthree = new THREE.Mesh(bigPerpMarkingOneGeometry, bigPerpMarkingOneMaterial); 
  bigPerpMarkingthree.position.set(-14, 4.7, 2)
  const bigPerpMarkingFour = new THREE.Mesh(bigPerpMarkingOneGeometry, bigPerpMarkingOneMaterial); 
  bigPerpMarkingFour.position.set(-14, 4.7, -2)

  scene.add(bigPerpMarkingthree)
  scene.add(bigPerpMarkingFour)


  //this is the rim
  const rimGeometry = new THREE.TorusGeometry(0.7, 0.1, 16, 100); 
  const rimMaterial = new THREE.MeshPhongMaterial({color: 0xff8f19, shininess: 100}); 

  const rimOne = new THREE.Mesh(rimGeometry, rimMaterial);
  rimOne.position.set(13, 4, 0);
  const rimTwo = new THREE.Mesh(rimGeometry, rimMaterial);
  rimTwo.position.set(-13, 4, 0);

  rimOne.rotation.x = Math.PI / 2;
  rimTwo.rotation.x = Math.PI / 2;

  scene.add(rimOne);
  scene.add(rimTwo);

  // there are metal support beams for the rim with a connector to the board
  //this is the rim to board connector
  const rimConnectorGeometry = new THREE.BoxGeometry(0.1, 0.7, 0.8);
  const rimConnectorMaterial = new THREE.MeshBasicMaterial( {color: 0xff8f19, shininess: 100} );

  const rimConnectorOne = new THREE.Mesh(rimConnectorGeometry, rimConnectorMaterial);
  rimConnectorOne.position.set(13.9, 3.8, 0)
  const rimConnectorTwo = new THREE.Mesh(rimConnectorGeometry, rimConnectorMaterial);
  rimConnectorTwo.position.set(-13.9, 3.8, 0)

  scene.add(rimConnectorOne)
  scene.add(rimConnectorTwo)
  
  //these are the small metal beams
  const rimSupportGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 32); 
  const rimSupportMaterial = new THREE.MeshBasicMaterial( {color: 0xff8f19, shininess: 100} ); 

  //for the positive x basket
  const rimSupportOne = new THREE.Mesh(rimSupportGeometry, rimSupportMaterial);
  rimSupportOne.position.set(13.6, 3.7, 0.5)
  rimSupportOne.rotation.z = Math.PI / 3
  rimSupportOne.rotation.y = Math.PI / 8

  const rimSupportTwo = new THREE.Mesh(rimSupportGeometry, rimSupportMaterial);
  rimSupportTwo.position.set(13.6, 3.7, -0.5)
  rimSupportTwo.rotation.z = Math.PI / 3
  rimSupportTwo.rotation.y = -Math.PI / 8

  scene.add(rimSupportOne)
  scene.add(rimSupportTwo)

  //for the negative x basket
  const rimSupportThree = new THREE.Mesh(rimSupportGeometry, rimSupportMaterial);
  rimSupportThree.position.set(-13.6, 3.7, 0.5)
  rimSupportThree.rotation.z = -Math.PI / 3
  rimSupportThree.rotation.y = -Math.PI / 8

  const rimSupportFour = new THREE.Mesh(rimSupportGeometry, rimSupportMaterial);
  rimSupportFour.position.set(-13.6, 3.7, -0.5)
  rimSupportFour.rotation.z = -Math.PI / 3
  rimSupportFour.rotation.y = Math.PI / 8

  scene.add(rimSupportThree)
  scene.add(rimSupportFour)


  //this is the net - i'll do a cylinder with unequal edge radii, hollow and wireframe
  const netGeometry = new THREE.CylinderGeometry(0.7, 0.5, 1.2, 32, 1, true); 
  const netMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true}); 

  const netOne = new THREE.Mesh( netGeometry, netMaterial );
  netOne.position.set(rimOne.position.x, 3.3, 0);
  const netTwo = new THREE.Mesh( netGeometry, netMaterial );
  netTwo.position.set(rimTwo.position.x, 3.3, 0);

  scene.add(netOne);
  scene.add(netTwo);
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

// Instructions display
const instructionsElement = document.createElement('div');
instructionsElement.style.position = 'absolute';
instructionsElement.style.bottom = '20px';
instructionsElement.style.left = '20px';
instructionsElement.style.color = 'white';
instructionsElement.style.fontSize = '16px';
instructionsElement.style.fontFamily = 'Arial, sans-serif';
instructionsElement.style.textAlign = 'left';
instructionsElement.innerHTML = `
  <h3>Controls:</h3>
  <p>O - Toggle orbit camera</p>
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

animate();