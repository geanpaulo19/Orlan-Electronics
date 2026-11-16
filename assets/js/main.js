/* ==========================================================================
   Orlan Electronics
   Shared interactions: navigation, reveals, service preview, filters, form
   ========================================================================== */
(function () {
  "use strict";

  var doc = document;
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------------- */
  function setupNav() {
    var toggle = doc.querySelector("[data-menu-toggle]");
    var menu = doc.getElementById("mobile-menu");

    if (!toggle || !menu) {
      return;
    }

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.setAttribute("aria-hidden", String(!open));
      menu.classList.toggle("is-open", open);
      doc.body.classList.toggle("menu-open", open);

      if (open) {
        var firstLink = menu.querySelector("a");
        if (firstLink) {
          window.setTimeout(function () {
            firstLink.focus();
          }, 60);
        }
      }
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        setOpen(false);
      }
    });

    doc.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 960 && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
      }
    });
  }

  /* ---------------------------------------------------------------
     Scroll reveals
     --------------------------------------------------------------- */
  function setupReveals() {
    var items = Array.prototype.slice.call(doc.querySelectorAll("[data-reveal]"));

    if (!items.length) {
      return;
    }

    if (prefersReduced || !("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" }
    );

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  /* ---------------------------------------------------------------
     Home service index preview
     --------------------------------------------------------------- */
  function setupServicePreview() {
    var rows = Array.prototype.slice.call(doc.querySelectorAll("[data-preview]"));
    var images = Array.prototype.slice.call(doc.querySelectorAll("[data-preview-image]"));
    var captionTitle = doc.querySelector("[data-preview-title]");
    var captionMeta = doc.querySelector("[data-preview-meta]");

    if (!rows.length || !images.length) {
      return;
    }

    function activate(row) {
      var key = row.getAttribute("data-preview");

      images.forEach(function (image) {
        image.classList.toggle("is-active", image.getAttribute("data-preview-image") === key);
      });

      if (captionTitle && row.getAttribute("data-preview-title")) {
        captionTitle.textContent = row.getAttribute("data-preview-title");
      }

      if (captionMeta && row.getAttribute("data-preview-meta")) {
        captionMeta.textContent = row.getAttribute("data-preview-meta");
      }
    }

    rows.forEach(function (row) {
      row.addEventListener("mouseenter", function () {
        activate(row);
      });
      row.addEventListener("focus", function () {
        activate(row);
      });
    });
  }

  /* ---------------------------------------------------------------
     Services filter
     --------------------------------------------------------------- */
  function setupFilters() {
    var chips = Array.prototype.slice.call(doc.querySelectorAll("[data-filter]"));
    var cards = Array.prototype.slice.call(doc.querySelectorAll("[data-category]"));
    var count = doc.querySelector("[data-filter-count]");
    var empty = doc.querySelector("[data-filter-empty]");

    if (!chips.length || !cards.length) {
      return;
    }

    function apply(category) {
      var visible = 0;

      cards.forEach(function (card) {
        var show = category === "all" || card.getAttribute("data-category") === category;
        card.hidden = !show;
        if (show) {
          visible += 1;
        }
      });

      chips.forEach(function (chip) {
        chip.setAttribute("aria-pressed", String(chip.getAttribute("data-filter") === category));
      });

      if (count) {
        count.textContent = visible + (visible === 1 ? " service" : " services");
      }

      if (empty) {
        empty.hidden = visible !== 0;
      }
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        apply(chip.getAttribute("data-filter"));
      });
    });

    apply("all");
  }

  /* ---------------------------------------------------------------
     Contact request form
     --------------------------------------------------------------- */
  function setupForm() {
    var form = doc.querySelector("[data-request-form]");

    if (!form) {
      return;
    }

    var config = window.ORLAN_CONFIG || {};
    var endpoint = String(config.sheetsEndpoint || "").trim();
    var formToken = String(config.formToken || "").trim();
    var isOnline = /^https?:\/\//i.test(endpoint);
    var success = doc.querySelector("[data-form-success]");
    var prefill = doc.querySelector("[data-form-prefill]");
    var prefillText = doc.querySelector("[data-form-prefill-text]");
    var resetButton = doc.querySelector("[data-form-reset]");
    var alertBox = doc.querySelector("[data-form-alert]");
    var formNote = doc.querySelector("[data-form-note]");
    var submitButton = form.querySelector("[data-form-submit]");
    var submitLabel = form.querySelector("[data-submit-label]");
    var successTitle = doc.querySelector("[data-success-title]");
    var successCopy = doc.querySelector("[data-success-copy]");
    var successDetail = doc.querySelector("[data-success-detail]");
    var serviceSelect = form.querySelector("#service");
    var honeypot = form.querySelector('[name="website"]');
    var params = new URLSearchParams(window.location.search);
    var requested = params.get("service");
    var submitting = false;
    var originalLabel = submitLabel ? submitLabel.textContent : "Send request";
    var businessEmail = config.businessEmail || "OERAAS@yahoo.com.ph";
    var businessPhone = config.businessPhone || "0905 266 3284";
    var phoneHref = "tel:+639052663284";
    var facebookUrl = "https://www.facebook.com/search/top?q=Orlan%20Elektronics";

    if (formNote && isOnline) {
      formNote.textContent = "Your request goes straight to our service team. We use your details only to respond.";
    }

    var serviceLabels = {
      "aircon-repair": "Aircon repair",
      "aircon-cleaning": "Aircon cleaning",
      "aircon-installation": "Aircon installation",
      "refrigerator": "Refrigerator repair",
      "freezer": "Freezer repair",
      "washing-machine": "Washing machine repair",
      "dryer": "Dryer repair",
      "tv": "LED/LCD TV repair",
      "tv-wall": "TV wall installation",
      "microwave": "Microwave oven repair",
      "rice-cooker": "Rice cooker repair",
      "electric-fan": "Electric fan repair",
      "amplifier": "Amplifier repair",
      "component": "Component repair",
      "other": "Other or not sure"
    };

    if (requested && serviceSelect) {
      var matching = Array.prototype.slice.call(serviceSelect.options).some(function (option) {
        return option.value === requested;
      });

      if (matching) {
        serviceSelect.value = requested;

        if (prefill && prefillText) {
          prefillText.textContent = serviceLabels[requested] || "Selected service";
          prefill.hidden = false;
        }
      }
    }

    function valueOf(name) {
      var input = form.querySelector('[name="' + name + '"]');
      return input ? input.value.trim() : "";
    }

    function fieldWrap(input) {
      return input ? input.closest(".field") : null;
    }

    function setError(input, message) {
      var wrap = fieldWrap(input);
      var error = wrap ? wrap.querySelector(".field__error") : null;

      if (!wrap || !error) {
        return;
      }

      if (message) {
        wrap.classList.add("has-error");
        input.setAttribute("aria-invalid", "true");
        error.textContent = message;
      } else {
        wrap.classList.remove("has-error");
        input.removeAttribute("aria-invalid");
        error.textContent = "";
      }
    }

    function validate() {
      var valid = true;
      var firstInvalid = null;
      var name = form.querySelector('[name="name"]');
      var mobile = form.querySelector('[name="mobile"]');
      var email = form.querySelector('[name="email"]');
      var address = form.querySelector('[name="address"]');
      var service = form.querySelector('[name="service"]');
      var details = form.querySelector('[name="details"]');

      setError(name, "");
      setError(mobile, "");
      setError(email, "");
      setError(address, "");
      setError(service, "");
      setError(details, "");

      if (valueOf("name").length < 2) {
        setError(name, "Please enter your name.");
        valid = false;
        firstInvalid = firstInvalid || name;
      }

      var digits = valueOf("mobile").replace(/\D/g, "");
      if (digits.length < 10) {
        setError(mobile, "Enter a mobile number with at least 10 digits.");
        valid = false;
        firstInvalid = firstInvalid || mobile;
      }

      var emailValue = valueOf("email");
      if (emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
        setError(email, "Check the email address.");
        valid = false;
        firstInvalid = firstInvalid || email;
      }

      if (valueOf("address").length < 6) {
        setError(address, "Add your street, barangay, or city.");
        valid = false;
        firstInvalid = firstInvalid || address;
      }

      if (!valueOf("service")) {
        setError(service, "Choose the service you need.");
        valid = false;
        firstInvalid = firstInvalid || service;
      }

      if (firstInvalid) {
        firstInvalid.focus();
      }

      return valid;
    }

    function clearAlert() {
      if (!alertBox) {
        return;
      }
      alertBox.hidden = true;
      alertBox.innerHTML = "";
    }

    function showAlert(html) {
      if (!alertBox) {
        return;
      }
      alertBox.innerHTML = html;
      alertBox.hidden = false;
    }

    function setLoading(loading) {
      submitting = loading;

      if (submitButton) {
        submitButton.disabled = loading;
        submitButton.classList.toggle("is-loading", loading);
        submitButton.setAttribute("aria-busy", loading ? "true" : "false");
      }

      if (submitLabel) {
        submitLabel.textContent = loading ? "Sending..." : originalLabel;
      }
    }

    function setSuccessContent(mode) {
      if (mode === "online") {
        if (successTitle) {
          successTitle.textContent = "Salamat! Your request is in.";
        }
        if (successCopy) {
          successCopy.textContent = "We received your request and will get back to you at the number you provided.";
        }
        if (successDetail) {
          successDetail.innerHTML =
            'If you need to add something, call or text <a href="' + phoneHref + '">' + businessPhone + '</a> or message us on <a href="' + facebookUrl + '" target="_blank" rel="noopener">Facebook</a>.';
        }
      } else {
        if (successTitle) {
          successTitle.textContent = "Salamat! Your request is ready to send.";
        }
        if (successCopy) {
          successCopy.textContent = "Your email app should have opened with the details filled in. Send the message and we will reply as soon as we can.";
        }
        if (successDetail) {
          successDetail.innerHTML =
            'If it did not open, email <a href="mailto:' + businessEmail + '">' + businessEmail + '</a> or call <a href="' + phoneHref + '">' + businessPhone + '</a>.';
        }
      }
    }

    function showSuccess(mode) {
      if (!success) {
        return;
      }

      form.hidden = true;
      success.hidden = false;
      setSuccessContent(mode);

      var heading = success.querySelector("h2");
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus();
      }
    }

    function resetForm() {
      form.reset();
      form.hidden = false;
      if (success) {
        success.hidden = true;
      }
      clearAlert();
      setLoading(false);
      if (prefill) {
        prefill.hidden = true;
      }
      var firstField = form.querySelector("#name");
      if (firstField) {
        firstField.focus();
      }
    }

    function buildMailto(serviceLabel) {
      var subject = "Service request: " + serviceLabel + " - " + valueOf("name");
      var lines = [
        "Hello Orlan Electronics,",
        "",
        "I would like to request a service.",
        "",
        "Name: " + valueOf("name"),
        "Mobile: " + valueOf("mobile"),
        "Email: " + (valueOf("email") || "Not provided"),
        "Service: " + serviceLabel,
        "Address: " + valueOf("address"),
        "Preferred date: " + (valueOf("date") || "Flexible"),
        "",
        "Details:",
        valueOf("details") || "No additional details provided.",
        "",
        "Thank you."
      ];

      return "mailto:" + businessEmail + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
    }

    function submitOnline(serviceLabel) {
      var body = new URLSearchParams();
      body.append("name", valueOf("name"));
      body.append("mobile", valueOf("mobile"));
      body.append("email", valueOf("email"));
      body.append("service", serviceLabel);
      body.append("address", valueOf("address"));
      body.append("preferredDate", valueOf("date"));
      body.append("details", valueOf("details"));
      body.append("submittedAt", new Date().toISOString());
      body.append("page", doc.title);
      body.append("source", window.location.href);
      body.append("userAgent", navigator.userAgent);
      body.append("token", formToken);
      body.append("website", honeypot ? honeypot.value : "");

      setLoading(true);

      fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        body: body
      })
        .then(function () {
          setLoading(false);
          showSuccess("online");
        })
        .catch(function () {
          setLoading(false);
          showAlert(
            'We could not send that request. Check your connection and try again, or call or text <a href="' +
              phoneHref +
              '">' +
              businessPhone +
              "</a> and we will take the details."
          );
        });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (submitting) {
        return;
      }

      clearAlert();

      if (honeypot && honeypot.value) {
        showSuccess("online");
        return;
      }

      if (!validate()) {
        return;
      }

      var serviceValue = valueOf("service");
      var serviceLabel = serviceLabels[serviceValue] || serviceValue;

      if (!isOnline) {
        window.location.href = buildMailto(serviceLabel);
        showSuccess("mailto");
        return;
      }

      submitOnline(serviceLabel);
    });

    form.addEventListener("input", function (event) {
      var input = event.target;
      if (input && input.matches("input, select, textarea")) {
        setError(input, "");
        clearAlert();
      }
    });

    if (resetButton) {
      resetButton.addEventListener("click", resetForm);
    }
  }

  /* ---------------------------------------------------------------
     Footer year
     --------------------------------------------------------------- */
  function setupYear() {
    var year = doc.querySelectorAll("[data-year]");
    var current = String(new Date().getFullYear());

    year.forEach(function (node) {
      node.textContent = current;
    });
  }

  function init() {
    setupNav();
    setupReveals();
    setupServicePreview();
    setupFilters();
    setupForm();
    setupYear();
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
