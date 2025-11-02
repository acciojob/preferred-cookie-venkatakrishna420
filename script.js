//your JS code here. If required.
// --- Cookie helpers ---
function setCookie(name, value, days = 365) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}

function getCookie(name) {
  const cookieStr = document.cookie;
  if (!cookieStr) return null;
  const cookies = cookieStr.split(";").map(c => c.trim());
  for (const c of cookies) {
    if (c.startsWith(name + "=")) {
      return decodeURIComponent(c.substring(name.length + 1));
    }
  }
  return null;
}

function eraseCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// --- Apply preferences to :root CSS variables ---
function applyPreferences(fontSizeValueWithPx, fontColorHex) {
  if (fontSizeValueWithPx) {
    document.documentElement.style.setProperty("--fontsize", fontSizeValueWithPx);
  }
  if (fontColorHex) {
    document.documentElement.style.setProperty("--fontcolor", fontColorHex);
  }
}

// --- On page load: read cookies and apply if present, and update form inputs ---
window.addEventListener("DOMContentLoaded", () => {
  const savedFontSize = getCookie("fontsize"); // expected like "18px"
  const savedFontColor = getCookie("fontcolor"); // expected like "#ff0000"

  if (savedFontSize) {
    applyPreferences(savedFontSize, null);
    // set number input without the "px"
    const num = parseInt(savedFontSize, 10);
    if (!Number.isNaN(num)) {
      document.getElementById("fontsize").value = num;
    }
  } else {
    applyPreferences("16px", null);
    document.getElementById("fontsize").value = 16;
  }

  if (savedFontColor) {
    applyPreferences(null, savedFontColor);
    document.getElementById("fontcolor").value = savedFontColor;
  } else {
    applyPreferences(null, "#000000");
    document.getElementById("fontcolor").value = "#000000";
  }

  // Form submit handler
  const form = document.getElementById("prefForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const sizeInput = document.getElementById("fontsize");
    const colorInput = document.getElementById("fontcolor");

    let sizeVal = parseInt(sizeInput.value, 10);
    if (Number.isNaN(sizeVal)) {
      alert("Please enter a valid font size between 8 and 72.");
      return;
    }
    if (sizeVal < 8) sizeVal = 8;
    if (sizeVal > 72) sizeVal = 72;

    const sizeWithPx = sizeVal + "px";
    const colorVal = colorInput.value;

    setCookie("fontsize", sizeWithPx, 365);
    setCookie("fontcolor", colorVal, 365);

    applyPreferences(sizeWithPx, colorVal);

    // tiny UX feedback
    const submitBtn = this.querySelector('input[type="submit"]');
    const originalLabel = submitBtn.value;
    submitBtn.value = "Saved!";
    setTimeout(() => { submitBtn.value = originalLabel; }, 1000);
  });

  // Reset button
  document.getElementById("resetBtn").addEventListener("click", () => {
    eraseCookie("fontsize");
    eraseCookie("fontcolor");

    applyPreferences("16px", "#000000");
    document.getElementById("fontsize").value = 16;
    document.getElementById("fontcolor").value = "#000000";
  });
});

