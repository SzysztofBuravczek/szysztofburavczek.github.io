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

  // TODO: refactor tabs to allow multiple tab groups
  var tabSaveVar = "";
  var savedTab = "";
  if (localStorage) {
    var chooseLang = document.getElementById("choose-lang");
    if (chooseLang) {
      var activeLangBtn = chooseLang.querySelector("button");
      if (activeLangBtn) {
        localStorage.setItem("lang", activeLangBtn.lang);
      }
    }

    var tabSaveElement = document.querySelector("[data-tab-save]");
    if (tabSaveElement) {
      tabSaveVar = tabSaveElement.getAttribute("data-tab-save");
      savedTab = localStorage.getItem(tabSaveVar);
    }
  }

  var tabControlBtns = document.querySelectorAll("[data-tab-ctrl]");
  var tabs = document.querySelectorAll("[data-tab]");

  var tabNames = new Array(tabControlBtns.length);
  var defaultTabName;

  for (var i = 0; i < tabControlBtns.length; i++) {
    tabNames[i] = tabControlBtns[i].getAttribute("data-tab-ctrl");
    if (tabControlBtns[i].getAttribute("data-default-tab") != null) {
      defaultTabName = tabNames[i];
    }
  }
  if (!defaultTabName) {
    defaultTabName = tabNames[0];
  }
  if (tabSaveVar && savedTab && tabNames.indexOf(savedTab) >= 0) {
    defaultTabName = savedTab;
  }

  var currentTabName = defaultTabName;
  setTab(currentTabName);

  var popupBackdrop = document.getElementById("backdrop");
  var openPopupNames = [];
  var openPopups = [];

  document.addEventListener("click", function (e) {
    var target = e.target;
    while (!respond(target, e) && target.parentNode) {
      target = target.parentNode;
    }
  });

  addEventListener("hashchange", function () {
    setTab(currentTabName);
  });

  function respond(target, e) {
    var catched = false;

    if (target.tagName == "VIDEO" && target.play && target.pause) {
      if (target.paused) {
        target.play();
      } else {
        target.pause();
      }
      catched = true;
    }

    if (!target.getAttribute) {
      return catched;
    }

    var tabCtrl = target.getAttribute("data-tab-ctrl");
    var close = target.getAttribute("data-close");
    var open = target.getAttribute("data-open");
    var href = target.getAttribute("href");

    if (tabCtrl) {
      if (location) {
        location.hash = tabCtrl;
      } else {
        setTab(tabCtrl);
      }
      catched = true;
    }
    if (close) {
      close.split(" ").forEach(closePopup);

      if (popupBackdrop && !openPopups.length) {
        popupBackdrop.style.display = "none";
      }
      catched = true;
    }
    if (open) {
      open.split(" ").forEach(openPopup);

      if (popupBackdrop && openPopups.length) {
        popupBackdrop.style.display = "";
      }
      catched = true;
    }

    if (href == "#top" && target.scrollIntoView && e.preventDefault) {
      document.querySelector(href).scrollIntoView();
      e.preventDefault();

      if (location && location.hash) {
        if (currentTabName) {
          location.hash = currentTabName;
        } else {
          location.hash = "";
        }
      }
    }

    return catched;
  }

  function setTab(tabName) {
    // Also helps the location.hash mechanics to work without lags
    var element;

    if (location) {
      if (location.hash) {
        for (let i = 0; i < tabNames.length; i++) {
          if (location.hash.indexOf(tabNames[i]) == 1) {
            tabName = tabNames[i];
            break;
          }
        }
        element = document.querySelector(location.hash);
      } else {
        tabName = defaultTabName;
        element = document.querySelector("#top");
      }
    }
    if (tabSaveVar) {
      localStorage.setItem(tabSaveVar, tabName);
    }

    for (var i = 0; i < tabControlBtns.length; i++) {
      if (tabNames[i] == tabName) {
        tabControlBtns[i].classList.add("highlight");
      } else {
        tabControlBtns[i].classList.remove("highlight");
      }
    }

    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].getAttribute("data-tab") == tabName) {
        tabs[i].style.display = "";
      } else {
        tabs[i].style.display = "none";
      }
    }

    currentTabName = tabName;

    if (element && element.scrollIntoView) {
      element.scrollIntoView();
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
