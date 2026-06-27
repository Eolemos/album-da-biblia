// Troque aqui pelo seu link real de checkout.
// Exemplo: "https://pay.hotmart.com/SEU_PRODUTO?checkoutMode=10"
const CHECKOUT_URL = "https://pay.cakto.com.br/tqrcuii";

const buyers = [
  "Marina", "Ana", "Júlia", "Antônia", "Adriana", "Juliana", "Fernanda", "Patrícia",
  "Aline", "Sophia", "Camila", "Amanda", "Bruna", "Letícia", "Vanessa", "Gabriela",
  "Alice", "Larissa", "Beatriz", "Helena", "Renata", "Esther", "Melissa", "Isabela"
];

function ready(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    fn();
  }
}

ready(() => {
  setupCheckoutButtons();
  setupFaq();
  setupCarousels();
  setupImageFallbacks();
  startFakeSalesNotifications();
});

function setupCheckoutButtons() {
  document.querySelectorAll(".js-checkout").forEach((button) => {
    button.setAttribute("href", CHECKOUT_URL || "#preco");
    button.setAttribute("target", "_blank");
    button.setAttribute("rel", "noopener noreferrer");
  });
}

function setupFaq() {
  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const isOpen = item.classList.contains("open");

      document.querySelectorAll(".faq-item.open").forEach((openItem) => {
        openItem.classList.remove("open");
      });

      if (!isOpen) item.classList.add("open");
    });
  });
}

function setupCarousels() {
  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
    const prev = carousel.querySelector(".prev");
    const next = carousel.querySelector(".next");
    const dotsWrap = carousel.querySelector(".carousel-dots");

    if (!track || slides.length === 0) return;

    let index = 0;
    let timer = null;

    const dots = slides.map((_, dotIndex) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Ir para imagem ${dotIndex + 1}`);
      dot.addEventListener("click", () => goTo(dotIndex, true));
      dotsWrap.appendChild(dot);
      return dot;
    });

    function render() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === index);
      });
    }

    function goTo(nextIndex, userAction = false) {
      index = (nextIndex + slides.length) % slides.length;
      render();

      if (userAction) {
        restart();
      }
    }

    function restart() {
      if (timer) {
        clearInterval(timer);
      }

      timer = setInterval(() => {
        goTo(index + 1);
      }, 5000);
    }

    if (prev) {
      prev.addEventListener("click", () => goTo(index - 1, true));
    }

    if (next) {
      next.addEventListener("click", () => goTo(index + 1, true));
    }

    render();
    restart();
  });
}

function setupImageFallbacks() {
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      const frame = img.closest(".image-frame");

      if (frame) {
        frame.classList.add("missing-image");
      }

      img.remove();
    });
  });
}

function startFakeSalesNotifications() {
  const area = document.getElementById("toastArea");

  if (!area) return;

  function show() {
    const name = buyers[Math.floor(Math.random() * buyers.length)];

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<strong>${name}</strong> acabou de comprar o Álbum da Bíblia`;

    area.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 4200);

    const nextTime = Math.floor(Math.random() * (20000 - 7000 + 1)) + 7000;

    setTimeout(show, nextTime);
  }

  setTimeout(show, 4500);
}