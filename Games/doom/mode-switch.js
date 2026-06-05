// URL-driven boot mode. Runs synchronously inside <body> so CSS doesn't
// flash the wrong layout. Sets one of:
//   body.clean         → Classic DOOM auto-prime mode
//   (no class)         → ?manual=1     (full uzdoom-loader picker UI)
// Also tags body.flavor-classic for accent color theming.

(function () {
  var p = new URLSearchParams(window.location.search);
  var manualVal = p.get('manual');
  var manual = manualVal === '1';
  var flavor = p.get('flavor');
  var validFlavors = {
    classic: 1
  };
  if (manual) {
    // No class — leave the manual picker visible.
  } else if (flavor && validFlavors[flavor]) {
    document.body.classList.add('clean');
    document.body.classList.add('flavor-' + flavor);
  } else {
    document.body.classList.add('clean');
    document.body.classList.add('flavor-classic');
  }
})();
