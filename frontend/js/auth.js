// ===== SHARED AUTH UTILITIES =====

function showMessage(text, type = "success", elementId = "msg") {
  const msg = document.getElementById(elementId);
  if (!msg) return;
  msg.className = `msg ${type}`;
  msg.innerText = text;
  setTimeout(() => {
    if (msg.innerText === text) msg.className = "msg";
  }, 5000);
}

function togglePassword(id, icon) {
  const input = document.getElementById(id);
  if (!input) return;

  if (input.type === "password") {
    input.type = "text";
    icon.textContent = "👁‍🗨";
  } else {
    input.type = "password";
    icon.textContent = "👁️";
  }
}

function checkPasswordStrength() {
  const password = document.getElementById("password")?.value || "";
  const bar = document.getElementById("strengthBar");
  const text = document.getElementById("strengthText");
  if (!bar || !text) return;

  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[@#$!%*?&]/.test(password)) strength++;

  if (strength <= 2) {
    bar.style.width = "30%";
    bar.style.background = "#ef4444";
    text.innerText = "Weak password";
    text.style.color = "#ef4444";
  } else if (strength <= 4) {
    bar.style.width = "60%";
    bar.style.background = "#f97316";
    text.innerText = "Medium strength";
    text.style.color = "#f97316";
  } else {
    bar.style.width = "100%";
    bar.style.background = "#22c55e";
    text.innerText = "Strong password";
    text.style.color = "#22c55e";
  }
}

function logout() {
  localStorage.removeItem("token");
  showMessage("Logged out successfully", "success");
  setTimeout(() => (window.location = "index.html"), 800);
}

function requireAuth() {
  if (!localStorage.getItem("token")) {
    window.location = "index.html";
  }
}

// ===== UPDATED API FETCH FOR RAILWAY =====

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: token } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(path, {
    ...options,
    headers,
  });

  const data = await res.json();
  return { res, data };
}