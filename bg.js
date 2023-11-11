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
    data[iA] = 12;
  }
  ctx.putImageData(imageData, 0, 0);
  background.style.backgroundImage =
    "linear-gradient(45deg, rgba(0,0,0,0.1), transparent 10%, transparent 85%, rgba(0,0,0,0.125)), url(" +
    canvas.toDataURL("image/png") +
    ")";
  background.style.backgroundPosition = "center top";

  if (getComputedStyle) {
    var computedColor = /rgb\((\d+),\s?(\d+),\s?(\d+)\)/.exec(
      getComputedStyle(background).backgroundColor
    );
    if (computedColor) {
      var sumRA = 0;
      var sumGA = 0;
      var sumBA = 0;
      var sumNotA = 65280;
      for (var i = 0; i < 256; i++) {
        iR = 4 * i;
        iG = iR + 1;
        iB = iG + 1;
        iA = iB + 1;

        sumRA += data[iR] * data[iA];
        sumGA += data[iG] * data[iA];
        sumBA += data[iB] * data[iA];
        sumNotA -= data[iA];
      }

      var R = (65280 * Number(computedColor[1]) - sumRA) / sumNotA;
      var G = (65280 * Number(computedColor[2]) - sumGA) / sumNotA;
      var B = (65280 * Number(computedColor[3]) - sumBA) / sumNotA;

      if (R > 255) R = 255;
      if (G > 255) G = 255;
      if (B > 255) B = 255;

      background.style.backgroundColor =
        "rgb(" +
        Math.round(R) +
        "," +
        Math.round(G) +
        "," +
        Math.round(B) +
        ")";
    } else {
      defaultBgColor();
    }
  } else {
    defaultBgColor();
  }

  function defaultBgColor() {
    background.style.backgroundColor = "#e0f1f7";
  }
})();
