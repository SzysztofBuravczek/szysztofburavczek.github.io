(function () {
  var background = document.querySelector(".background");
  var mainEl = document.querySelector("main");
  var srcTxt = "";
  if (mainEl) {
    srcTxt = mainEl.innerHTML;
  } else {
    srcTxt = background.innerHTML;
  }

  var canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 16;

  var ctx = canvas.getContext("2d");
  var imageData = ctx.createImageData(16, 16);
  var data = imageData.data;

  var currentIndex = 0;
  var iR, iG, iB, iA;
  for (var i = 0; i < 512; i++) {
    currentIndex = (currentIndex + srcTxt.charCodeAt(i % srcTxt.length)) % 256;
    iA = 4 * currentIndex + 3;
    if (data[iA]) {
      iB = iA - 1;
      iG = iB - 1;
      iR = iG - 1;

      data[iB] = !data[iB] * 255;
      data[iR] = !(data[iB] || data[iR]) * 255 || (data[iB] && data[iR]);
      data[iG] =
        !(data[iB] || data[iR] || data[iG]) * 255 ||
        ((data[iB] || data[iR]) && data[iG]);
    }
    data[iA] = 8;
  }
  ctx.putImageData(imageData, 0, 0);
  background.style.backgroundImage =
    "url(" + canvas.toDataURL("image/png") + ")";
  background.style.backgroundColor = "#ddeaf4";
  background.style.backgroundPosition = "center top";
})();
