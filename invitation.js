const invite = document.getElementById('invite');
const openButton = document.querySelector('.open-envelope');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let closing = false;

function showInvite() {
  invite.classList.remove('opening');
  invite.showModal();
  document.body.classList.add('invite-open');
  openButton.focus();
}

function closeInvite() {
  if (closing || !invite.open) return;
  closing = true;
  invite.classList.add('opening');
  window.setTimeout(() => {
    invite.close();
    document.body.classList.remove('invite-open');
    closing = false;
    document.querySelector('.reopen').focus({ preventScroll: true });
  }, reducedMotion.matches ? 0 : 550);
}

openButton.addEventListener('click', closeInvite);
invite.addEventListener('cancel', event => {
  event.preventDefault();
  closeInvite();
});
document.querySelector('.reopen').addEventListener('click', showInvite);
showInvite();

// Warm light follows a mouse or pen; touch scrolling remains native.
document.querySelectorAll('.light-area').forEach(element => {
  element.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || reducedMotion.matches) return;
    const rect = element.getBoundingClientRect();
    element.style.setProperty('--x', `${event.clientX - rect.left}px`);
    element.style.setProperty('--y', `${event.clientY - rect.top}px`);
  });
});

// The video stays a coming-soon frame until a real clip is available.
const video = document.getElementById('invitation-video');
const shell = document.getElementById('video-shell');
video.addEventListener('loadedmetadata', () => {
  video.hidden = false;
  shell.classList.add('has-video');
});
video.addEventListener('error', () => {
  video.hidden = true;
  shell.classList.remove('has-video');
});
fetch('./assets/invitation-video.mp4', { method: 'HEAD' })
  .then(response => {
    if (!response.ok) return;
    video.src = './assets/invitation-video.mp4';
    video.preload = 'metadata';
    video.load();
  })
  .catch(() => { /* The invitation remains usable when offline. */ });
