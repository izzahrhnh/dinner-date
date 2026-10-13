const invite = document.getElementById('invite');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let noteTrigger;

document.querySelectorAll('[data-open-note]').forEach(button => {
  button.addEventListener('click', () => {
    noteTrigger = button;
    invite.showModal();
    document.body.classList.add('invite-open');
    document.querySelector('.open-envelope').focus();
  });
});
function closeNote() { invite.close(); }
document.querySelector('.open-envelope').addEventListener('click', closeNote);
document.querySelector('.close-note').addEventListener('click', closeNote);
invite.addEventListener('close', () => {
  document.body.classList.remove('invite-open');
  noteTrigger?.focus({ preventScroll:true });
});

document.querySelectorAll('.negative').forEach(frame => {
  frame.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || reducedMotion.matches) return;
    const rect = frame.getBoundingClientRect();
    frame.style.setProperty('--x', `${event.clientX - rect.left}px`);
    frame.style.setProperty('--y', `${event.clientY - rect.top}px`);
  });
  frame.addEventListener('click', () => {
    const lit = frame.getAttribute('aria-pressed') === 'true';
    frame.setAttribute('aria-pressed', String(!lit));
  });
});

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
fetch('./assets/invitation-video.mp4', { method:'HEAD' })
  .then(response => {
    if (!response.ok) return;
    video.src = './assets/invitation-video.mp4';
    video.preload = 'metadata';
    video.load();
  })
  .catch(() => { /* Keep the coming-soon frame when offline. */ });
