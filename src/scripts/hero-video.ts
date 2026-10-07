/**
 * Lazy hero video: <video data-src="…" data-src-type="video/webm" data-min-width="769">
 * only receives its source when the viewport is wide enough, motion is allowed and the user
 * has not asked to save data. Phones keep the lightweight poster (the video is hidden there
 * anyway, but a hidden autoplay <video> would still download megabytes).
 */

export {};

function initHeroVideos() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

  document.querySelectorAll<HTMLVideoElement>('video[data-src]:not([data-src-loaded])').forEach((video) => {
    const minWidth = parseInt(video.dataset.minWidth || '0', 10);
    if (reduce || saveData || window.innerWidth < minWidth) return;
    const source = document.createElement('source');
    source.src = video.dataset.src!;
    if (video.dataset.srcType) source.type = video.dataset.srcType;
    video.appendChild(source);
    video.dataset.srcLoaded = 'true';
    video.load();
    void video.play().catch(() => {});
  });
}

initHeroVideos();
document.addEventListener('astro:page-load', initHeroVideos);
