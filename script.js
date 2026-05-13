const revealItems = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".nav a");
const modeToggle = document.querySelector("#modeToggle");
const progressFill = document.querySelector("#progressFill");
const tiltItems = document.querySelectorAll(".tilt");
const loopVideos = document.querySelectorAll(".loop-video");
const clickSequences = document.querySelectorAll(".click-sequence");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));

navLinks.forEach((link) => {
  link.addEventListener("mousemove", (event) => {
    const rect = link.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    link.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
  });
  link.addEventListener("mouseleave", () => {
    link.style.transform = "translate(0, 0)";
  });
});

if (modeToggle) {
  modeToggle.addEventListener("click", () => {
    document.body.classList.toggle("night");
    modeToggle.textContent = document.body.classList.contains("night")
      ? "Day"
      : "Night";
  });
}

window.addEventListener("scroll", () => {
  if (!progressFill) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressFill.style.width = `${Math.min(progress, 100)}%`;
});

tiltItems.forEach((item) => {
  item.addEventListener("mousemove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -3;
    const rotateY = ((x / rect.width) - 0.5) * 4;
    item.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  item.addEventListener("mouseleave", () => {
    item.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  });
});

loopVideos.forEach((video) => {
  video.muted = true;
  const playVideo = () => {
    video.play().catch(() => {});
  };

  video.addEventListener("loadeddata", playVideo);
  playVideo();

  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          playVideo();
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.15 }
  );

  videoObserver.observe(video);
});

clickSequences.forEach((sequence) => {
  const images = Array.from(sequence.querySelectorAll("img"));
  const hint = sequence.querySelector(".sequence-hint");
  if (!images.length) return;

  let index = 0;
  let timer = null;

  const show = (nextIndex) => {
    images.forEach((img, i) => {
      img.classList.toggle("active", i === nextIndex);
    });
    index = nextIndex;
  };

  const startAuto = () => {
    if (timer) return;
    timer = window.setInterval(() => {
      show((index + 1) % images.length);
    }, 900);
    if (hint) hint.textContent = "Playing";
  };

  const stopAuto = () => {
    if (!timer) return;
    window.clearInterval(timer);
    timer = null;
    if (hint) hint.textContent = "Click to play sequence";
  };

  show(0);

  sequence.addEventListener("click", () => {
    show((index + 1) % images.length);
    startAuto();
  });

  sequence.addEventListener("mouseleave", () => {
    stopAuto();
  });
});

document.addEventListener("click", (event) => {
  const pulse = document.createElement("span");
  pulse.className = "click-pulse";
  pulse.style.left = `${event.clientX}px`;
  pulse.style.top = `${event.clientY}px`;
  document.body.appendChild(pulse);

  pulse.addEventListener("animationend", () => {
    pulse.remove();
  });
});
