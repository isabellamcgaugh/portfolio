const revealItems = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".nav a");
const modeToggle = document.querySelector("#modeToggle");
const progressFill = document.querySelector("#progressFill");
const tiltItems = document.querySelectorAll(".tilt");
const loopVideos = document.querySelectorAll(".loop-video");

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
