/*
 * Hero background: a perspective "net" of logos rolling on a slow sine-wave
 * surface. Logos near the pointer warm from green to pink and fade back,
 * leaving a soft trail.
 *
 * Usage:
 *   <script src="js/hero-background.js"></script>
 *   initHeroBackground(document.querySelector('.hero-section'), { ...overrides });
 *
 * Vanilla Canvas 2D, no dependencies. Classic script (not an ES module) so it
 * also works when the page is opened straight from disk (file://).
 */
(function (global) {
    'use strict';

    // ---------------------------------------------------------------------
    // CONFIG: every tunable value lives here. Any key can be overridden via
    // the `options` argument of initHeroBackground().
    // ---------------------------------------------------------------------
    var CONFIG = {
        // Grid density (points across x, rows into depth)
        cols: 72,
        rows: 28,
        mobileCols: 38,
        mobileRows: 20,
        mobileBreakpoint: 768,      // px; container width below this uses mobile grid

        // Logo
        logoSize: 16,               // px height of a logo in the nearest row
        logoUrl: null,              // e.g. 'assets/logo.svg'; null = embedded copy

        // Wave
        amplitude: 0.09,            // wave height, as a fraction of camera height
        frequencyX: 1.8,            // ripples across
        frequencyZ: 1.4,            // ripples into depth
        speed: 0.35,                // radians per second (higher = faster rolling)

        // Camera / perspective
        camDist: 2,                 // distance from camera to the nearest row
        depth: 2.6,                 // how far back the surface extends
        topY: 0.08,                 // far row's screen position (fraction of height)
        bottomY: 1.12,              // near row's screen position (fraction of height)

        // Depth fade
        minAlpha: 0.22,             // opacity of the farthest row
        maxAlpha: 1,                // opacity of the nearest row

        // Colours
        baseColor: '#536560',
        hoverColor: '#9A3745',
        background: '#F6F6F4',

        // Interaction
        hoverRadius: 36,            // px around the pointer that "touches" logos
        fadeInMs: 200,              // green -> pink
        fadeOutMs: 1500,            // pink -> green

        // Performance
        maxDpr: 2
    };

    // Embedded copy of assets/logo.svg, so nothing needs fetching.
    var DEFAULT_LOGO_SVG =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 216.65 284.77">' +
        '<path d="M187.39,184.58l-17.97-87.36-17.26,1.2-2.23-34.41-87.36,17.97,1.22,17.54-34.54,2.23,17.97,87.36,17.26-1.2,2.23,34.41,87.36-17.97-1.22-17.54,34.54-2.23ZM65.09,187.58l-1.09-87.74,87.57-1.09.35,28.27-60.62.54,2.25,34.73,58.65-13.2.47,37.4-87.57,1.09Z"/>' +
        '</svg>';

    var COLOR_STEPS = 32;
    var SVG_NS = 'http://www.w3.org/2000/svg';

    // ---------------------------------------------------------------------
    // Logo parsing (once per load): SVG markup -> one normalised Path2D,
    // centred on the origin with its larger side = 1 unit.
    // ---------------------------------------------------------------------
    function buildLogoPath(svgText) {
        var doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
        var paths = doc.querySelectorAll('path');
        if (!paths.length) throw new Error('hero-background: no <path> in logo SVG');

        // Measure the real shape bounds (viewBoxes often carry padding).
        var probe = document.createElementNS(SVG_NS, 'svg');
        probe.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden;visibility:hidden');
        var group = document.createElementNS(SVG_NS, 'g');
        probe.appendChild(group);
        var ds = [];
        var fillRule = 'nonzero';
        paths.forEach(function (p) {
            var d = p.getAttribute('d');
            if (!d) return;
            ds.push(d);
            if (p.getAttribute('fill-rule') === 'evenodd') fillRule = 'evenodd';
            var el = document.createElementNS(SVG_NS, 'path');
            el.setAttribute('d', d);
            group.appendChild(el);
        });
        document.body.appendChild(probe);
        var box = group.getBBox();
        document.body.removeChild(probe);

        var unit = 1 / Math.max(box.width, box.height);
        var m = new DOMMatrix()
            .scale(unit, unit)
            .translate(-(box.x + box.width / 2), -(box.y + box.height / 2));
        var path = new Path2D();
        ds.forEach(function (d) { path.addPath(new Path2D(d), m); });
        return { path: path, fillRule: fillRule };
    }

    // ---------------------------------------------------------------------
    // Colour helpers
    // ---------------------------------------------------------------------
    function hexToRgb(hex) {
        var h = hex.replace('#', '');
        if (h.length === 3) h = h.replace(/./g, '$&$&');
        var n = parseInt(h, 16);
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }

    function easeInOutCubic(x) {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }

    function buildPalette(from, to) {
        var a = hexToRgb(from), b = hexToRgb(to), out = [];
        for (var i = 0; i < COLOR_STEPS; i++) {
            var t = easeInOutCubic(i / (COLOR_STEPS - 1));
            out.push('rgb(' +
                Math.round(a[0] + (b[0] - a[0]) * t) + ',' +
                Math.round(a[1] + (b[1] - a[1]) * t) + ',' +
                Math.round(a[2] + (b[2] - a[2]) * t) + ')');
        }
        return out;
    }

    // ---------------------------------------------------------------------
    // Main entry point
    // ---------------------------------------------------------------------
    function initHeroBackground(container, options) {
        if (!container) throw new Error('initHeroBackground: container element is required');

        var cfg = {};
        Object.keys(CONFIG).forEach(function (k) { cfg[k] = CONFIG[k]; });
        Object.keys(options || {}).forEach(function (k) { cfg[k] = options[k]; });

        // Canvas setup
        if (getComputedStyle(container).position === 'static') {
            container.style.position = 'relative';
        }
        var canvas = document.createElement('canvas');
        canvas.className = 'hero-bg-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        canvas.style.cssText =
            'position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;display:block;';
        container.insertBefore(canvas, container.firstChild);
        var ctx = canvas.getContext('2d');

        var logo = buildLogoPath(DEFAULT_LOGO_SVG);
        var palette = buildPalette(cfg.baseColor, cfg.hoverColor);

        // Layout state (rebuilt on resize)
        var W = 0, H = 0, dpr = 1;
        var cols = 0, rows = 0;
        var gridX = null;       // world x per column
        var rowZ = null;        // world z per row (far -> near)
        var rowS = null;        // perspective scale per row
        var rowAlpha = null;    // depth opacity per row
        var rowColStart = null, rowColEnd = null; // visible column range per row
        var screenX = null;     // precomputed screen x per point (x and z are fixed)
        var heat = null;        // 0..1 per point
        var camHeight = 0, horizonY = 0, sNear = 1, halfSpan = 0;

        // Runtime state
        var t = 0, lastTs = 0, rafId = 0;
        var inView = true, docVisible = !document.hidden, paused = false, destroyed = false;
        var pointer = null;     // {x, y} in CSS px relative to canvas, or null
        var activity = false;   // any heat > 0 last frame
        var motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
        var reducedMotion = !!(motionQuery && motionQuery.matches);

        function buildGrid() {
            var mobile = W < cfg.mobileBreakpoint;
            var nc = mobile ? cfg.mobileCols : cfg.cols;
            var nr = mobile ? cfg.mobileRows : cfg.rows;
            var c = cfg.camDist;
            var sFar = 1 / (cfg.depth + c);
            sNear = 1 / c;

            // Screen mapping: sx = W/2 + x*s*W ; sy = horizonY + (camHeight - y)*s*W
            // Solve camHeight / horizonY so far row lands at topY and near row at bottomY.
            camHeight = ((cfg.bottomY - cfg.topY) * H) / ((sNear - sFar) * W);
            horizonY = cfg.topY * H - camHeight * sFar * W;

            // The far row must still span the full width (+ a margin for logo size).
            halfSpan = 0.5 * (cfg.depth + c) * 1.06;

            var needRealloc = nc !== cols || nr !== rows;
            cols = nc;
            rows = nr;
            gridX = new Float32Array(cols);
            for (var i = 0; i < cols; i++) gridX[i] = -halfSpan + (2 * halfSpan * i) / (cols - 1);

            rowZ = new Float32Array(rows);
            rowS = new Float32Array(rows);
            rowAlpha = new Float32Array(rows);
            rowColStart = new Int32Array(rows);
            rowColEnd = new Int32Array(rows);
            screenX = new Float32Array(cols * rows);
            if (needRealloc || !heat) heat = new Float32Array(cols * rows);

            for (var r = 0; r < rows; r++) {
                var f = r / (rows - 1);                 // 0 = far, 1 = near
                var z = cfg.depth * (1 - f);
                var s = 1 / (z + c);
                rowZ[r] = z;
                rowS[r] = s;
                var depthT = (s - sFar) / (sNear - sFar);
                rowAlpha[r] = cfg.minAlpha + (cfg.maxAlpha - cfg.minAlpha) * depthT;

                var margin = cfg.logoSize * (s / sNear) + cfg.hoverRadius;
                var start = -1, end = -1;
                for (var col = 0; col < cols; col++) {
                    var sx = W / 2 + gridX[col] * s * W;
                    screenX[r * cols + col] = sx;
                    if (sx > -margin && sx < W + margin) {
                        if (start < 0) start = col;
                        end = col;
                    }
                }
                rowColStart[r] = Math.max(start, 0);
                rowColEnd[r] = end;
            }
        }

        function resize() {
            var rect = container.getBoundingClientRect();
            var nw = Math.max(1, Math.round(rect.width));
            var nh = Math.max(1, Math.round(rect.height));
            var nd = Math.min(window.devicePixelRatio || 1, cfg.maxDpr);
            if (nw === W && nh === H && nd === dpr) return;
            W = nw; H = nh; dpr = nd;
            canvas.width = Math.round(W * dpr);
            canvas.height = Math.round(H * dpr);
            buildGrid();
            draw(0);
            schedule();
        }

        // Advance heat and render one frame. dt in ms.
        function draw(dt) {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.fillStyle = cfg.background;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            var kx = cfg.frequencyX, kz = cfg.frequencyZ, w = cfg.speed;
            var amp = cfg.amplitude * camHeight;
            var up = dt / cfg.fadeInMs, down = dt / cfg.fadeOutMs;
            var px = pointer ? pointer.x : -1e9, py = pointer ? pointer.y : -1e9;
            var r2 = cfg.hoverRadius * cfg.hoverRadius;
            var maxIdx = COLOR_STEPS - 1;
            var anyHeat = false;
            var lastColor = -1;
            var path = logo.path, rule = logo.fillRule;

            for (var r = 0; r < rows; r++) {           // far -> near: painter's order
                var s = rowS[r];
                var sW = s * W;
                var z = rowZ[r];
                var size = cfg.logoSize * (s / sNear) * dpr;
                var cz = Math.cos(kz * z + 0.7 * w * t);
                var base = r * cols;
                ctx.globalAlpha = rowAlpha[r];

                for (var col = rowColStart[r]; col <= rowColEnd[r]; col++) {
                    var i = base + col;
                    var x = gridX[col];
                    var y = amp * (Math.sin(kx * x + w * t) * cz +
                        0.35 * Math.sin(0.6 * kx * x + 1.3 * kz * z + 0.5 * w * t));
                    var sx = screenX[i];
                    var sy = horizonY + (camHeight - y) * sW;

                    // Heat: rise near the pointer, decay elsewhere
                    var h = heat[i];
                    var dx = sx - px, dy = sy - py;
                    if (dx * dx + dy * dy < r2) h = Math.min(1, h + up);
                    else if (h > 0) h = Math.max(0, h - down);
                    heat[i] = h;
                    if (h > 0) anyHeat = true;

                    var ci = (h * maxIdx + 0.5) | 0;
                    if (ci !== lastColor) {
                        ctx.fillStyle = palette[ci];
                        lastColor = ci;
                    }
                    ctx.setTransform(size, 0, 0, size, sx * dpr, sy * dpr);
                    ctx.fill(path, rule);
                }
            }
            ctx.globalAlpha = 1;
            activity = anyHeat;
        }

        function shouldRun() {
            if (destroyed || paused || !inView || !docVisible) return false;
            return !reducedMotion || pointer !== null || activity;
        }

        function frame(ts) {
            rafId = 0;
            var dt = lastTs ? Math.min(ts - lastTs, 50) : 16.7; // clamp after stalls
            lastTs = ts;
            if (!reducedMotion) t += dt / 1000;
            draw(dt);
            schedule();
        }

        function schedule() {
            if (shouldRun()) {
                if (!rafId) rafId = requestAnimationFrame(frame);
            } else {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = 0;
                lastTs = 0;
            }
        }

        // --- Pointer / touch ------------------------------------------------
        function setPointer(clientX, clientY) {
            var rect = canvas.getBoundingClientRect();
            pointer = { x: clientX - rect.left, y: clientY - rect.top };
            schedule();
        }
        function clearPointer() {
            pointer = null;
        }
        function onPointerMove(e) {
            if (e.pointerType === 'touch') return; // handled by touch events below
            setPointer(e.clientX, e.clientY);
        }
        // Touch events keep firing while the page scrolls (pointer events get
        // cancelled), so a drag leaves a trail without blocking scrolling.
        function onTouch(e) {
            var tch = e.touches[0];
            if (tch) setPointer(tch.clientX, tch.clientY);
        }

        container.addEventListener('pointermove', onPointerMove);
        container.addEventListener('pointerdown', onPointerMove);
        container.addEventListener('pointerleave', clearPointer);
        container.addEventListener('touchstart', onTouch, { passive: true });
        container.addEventListener('touchmove', onTouch, { passive: true });
        container.addEventListener('touchend', clearPointer, { passive: true });
        container.addEventListener('touchcancel', clearPointer, { passive: true });

        // --- Lifecycle observers ---------------------------------------------
        var ro = new ResizeObserver(resize);
        ro.observe(container);

        var io = new IntersectionObserver(function (entries) {
            inView = entries[entries.length - 1].isIntersecting;
            schedule();
        });
        io.observe(container);

        function onVisibility() {
            docVisible = !document.hidden;
            schedule();
        }
        document.addEventListener('visibilitychange', onVisibility);

        function onMotionChange(e) {
            reducedMotion = e.matches;
            draw(0);
            schedule();
        }
        if (motionQuery) {
            if (motionQuery.addEventListener) motionQuery.addEventListener('change', onMotionChange);
            else motionQuery.addListener(onMotionChange);
        }

        // DPR changes (e.g. dragging the window to another monitor)
        var dprQuery = null;
        function watchDpr() {
            if (dprQuery) dprQuery.removeEventListener('change', onDprChange);
            dprQuery = window.matchMedia('(resolution: ' + (window.devicePixelRatio || 1) + 'dppx)');
            if (dprQuery.addEventListener) dprQuery.addEventListener('change', onDprChange);
        }
        function onDprChange() {
            resize();
            watchDpr();
        }
        watchDpr();

        // Optional: load the logo from a URL (falls back to the embedded copy)
        if (cfg.logoUrl && location.protocol !== 'file:') {
            fetch(cfg.logoUrl)
                .then(function (res) {
                    if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
                    return res.text();
                })
                .then(function (text) {
                    if (destroyed) return;
                    logo = buildLogoPath(text);
                    draw(0);
                })
                .catch(function (err) {
                    console.warn('hero-background: could not load ' + cfg.logoUrl + ', using embedded logo.', err);
                });
        }

        resize();

        return {
            pause: function () { paused = true; schedule(); },
            resume: function () { paused = false; schedule(); },
            destroy: function () {
                destroyed = true;
                schedule();
                ro.disconnect();
                io.disconnect();
                document.removeEventListener('visibilitychange', onVisibility);
                if (motionQuery) {
                    if (motionQuery.removeEventListener) motionQuery.removeEventListener('change', onMotionChange);
                    else motionQuery.removeListener(onMotionChange);
                }
                if (dprQuery && dprQuery.removeEventListener) dprQuery.removeEventListener('change', onDprChange);
                container.removeEventListener('pointermove', onPointerMove);
                container.removeEventListener('pointerdown', onPointerMove);
                container.removeEventListener('pointerleave', clearPointer);
                container.removeEventListener('touchstart', onTouch);
                container.removeEventListener('touchmove', onTouch);
                container.removeEventListener('touchend', clearPointer);
                container.removeEventListener('touchcancel', clearPointer);
                canvas.remove();
            }
        };
    }

    initHeroBackground.CONFIG = CONFIG;
    global.initHeroBackground = initHeroBackground;
    if (typeof module !== 'undefined' && module.exports) module.exports = initHeroBackground;
})(typeof window !== 'undefined' ? window : this);
