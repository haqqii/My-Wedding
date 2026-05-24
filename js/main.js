// ==================== DATA STORAGE ====================
let ucapanData = JSON.parse(localStorage.getItem('weddingUcapan')) || [];

if (ucapanData.length === 0) {
    ucapanData = [
        {
            id: 1,
            nama: 'Keluarga Besar',
            kehadiran: 'hadir',
            jumlah: '2',
            ucapan: 'Barakallah laka wa baraka alaika wa jama\'a bainakuma fi khair. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.',
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

// ==================== GLOBAL FUNCTIONS (accessible from onclick) ====================

function openInvitation() {
    const coverPage = document.getElementById('coverPage');
    const mainContent = document.getElementById('mainContent');
    const bgMusic = document.getElementById('bgMusic');

    coverPage.classList.add('hidden');
    mainContent.classList.remove('opacity-0');
    document.body.classList.remove('cover-open');

    if (bgMusic) {
        bgMusic.play().then(() => {
            const musicBtn = document.getElementById('musicBtn');
            if (musicBtn) musicBtn.classList.add('rotating');
            isPlaying = true;
        }).catch(() => {});
    }

    window.scrollTo(0, 0);
    renderUcapan();
}

function toggleMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicBtn');
    const musicIcon = document.getElementById('musicIcon');

    if (!bgMusic || !musicBtn || !musicIcon) return;

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

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.style.background = type === 'error' ? '#c45b5b' : '#4A574B';
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

function saveToCalendar() {
    const akadTitle = encodeURIComponent('Akad Nikah Hilda & Reza');
    const akadDates = '20260218T010000Z/20260218T030000Z';
    const akadLocation = encodeURIComponent('Batakan Beach Club Village, Jl. Marina Emas Timur V No.25, Keputih, Surabaya');
    const akadDetails = encodeURIComponent('Akad Nikah Hilda & Reza\n\nMohon doa restu agar acara berjalan lancar.\n\nResepsi akan diadakan pada tanggal 25 Februari 2026 pukul 18.00 WIB.');

    const resepsiTitle = encodeURIComponent('Resepsi Pernikahan Hilda & Reza');
    const resepsiDates = '20260225T110000Z/20260225T150000Z';
    const resepsiLocation = encodeURIComponent('Gedung Graha Widya Bhakti, Jl. Menur Pumpungan No.30, Surabaya');
    const resepsiDetails = encodeURIComponent('Resepsi Pernikahan Hilda & Reza\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.');

    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${akadTitle}&dates=${akadDates}&details=${akadDetails}&location=${akadLocation}`, '_blank');
    setTimeout(() => {
        window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${resepsiTitle}&dates=${resepsiDates}&details=${resepsiDetails}&location=${resepsiLocation}`, '_blank');
    }, 500);
    showToast('Google Calendar terbuka! Silakan simpan kedua acara.');
}

function openLightbox(element) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = element.querySelector('img').src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function formatDate(isoString) {
    const date = new Date(isoString);
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('id-ID', options);
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function renderUcapan() {
    const list = document.getElementById('ucapanList');
    const emptyState = document.getElementById('emptyState');
    if (!list || !emptyState) return;

    const total = ucapanData.length;
    const hadir = ucapanData.filter(u => u.kehadiran === 'hadir').length;
    const tidakHadir = ucapanData.filter(u => u.kehadiran === 'tidak_hadir').length;

    const statTotal = document.getElementById('statTotal');
    const statHadir = document.getElementById('statHadir');
    const statTidakHadir = document.getElementById('statTidakHadir');
    if (statTotal) statTotal.textContent = total;
    if (statHadir) statHadir.textContent = hadir;
    if (statTidakHadir) statTidakHadir.textContent = tidakHadir;

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

// ==================== INITIALIZATION (runs after DOM is ready) ====================
document.addEventListener('DOMContentLoaded', function() {
    let isPlaying = false;

    // ==================== GSAP ANIMATIONS ====================
    gsap.registerPlugin(ScrollTrigger);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        gsap.utils.toArray('.reveal').forEach((element) => {
            gsap.fromTo(element,
                { opacity: 0, y: 50, z: -30, rotateX: 10 },
                {
                    opacity: 1, y: 0, z: 0, rotateX: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: element, start: 'top 85%', toggleActions: 'play none none reverse' }
                }
            );
        });

        gsap.utils.toArray('.ornament-corner, .floral-corner, .flourish-ornament, .geometric-pattern').forEach((ornament) => {
            gsap.to(ornament, {
                y: -40, z: 15,
                scrollTrigger: { trigger: ornament.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 }
            });
        });
    } else {
        document.querySelectorAll('.reveal').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    }

    // ==================== FLOATING NAVIGATION ====================
    const floatingNav = document.getElementById('floatingNav');
    const navLinks = floatingNav ? floatingNav.querySelectorAll('a') : [];
    const sections = document.querySelectorAll('section[id]');
    let isNavVisible = false;

    function handleNavVisibility() {
        const scrollY = window.scrollY;
        const heroHeight = window.innerHeight * 0.6;
        if (scrollY > heroHeight && !isNavVisible && floatingNav) {
            floatingNav.classList.add('visible');
            isNavVisible = true;
        } else if (scrollY <= heroHeight && isNavVisible && floatingNav) {
            floatingNav.classList.remove('visible');
            isNavVisible = false;
        }
    }

    function highlightActiveSection() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + section.offsetHeight) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) link.classList.add('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = document.querySelector(this.getAttribute('href'));
            if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    window.addEventListener('scroll', () => { handleNavVisibility(); highlightActiveSection(); }, { passive: true });

    // ==================== 3D MOUSE TILT EFFECT ====================
    const coverPage = document.getElementById('coverPage');
    const coverContent = coverPage ? coverPage.querySelector('.cover-content') : null;

    if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches && coverPage && coverContent) {
        coverPage.addEventListener('mousemove', (e) => {
            const xPercent = ((e.clientX / window.innerWidth) - 0.5) * 2;
            const yPercent = ((e.clientY / window.innerHeight) - 0.5) * 2;
            gsap.to(coverContent, { rotateY: xPercent * 5, rotateX: -yPercent * 5, duration: 0.5, ease: 'power2.out' });
        });

        coverPage.addEventListener('mouseleave', () => {
            gsap.to(coverContent, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power2.out' });
        });
    }

    // ==================== COUNTDOWN ====================
    const AKAD_DATE = new Date('February 18, 2026 08:00:00').getTime();
    const RESEPSI_DATE = new Date('February 25, 2026 18:00:00').getTime();
    const COUNTDOWN_TARGET = Math.min(AKAD_DATE, RESEPSI_DATE);
    const FIRST_EVENT_NAME = AKAD_DATE <= RESEPSI_DATE ? 'Akad Nikah' : 'Resepsi';
    const FIRST_EVENT_DATE = new Date(COUNTDOWN_TARGET);

    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayName = dayNames[FIRST_EVENT_DATE.getDay()];
    const formattedDate = `${String(FIRST_EVENT_DATE.getDate()).padStart(2, '0')} . ${String(FIRST_EVENT_DATE.getMonth() + 1).padStart(2, '0')} . ${FIRST_EVENT_DATE.getFullYear()}`;

    const countdownTargetName = document.getElementById('countdownTargetName');
    if (countdownTargetName) countdownTargetName.textContent = FIRST_EVENT_NAME;

    const coverDayNameEl = document.getElementById('coverDayName');
    const coverDateEl = document.getElementById('coverDate');
    if (coverDayNameEl) coverDayNameEl.textContent = dayName;
    if (coverDateEl) coverDateEl.textContent = formattedDate;

    const heroDayNameEl = document.getElementById('heroDayName');
    const heroDateEl = document.getElementById('heroDate');
    if (heroDayNameEl) heroDayNameEl.textContent = dayName;
    if (heroDateEl) heroDateEl.textContent = formattedDate;

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = COUNTDOWN_TARGET - now;
        const days = document.getElementById('days');
        const hours = document.getElementById('hours');
        const minutes = document.getElementById('minutes');
        const seconds = document.getElementById('seconds');

        if (days && hours && minutes && seconds) {
            if (distance > 0) {
                days.textContent = String(Math.floor(distance / 86400000)).padStart(2, '0');
                hours.textContent = String(Math.floor((distance % 86400000) / 3600000)).padStart(2, '0');
                minutes.textContent = String(Math.floor((distance % 3600000) / 60000)).padStart(2, '0');
                seconds.textContent = String(Math.floor((distance % 60000) / 1000)).padStart(2, '0');
            } else {
                days.textContent = hours.textContent = minutes.textContent = seconds.textContent = '00';
            }
        }
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // ==================== RSVP FORM ====================
    const rsvpForm = document.getElementById('rsvpForm');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = document.getElementById('submitBtn');
            if (!submitBtn) return;

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
                showToast('Ucapan berhasil dikirim! Terima kasih');

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalContent;
                }, 2000);

                const ucapanList = document.getElementById('ucapanList');
                if (ucapanList) ucapanList.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 800);
        });
    }

    // ==================== ADMIN & GUEST ====================
    const urlParams = new URLSearchParams(window.location.search);
    const adminPanel = document.getElementById('adminPanel');
    if (urlParams.get('admin') === 'true' && adminPanel) {
        adminPanel.classList.add('visible');
    }

    const guestName = document.getElementById('guestName');
    const guest = urlParams.get('to');
    if (guest && guestName) {
        guestName.textContent = decodeURIComponent(guest);
    }

    // ==================== KEYBOARD ====================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // ==================== INITIAL STATE ====================
    document.body.classList.add('cover-open');
    renderUcapan();

    document.addEventListener('visibilitychange', () => {
        const bgMusic = document.getElementById('bgMusic');
        if (!bgMusic) return;
        if (document.hidden && isPlaying) {
            bgMusic.pause();
        } else if (!document.hidden && isPlaying) {
            bgMusic.play().catch(() => {});
        }
    });

    // ==================== DARK MODE ====================
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const html = document.documentElement;

    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('weddingTheme', theme);
        if (themeIcon) {
            if (theme === 'dark') {
                themeIcon.classList.replace('ph-moon', 'ph-sun');
            } else {
                themeIcon.classList.replace('ph-sun', 'ph-moon');
            }
        }
    }

    function toggleTheme() {
        const currentTheme = html.getAttribute('data-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }

    const savedTheme = localStorage.getItem('weddingTheme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme('light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // ==================== SCROLL PROGRESS ====================
    const scrollProgressBar = document.getElementById('scrollProgressBar');

    function updateScrollProgress() {
        if (!scrollProgressBar) return;
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgressBar.style.width = (scrollTop / docHeight) * 100 + '%';
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    // ==================== MUSIC BUTTON SCROLL FOLLOW ====================
    const musicBtn = document.getElementById('musicBtn');
    const musicBtnBaseY = 20;

    function updateMusicBtnPosition() {
        if (musicBtn) musicBtn.style.top = (musicBtnBaseY + window.scrollY) + 'px';
    }

    window.addEventListener('scroll', () => {
        updateMusicBtnPosition();
    }, { passive: true });
    updateMusicBtnPosition();

    // ==================== SERVICE WORKER ====================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').then(() => {}).catch(() => {});
        });
    }

    // ==================== PWA INSTALL ====================
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
            await deferredPrompt.userChoice;
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
