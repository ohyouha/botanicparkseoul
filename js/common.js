if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
}

document.addEventListener('DOMContentLoaded', () => {

    /* ── GNB 4depth 화살표 ── */
    document.querySelectorAll('.header .gnb .ter > li').forEach(li => {
        if (li.querySelector(':scope > .qua')) {
            li.classList.add('has_depth');
        }
    });

    function initHeaderScroll() {
        const header = document.querySelector('.header');
        const headerTop = document.querySelector('.header .top');
        const garden = document.querySelector('.garden');
        if (!header || !garden) return;

        function updateHeader() {
            const gardenTop = garden.getBoundingClientRect().top;
            const isScrolled = gardenTop <= 95;

            if (isScrolled) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(12px)';
                header.style.borderBottom = '1px solid rgba(0,0,0,0.08)';
                document.querySelectorAll('.gnb .menu_item > a').forEach(a => a.style.color = '#1a3a24');
                document.querySelectorAll('.lang_btn, .header_right').forEach(el => el.style.color = '#1a3a24');
                const logo1 = document.querySelector('.seoul_logo img');
                const logo2 = document.querySelector('.site_logo img');
                if (logo1) logo1.src = './img/logo1_1.png';
                if (logo2) logo2.src = './img/logo2_2.png';
                if (headerTop) headerTop.style.display = 'none';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.07)';
                header.style.backdropFilter = 'blur(0.7px)';
                header.style.borderBottom = '1px solid transparent';
                document.querySelectorAll('.gnb .menu_item > a').forEach(a => a.style.color = 'rgba(255,255,255,0.9)');
                document.querySelectorAll('.lang_btn, .header_right').forEach(el => el.style.color = '#fff');
                const logo1 = document.querySelector('.seoul_logo img');
                const logo2 = document.querySelector('.site_logo img');
                if (logo1) logo1.src = './img/logo1.png';
                if (logo2) logo2.src = './img/logo2.png';
                if (headerTop) headerTop.style.display = '';
            }
        }

        window.addEventListener('scroll', updateHeader);
        updateHeader(); // 초기 실행
    }
    try { initGarden(); } catch (e) { console.error("initGarden error", e); }
    try { initCourse(); } catch (e) { console.error("initCourse error", e); }
    try { initNewsOverflow(); } catch (e) { console.error("initNewsOverflow error", e); }
    try { initFaq(); } catch (e) { console.error("initFaq error", e); }
    try { initMouGSAP(); } catch (e) { console.error("initMouGSAP error", e); }
    try { initHeaderScroll(); } catch (e) { console.error("initHeaderScroll error", e); }
});/* DOM end */