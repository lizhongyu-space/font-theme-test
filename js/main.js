// Design Lab interactions — intentionally isolated from the production site.
(() => {
  const body = document.body;
  const themeButton = document.getElementById("themeBtn");
  const themeGlyph = document.getElementById("themeGlyph");
  const fontSelect = document.getElementById("fontSelect");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const mobileMenuButton = document.getElementById("mobileMenuButton");
  const radiusDemo = document.getElementById("radiusDemo");
  const swatchLabels = {
    canvas: document.getElementById("canvasHex"),
    surface: document.getElementById("surfaceHex"),
    text: document.getElementById("textHex"),
    accent: document.getElementById("accentHex"),
    border: document.getElementById("borderHex")
  };

  const presets = {
    silver: { canvas: "#F5F7FA", surface: "#FFFFFF", text: "#202A35", accent: "#3977B8", border: "#DCE3EA" },
    paper: { canvas: "#F5F1E9", surface: "#FFFDF8", text: "#302D29", accent: "#8C765B", border: "#E2D9CA" },
    graphite: { canvas: "#20252C", surface: "#282F37", text: "#E5EAF0", accent: "#91B8E0", border: "#3C4651" },
    blue: { canvas: "#F0F5FB", surface: "#FFFFFF", text: "#1D2D40", accent: "#2869AA", border: "#D7E2EF" }
  };

  function updateSwatches(presetName) {
    const colors = presets[presetName] || presets.silver;
    Object.entries(colors).forEach(([key, value]) => {
      if (swatchLabels[key]) swatchLabels[key].textContent = value;
    });
  }

  function applyPreset(presetName) {
    const safePreset = presets[presetName] ? presetName : "silver";
    body.dataset.preset = safePreset;
    body.removeAttribute("data-mode");
    document.querySelectorAll("[data-preset]").forEach((button) => {
      if (button.classList.contains("theme-option")) {
        const active = button.dataset.preset === safePreset;
        button.classList.toggle("selected", active);
        button.setAttribute("aria-pressed", String(active));
      }
    });
    updateSwatches(safePreset);
    try { localStorage.setItem("design-lab-preset", safePreset); } catch (_) {}
    themeGlyph.textContent = safePreset === "graphite" ? "☼" : "◐";
  }

  document.querySelectorAll(".theme-option").forEach((button) => {
    button.addEventListener("click", () => applyPreset(button.dataset.preset));
  });

  themeButton.addEventListener("click", () => {
    const darkNow = body.dataset.preset !== "graphite";
    if (darkNow) {
      body.dataset.preset = "graphite";
      body.removeAttribute("data-mode");
      document.querySelectorAll(".theme-option").forEach((button) => {
        button.classList.remove("selected");
        button.setAttribute("aria-pressed", "false");
      });
      updateSwatches("graphite");
      document.querySelectorAll("[data-preset]").forEach((button) => {
        if (button.classList.contains("theme-option")) {
          button.classList.toggle("selected", button.dataset.preset === "graphite");
          button.setAttribute("aria-pressed", String(button.dataset.preset === "graphite"));
        }
      });
      themeGlyph.textContent = "☼";
    } else {
      applyPreset("silver");
    }
  });

  fontSelect.addEventListener("change", () => {
    body.dataset.font = fontSelect.value;
    try { localStorage.setItem("design-lab-font", fontSelect.value); } catch (_) {}
  });

  sidebarToggle.addEventListener("click", () => {
    if (window.matchMedia("(max-width: 760px)").matches) {
      body.classList.remove("mobile-nav-open");
      mobileMenuButton.setAttribute("aria-expanded", "false");
      mobileMenuButton.setAttribute("aria-label", "Open navigation");
      return;
    }
    const collapsed = body.classList.toggle("sidebar-collapsed");
    sidebarToggle.setAttribute("aria-expanded", String(!collapsed));
    sidebarToggle.setAttribute("aria-label", collapsed ? "Expand navigation" : "Collapse navigation");
  });
  mobileMenuButton.addEventListener("click", () => {
    const open = body.classList.toggle("mobile-nav-open");
    mobileMenuButton.setAttribute("aria-expanded", String(open));
    mobileMenuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });

  document.querySelectorAll(".radius-choice").forEach((button) => {
    button.addEventListener("click", () => {
      const radius = Number(button.dataset.radius);
      if (![6, 12, 18, 24].includes(radius)) return;
      document.documentElement.style.setProperty("--radius-sm", radius + "px");
      document.documentElement.style.setProperty("--radius-md", radius + "px");
      document.documentElement.style.setProperty("--radius-lg", radius + "px");
      radiusDemo.style.borderRadius = radius + "px";
      document.querySelectorAll(".radius-choice").forEach((choice) => {
        const active = choice === button;
        choice.classList.toggle("selected", active);
        choice.setAttribute("aria-pressed", String(active));
      });
    });
  });

  document.querySelectorAll(".nav-item").forEach((link) => {
    link.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
      if (window.matchMedia("(max-width: 760px)").matches) {
        body.classList.remove("mobile-nav-open");
        mobileMenuButton.setAttribute("aria-expanded", "false");
        mobileMenuButton.setAttribute("aria-label", "Open navigation");
      }
    });
  });

  try {
    const savedPreset = localStorage.getItem("design-lab-preset");
    const savedFont = localStorage.getItem("design-lab-font");
    if (savedPreset && presets[savedPreset]) applyPreset(savedPreset);
    else applyPreset("silver");
    document.documentElement.style.setProperty("--radius-sm", "12px");
    document.documentElement.style.setProperty("--radius-md", "12px");
    document.documentElement.style.setProperty("--radius-lg", "12px");
    if (savedFont && ["system", "rounded", "serif", "mono", "song"].includes(savedFont)) {
      fontSelect.value = savedFont;
      body.dataset.font = savedFont;
    }
  } catch (_) {
    applyPreset("silver");
  }
})();