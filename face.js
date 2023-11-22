(function () {
  var insertionPoint = document.getElementById("szysztoface");
  if (
    !insertionPoint ||
    !insertionPoint.getAttribute ||
    !insertionPoint.parentNode ||
    !insertionPoint.parentNode.replaceChild ||
    !HTMLCanvasElement ||
    !requestAnimationFrame
  ) {
    return;
  }

  var width = parseInt(insertionPoint.getAttribute("data-width"));
  var height = parseInt(insertionPoint.getAttribute("data-height"));
  if (!width || !height) {
    return;
  }

  var TWO_PI = 2 * Math.PI;

  function createDirection(phi) {
    return { x: Math.cos(phi), y: Math.sin(phi) };
  }

  var canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.setAttribute("class", insertionPoint.getAttribute("class") || "");

  var a = height / 48; // a/4 of the old script
  var centerX = width / 2;
  var centerY = height / 2;

  var ctx = canvas.getContext("2d");
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = 0.4 * a;

  var eyeDeltaX = 3.35 * a;
  var leftEyeX = centerX - eyeDeltaX;
  var rightEyeX = centerX + eyeDeltaX;
  var eyeRadius = 2.4 * a;

  var arrowLen = eyeRadius / 2;
  var arrowAddDirection = createDirection(Math.PI / 9);
  var arrowDownDirection = createDirection(Math.PI / 4);
  var arrowUpDirection = createDirection(Math.PI / 12);

  var deltaY = 0;
  var a_cos_phi = 0;
  var a_sin_phi = 0;
  var isEyeClosed = false;
  var pupilRadius = 0;
  var arrowDeltaX = 0;
  var arrowDeltaY = 0;
  var arrowLen_cos = 0;
  var arrowLen_sin = 0;

  function Up(src, dest) {
    dest.x = centerX + a * src.x;
    dest.y = centerY + a * src.y - deltaY;
  }

  function UpLeft(src, dest) {
    dest.x = centerX + a_cos_phi * src.x + a_sin_phi * src.y;
    dest.y = centerY + a_cos_phi * src.y - a_sin_phi * src.x - deltaY;
  }

  function UpRight(src, dest) {
    dest.x = centerX + a_cos_phi * src.x - a_sin_phi * src.y;
    dest.y = centerY + a_cos_phi * src.y + a_sin_phi * src.x - deltaY;
  }

  function Down(src, dest) {
    dest.x = centerX + a * src.x;
    dest.y = centerY + a * src.y + deltaY;
  }

  function DownLeft(src, dest) {
    dest.x = centerX + a_cos_phi * src.x + a_sin_phi * src.y;
    dest.y = centerY + a_cos_phi * src.y - a_sin_phi * src.x + deltaY;
  }

  function DownRight(src, dest) {
    dest.x = centerX + a_cos_phi * src.x - a_sin_phi * src.y;
    dest.y = centerY + a_cos_phi * src.y + a_sin_phi * src.x + deltaY;
  }

  function LeftEyeArrow(src, dest) {
    dest.x =
      leftEyeX - arrowDeltaX + arrowLen_cos * src.x + arrowLen_sin * src.y;
    dest.y =
      centerY - arrowDeltaY + arrowLen_cos * src.y - arrowLen_sin * src.x;
  }

  function RightEyeArrow(src, dest) {
    dest.x =
      rightEyeX + arrowDeltaX + arrowLen_cos * src.x - arrowLen_sin * src.y;
    dest.y =
      centerY - arrowDeltaY + arrowLen_cos * src.y + arrowLen_sin * src.x;
  }

  var SRC = [
    { x: -7, y: -10, f: UpLeft }, //   0
    { x: -5, y: -10, f: UpLeft }, //   1
    { x: -3, y: -10, f: UpLeft }, //   2
    { x: 0, y: -10, f: UpLeft }, //    3

    { x: -7, y: -6, f: UpLeft }, //    4
    { x: -5, y: -6, f: UpLeft }, //    5
    { x: -3, y: -6, f: UpLeft }, //    6
    { x: 0, y: -6, f: UpLeft }, //     7

    { x: 0, y: -10, f: Up }, //        8
    { x: 0, y: 0, f: Up }, //          9
    { x: 0, y: 4, f: Up }, //         10

    { x: 0, y: -10, f: UpRight }, //   11
    { x: 3, y: -10, f: UpRight }, //   12
    { x: 5, y: -10, f: UpRight }, //   13
    { x: 7, y: -10, f: UpRight }, //   14

    { x: 0, y: -6, f: UpRight }, //    15
    { x: 3, y: -6, f: UpRight }, //    16
    { x: 5, y: -6, f: UpRight }, //    17
    { x: 7, y: -6, f: UpRight }, //    18

    { x: -7, y: 10, f: DownRight }, // 19
    { x: -5, y: 10, f: DownRight }, // 20
    { x: -3, y: 10, f: DownRight }, // 21
    { x: 0, y: 10, f: DownRight }, //  22

    { x: -7, y: 6, f: DownRight }, //  23
    { x: -5, y: 6, f: DownRight }, //  24
    { x: -3, y: 6, f: DownRight }, //  25
    { x: 0, y: 6, f: DownRight }, //   26

    { x: 0, y: 10, f: Down }, //       27
    { x: 0, y: 0, f: Down }, //        28
    { x: 0, y: -4, f: Down }, //       29

    { x: 0, y: 10, f: DownLeft }, //   30
    { x: 3, y: 10, f: DownLeft }, //   31
    { x: 5, y: 10, f: DownLeft }, //   32
    { x: 7, y: 10, f: DownLeft }, //   33

    { x: 0, y: 6, f: DownLeft }, //    34
    { x: 3, y: 6, f: DownLeft }, //    35
    { x: 5, y: 6, f: DownLeft }, //    36
    { x: 7, y: 6, f: DownLeft }, //    37

    { x: arrowUpDirection.x, y: -arrowUpDirection.y, f: LeftEyeArrow }, //    38
    { x: 0, y: 0, f: LeftEyeArrow }, //                                       39
    { x: arrowDownDirection.x, y: arrowDownDirection.y, f: LeftEyeArrow }, // 40

    { x: -arrowUpDirection.x, y: -arrowUpDirection.y, f: RightEyeArrow }, //    41
    { x: 0, y: 0, f: RightEyeArrow }, //                                        42
    { x: -arrowDownDirection.x, y: arrowDownDirection.y, f: RightEyeArrow }, // 43
  ];
  var POINTS = [
    [0, 4, 6, 3, 9, 11, 16, 18, 14],
    [7, 15],
    [2, 6],
    [12, 16],
    [8, 10],
    [19, 23, 25, 22, 28, 30, 35, 37, 33],
    [26, 34],
    [21, 25],
    [31, 35],
    [27, 29],
    [1, 5, 24, 20],
    [13, 17, 36, 32],
    [38, 39, 40],
    [41, 42, 43],
  ];

  var DEST = Array(SRC.length);
  for (var i = 0; i < SRC.length; i++) {
    DEST[i] = { x: 0, y: 0 };
  }

  var minX = centerX;
  var maxX = centerX;
  var minY = centerY;
  var maxY = centerY;

  function usePoint(dest, j) {
    if (dest.x < minX) minX = dest.x;
    if (dest.x > maxX) maxX = dest.x;
    if (dest.y < minY) minY = dest.y;
    if (dest.y > maxY) maxY = dest.y;

    if (j) {
      ctx.lineTo(dest.x, dest.y);
    } else {
      ctx.moveTo(dest.x, dest.y);
    }
  }

  function drawEye(x) {
    ctx.beginPath();
    if (isEyeClosed) {
      ctx.moveTo(x - eyeRadius, centerY);
      ctx.lineTo(x + eyeRadius, centerY);
    } else {
      ctx.arc(x, centerY, pupilRadius, 0, TWO_PI);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, centerY, eyeRadius, 0, TWO_PI);
    }
    ctx.stroke();
  }

  var cos_phi = 0;
  var sin_phi = 0;

  var cos2phi = 0;
  var cos_2phi = 0;
  var sin_2phi = 0;
  var arrow_cos = 0;
  var arrow_sin = 0;

  function draw(phi) {
    cos_phi = Math.cos(phi);
    sin_phi = Math.sin(phi);

    cos2phi = cos_phi * cos_phi;
    cos_2phi = 2 * cos2phi - 1;
    sin_2phi = 2 * sin_phi * cos_phi;

    arrow_cos = cos_2phi * arrowAddDirection.x - sin_2phi * arrowAddDirection.y;
    arrow_sin = sin_2phi * arrowAddDirection.x + cos_2phi * arrowAddDirection.y;

    arrowLen_cos = arrowLen * arrow_cos;
    arrowLen_sin = arrowLen * arrow_sin;

    arrowDeltaX = eyeRadius * arrow_sin;

    isEyeClosed = phi > 2 && phi < 2.7;
    if (isEyeClosed) {
      arrowDeltaY = 0;
    } else {
      arrowDeltaY = eyeRadius * arrow_cos;
      pupilRadius =
        eyeRadius *
        (0.3 -
          0.17 * cos_phi +
          0.1 * sin_phi +
          0.11 * cos2phi +
          0.06 * cos_phi * (sin_phi + cos2phi) -
          0.02 * sin_phi * sin_phi * sin_phi);
    }

    a_cos_phi = a * cos_phi;
    a_sin_phi = a * sin_phi;
    deltaY = 6 * (a - a_cos_phi);

    for (var i = 0; i < SRC.length; i++) {
      SRC[i].f(SRC[i], DEST[i]);
    }

    minX -= ctx.lineWidth;
    maxX += ctx.lineWidth;
    minY -= ctx.lineWidth;
    maxY += ctx.lineWidth;
    ctx.clearRect(minX, minY, maxX - minX, maxY - minY);
    minX = leftEyeX - eyeRadius;
    maxX = rightEyeX + eyeRadius;
    minY = centerY;
    maxY = centerY;

    drawEye(leftEyeX);
    drawEye(rightEyeX);

    ctx.beginPath();
    for (var i = 0; i < POINTS.length; i++) {
      for (var j = 0; j < POINTS[i].length; j++) {
        usePoint(DEST[POINTS[i][j]], j);
      }
    }
    ctx.stroke();
  }

  var play = true;
  var phi = 0;
  var animationStartPhi = 0;
  var animationStartTime = performance.now();
  var coeff = TWO_PI / 3000;

  function animator(t) {
    phi = (animationStartPhi + (t - animationStartTime) * coeff) % TWO_PI;
    draw(phi);
    if (play) {
      requestAnimationFrame(animator);
    }
  }

  canvas.addEventListener("click", () => {
    play = !play;
    if (play) {
      animationStartPhi = phi;
      animationStartTime = performance.now();
      requestAnimationFrame(animator);
    }
  });

  animator(animationStartTime);
  insertionPoint.parentNode.replaceChild(canvas, insertionPoint);
})();
