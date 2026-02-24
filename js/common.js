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

    /* 정원*/
    function initGarden() {
        const section = document.querySelector('.garden');
        if (!section) return;

        const gardenData = [
            { name: '수련', place: '주제정원', desc: '한국의 정원 문화와 식물의 아름다움을\n테마별로 담아낸 공간입니다.', color: '#5a8a6a', img: './img/garden1.jpg' },
            { name: '느티나무', place: '열린숲', desc: '드넓은 잔디마당과 나무들 사이에서\n누구나 편히 쉴 수 있는 식물원의 입구입니다.', color: '#3d6e4d' },
            { name: '꽃창포', place: '호수원', desc: '수변 산책로를 따라 흐르는 물결과\n식물의 조화를 느낄 수 있는 휴식처입니다.', color: '#4a6fa8' },
            { name: '낙우송', place: '습지원', desc: '자연 그대로의 습지 생태계를 보존하여\n생물의 다양성을 관찰할 수 있는 구역입니다.', color: '#4a7a6a' },
            { name: '억새', place: '햇살정원', desc: '따스한 햇볕 아래 바람에 흔들리는\n풀잎들의 질감을 가장 잘 느낄 수 있는 정원입니다.', color: '#a07840' },
            { name: '튤립', place: '해봄정원', desc: '계절마다 피어나는 꽃들을 통해\n새로운 생명력을 직접 마주하는 공간입니다.', color: '#b06080' },
            { name: '수국', place: '정원사의 정원', desc: '가드너의 손길이 닿은 섬세한 식재 조합과\n정원 가꾸기의 즐거움을 보여줍니다.', color: '#6070a0' },
            { name: '조팝나무', place: '시소정원', desc: '아이들의 눈높이에 맞춘 식물들과\n재미있는 조형물이 어우러진 체험형 공간입니다.', color: '#a09040' },
            { name: '남천', place: '입구정원', desc: '방문객을 가장 먼저 맞이하며\n사계절의 변화를 직관적으로 보여주는 정원입니다.', color: '#904030' },
            { name: '붓꽃', place: '아이리스원', desc: '다채로운 색과 모양을 가진\n아이리스 품종들을 집중적으로 감상할 수 있는 정원입니다.', color: '#7050a0' },
            { name: '소나무', place: '숲문화원', desc: '울창한 나무들이 만드는 숲의 정취 속에서\n문화와 교육을 함께 즐기는 공간입니다.', color: '#406040' },
        ];
        const total = gardenData.length;

        const nameEl = document.querySelector('#garden_name');
        const placeEl = document.querySelector('#garden_place');
        const descEl = document.querySelector('#garden_desc');
        const prevBtn = document.querySelector('#garden_prev');
        const nextBtn = document.querySelector('#garden_next');
        const countCurEl = document.querySelector('.garden_counter .count_cur');

        [nameEl, placeEl, descEl].forEach(el => {
            if (el) el.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        });

        function getSizes() {
            const W = section.offsetWidth;
            const H = section.offsetHeight;

            const BASE = Math.min(W, H);
            const isMobile = W <= 480;
            const is1280 = W <= 1280 && W > 480;

            // 원 크기
            const MAIN_SIZE = isMobile ? Math.min(320, BASE * 0.85)
                : is1280 ? Math.min(520, BASE * 0.62)
                    : Math.min(680, BASE * 0.75);
            const PEEK_SIZE = isMobile ? Math.min(150, BASE * 0.38)
                : is1280 ? Math.min(240, BASE * 0.28)
                    : Math.min(300, BASE * 0.35);

            // 큰 원 위치
            const MAIN_LEFT = isMobile ? (W - MAIN_SIZE) / 2
                : is1280 ? W * 0.38
                    : W * 0.45;
            const MAIN_TOP = isMobile ? H * 0.45
                : (H - MAIN_SIZE) / 2;

            const MAIN_CX = MAIN_LEFT + MAIN_SIZE / 2;
            const MAIN_CY = MAIN_TOP + MAIN_SIZE / 2;

            // 궤도 중심
            const CX = isMobile ? W / 2 : W + 200;
            const CY = isMobile ? H * 1.5 : H * 0.5;
            const R = Math.sqrt((CX - MAIN_CX) ** 2 + (CY - MAIN_CY) ** 2);

            // 작은 원 각도
            const angleMain = Math.atan2(MAIN_CY - CY, MAIN_CX - CX);
            const anglePrev = angleMain - 0.85;
            const angleNext = angleMain + 0.85;

            const PREV_LEFT = CX + R * Math.cos(anglePrev) - PEEK_SIZE / 2;
            const PREV_TOP = CY + R * Math.sin(anglePrev) - PEEK_SIZE / 2;
            const NEXT_LEFT = CX + R * Math.cos(angleNext) - PEEK_SIZE / 2;
            const NEXT_TOP = CY + R * Math.sin(angleNext) - PEEK_SIZE / 2;

            return { W, H, MAIN_SIZE, PEEK_SIZE, MAIN_LEFT, MAIN_TOP, PREV_LEFT, PREV_TOP, NEXT_LEFT, NEXT_TOP, CX, CY, R };
        }
        const orbitSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        orbitSvg.classList.add('garden_orbit_svg');
        orbitSvg.setAttribute('aria-hidden', 'true');
        section.appendChild(orbitSvg);

        function updateSvg(s) {
            orbitSvg.setAttribute('viewBox', `0 0 ${s.W} ${s.H}`);
            orbitSvg.innerHTML = `<circle cx="${s.CX}" cy="${s.CY}" r="${s.R}" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="1.5"/>`;
        }

        function getSlot(rel, s) {
            if (rel === 0)
                return { left: s.MAIN_LEFT, top: s.MAIN_TOP, size: s.MAIN_SIZE, opacity: 1, filter: 'brightness(1)', z: 10, visible: true };
            if (rel === 1 || rel === -(total - 1))
                return { left: s.NEXT_LEFT, top: s.NEXT_TOP, size: s.PEEK_SIZE, opacity: 0.85, filter: 'brightness(0.75)', z: 5, visible: true };
            if (rel === -1 || rel === total - 1)
                return { left: s.PREV_LEFT, top: s.PREV_TOP, size: s.PEEK_SIZE, opacity: 0.85, filter: 'brightness(0.75)', z: 5, visible: true };
            return { left: s.W + 200, top: s.H / 2, size: 200, opacity: 0, filter: 'brightness(0.5)', z: 1, visible: false };
        }

        const items = gardenData.map((d, i) => {
            const el = document.createElement('div');
            el.className = 'g-item';
            const inner = document.createElement('div');
            inner.className = 'g-inner';
            if (d.img) {
                inner.style.backgroundImage = `url("${d.img}")`;
                inner.style.backgroundSize = 'cover';
                inner.style.backgroundPosition = 'center';
            } else {
                inner.style.background = d.color;
            }
            inner.textContent = d.name;
            el.appendChild(inner);

            el.addEventListener('click', () => {
                let rel = ((i - current) % total + total) % total;
                if (rel > total / 2) rel -= total;
                if (rel !== 0) { goTo(current + rel); pauseAndResume(); }
            });

            section.appendChild(el);
            return el;
        });

        let current = 0;

        function updateText(animate) {
            const d = gardenData[current];
            const num = String(current + 1).padStart(2, '0');

            if (!animate) {
                if (nameEl) { nameEl.style.opacity = '1'; nameEl.textContent = d.name; }
                if (placeEl) { placeEl.style.opacity = '1'; placeEl.textContent = d.place; }
                if (descEl) { descEl.style.opacity = '1'; descEl.textContent = d.desc; }
                if (countCurEl) countCurEl.textContent = num;
                return;
            }

            [nameEl, placeEl, descEl].forEach(el => {
                if (el) { el.style.opacity = '0'; el.style.transform = 'translateY(6px)'; }
            });

            setTimeout(() => {
                if (nameEl) nameEl.textContent = d.name;
                if (placeEl) placeEl.textContent = d.place;
                if (descEl) descEl.textContent = d.desc;
                if (countCurEl) countCurEl.textContent = num;
                [nameEl, placeEl, descEl].forEach(el => {
                    if (el) { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }
                });
            }, 220);
        }

        function render(animate = true) {
            const s = getSizes();
            updateSvg(s);

            items.forEach((el, i) => {
                let rel = ((i - current) % total + total) % total;
                if (rel > total / 2) rel -= total;
                const slot = getSlot(rel, s);

                el.style.width = slot.size + 'px';
                el.style.height = slot.size + 'px';
                el.style.left = slot.left + 'px';
                el.style.top = slot.top + 'px';
                el.style.opacity = slot.opacity;
                el.style.filter = slot.filter;
                el.style.zIndex = slot.z;
                el.style.pointerEvents = slot.visible ? 'auto' : 'none';
            });

            updateText(animate);
        }

        function goTo(idx) { current = ((idx % total) + total) % total; render(true); }
        function next() { goTo(current + 1); }
        function prev() { goTo(current - 1); }

        prevBtn?.addEventListener('click', () => { prev(); pauseAndResume(); });
        nextBtn?.addEventListener('click', () => { next(); pauseAndResume(); });
        /* 도는 시간 조절 */
        let autoTimer = null, resumeTimer = null;
        const startAuto = () => { stopAuto(); autoTimer = setInterval(next, 3000); };
        const stopAuto = () => clearInterval(autoTimer);

        function pauseAndResume() {
            stopAuto(); clearTimeout(resumeTimer);
            resumeTimer = setTimeout(startAuto, 5000);
        }

        let startX = 0, isDragging = false;
        section.addEventListener('mousedown', e => { startX = e.clientX; isDragging = true; stopAuto(); e.preventDefault(); });
        window.addEventListener('mouseup', e => {
            if (!isDragging) return; isDragging = false;
            const diff = e.clientX - startX;
            if (Math.abs(diff) > 80) diff < 0 ? next() : prev();
            pauseAndResume();
        });

        section.addEventListener('touchstart', e => { startX = e.touches[0].clientX; stopAuto(); }, { passive: true });
        section.addEventListener('touchend', e => {
            const diff = e.changedTouches[0].clientX - startX;
            if (Math.abs(diff) > 80) diff < 0 ? next() : prev();
            pauseAndResume();
        }, { passive: true });

        window.addEventListener('resize', () => {
            if (window.innerWidth <= 375) return; // 375px 이하는 미디어쿼리에 맡김
            render(false);
        });

        items.forEach(el => el.style.transition = 'none');
        render(false);
        requestAnimationFrame(() => items.forEach(el => el.style.transition = ''));

        startAuto();
    }

    /* 코스*/
    function initCourse() {
        const courseSection = document.querySelector(".course");
        if (!courseSection) return;

        const courseData = [
            {
                title: "온실 중심 관람",
                sub: "온실 랜드마크 집중 관람과 편의시설",
                facilities: [
                    "식물문화센터 B1 유모차·휠체어 대여",
                    "식물문화센터 1F 수유실 및 의무실"
                ],
                time: "관람 시간: 약 60분 ~ 90분",
                img: "./img/course1.jpg",
                route: "./img/route1.png"
            },
            {
                title: "온실 + 야외 연계 관람",
                sub: "온실 전체와 주제원(야외 정원) 주요 거점 통합 관람",
                facilities: [
                    "주제원 입구 유모차·휠체어 대여",
                    "식물문화센터 1F 수유실 및 의무실"
                ],
                time: "관람 시간: 약 120분 ~ 180분",
                img: "./img/course2.jpg",
                route: "./img/route2.png"
            },
            {
                title: "온실 일부 관람",
                sub: "온실 내 열대관 및 지중해관 핵심 하이라이트 집중 관람",
                facilities: [
                    "식물문화센터 B1 유모차·휠체어 대여",
                    "식물문화센터 1F 수유실 및 의무실"
                ],
                time: "관람 시간: 약 60분",
                img: "./img/course3.jpg",
                route: "./img/route1.png"
            },
            {
                title: "야외 공간 중심 관람",
                sub: "주제정원, 호수원, 습지원 야외 공간 산책 및 계절별 자생식물 관람",
                facilities: [
                    "주제원 입구 유모차·휠체어 대여",
                    "식물문화센터 B1 유모차·휠체어 대여"
                ],
                time: "관람 시간: 약 90분 ~ 120분",
                img: "./img/course4.jpg",
                route: "./img/route3.png"
            }
        ];

        if (!taps.length || !titleEl || !subEl || !listEl || !timeEl || !imgEl || !routeEl) {
            console.warn("[course] 필요한 요소를 찾지 못했습니다.");
            return;
        }

        let currentIndex = 0;
        let lock = false;

        function getIndex(btn) {
            const a = btn.getAttribute("data-course");
            const b = btn.getAttribute("data_course");
            return Number(a ?? b);
        }

        function setActiveTap(index) {
            taps.forEach(btn => btn.classList.remove("is_active"));
            taps[index]?.classList.add("is_active");
        }

        function applyContent(index) {
            const data = courseData[index];
            if (!data) return;

            titleEl.textContent = data.title;
            subEl.textContent = data.sub;
            timeEl.textContent = data.time;

            listEl.innerHTML = "";
            data.facilities.forEach(text => {
                const li = document.createElement("li");
                li.textContent = text;
                listEl.appendChild(li);
            });

            imgEl.style.backgroundImage = `url("${data.img}")`;
            routeEl.style.backgroundImage = `url("${data.route}")`;
        }

        function change(index) {
            if (!Number.isFinite(index)) return;
            if (index === currentIndex) return;
            if (lock) return;

            lock = true;
            courseSection.classList.add("course_is_changing");

            setTimeout(() => {
                applyContent(index);
                setActiveTap(index);
                currentIndex = index;

                courseSection.classList.remove("course_is_changing");
                setTimeout(() => { lock = false; }, 220);
            }, 180);
        }

        taps.forEach((btn) => {
            btn.addEventListener("mouseenter", () => change(getIndex(btn)));
            btn.addEventListener("click", () => change(getIndex(btn)));
        });

        applyContent(0);
        setActiveTap(0);
    }
    const taps = document.querySelectorAll(".course_tap");
    const titleEl = document.getElementById("box_title");
    const subEl = document.getElementById("box_sub");
    const listEl = document.getElementById("amenities_list");
    const timeEl = document.getElementById("course_time");
    const imgEl = document.getElementById("course_img");
    const routeEl = document.getElementById("course_line");
    /* 뉴스 */
    function initNewsOverflow() {
        const list = document.querySelector(".notice_list");
        if (!list) return;

        function check() {
            document.querySelectorAll(".notice_list li").forEach((li) => {
                const wrap = li.querySelector(".notice_title_wrap");
                const title = li.querySelector(".notice_title");
                if (!wrap || !title) return;

                if (title.scrollWidth > wrap.clientWidth + 1) li.classList.add("is_overflow");
                else li.classList.remove("is_overflow");
            });
        }

        check();
        window.addEventListener("resize", check);
    }

    /* faq */
    function initFaq() {
        const items = document.querySelectorAll(".faq_all");
        if (!items.length) return;

        // 초기 상태: 전부 닫힘
        items.forEach((item) => {
            item.classList.remove("on");
            const icon = item.querySelector(".faq_q i");
            if (icon) {
                icon.classList.remove("fa-minus");
                icon.classList.add("fa-plus");
            }

            item.addEventListener("click", function (e) {
                // 이미 열려있으면 닫기
                const isOpen = this.classList.contains("on");

                // 전체 닫기
                items.forEach((el) => {
                    el.classList.remove("on");
                    const i = el.querySelector(".faq_q i");
                    if (i) {
                        i.classList.remove("fa-minus");
                        i.classList.add("fa-plus");
                    }
                });

                // 클릭한 것만 열기
                if (!isOpen) {
                    this.classList.add("on");
                    const icon = this.querySelector(".faq_q i");
                    if (icon) {
                        icon.classList.remove("fa-plus");
                        icon.classList.add("fa-minus");
                    }
                }
            });
        });
    }
    /* mou */
    function initMouGSAP() {
        const track = document.getElementById("mou_track");
        const slider = document.getElementById("mou_slider");
        const btnPrev = document.getElementById("mou_prev");
        const btnNext = document.getElementById("mou_next");
        const btnPause = document.getElementById("mou_pause");
        if (!track || !slider || !btnPrev || !btnNext || !btnPause) return;

        const pauseIcon = btnPause.querySelector("i");
        let isPaused = false;

        function getLoopDistance() {
            // 트랙의 절반 길이(원본만큼)만 이동하면 복사본이 이어져서 무한처럼 보임
            return track.scrollWidth / 2;
        }

        let loopDistance = getLoopDistance();

        // 무한 루프 타임라인
        const tl = gsap.timeline({ repeat: -1 });
        tl.to(track, {
            x: () => -loopDistance,
            duration: 80,          // 속도(작을수록 빠름)
            ease: "none"
        });

        // 리사이즈 시 거리 재계산
        window.addEventListener("resize", () => {
            loopDistance = getLoopDistance();
            tl.invalidate().restart(); // 깔끔하게 다시 계산
            if (isPaused) tl.pause();
        });

        // 한 칸 이동량(로고 하나 폭 + gap 대충)
        function step() {
            const first = track.querySelector("img");
            if (!first) return 200;
            const gap = parseFloat(getComputedStyle(track).gap || "0");
            return first.getBoundingClientRect().width + gap;
        }

        // prev/next: 현재 위치를 한 칸 이동 (루프 보정 포함)
        function nudge(dir) {
            const curX = gsap.getProperty(track, "x");
            let nextX = curX + dir * step();

            // 범위 보정 (0 ~ -loopDistance 사이로 유지)
            if (nextX > 0) nextX -= loopDistance;
            if (nextX < -loopDistance) nextX += loopDistance;

            gsap.set(track, { x: nextX });
            tl.progress((-nextX) / loopDistance); // 타임라인 진행률도 맞춤
        }

        btnPrev.addEventListener("click", () => nudge(1));
        btnNext.addEventListener("click", () => nudge(-1));

        // pause/play
        btnPause.addEventListener("click", () => {
            if (!isPaused) {
                tl.pause();
                pauseIcon.classList.remove("fa-pause");
                pauseIcon.classList.add("fa-play");
            } else {
                tl.play();
                pauseIcon.classList.remove("fa-play");
                pauseIcon.classList.add("fa-pause");
            }
            isPaused = !isPaused;
        });
    }
    function initHeaderScroll() {
        if (!window.gsap || !window.ScrollTrigger) return;

        const header = document.querySelector('.header');
        const headerTop = document.querySelector('.header_top');

        ScrollTrigger.create({
            trigger: '.garden',
            start: 'top 95px',
            onEnter: () => {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(12px)';
                header.style.borderBottom = '1px solid rgba(0,0,0,0.08)';

                document.querySelectorAll('.gnb .menu_item > a').forEach(a => {
                    a.style.color = '#1a3a24';
                });
                document.querySelectorAll('.lang_btn, .header_right').forEach(el => {
                    el.style.color = '#1a3a24';
                });
                document.querySelectorAll('.top_links a').forEach(a => {
                    a.style.color = '#1a3a24';
                });

                if (headerTop) headerTop.style.display = 'none';
            },
            onLeaveBack: () => {
                header.style.background = 'rgba(255, 255, 255, 0.07)';
                header.style.backdropFilter = 'blur(0.7px)';
                header.style.borderBottom = '1px solid transparent';

                document.querySelectorAll('.gnb .menu_item > a').forEach(a => {
                    a.style.color = 'rgba(255,255,255,0.9)';
                });
                document.querySelectorAll('.lang_btn, .header_right').forEach(el => {
                    el.style.color = '#fff';
                });
                document.querySelectorAll('.top_links a').forEach(a => {
                    a.style.color = 'rgba(255,255,255,0.85)';
                });

                if (headerTop) headerTop.style.display = '';
            }
        });
    }
    try { initGarden(); } catch (e) { console.error("initGarden error", e); }
    try { initCourse(); } catch (e) { console.error("initCourse error", e); }
    try { initNewsOverflow(); } catch (e) { console.error("initNewsOverflow error", e); }
    try { initFaq(); } catch (e) { console.error("initFaq error", e); }
    try { initMouGSAP(); } catch (e) { console.error("initMouGSAP error", e); }
    try { initHeaderScroll(); } catch (e) { console.error("initHeaderScroll error", e); }
});/* DOM end */