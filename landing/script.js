/* ============================================================
   云启 CloudStart 落地页交互
   - 移动端导航切换
   - 表单校验（preventDefault，不在客户端暴露任何密钥）
   - IntersectionObserver 滚动揭示 + 数字滚动动画
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 1. 移动端导航 ---------- */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      const isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggle.setAttribute("aria-label", isOpen ? "关闭菜单" : "打开菜单");
    });

    // 点击导航项后自动收起
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "打开菜单");
      });
    });

    // 视口放大到桌面尺寸时复位
    window.addEventListener("resize", function () {
      if (window.innerWidth > 720 && links.classList.contains("open")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- 2. 滚动揭示动画 ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length > 0) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- 3. 数字滚动动画 ---------- */
  const counters = document.querySelectorAll(".stat-num[data-target]");

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute("data-target")) || 0;
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (Number.isInteger(target) ? Math.round(value) : value.toFixed(1)) + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = (Number.isInteger(target) ? target : target.toFixed(1)) + suffix;
      }
    }
    requestAnimationFrame(tick);
  }

  if ("IntersectionObserver" in window && counters.length > 0) {
    const cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) {
      cio.observe(el);
    });
  } else {
    counters.forEach(function (el) {
      const target = parseFloat(el.getAttribute("data-target")) || 0;
      el.textContent = Number.isInteger(target) ? target : target.toFixed(1);
    });
  }

  /* ---------- 4. 联系表单校验 ---------- */
  const form = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");

  function setError(fieldId, msg) {
    const field = document.getElementById(fieldId);
    const small = document.querySelector('.error[data-for="' + fieldId + '"]');
    if (field) field.closest(".field").classList.add("invalid");
    if (small) small.textContent = msg;
  }

  function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const small = document.querySelector('.error[data-for="' + fieldId + '"]');
    if (field) field.closest(".field").classList.remove("invalid");
    if (small) small.textContent = "";
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // 关键：阻止原生提交，避免页面跳转

      let valid = true;
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      // 姓名
      if (name === "") {
        setError("name", "请填写姓名");
        valid = false;
      } else {
        clearError("name");
      }

      // 邮箱：格式校验
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email === "") {
        setError("email", "请填写邮箱");
        valid = false;
      } else if (!emailRe.test(email)) {
        setError("email", "邮箱格式不正确");
        valid = false;
      } else {
        clearError("email");
      }

      // 需求描述
      if (message === "") {
        setError("message", "请简单描述您的需求");
        valid = false;
      } else {
        clearError("message");
      }

      if (!valid) return;

      // 真实项目可在此通过 fetch 提交到后端 API；此处仅做前端演示
      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      form.reset();
    });

    // 输入时实时清除错误
    ["name", "email", "message"].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) el.addEventListener("input", function () { clearError(id); });
    });
  }
})();
