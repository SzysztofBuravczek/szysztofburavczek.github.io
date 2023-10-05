(function () {
  if (
    !document.addEventListener ||
    !document.querySelectorAll ||
    !document.getElementById
  ) {
    return;
  }

  var controlBtns = document.querySelectorAll("[data-tab]");

  if (!controlBtns.length) {
    return;
  }
  if (!controlBtns[0].classList || !controlBtns[0].style) {
    return;
  }

  var tabNames = new Array(controlBtns.length);
  var tabs = new Array(controlBtns.length);
  var defaultTabName;
  for (let i = 0; i < controlBtns.length; i++) {
    tabNames[i] = controlBtns[i].dataset.tab;
    tabs[i] = document.getElementById(tabNames[i]);
    if (controlBtns[i].dataset.defaultTab != undefined) {
      defaultTabName = tabNames[i];
    }
  }
  if (!defaultTabName) {
    defaultTabName = tabNames[0];
  }
  setTab(defaultTabName);

  document.addEventListener("click", function (e) {
    if (e.target.dataset.tab) {
      setTab(e.target.dataset.tab);
    }
  });

  function setTab(tabName) {
    for (let i = 0; i < controlBtns.length; i++) {
      if (tabNames[i] == tabName) {
        controlBtns[i].disabled = true;
        controlBtns[i].classList.add("button-highlight");
        if (tabs[i]) {
          tabs[i].style.display = "";
        }
      } else {
        controlBtns[i].disabled = false;
        controlBtns[i].classList.remove("button-highlight");
        if (tabs[i]) {
          tabs[i].style.display = "none";
        }
      }
    }
  }
})();
