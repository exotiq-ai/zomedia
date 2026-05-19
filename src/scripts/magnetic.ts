/**
 * Magnetic CTA (Phase 6)
 *
 * Buttons opted-in via `data-magnetic` attribute subtly attract the cursor
 * within a ~120px radius. Max offset clamped to 6px so it stays elegant,
 * never gimmicky.
 *
 * Skipped under:
 *   - prefers-reduced-motion: reduce
 *   - touch-only devices (no hover capability)
 *
 * Apply: <a class="btn btn--primary" data-magnetic>...</a>
 */

export {};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (!reduceMotion && hasHover) {
  const RADIUS = 120;     // px — proximity range
  const MAX_OFFSET = 6;   // px — maximum cursor pull
  const SMOOTHING = 0.18; // 0–1 — higher = snappier

  const magnets = Array.from(
    document.querySelectorAll<HTMLElement>('[data-magnetic]')
  );

  magnets.forEach((el) => {
    let rafId: number | null = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    function update(e: PointerEvent) {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const distance = Math.hypot(dx, dy);

      if (distance < RADIUS) {
        const pull = (1 - distance / RADIUS) * MAX_OFFSET;
        const angle = Math.atan2(dy, dx);
        targetX = Math.cos(angle) * pull;
        targetY = Math.sin(angle) * pull;
      } else {
        targetX = 0;
        targetY = 0;
      }

      if (rafId === null) rafId = requestAnimationFrame(animate);
    }

    function animate() {
      currentX += (targetX - currentX) * SMOOTHING;
      currentY += (targetY - currentY) * SMOOTHING;
      el.style.transform = `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px)`;

      if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
        rafId = requestAnimationFrame(animate);
      } else {
        if (targetX === 0 && targetY === 0) {
          el.style.transform = '';
        }
        rafId = null;
      }
    }

    function reset() {
      targetX = 0;
      targetY = 0;
      if (rafId === null) rafId = requestAnimationFrame(animate);
    }

    window.addEventListener('pointermove', update);
    el.addEventListener('pointerleave', reset);
  });
}
