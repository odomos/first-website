// Scroll animation reveal
function revealOnScroll() {
  let reveals = document.querySelectorAll(".reveal");

  for (let i = 0; i < reveals.length; i++) {
    let windowHeight = window.innerHeight;
    let elementTop = reveals[i].getBoundingClientRect().top;
    let revealPoint = 100;

    if (elementTop < windowHeight - revealPoint) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}

window.addEventListener("scroll", revealOnScroll);

// Scroll-synced video scrubbing
(function initScrollVideo() {
  const video = document.getElementById('scrollVideo');
  const section = document.querySelector('.video-section');
  if (!video || !section) return;

  // Ensure video metadata is loaded to know duration
  let videoDuration = 0;
  const onLoaded = () => {
    videoDuration = video.duration || 0;
  };
  if (video.readyState >= 1) onLoaded();
  else video.addEventListener('loadedmetadata', onLoaded);

  // Map scroll progress within the section to currentTime of the video
  const onScroll = () => {
    if (!videoDuration) return; // wait until metadata
    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // total scrollable distance where sticky video is active
    const total = rect.height - viewportHeight;
    // progress from 0 to 1 while the section is on screen
    const progressed = Math.min(1, Math.max(0, (viewportHeight - rect.top) / (rect.height)));

    const targetTime = progressed * videoDuration;
    // Avoid heavy seeks: only update if change is significant
    if (Math.abs(video.currentTime - targetTime) > 0.03) {
      video.currentTime = targetTime;
    }
  };

  // Prevent the video from auto-playing audio and controls
  video.pause();
  video.muted = true;
  video.controls = false;

  // Use rAF to smooth scrubbing
  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll);
  // Initial sync
  handleScroll();
})();