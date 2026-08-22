/* ============================================================
   优选清单 · 联盟营销主页交互
   - 联盟披露条关闭
   - 移动端导航切换
   - 订阅表单校验（preventDefault，不在客户端暴露任何密钥）
   - IntersectionObserver 滚动揭示
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 1. 联盟披露条 ---------- */
  const disclosure = document.getElementById("disclosure");
  const disclosureClose = document.getElementById("disclosureClose");
  if (disclosure && disclosureClose) {
    disclosureClose.addEventListener("click", function () {
      disclosure.classList.add("hide");
    });
  }

  /* ---------- 2. 移动端导航 ---------- */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      const isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggle.setAttribute("aria-label", isOpen ? "关闭菜单" : "打开菜单");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "打开菜单");
      });
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 720 && links.classList.contains("open")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- 3. 滚动揭示动画 ---------- */
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
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- 4. 订阅表单校验 ---------- */
  const subForm = document.getElementById("subForm");
  const subSuccess = document.getElementById("subSuccess");
  const subEmail = document.getElementById("subEmail");

  if (subForm && subEmail) {
    subForm.addEventListener("submit", function (e) {
      e.preventDefault(); // 阻止原生提交，避免页面跳转

      const value = subEmail.value.trim();
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (value === "") {
        subEmail.focus();
        return;
      }
      if (!emailRe.test(value)) {
        subEmail.focus();
        return;
      }

      // 真实项目：通过 fetch 发送到你的邮件服务（Mailchimp / 自建 API 等）
      // 示例：fetch("/api/subscribe", { method: "POST", body: JSON.stringify({ email: value }) })
      if (subSuccess) {
        subSuccess.hidden = false;
        subSuccess.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      subForm.reset();
    });
  }
})();
