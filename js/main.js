// ==================== DATA STORAGE ====================
        let ucapanData = JSON.parse(localStorage.getItem('weddingUcapan')) || [];

        if (ucapanData.length === 0) {
            ucapanData = [
                {
                    id: 1,
                    nama: 'Keluarga Besar',
                    kehadiran: 'hadir',
                    jumlah: '2',
                    ucapan: 'Barakallahu laka wa baraka alaika wa jama\'a bainakuma fi khair. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.',
                    waktu: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    id: 2,
                    nama: 'Teman Kuliah',
                    kehadiran: 'hadir',
                    jumlah: '1',
                    ucapan: 'Selamat ya Hilda & Reza! Akhirnya pelabuhan hati sudah ditemukan. Semoga bahagia selamanya!',
                    waktu: new Date(Date.now() - 172800000).toISOString()
                }
            ];
            saveData();
        }

        function saveData() {
            localStorage.setItem('weddingUcapan', JSON.stringify(ucapanData));
        }

        // ==================== GSAP ANIMATIONS ====================
        gsap.registerPlugin(ScrollTrigger);

        // Only run animations if not reduced motion preferred
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!prefersReducedMotion) {
            gsap.utils.toArray('.reveal').forEach((element) => {
                gsap.fromTo(element,
                    { opacity: 0, y: 50, z: -30, rotateX: 10 },
                    {
                        opacity: 1,
                        y: 0,
                        z: 0,
                        rotateX: 0,
                        duration: 0.8,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: element,
                            start: 'top 85%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            });

            // 3D Parallax for ornaments
            gsap.utils.toArray('.ornament-corner, .floral-corner, .flourish-ornament, .geometric-pattern').forEach((ornament) => {
                gsap.to(ornament, {
                    y: -40,
                    z: 15,
                    scrollTrigger: {
                        trigger: ornament.parentElement,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1
                    }
                });
            });
        } else {
            // Show all elements immediately if reduced motion
            document.querySelectorAll('.reveal').forEach(el => {
                el.style.opacity = 1;
                el.style.transform = 'none';
            });
        }

        // ==================== FLOATING NAVIGATION ====================
        const floatingNav = document.getElementById('floatingNav');
        const navLinks = floatingNav.querySelectorAll('a');
        const sections = document.querySelectorAll('section[id]');
        let isNavVisible = false;

        // Show/hide navigation based on scroll position
        function handleNavVisibility() {
            const scrollY = window.scrollY;
            const heroHeight = window.innerHeight * 0.6;

            if (scrollY > heroHeight && !isNavVisible) {
                floatingNav.classList.add('visible');
                isNavVisible = true;
            } else if (scrollY <= heroHeight && isNavVisible) {
                floatingNav.classList.remove('visible');
                isNavVisible = false;
            }
        }

        // Highlight active section in navigation
        function highlightActiveSection() {
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                const sectionHeight = section.offsetHeight;

                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === current) {
                    link.classList.add('active');
                }
            });
        }

        // Smooth scroll to section
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        window.addEventListener('scroll', () => {
            handleNavVisibility();
            highlightActiveSection();
        }, { passive: true });

        // ==================== COVER PAGE ====================
        function openInvitation() {
            const coverPage = document.getElementById('coverPage');
            const mainContent = document.getElementById('mainContent');
            const bgMusic = document.getElementById('bgMusic');

            coverPage.classList.add('hidden');
            mainContent.classList.remove('opacity-0');
            document.body.classList.remove('cover-open');

            bgMusic.play().then(() => {
                document.getElementById('musicBtn').classList.add('rotating');
                isPlaying = true;
            }).catch(() => {});

            window.scrollTo(0, 0);
            renderUcapan();
        }

        // ==================== 3D MOUSE TILT EFFECT ====================
        const coverPage = document.getElementById('coverPage');
        const coverContent = coverPage.querySelector('.cover-content');

        if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
            coverPage.addEventListener('mousemove', (e) => {
                const { clientX, clientY } = e;
                const { innerWidth, innerHeight } = window;

                const xPercent = (clientX / innerWidth - 0.5) * 2;
                const yPercent = (clientY / innerHeight - 0.5) * 2;

                gsap.to(coverContent, {
                    rotateY: xPercent * 5,
                    rotateX: -yPercent * 5,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });

            coverPage.addEventListener('mouseleave', () => {
                gsap.to(coverContent, {
                    rotateY: 0,
                    rotateX: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });
        }

        // ==================== MUSIC ====================
        let isPlaying = false;
        function toggleMusic() {
            const bgMusic = document.getElementById('bgMusic');
            const musicBtn = document.getElementById('musicBtn');
            const musicIcon = document.getElementById('musicIcon');

            if (isPlaying) {
                bgMusic.pause();
                musicBtn.classList.remove('rotating');
                musicIcon.classList.replace('ph-speaker-high', 'ph-speaker-slash');
            } else {
                bgMusic.play();
                musicBtn.classList.add('rotating');
                musicIcon.classList.replace('ph-speaker-slash', 'ph-speaker-high');
            }
            isPlaying = !isPlaying;
        }

        // ==================== COUNTDOWN ====================
        // Define both event dates - countdown will target the earlier date
        // Akad: 18 Feb 2026, Resepsi: 25 Feb 2026
        const AKAD_DATE = new Date('February 18, 2026 08:00:00').getTime();
        const RESEPSI_DATE = new Date('February 25, 2026 18:00:00').getTime();

        // Determine which event comes first
        const COUNTDOWN_TARGET = Math.min(AKAD_DATE, RESEPSI_DATE);
        const FIRST_EVENT_NAME = AKAD_DATE <= RESEPSI_DATE ? 'Akad Nikah' : 'Resepsi';
        const FIRST_EVENT_DATE = new Date(COUNTDOWN_TARGET);

        // Format date for display: DD . MM . YYYY
        const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const dayName = dayNames[FIRST_EVENT_DATE.getDay()];
        const day = String(FIRST_EVENT_DATE.getDate()).padStart(2, '0');
        const month = String(FIRST_EVENT_DATE.getMonth() + 1).padStart(2, '0');
        const year = FIRST_EVENT_DATE.getFullYear();
        const formattedDate = `${day} . ${month} . ${year}`;

        // Update the label to show which event is being counted down
        document.getElementById('countdownTargetName').textContent = FIRST_EVENT_NAME;

        // Update cover page date
        const coverDayNameEl = document.getElementById('coverDayName');
        const coverDateEl = document.getElementById('coverDate');
        if (coverDayNameEl) coverDayNameEl.textContent = dayName;
        if (coverDateEl) coverDateEl.textContent = formattedDate;

        // Update hero section date
        const heroDayNameEl = document.getElementById('heroDayName');
        const heroDateEl = document.getElementById('heroDate');
        if (heroDayNameEl) heroDayNameEl.textContent = dayName;
        if (heroDateEl) heroDateEl.textContent = formattedDate;

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = COUNTDOWN_TARGET - now;

            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                document.getElementById('days').textContent = String(days).padStart(2, '0');
                document.getElementById('hours').textContent = String(hours).padStart(2, '0');
                document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
                document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
            } else {
                document.getElementById('days').textContent = '00';
                document.getElementById('hours').textContent = '00';
                document.getElementById('minutes').textContent = '00';
                document.getElementById('seconds').textContent = '00';
            }
        }
        setInterval(updateCountdown, 1000);
        updateCountdown();

        // ==================== SAVE TO CALENDAR ====================
        function saveToCalendar() {
            // Google Calendar URL parameters
            // Format dates: YYYYMMDDTHHMMSSZ (UTC)
            // WIB (UTC+7): 08:00 WIB = 01:00 UTC, 18:00 WIB = 11:00 UTC

            const akadTitle = encodeURIComponent('Akad Nikah Hilda & Reza');
            const akadDates = '20260218T010000Z/20260218T030000Z'; // 18 Feb 2026, 08:00-10:00 WIB
            const akadLocation = encodeURIComponent('Batakan Beach Club Village, Jl. Marina Emas Timur V No.25, Keputih, Surabaya');
            const akadDetails = encodeURIComponent('Akad Nikah Hilda & Reza\n\nMohon doa restu agar acara berjalan lancar.\n\nResepsi akan diadakan pada tanggal 25 Februari 2026 pukul 18.00 WIB di Gedung Graha Widya Bhakti, Jl. Menur Pumpungan No.30, Surabaya.');

            const resepsiTitle = encodeURIComponent('Resepsi Pernikahan Hilda & Reza');
            const resepsiDates = '20260225T110000Z/20260225T150000Z'; // 25 Feb 2026, 18:00-22:00 WIB
            const resepsiLocation = encodeURIComponent('Gedung Graha Widya Bhakti, Jl. Menur Pumpungan No.30, Surabaya');
            const resepsiDetails = encodeURIComponent('Resepsi Pernikahan Hilda & Reza\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.');

            // Build Google Calendar URLs
            const akadUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${akadTitle}&dates=${akadDates}&details=${akadDetails}&location=${akadLocation}`;
            const resepsiUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${resepsiTitle}&dates=${resepsiDates}&details=${resepsiDetails}&location=${resepsiLocation}`;

            // Open both events in new tabs (Akad first, then Resepsi)
            window.open(akadUrl, '_blank');

            // Delay opening second tab to avoid popup blocker
            setTimeout(() => {
                window.open(resepsiUrl, '_blank');
            }, 500);

            showToast('Google Calendar terbuka! Silakan simpan kedua acara.');
        }

        // ==================== LIGHTBOX ====================
        function openLightbox(element) {
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightboxImg');
            lightboxImg.src = element.querySelector('img').src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            document.getElementById('lightbox').classList.remove('active');
            document.body.style.overflow = '';
        }

        // ==================== UTILITY ====================
        function showToast(message, type = 'success') {
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toastMessage');
            toastMessage.textContent = message;

            if (type === 'error') {
                toast.style.background = '#c45b5b';
            } else {
                toast.style.background = '#4A574B';
            }

            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }

        function copyToClipboard(text, successMessage) {
            navigator.clipboard.writeText(text).then(() => {
                showToast(successMessage);
            }).catch(() => {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                showToast(successMessage);
            });
        }

        function formatDate(isoString) {
            const date = new Date(isoString);
            const options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            return date.toLocaleDateString('id-ID', options);
        }

        // ==================== RSVP & UCAPAN ====================
        function renderUcapan() {
            const list = document.getElementById('ucapanList');
            const emptyState = document.getElementById('emptyState');

            const total = ucapanData.length;
            const hadir = ucapanData.filter(u => u.kehadiran === 'hadir').length;
            const tidakHadir = ucapanData.filter(u => u.kehadiran === 'tidak_hadir').length;

            document.getElementById('statTotal').textContent = total;
            document.getElementById('statHadir').textContent = hadir;
            document.getElementById('statTidakHadir').textContent = tidakHadir;

            if (ucapanData.length === 0) {
                list.innerHTML = '';
                emptyState.style.display = 'block';
                return;
            }

            emptyState.style.display = 'none';

            const sorted = [...ucapanData].sort((a, b) => new Date(b.waktu) - new Date(a.waktu));

            list.innerHTML = sorted.map(item => `
                <div class="ucapan-card" data-id="${item.id}">
                    <div class="ucapan-header">
                        <span class="ucapan-name">${escapeHtml(item.nama)}</span>
                        <span class="ucapan-badge ${item.kehadiran}">
                            ${item.kehadiran === 'hadir' ? 'Hadir' : 'Tidak Hadir'} · ${item.jumlah} Org
                        </span>
                    </div>
                    <p class="ucapan-text">${escapeHtml(item.ucapan) || '<i>Tidak ada ucapan</i>'}</p>
                    <p class="ucapan-time">${formatDate(item.waktu)}</p>
                </div>
            `).join('');
        }

        function escapeHtml(text) {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Form Submission
        document.getElementById('rsvpForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = document.getElementById('submitBtn');
            const originalContent = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<div class="spinner"></div><span>Mengirim...</span>';

            const formData = new FormData(this);

            const newUcapan = {
                id: Date.now(),
                nama: formData.get('nama').trim(),
                kehadiran: formData.get('kehadiran'),
                jumlah: formData.get('jumlah'),
                ucapan: formData.get('ucapan').trim(),
                waktu: new Date().toISOString()
            };

            setTimeout(() => {
                ucapanData.push(newUcapan);
                saveData();
                renderUcapan();

                this.reset();

                submitBtn.innerHTML = '<i class="ph-fill ph-check"></i><span>Terkirim!</span>';
                showToast('Ucapan berhasil dikirim! Terima kasih 🎉');

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalContent;
                }, 2000);

                document.getElementById('ucapanList').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 800);
        });

        // ==================== ADMIN EXPORT ====================
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('admin') === 'true') {
            document.getElementById('adminPanel').classList.add('visible');
        }

        function exportUcapan() {
            if (ucapanData.length === 0) {
                showToast('Belum ada data untuk diexport');
                return;
            }

            const sorted = [...ucapanData].sort((a, b) => new Date(a.waktu) - new Date(b.waktu));

            let csv = 'No,Nama,Kehadiran,Jumlah Tamu,Ucapan,Waktu\n';
            sorted.forEach((item, index) => {
                csv += `${index + 1},"${item.nama}","${item.kehadiran === 'hadir' ? 'Hadir' : 'Tidak Hadir'}",${item.jumlah},"${item.ucapan.replace(/"/g, '""')}",${formatDate(item.waktu)}\n`;
            });

            const totalHadir = sorted.filter(u => u.kehadiran === 'hadir').reduce((sum, u) => sum + parseInt(u.jumlah), 0);
            csv += `\nTotal Tamu Yang Hadir:,${totalHadir} orang\n`;
            csv += `Total Konfirmasi Hadir:,${sorted.filter(u => u.kehadiran === 'hadir').length}\n`;
            csv += `Total Tidak Hadir:,${sorted.filter(u => u.kehadiran === 'tidak_hadir').length}\n`;

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `RSVP_Hilda_Reza_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();

            showToast('Data berhasil diexport!');
        }

        // ==================== GUEST NAME ====================
        const guest = urlParams.get('to');
        if (guest) {
            document.getElementById('guestName').textContent = decodeURIComponent(guest);
        }

        // ==================== KEYBOARD ====================
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });

        // ==================== INITIAL RENDER ====================
        document.body.classList.add('cover-open');
        renderUcapan();

        // Handle visibility change for music
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && isPlaying) {
                document.getElementById('bgMusic').pause();
            } else if (!document.hidden && isPlaying) {
                document.getElementById('bgMusic').play().catch(() => {});
            }
        });

        // ==================== DARK MODE ====================
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.getElementById('themeIcon');
        const html = document.documentElement;

        function setTheme(theme) {
            html.setAttribute('data-theme', theme);
            localStorage.setItem('weddingTheme', theme);
            if (theme === 'dark') {
                themeIcon.classList.replace('ph-moon', 'ph-sun');
            } else {
                themeIcon.classList.replace('ph-sun', 'ph-moon');
            }
        }

        function toggleTheme() {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        }

        // Initialize theme from localStorage or default to light
        const savedTheme = localStorage.getItem('weddingTheme');
        if (savedTheme) {
            setTheme(savedTheme);
        }
        // Default theme is light

        themeToggle.addEventListener('click', toggleTheme);

        // ==================== SCROLL PROGRESS ====================
        const scrollProgressBar = document.getElementById('scrollProgressBar');

        function updateScrollProgress() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            scrollProgressBar.style.width = progress + '%';
        }

        window.addEventListener('scroll', updateScrollProgress, { passive: true });
        updateScrollProgress();

        // ==================== LAZY LOADING ====================
        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading supported
            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                img.src = img.dataset.src || img.src;
            });
        } else {
            // Fallback for browsers without native lazy loading
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });
            lazyImages.forEach(img => imageObserver.observe(img));
        }

        // ==================== MUSIC BUTTON SCROLL FOLLOW ====================
        const musicBtn = document.getElementById('musicBtn');
        let musicBtnBaseY = 20;
        let isScrolling = false;
        let scrollTimeout;

        function updateMusicBtnPosition() {
            const scrollY = window.scrollY;
            musicBtn.style.top = (musicBtnBaseY + scrollY) + 'px';
        }

        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                isScrolling = true;
            }
            updateMusicBtnPosition();
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 150);
        }, { passive: true });

        // Initialize position
        updateMusicBtnPosition();

        // ==================== SERVICE WORKER ====================
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('sw.js')
                    .then(registration => {
                        console.log('SW registered:', registration.scope);
                    })
                    .catch(error => {
                        console.log('SW registration failed:', error);
                    });
            });
        }

        // ==================== INSTALL PWA PROMPT ====================
        let deferredPrompt;
        const installBtn = document.createElement('button');
        installBtn.className = 'btn-primary fixed bottom-20 right-5 md:bottom-24 md:right-8 z-50';
        installBtn.style.display = 'none';
        installBtn.innerHTML = '<i class="ph ph-download-simple"></i><span>Install App</span>';
        document.body.appendChild(installBtn);

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            installBtn.style.display = 'flex';
        });

        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log('User response:', outcome);
                deferredPrompt = null;
                installBtn.style.display = 'none';
            }
        });

        window.addEventListener('appinstalled', () => {
            deferredPrompt = null;
            installBtn.style.display = 'none';
            showToast('App berhasil diinstall!');
        });
    });
