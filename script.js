document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const welcome = $("#welcome");
  const experience = $("#experience");
  const enterButton = $("#enterButton");
  const bgMusic = $("#bgMusic");
  const musicToggle = $("#musicToggle");
  const musicStatus = $("#musicStatus");
  const menuToggle = $("#menuToggle");
  const siteNav = $("#siteNav");
  let lastFocusedElement = null;
  let toastTimer;

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  enterButton.addEventListener("click", () => {
    welcome.classList.add("hidden");
    experience.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("Welcome to your little world, Ife mi. ♡");
  });

  musicToggle.addEventListener("click", async () => {
    if (bgMusic.paused) {
      if (!bgMusic.getAttribute("src") || bgMusic.getAttribute("src").includes("our-song.mp3")) {
        // The local file is optional; if it has not been added, show a helpful message.
        try {
          await bgMusic.play();
          musicToggle.textContent = "Pause ♫";
          musicStatus.textContent = "Playing for you";
        } catch {
          musicStatus.textContent = "Add your song file";
          showToast("Add your chosen song as assets/audio/our-song.mp3 first.");
        }
      }
    } else {
      bgMusic.pause();
      musicToggle.textContent = "Play ♫";
      musicStatus.textContent = "A little music?";
    }
  });
  bgMusic.addEventListener("error", () => {
    musicToggle.textContent = "Play ♫";
    musicStatus.textContent = "Add your song file";
  });

  menuToggle.addEventListener("click", () => {
    const open = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.textContent = open ? "×" : "☰";
  });
  $$(".site-nav a").forEach(link => link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  }));

  $$(".reason-card").forEach(card => {
    card.addEventListener("click", () => {
      const isExpanded = card.getAttribute("aria-expanded") === "true";
      card.setAttribute("aria-expanded", String(!isExpanded));
      const hint = $(".reason-hint", card);
      if (hint) hint.textContent = isExpanded ? "A little reminder ↗" : "Keep this close ♡";
    });
  });

  const letters = {
    miss: {
      title: "When you miss me, Ife mi.",
      text: "If I could, I'd close the distance between us with one hug and stay there for a while. Until I can, I hope this little note reminds you that you matter to me even when we're not in the same place. Think of one thing that makes you smile about us, take a deep breath, and remember that you are loved. I look forward to the next memory we get to make together. ♡"
    },
    hard: {
      title: "For a difficult day, Mama.",
      text: "You don't have to solve everything today. You are allowed to rest, feel what you feel, and take things one step at a time. A difficult day doesn't define you, and you don't have to pretend to be okay to deserve care. I hope you give yourself the gentleness you so freely deserve. If you want to talk, I want to listen; if you need a little quiet, that deserves respect too. I'm rooting for you, my love."
    },
    doubt: {
      title: "Please don't forget who you are.",
      text: "There is so much more to you than one mistake, one hard season, or one moment of doubt. I hope you keep making room for your own dreams and keep giving yourself credit for how far you've come. You don't have to be perfect to be worthy of good things. I see someone with her own light, her own story, and so much more ahead of her. Please be kind to yourself, Khemmie. ♡"
    },
    understood: {
      title: "I want to keep learning you.",
      text: "I know that love doesn't mean I'll always understand everything immediately. I want to ask, listen, learn, and make room for your honest feelings, even when they are difficult to explain. You don't have to express everything perfectly for it to matter. I hope we keep creating space where we can be honest with each other and grow through the things we learn."
    },
    sleep: {
      title: "A soft goodnight, Habibi.",
      text: "Let the day settle for a little while. You don't have to carry every thought into tomorrow. Unclench your shoulders, take a slow breath, and let yourself rest. I hope sleep finds you gently and tomorrow brings you a reason to smile. If I were there, I'd remind you to get comfortable, pull the blanket close, and stop borrowing worries from a day that hasn't arrived yet. Goodnight, my Ife mi. ♡"
    },
    future: {
      title: "For the chapters ahead.",
      text: "When I think about the future, I hope for more than beautiful moments. I hope we keep learning how to communicate, how to support each other's dreams, how to be honest when something hurts, and how to celebrate each other's growth. I hope we build something that feels safe and joyful for both of us. I can't write every page in advance, but I know I'd like to keep writing this story with you."
    }
  };

  function openModal(id) {
    lastFocusedElement = document.activeElement;
    const modal = document.getElementById(id);
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    const close = $(".modal-close", modal);
    if (close) close.focus();
  }
  function closeModal(modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
    const video = $("video", modal);
    if (video) { video.pause(); video.currentTime = 0; }
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") lastFocusedElement.focus();
  }
  $$(".modal").forEach(modal => {
    $$("[data-close='true']", modal).forEach(el => el.addEventListener("click", () => closeModal(modal)));
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") $$(".modal:not(.hidden)").forEach(closeModal);
  });

  $$(".envelope-card").forEach(card => card.addEventListener("click", () => {
    const letter = letters[card.dataset.letter];
    if (!letter) return;
    $("#modalTitle").textContent = letter.title;
    $("#modalLetterText").textContent = letter.text;
    openModal("letterModal");
  }));

  const memoryPlayer = $("#memoryPlayer");
  // Legacy video modal remains available if another element invokes it; the main memories now play inline.

  $("#finalVideoButton").addEventListener("click", () => {
    const player = $("#birthdayPlayer");
    const missing = $("#birthdayMissing");
    missing.classList.add("hidden");
    player.classList.remove("hidden");
    player.src = "assets/videos/ekemini-07.mp4";
    player.load();
    openModal("birthdayModal");
    player.play().catch(() => {});
    player.addEventListener("error", function handleBirthdayMissing() {
      missing.classList.remove("hidden");
      player.classList.add("hidden");
      player.removeEventListener("error", handleBirthdayMissing);
    }, { once: true });
  });

  $("#celebrateButton").addEventListener("click", () => {
    burstConfetti(90);
    openModal("flirtyModal");
  });

  // Keep the video controls usable; inline playback does not require a popup.
  $$(".memory-inline-video").forEach(video => {
    video.addEventListener("error", () => {
      const card = video.closest(".video-card");
      if (card) {
        const note = document.createElement("p");
        note.className = "video-load-error";
        note.textContent = "This video couldn't load. Check that the MP4 is inside assets/videos and the filename matches.";
        if (!card.querySelector(".video-load-error")) card.appendChild(note);
      }
    });
  });

  $("#saveAnswer").addEventListener("click", () => {
    const answer = $("#answerText").value.trim();
    if (!answer) {
      $("#answerFeedback").textContent = "Write anything that comes to your heart first. ♡";
      return;
    }
    try {
      const saved = JSON.parse(localStorage.getItem("ekeminiAnswers") || "[]");
      saved.push({ answer, savedAt: new Date().toISOString() });
      localStorage.setItem("ekeminiAnswers", JSON.stringify(saved));
      $("#answerFeedback").textContent = "Saved on this device. Keep this little memory. ♡";
      showToast("Your answer has been saved on this device.");
    } catch {
      $("#answerFeedback").textContent = "This browser couldn't save the answer, but you can copy it before closing.";
    }
  });

  function burstConfetti(count) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) { showToast("Happy birthday, Ekemini! ♡"); return; }
    const symbols = ["♡", "✦", "✧", "·"];
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("span");
      piece.className = "confetti";
      piece.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.color = ["#d7b77a", "#b66c81", "#f5e5dc", "#8d435b"][Math.floor(Math.random() * 4)];
      piece.style.fontSize = `${10 + Math.random() * 12}px`;
      piece.style.setProperty("--duration", `${2.4 + Math.random() * 2.4}s`);
      piece.style.setProperty("--drift", `${-80 + Math.random() * 160}px`);
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 5000);
    }
    showToast("Happy birthday, my Ekemini! ♡");
  }
});
