let renderer
var treeLength = 100;
var maxTreeLength = 100;
var MINUTES_TO_FULL_SIZE = .1;
MINUTES_TO_FULL_SIZE = MINUTES_TO_FULL_SIZE * 60000

var branchLengthRange = [.7, .9]
var ROTATION_RANGE_SLIDER;
var ROTATION_MODIFIER_SLIDER;
var ROTATION_WAVE = false;
var ROTATION_WAVE_BOX;

var SWAY_MODE = false;
var SWAY_MODE_SLIDER;


var HIDE_BRANCHES;

var TREE_SWITCHING = false;
var TREE_SWITCHING_BOX;

var TREES_PER_SEC = 20;
TREES_PER_SEC = 60 / TREES_PER_SEC

var EGG_MODE = false;
var EGG_MODE_BOX;

var THREE_D_MODE = true;
var THREE_D_MODE_BOX;
var LEAF_COLOR_PICKER;
var LEAF_OUTLINE_PICKER;
var BRANCH_COLOR_PICKER;
var BRANCH_TEXTURE = '';
var bg;
var branchShapeFunctions = [
  'cylinder(map(len, 10, 100, 0.5, 3.5) + BRANCH_RADIUS.value(), len + 2 + BRANCH_LENGTH.value())',
  'box(map(len, 10, 100, 0.5, 3.5) + BRANCH_RADIUS.value(), len + 2 + BRANCH_LENGTH.value())',
  'sphere(map(len, 10, 100, 0.5, 3.5) + BRANCH_RADIUS.value())',
  'ellipsoid(map(len, 10, 100, 0.5, 3.5) + BRANCH_RADIUS.value(), len + 2 + BRANCH_LENGTH.value())',
  'torus(map(len, 10, 100, 0.5, 3.5) + BRANCH_RADIUS.value(), len + 2 + BRANCH_LENGTH.value())'
];
var BRANCH_SHAPE = '0';

var BRANCH_RADIUS;
var BRANCH_LENGTH;

var LEAF_SIZE;
var LEAF_SIZE_X;
var LEAF_SIZE_Y;
var LEAF_SIZE_Z;

var leafShapeFunctions = [
  'cylinder(3.3 + LEAF_SIZE_X.value() + LEAF_SIZE.value(), 5.8 + LEAF_SIZE_Y.value() + LEAF_SIZE.value())',
  'box(3.3 + LEAF_SIZE_X.value() + LEAF_SIZE.value(), 5.8 + LEAF_SIZE_Y.value() + LEAF_SIZE.value(), 1.8 + LEAF_SIZE_Z.value() + LEAF_SIZE.value())',
  'sphere(3.3 + LEAF_SIZE.value())',
  'ellipsoid(3.3 + LEAF_SIZE_X.value() + LEAF_SIZE.value(), 5.8 + LEAF_SIZE_Y.value() + LEAF_SIZE.value(), 1.8 + LEAF_SIZE_Z.value() + LEAF_SIZE.value())',
];
var LEAF_SHAPE = '3';

var SPINNING;
var SPINNING_BOX;

var CAMERA_X;
var CAMERA_Y;
var CAMERA_Z;

var RANDOMIZE_VARIABLES;

function setup() {
  const controlsContainer = document.querySelector("#controls-container")
  renderer = createCanvas(windowWidth, windowHeight, WEBGL);
  renderer.parent("sketch")
  renderer.drawingContext.disable(renderer.drawingContext.DEPTH_TEST);
  angleMode(DEGREES)
  background('black');

  frameRate(60)

  ROTATION_RANGE_SLIDER = createSlider(0, 1000, 20, .001).parent(createDiv('Rotate Range').parent(controlsContainer));
  ROTATION_MODIFIER_SLIDER = createSlider(0, 360, 0, .001).parent(createDiv('Rotate Mod').parent(controlsContainer));

  EGG_MODE = createCheckbox('Egg Mode', false).parent(controlsContainer);

  THREE_D_MODE = createCheckbox('3D Mode', true).parent(controlsContainer);

  SPINNING = createCheckbox('Spinning (3D Only)', true).parent(controlsContainer);
  TREE_SWITCHING = createCheckbox('Tree Switching (2D only)', false).parent(controlsContainer);

  ROTATION_WAVE = createCheckbox('Rotation Wave', false).parent(controlsContainer);


  HIDE_BRANCHES = createCheckbox('Hide Branches', false).parent(controlsContainer);
  SWAY_MODE = createCheckbox('Sway Mode (2D Only)', false).parent(controlsContainer);
  SWAY_MODE_SLIDER = createSlider(0, 5, 2).parent(createDiv('Sway Amount').parent(controlsContainer));

  LEAF_SIZE = createSlider(0, 180, 0).parent(createDiv('Leaf Size').parent(controlsContainer));
  LEAF_SIZE_Y = createSlider(0, 180, 0).parent(createDiv('Leaf Length').parent(controlsContainer));
  LEAF_SIZE_X = createSlider(0, 180, 0).parent(createDiv('Leaf Width').parent(controlsContainer));
  LEAF_SIZE_Z = createSlider(0, 180, 0).parent(createDiv('Leaf Depth').parent(controlsContainer));

  LEAF_COLOR = color('blue')
  LEAF_COLOR_PICKER = createColorPicker(color('green')).parent(createDiv('Leaf Color').parent(controlsContainer));

  LEAF_OUTLINE_PICKER = createColorPicker(color(70, 40, 20)).parent(createDiv('Leaf Outline Color').parent(controlsContainer));
  const leafShapeWrapper = createDiv()
  leafShapeWrapper.id("leafShapeWrapper")
  createP("Shape").style('text-decoration', 'underline').parent(controlsContainer);
  LEAF_SHAPE = createRadio(leafShapeWrapper).parent(controlsContainer);
  LEAF_SHAPE.option('0', 'cylinder', 'please');
  LEAF_SHAPE.option('1', 'box');
  LEAF_SHAPE.option('2', 'sphere');
  LEAF_SHAPE.option('3', 'ellipsoid');
  const leafShapeRadios = LEAF_SHAPE.elt.querySelectorAll('input')
  for (let i = 0; i < leafShapeRadios.length; i++) {
    leafShapeRadios[i].name = "leafShapeRadio";
  }
  LEAF_SHAPE.selected('3');

  BRANCH_COLOR = color('brown')
  BRANCH_COLOR_PICKER = createColorPicker(color('brown')).parent(createDiv('Branch Color').parent(controlsContainer))
  BRANCH_RADIUS = createSlider(0, 180, 0).parent(createDiv('Branch Radius').parent(controlsContainer));
  BRANCH_LENGTH = createSlider(-180, 180, 0).parent(createDiv('Branch Length').parent(controlsContainer));


  const textureWrapper = createDiv()
  textureWrapper.id("textureWrapper")
  const shapeWrapper = createDiv()
  shapeWrapper.id("shapeWrapper")

  createP("Texture").style('text-decoration', 'underline').parent(controlsContainer);
  BRANCH_TEXTURE = createRadio(textureWrapper).parent(controlsContainer);
  BRANCH_TEXTURE.option('', 'none');
  BRANCH_TEXTURE.option('texture(images[floor(random(0, images.length))]);', 'embroidery');
  BRANCH_TEXTURE.option('texture(barks[0]);', 'bark');
  BRANCH_TEXTURE.selected('');

  createP("Shape").style('text-decoration', 'underline').parent(controlsContainer);
  BRANCH_SHAPE = createRadio(shapeWrapper).parent(controlsContainer);
  BRANCH_SHAPE.option('0', 'cylinder', 'please');
  BRANCH_SHAPE.option('1', 'box');
  BRANCH_SHAPE.option('2', 'sphere');
  BRANCH_SHAPE.option('3', 'ellipsoid');
  BRANCH_SHAPE.option('4', 'torus');
  const shapeRadios = BRANCH_SHAPE.elt.querySelectorAll('input')
  for (let i = 0; i < shapeRadios.length; i++) {
    shapeRadios[i].name = "shapeRadio";
  }
  BRANCH_SHAPE.selected('0');

  CAMERA_X = createSlider(-width / 2, width / 2, 0).parent(createDiv('X').parent(controlsContainer));
  CAMERA_Y = createSlider(-height / 2, height / 2, 0).parent(createDiv('Y').parent(controlsContainer));
  CAMERA_Z = createSlider(-width / 2, width / 2, 0).parent(createDiv('Z').parent(controlsContainer));

  // EXPORT_SECONDS.position(20, 65);

  let valueDisplayer = createP("5 second(s)").parent(controlsContainer);
  EXPORT_SECONDS = createSlider(1, 60, 4).parent(createDiv('Seconds').parent(controlsContainer));
  EXPORT_SECONDS.input(() => {
    valueDisplayer.html(EXPORT_SECONDS.value() + " second(s)")
  })
  SAVE_BUTTON = createButton('Save to gif', '5', 'number').parent(controlsContainer);

  SAVE_BUTTON.mousePressed(() => {
    saveGif('treeGif', Number(EXPORT_SECONDS.value()));
  });

  var RANDOMIZE_VARIABLES = {
    sliders: [ROTATION_MODIFIER_SLIDER, ROTATION_RANGE_SLIDER, BRANCH_RADIUS, BRANCH_LENGTH, LEAF_SIZE_X, LEAF_SIZE_Y, LEAF_SIZE_Z,
      CAMERA_X, CAMERA_Y, CAMERA_Z
    ],

    checkboxes: [EGG_MODE, THREE_D_MODE, HIDE_BRANCHES, SPINNING, ROTATION_WAVE, TREE_SWITCHING]

  };

  RANDOMIZE_BUTTON = createButton('Randomize', '5', 'number').parent(controlsContainer);

  RANDOMIZE_BUTTON.mousePressed(() => {
    for (let i = 0; i < RANDOMIZE_VARIABLES.sliders.length; i++) {
      const slider = RANDOMIZE_VARIABLES.sliders[i];
      console.log(slider.value());
    }
  });


  ROTATION_MODIFIER_SLIDER.value(18);
  BRANCH_RADIUS.value(180);
  BRANCH_LENGTH.value(180);
  LEAF_SIZE_X.value(36);
  LEAF_SIZE_Y.value(6);
  LEAF_SIZE_Z.value(0);

  CAMERA_X.value(0)
  CAMERA_Y.value(50.5)
  CAMERA_Z.value(595)

  // LEAF_COLOR_PICKER.value("#684B21");
  LEAF_OUTLINE_PICKER.value("#DADBFF")
  BRANCH_COLOR_PICKER.value("#0A030E")
  LEAF_SHAPE.selected('3')

}

let images = [];
let barks = [];

function preload() {
  // images = [loadImage('./Embroidery/pys1.png'), loadImage('./Embroidery/embroider2white.png'), loadImage('./Embroidery/3dpys.jpg'), loadImage('./Embroidery/3dpys2.jpg'), loadImage('./Embroidery/blue.png')]
  // barks = [loadImage('./textures/bark1.jpg')]
  // console.log(bg);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // ROTATION_MODIFIER_SLIDER.value(18 + map(mouseX, 0, width, -1, 1));
  // ROTATION_RANGE_SLIDER.value(18 + map(mouseY, 0, height, -1, 1));
  // LEAF_COLOR = color(map(mouseX, 0, width, 0, 255), 128, 0);
  
  // LEAF_COLOR_PICKER.value(LEAF_COLOR)

  if (THREE_D_MODE.checked()) {
    renderer.drawingContext.enable(renderer.drawingContext.DEPTH_TEST);
    background('black')
    // background(bg);

    randomSeed(1)

    // Camera Position
    translate(0 + CAMERA_X.value(), (height / 6 + CAMERA_Y.value()), height / 4 + CAMERA_Z.value())
    // rotate(map(mouseY, 0, height, 0, 2))
    SPINNING.checked() && rotateY(frameCount / 24)
    three_branch(treeLength)
    if (millis() < MINUTES_TO_FULL_SIZE) {
      treeLength = map(millis(), 0, MINUTES_TO_FULL_SIZE, maxTreeLength, maxTreeLength);
    }
  }

  // 2D MODE
  else {
    if (!(frameCount % TREES_PER_SEC)) {
      renderer.drawingContext.disable(renderer.drawingContext.DEPTH_TEST);

      !TREE_SWITCHING.checked() && randomSeed(100);
      background('black');
      translate(0 + CAMERA_X.value(), (height / 6 + CAMERA_Y.value()), height / 4 + CAMERA_Z.value())

      branch(treeLength);

      if (millis() < MINUTES_TO_FULL_SIZE) {
        treeLength = map(millis(), 0, MINUTES_TO_FULL_SIZE, 1, maxTreeLength);
      }
    }
  }
}

function branch(len) {
  push()
  if (len > 10) {
    var sinFunction = ROTATION_WAVE.checked() ? map(sin(frameCount), -1, 1, 0, 360) : 0;
    var swayFunction = SWAY_MODE.checked() ? map(sin(frameCount), -1, 1, -SWAY_MODE_SLIDER.value(), SWAY_MODE_SLIDER.value()) : 0;
    strokeWeight(map(len, 10, 100, 1, 15));
    stroke(BRANCH_COLOR_PICKER.color());
    noStroke();
    noFill()
    HIDE_BRANCHES.checked() && strokeWeight(0);
    fill(BRANCH_COLOR_PICKER.color())
    // line(0, 0, 0, -len);
    translate(0, -len / 2, 0)
    eval(BRANCH_TEXTURE.value());
    !HIDE_BRANCHES.checked() && eval(branchShapeFunctions[BRANCH_SHAPE.value()])
    translate(0, len / 2, 0)

    translate(0, -len);
    rotate((random(-20, -20 - ROTATION_RANGE_SLIDER.value())) + ROTATION_MODIFIER_SLIDER.value() + sinFunction + swayFunction);
    branch(len * random(...branchLengthRange))
    rotate(random(50, 50 + ROTATION_RANGE_SLIDER.value()) + ROTATION_MODIFIER_SLIDER.value() + sinFunction + swayFunction);
    branch(len * random(...branchLengthRange))
  } else {
    var r = LEAF_COLOR_PICKER.color().levels[0] + random(-20, 20)
    var g = LEAF_COLOR_PICKER.color().levels[1] + random(-20, 20)
    var b = LEAF_COLOR_PICKER.color().levels[2] + random(-20, 20)
    fill(r, g, b, 150);
    noStroke()
    beginShape()

    if (EGG_MODE.checked()) {
      noFill()
      image(images[0], 0, 0, 20, 20)
    } else {
      beginShape()
      // noStroke()
      strokeWeight(0)
      stroke('brown')
      noStroke()
      fill(r, g, b, 100)
      ellipsoid(5, 10, 2);
      endShape(CLOSE)
    }
    endShape(CLOSE)
  }
  pop();
}

var animation_complete = true;

function three_branch(len) {
  var sinFunction = ROTATION_WAVE.checked() || !animation_complete ? map(sin(frameCount), -1, 1, 0, 360) : 0;
  animation_complete = sinFunction === 0 || sinFunction === 360 ? true : false;

  translate(0, map(mouseY, 0, height, -len/2, -len/1.95), map(mouseX, 0, width, -5, 5))
  rotateZ(map(mouseY, 0, height, -2, 2))

  beginShape()
  strokeWeight(0);
  !HIDE_BRANCHES.checked() && eval(branchShapeFunctions[BRANCH_SHAPE.value()])
  fill(BRANCH_COLOR_PICKER.color())
  eval(BRANCH_TEXTURE.value());
  endShape(CLOSE)
  translate(0, len / 2, 0)

  translate(0, -len, 0)

  if (len > 10) {
    for (let i = 0; i < 3; i++) {
      rotateY(random(100, 120 + ROTATION_RANGE_SLIDER.value()) + ROTATION_MODIFIER_SLIDER.value() + sinFunction);

      push()
      rotateZ(random(20, 30 + ROTATION_RANGE_SLIDER.value()) + ROTATION_MODIFIER_SLIDER.value() + sinFunction)
      three_branch(len * .68)
      pop()
    }
  } else {
    // var leaf_color_range = map(mouseX+mouseY, 0, width+height, 0, 255);
    var leaf_color_range = 0;
    var r = LEAF_COLOR_PICKER.color().levels[0] + random(-leaf_color_range, leaf_color_range)
    var g = LEAF_COLOR_PICKER.color().levels[1] + random(-leaf_color_range, leaf_color_range)
    var b = LEAF_COLOR_PICKER.color().levels[2] + random(-leaf_color_range, leaf_color_range)
    fill(r, g, b, 150);

    if (EGG_MODE.checked()) {
      // noFill()
      beginShape()
      noStroke()
      fill('red')
      texture(images[floor(random(0, images.length))])
      ellipsoid(2.5 + LEAF_SIZE_X.value() + LEAF_SIZE.value(), 3 + LEAF_SIZE_Y.value() + LEAF_SIZE.value(), 3 + LEAF_SIZE_Z.value() + LEAF_SIZE.value());
      endShape(CLOSE)
    } else {
      beginShape()
      noStroke()
      strokeWeight(.1)
      fill(r, g, b, 150)
      eval(leafShapeFunctions[LEAF_SHAPE.value()])
      endShape(CLOSE)

      push();
      fill(LEAF_OUTLINE_PICKER.color());
      // ellipsoid(3.5 + LEAF_SIZE.value(), 6.1 + LEAF_SIZE.value(), 1);
      pop();
    }
  }
}

window.mobileCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

window.addEventListener("DOMContentLoaded", () => {
  const isReduced = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;
  if (mobileCheck() || isReduced) {
    noLoop();
  }
})