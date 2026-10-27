(function () {
  var PALETTE = [
    "#5b8def",
    "#e07a3d",
    "#3dbe8b",
    "#d45d7a",
    "#8b6adf",
    "#e0b43d",
    "#3aa0c8",
    "#c46b4a"
  ];

  function shuffle(list) {
    var arr = list.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function renderApps(apps) {
    var root = document.getElementById("apps");
    root.textContent = "";

    if (!apps.length) {
      var empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "No applications yet. Add a name and url in js/config.js.";
      root.appendChild(empty);
      return;
    }

    shuffle(apps).forEach(function (app, i) {
      var color = app.color || PALETTE[i % PALETTE.length];
      var item = document.createElement("div");
      item.className = "app";
      item.style.animationDelay = (i % 8) * -0.55 + "s";
      item.setAttribute("role", "listitem");

      var shadow = document.createElement("span");
      shadow.className = "ground-shadow";
      shadow.setAttribute("aria-hidden", "true");

      var button = document.createElement("button");
      button.type = "button";
      button.className = "orb";
      button.style.setProperty("--orb", color);
      button.setAttribute("aria-label", "Open " + app.name);

      var name = document.createElement("span");
      name.className = "orb-name";
      name.textContent = app.name;
      button.appendChild(name);

      button.addEventListener("click", function () {
        if (!app.url) return;
        window.open(app.url, "_blank", "noopener,noreferrer");
      });

      item.appendChild(shadow);
      item.appendChild(button);
      root.appendChild(item);
    });
  }

  function boot() {
    var portal = window.PORTAL || { title: "Portal", apps: [] };
    var title = portal.title || "Portal";
    document.title = title;
    document.getElementById("portal-title").textContent = title;
    renderApps(portal.apps || []);
    window.PortalBackground.start(
      document.getElementById("scene"),
      document.getElementById("scene-caption")
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
