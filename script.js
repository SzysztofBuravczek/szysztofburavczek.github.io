(function () {
  if (
    !document.addEventListener ||
    !document.querySelectorAll ||
    !document.querySelector ||
    !document.getElementById ||
    !document.querySelector("body").classList ||
    !document.querySelector("body").style
  ) {
    return;
  }

  if (localStorage) {
    var chooseLang = document.getElementById("choose-lang");
    if (chooseLang) {
      var activeLangBtn = chooseLang.querySelector("button");
      if (activeLangBtn) {
        localStorage.setItem("lang", activeLangBtn.lang);
      }
    }
  }

  if (!String.prototype.split) {
    String.prototype.split = function (sep) {
      var str = this.toString();
      var result = [""];
      for (var i = 0; i < str.length; i++) {
        if (str[i] == sep) {
          result[result.length] = "";
        } else {
          result[result.length - 1] += str[i];
        }
      }

      return result;
    };
  }

  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (procedure) {
      for (var i = 0; i < this.length; i++) {
        procedure(this[i]);
      }
    };
  }

  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (what) {
      for (var i = 0; i < this.length; i++) {
        if (this[i] == what) {
          return i;
        }
      }

      return -1;
    };
  }

  if (!Array.prototype.push) {
    Array.prototype.push = function (what) {
      this[this.length] = what;

      return this.length;
    };
  }

  if (!Array.prototype.splice) {
    Array.prototype.splice = function (start, length) {
      var result = [];
      var end = start + length;
      var oldLength = this.length;
      var newLength = oldLength - length;
      for (var i = start; i < newLength; i++) {
        if (i < end) {
          result[result.length] = this[i];
        }
        this[i] = this[i + length];
      }
      for (var i = newLength; i < oldLength; i++) {
        delete this[i];
      }
      this.length = newLength;

      return result;
    };
  }

  var tabControlBtns = document.querySelectorAll("[data-tab]");

  var tabNames = new Array(tabControlBtns.length);
  var tabs = new Array(tabControlBtns.length);
  var defaultTabName;

  for (var i = 0; i < tabControlBtns.length; i++) {
    tabNames[i] = tabControlBtns[i].dataset.tab;
    tabs[i] = document.getElementById(tabNames[i]);
    if (tabControlBtns[i].dataset.defaultTab != undefined) {
      defaultTabName = tabNames[i];
    }
  }
  if (!defaultTabName) {
    defaultTabName = tabNames[0];
  }
  setTab(defaultTabName);

  var popupBackdrop = document.getElementById("backdrop");
  var openPopupNames = [];
  var openPopups = [];

  document.addEventListener("click", function (e) {
    var target = e.target;
    while (!respond(target) && target.parentNode) {
      target = target.parentNode;
    }
  });

  function respond(target) {
    if (!target.dataset) {
      return false;
    }
    var catched = false;

    if (target.dataset.tab) {
      setTab(target.dataset.tab);
      catched = true;
    }
    if (target.dataset.close) {
      target.dataset.close.split(" ").forEach(closePopup);

      if (popupBackdrop && !openPopups.length) {
        popupBackdrop.style.display = "none";
      }
      catched = true;
    }
    if (target.dataset.open) {
      target.dataset.open.split(" ").forEach(openPopup);

      if (popupBackdrop && openPopups.length) {
        popupBackdrop.style.display = "";
      }
      catched = true;
    }

    return catched;
  }

  function setTab(tabName) {
    for (var i = 0; i < tabControlBtns.length; i++) {
      if (tabNames[i] == tabName) {
        tabControlBtns[i].disabled = true;
        tabControlBtns[i].classList.add("highlight");
        if (tabs[i]) {
          tabs[i].style.display = "";
        }
      } else {
        tabControlBtns[i].disabled = false;
        tabControlBtns[i].classList.remove("highlight");
        if (tabs[i]) {
          tabs[i].style.display = "none";
        }
      }
    }
  }

  function closePopup(id) {
    var popupIndex = openPopupNames.indexOf(id);
    if (popupIndex < 0) {
      return;
    }
    openPopups[popupIndex].style.display = "none";
    openPopupNames.splice(popupIndex, 1);
    openPopups.splice(popupIndex, 1);
  }

  function openPopup(id) {
    if (openPopupNames.indexOf(id) >= 0) {
      return;
    }
    var popup = document.getElementById(id);
    if (!popup) {
      return;
    }
    popup.style.display = "";
    openPopupNames.push(id);
    openPopups.push(popup);
  }
})();
