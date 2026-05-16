        /* ── CARRUSEL + MÚSICA — arrancan con el primer clic/scroll ── */
        const slides     = document.querySelectorAll(".carousel-slide");
        const audio      = document.getElementById("bg-audio");
        const btn        = document.getElementById("music-btn");
        const note       = document.getElementById("music-note");
        const fill       = document.getElementById("progress-fill");
        const timeLabel  = document.getElementById("music-time");
        const hint       = document.getElementById("touch-hint");
        let   current    = 0;
        let   playing    = false;
        let   carStarted = false;
        const INTERVAL   = 5000;

        function nextSlide() {
            slides[current].classList.remove("active");
            current = (current + 1) % slides.length;
            slides[current].classList.add("active");
        }

        function unlockExperience(e) {
            if (carStarted) return;
            carStarted = true;

            // Arranca música PRIMERO, directo en el handler del evento
            audio.volume = 0.2;
            const playPromise = audio.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    playing = true;
                    btn.textContent = "⏸";
                    note.classList.remove("paused");
                }).catch(() => {
                    btn.textContent = "▶";
                    note.classList.add("paused");
                });
            }

            // Oculta el hint
            if (hint) hint.classList.add("hidden");

            // Muestra la flecha de scroll
            const arrow = document.getElementById("scroll-arrow");
            if (arrow) setTimeout(() => arrow.classList.add("visible"), 600);

            // Arranca carrusel
            setInterval(nextSlide, INTERVAL);

            document.removeEventListener("click",    unlockExperience);
            document.removeEventListener("touchend", unlockExperience);
        }

        /* ── WELCOME SCREEN ── */
        const welcomeScreen = document.getElementById("welcome-screen");
        const wsBtn         = document.getElementById("ws-btn");

        wsBtn.addEventListener("click", () => {
            unlockExperience();
            welcomeScreen.classList.add("hidden");
            setTimeout(() => welcomeScreen.style.display = "none", 900);
        });

        wsBtn.addEventListener("touchend", (e) => {
            e.preventDefault();
            unlockExperience();
            welcomeScreen.classList.add("hidden");
            setTimeout(() => welcomeScreen.style.display = "none", 900);
        });

        document.addEventListener("click",    unlockExperience);
        document.addEventListener("touchend", unlockExperience);

        // Oculta la flecha al hacer scroll
        window.addEventListener("scroll", () => {
            const arrow = document.getElementById("scroll-arrow");
            if (arrow && window.scrollY > 80) arrow.classList.remove("visible");
        }, { passive: true });

        /* ── CUENTA REGRESIVA ── */
        const weddingDate = new Date("2026-08-07T16:00:00");
        function updateCountdown() {
            const now  = new Date();
            const diff = weddingDate - now;
            if (diff <= 0) {
                ["cd-d","cd-h","cd-m","cd-s"].forEach(
                    id => document.getElementById(id).textContent = "00"
                );
                return;
            }
            const pad = n => String(Math.floor(n)).padStart(2, "0");
            document.getElementById("cd-d").textContent = pad(diff / 86400000);
            document.getElementById("cd-h").textContent = pad((diff % 86400000) / 3600000);
            document.getElementById("cd-m").textContent = pad((diff % 3600000)  / 60000);
            document.getElementById("cd-s").textContent = pad((diff % 60000)    / 1000);
        }
        updateCountdown();
        setInterval(updateCountdown, 1000);

        /* ── BOTÓN PAUSAR / REANUDAR ── */
        function toggleMusic() {
            if (playing) { audio.pause(); btn.textContent="▶"; note.classList.add("paused"); }
            else { audio.play(); btn.textContent="⏸"; note.classList.remove("paused"); }
            playing = !playing;
        }

        /* ── BARRA DE PROGRESO ── */
        audio.addEventListener("timeupdate", () => {
            if (!audio.duration) return;
            fill.style.width = (audio.currentTime / audio.duration * 100) + "%";
            const m = Math.floor(audio.currentTime / 60);
            const s = Math.floor(audio.currentTime % 60).toString().padStart(2, "0");
            timeLabel.textContent = m + ":" + s;
        });

        function seekMusic(e) {
            const bar  = document.getElementById("progress-bar");
            const rect = bar.getBoundingClientRect();
            audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
        }

