(function(){
  "use strict";

  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var total = slides.length;
  var current = 0;

  var dotsContainer = document.getElementById("dots");
  var counterEl = document.getElementById("slideCurrent");
  var totalEl = document.getElementById("slideTotal");
  var btnPrev = document.getElementById("btnPrev");
  var btnNext = document.getElementById("btnNext");

  totalEl.textContent = String(total).padStart(2, "0");

  // --- Construir puntos de navegación ---
  slides.forEach(function(slide, i){
    var dot = document.createElement("button");
    dot.className = "dot";
    dot.setAttribute("aria-label", "Ir a: " + (slide.dataset.title || "Diapositiva " + (i + 1)));
    dot.addEventListener("click", function(){ goTo(i); });
    dotsContainer.appendChild(dot);
  });
  var dots = Array.prototype.slice.call(dotsContainer.children);

  function render(){
    slides.forEach(function(slide, i){
      slide.classList.remove("is-active", "is-prev");
      if (i === current) slide.classList.add("is-active");
      else if (i < current) slide.classList.add("is-prev");
    });
    dots.forEach(function(dot, i){
      dot.classList.toggle("is-active", i === current);
    });
    counterEl.textContent = String(current + 1).padStart(2, "0");
    btnPrev.style.opacity = current === 0 ? "0.35" : "1";
    btnNext.style.opacity = current === total - 1 ? "0.35" : "1";
  }

  function goTo(index){
    if (index < 0 || index >= total) return;
    current = index;
    render();
  }

  function next(){ goTo(current + 1); }
  function prev(){ goTo(current - 1); }

  btnNext.addEventListener("click", next);
  btnPrev.addEventListener("click", prev);

  // --- Navegación por teclado ---
  document.addEventListener("keydown", function(e){
    if (lightbox.classList.contains("is-open")){
      if (e.key === "Escape") closeLightbox();
      return;
    }
    if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); next(); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); prev(); }
    else if (e.key === "Home") { e.preventDefault(); goTo(0); }
    else if (e.key === "End") { e.preventDefault(); goTo(total - 1); }
  });

  // --- Deslizar (touch) ---
  var touchStartX = null;
  document.addEventListener("touchstart", function(e){ touchStartX = e.changedTouches[0].clientX; }, { passive:true });
  document.addEventListener("touchend", function(e){
    if (touchStartX === null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 60) { dx < 0 ? next() : prev(); }
    touchStartX = null;
  }, { passive:true });

  // --- Lightbox de imágenes y diagramas ---
  var lightbox = document.getElementById("lightbox");
  var lightboxStage = document.getElementById("lightboxStage");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxClose = document.getElementById("lightboxClose");

  document.querySelectorAll("[data-lightbox]").forEach(function(img){
    img.addEventListener("click", function(){
      if (img.classList.contains("cover__logo")){
        img.classList.remove("is-bumped");
        void img.offsetWidth; // reinicia la animación si se toca varias veces seguidas
        img.classList.add("is-bumped");
      }
      lightboxStage.innerHTML = "";
      var clone = lightboxImg.cloneNode(false);
      clone.id = "lightboxImg";
      clone.src = img.getAttribute("src");
      clone.alt = img.getAttribute("alt") || "";
      lightboxStage.appendChild(clone);
      lightbox.classList.add("is-open");
    });
  });

  var scrumWheel = document.getElementById("scrumWheel");
  if (scrumWheel){
    function openScrumLightbox(){
      var svg = scrumWheel.querySelector("svg").cloneNode(true);
      svg.classList.add("lightbox__svg");
      lightboxStage.innerHTML = "";
      lightboxStage.appendChild(svg);
      lightbox.classList.add("is-open");
    }
    scrumWheel.addEventListener("click", openScrumLightbox);
    scrumWheel.addEventListener("keydown", function(e){
      if (e.key === "Enter" || e.key === " "){ e.preventDefault(); openScrumLightbox(); }
    });
  }

  function closeLightbox(){
    lightbox.classList.remove("is-open");
    lightboxStage.innerHTML = "";
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function(e){
    if (e.target === lightbox) closeLightbox();
  });

  render();
})();
