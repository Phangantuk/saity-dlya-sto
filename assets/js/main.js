(function () {
  const PHONE_MAIN = "+79184100652";

  function initNav() {
    const nav = document.querySelector("[data-main-nav]");
    const toggle = document.querySelector("[data-nav-toggle]");
    if (!nav || !toggle) return;

    toggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || toggle.contains(event.target)) return;
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  }

  function initAnimation() {
    const nodes = document.querySelectorAll("[data-animate]");
    if (!nodes.length || !("IntersectionObserver" in window)) {
      nodes.forEach(function (n) {
        n.classList.add("is-in");
      });
      return;
    }

    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    nodes.forEach(function (node) {
      io.observe(node);
    });
  }

  function makeMessage(form) {
    const fd = new FormData(form);
    const name = (fd.get("name") || "").toString().trim();
    const phone = (fd.get("phone") || "").toString().trim();
    const service = (fd.get("service") || "").toString().trim();
    const car = (fd.get("car") || "").toString().trim();
    const comment = (fd.get("comment") || "").toString().trim();

    return [
      "Заявка с сайта sto-krasnodara.ru",
      "Имя: " + (name || "-"),
      "Телефон: " + (phone || "-"),
      "Услуга: " + (service || "-"),
      "Автомобиль: " + (car || "-"),
      "Комментарий: " + (comment || "-")
    ].join("\n");
  }

  function initForms() {
    const forms = document.querySelectorAll(".booking-form");
    if (!forms.length) return;

    forms.forEach(function (form) {
      const status = form.querySelector(".form-status");
      form.addEventListener("submit", function (event) {
        event.preventDefault();

        const text = makeMessage(form);
        const encoded = encodeURIComponent(text);
        const smsUrl = "sms:" + PHONE_MAIN + "?body=" + encoded;

        if (status) {
          status.textContent = "Открываем SMS для отправки заявки...";
          status.className = "form-status form-status--ok";
        }

        window.location.href = smsUrl;

        setTimeout(function () {
          if (status) {
            status.textContent = "Если SMS не открылось: позвоните по номеру +7 (918) 410-06-52.";
          }
        }, 900);
      });
    });
  }

  function safeText(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function renderPriceTable(category, items) {
    const columns = category.columns || [];
    const headCells = ["<th>Работа</th>"]
      .concat(columns.map(function (c) { return "<th>" + safeText(c) + "</th>"; }))
      .join("");

    const rows = items
      .map(function (item) {
        const prices = (item.prices || []).map(function (p) {
          return "<td>" + safeText(p) + "</td>";
        }).join("");
        return "<tr><td>" + safeText(item.name) + "</td>" + prices + "</tr>";
      })
      .join("");

    return (
      "<div class=\"surface price-category\" data-category=\"" + safeText(category.category) + "\">" +
      "<h3>" + safeText(category.category) + "</h3>" +
      "<div class=\"table-wrap\"><table class=\"price-table\"><thead><tr>" + headCells + "</tr></thead><tbody>" + rows + "</tbody></table></div>" +
      "</div>"
    );
  }

  function initPricePage() {
    const box = document.querySelector("[data-price-root]");
    const chips = document.querySelector("[data-price-chips]");
    const search = document.querySelector("[data-price-search]");
    if (!box || !window.PRICE_DATA) return;

    let activeCategory = "all";

    const categories = window.PRICE_DATA;

    if (chips) {
      const parts = ["<button class=\"filter-chip is-active\" data-filter=\"all\" type=\"button\">Все разделы</button>"];
      categories.forEach(function (cat) {
        parts.push(
          "<button class=\"filter-chip\" data-filter=\"" + safeText(cat.category) + "\" type=\"button\">" + safeText(cat.category) + "</button>"
        );
      });
      chips.innerHTML = parts.join("");

      chips.addEventListener("click", function (event) {
        const button = event.target.closest("button[data-filter]");
        if (!button) return;
        activeCategory = button.getAttribute("data-filter") || "all";
        chips.querySelectorAll(".filter-chip").forEach(function (node) {
          node.classList.toggle("is-active", node === button);
        });
        paint();
      });
    }

    if (search) {
      search.addEventListener("input", paint);
    }

    function paint() {
      const query = (search ? search.value : "").trim().toLowerCase();
      const html = categories
        .filter(function (cat) {
          if (activeCategory === "all") return true;
          return cat.category === activeCategory;
        })
        .map(function (cat) {
          let items = cat.items || [];
          if (query) {
            items = items.filter(function (item) {
              const combined = (item.name + " " + (item.prices || []).join(" ")).toLowerCase();
              return combined.includes(query);
            });
          }
          if (!items.length) return "";
          return renderPriceTable(cat, items);
        })
        .join("");

      box.innerHTML = html || "<div class=\"surface\"><p>По вашему запросу ничего не найдено. Попробуйте другой запрос или сбросьте фильтр.</p></div>";
    }

    paint();
  }

  function markActiveNav() {
    const page = document.body.getAttribute("data-page");
    if (!page) return;
    document.querySelectorAll("[data-main-nav] a").forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("data-link") === page);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initAnimation();
    initForms();
    initPricePage();
    markActiveNav();
  });
})();
