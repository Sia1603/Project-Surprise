// // Crossfade-ready audio player using two Audio objects.
// // Replaces previous single-Audio approach and avoids NotAllowedError
// // by calling play() synchronously inside the user gesture.

// const audioA = new Audio();
// const audioB = new Audio();
// let active = 0;                // 0 => audioA is "active", 1 => audioB is "active"
// let currentImage = null;       // image whose audio is currently playing
// let fadeIntervals = { in: null, out: null, crossIn: null, crossOut: null };
// let audioUnlocked = false;

// // Optional: one-time unlock attempt when the user first interacts anywhere.
// // (usually not required if play() is called directly from the image handler,
// // but keeps older browsers happy)
// function unlockAudioOnce() {
//   if (audioUnlocked) return;
//   audioUnlocked = true;
//   // harmless attempt to unlock (mute so it doesn't blare)
//   const t = new Audio();
//   t.muted = true;
//   t.play().then(() => { t.pause(); t.currentTime = 0; }).catch(()=>{ /* ignore */ });
// }

// // Fade helpers
// function clearAllFadeIntervals() {
//   Object.values(fadeIntervals).forEach(id => {
//     if (id) clearInterval(id);
//   });
//   fadeIntervals = { in: null, out: null, crossIn: null, crossOut: null };
// }

// function fadeIn(audio, step = 0.05, fps = 50) {
//   if (!audio) return;
//   if (fadeIntervals.in) clearInterval(fadeIntervals.in);
//   audio.volume = Math.max(0, audio.volume || 0);
//   fadeIntervals.in = setInterval(() => {
//     audio.volume = Math.min(1, (audio.volume || 0) + step);
//     if (audio.volume >= 1) {
//       clearInterval(fadeIntervals.in);
//       fadeIntervals.in = null;
//     }
//   }, fps);
// }

// function fadeOutAndPause(audio, step = 0.05, fps = 50) {
//   if (!audio) return;
//   if (fadeIntervals.out) clearInterval(fadeIntervals.out);
//   fadeIntervals.out = setInterval(() => {
//     audio.volume = Math.max(0, (audio.volume || 1) - step);
//     if (audio.volume <= 0.01) {
//       clearInterval(fadeIntervals.out);
//       fadeIntervals.out = null;
//       audio.pause();
//       audio.currentTime = 0;
//       audio.volume = 1; // reset for future plays
//     }
//   }, fps);
// }

// function crossfade(inAudio, outAudio, step = 0.05, fps = 50) {
//   // stop any previous fade intervals to avoid conflicts
//   if (fadeIntervals.crossIn) clearInterval(fadeIntervals.crossIn);
//   if (fadeIntervals.crossOut) clearInterval(fadeIntervals.crossOut);

//   inAudio.volume = Math.max(0, inAudio.volume || 0);
//   fadeIntervals.crossIn = setInterval(() => {
//     inAudio.volume = Math.min(1, (inAudio.volume || 0) + step);
//     if (inAudio.volume >= 1) {
//       clearInterval(fadeIntervals.crossIn);
//       fadeIntervals.crossIn = null;
//     }
//   }, fps);

//   fadeIntervals.crossOut = setInterval(() => {
//     outAudio.volume = Math.max(0, (outAudio.volume || 1) - step);
//     if (outAudio.volume <= 0.01) {
//       clearInterval(fadeIntervals.crossOut);
//       fadeIntervals.crossOut = null;
//       outAudio.pause();
//       outAudio.currentTime = 0;
//       outAudio.volume = 1; // reset for future use
//     }
//   }, fps);
// }

// // Handle image interactions:
// function imageHandler(e) {
//   e.preventDefault();                 // avoid double events on some devices
//   unlockAudioOnce();

//   const img = this;
//   const src = img.getAttribute("data-audio");
//   if (!src) return;

//   const activeAudio = active === 0 ? audioA : audioB;
//   const inactiveAudio = active === 0 ? audioB : audioA;

//   // If same image clicked: toggle play/pause for the active audio
//   if (currentImage === img) {
//     if (activeAudio.paused) {
//       // resume and fade in
//       activeAudio.play().catch(err => console.error("Play error:", err));
//       fadeIn(activeAudio);
//     } else {
//       // fade out and pause
//       fadeOutAndPause(activeAudio);
//     }
//     return;
//   }

//   // Different image clicked:
//   // Prepare inactiveAudio, set source and start playing it immediately
//   // (play() is being called directly inside the user gesture -> allowed)
//   try {
//     // Stop any existing fade intervals to prevent conflicts
//     clearAllFadeIntervals();

//     inactiveAudio.src = src;
//     inactiveAudio.volume = 0;
//     // Play new audio immediately (user gesture), then crossfade if there is an active audio
//     const playPromise = inactiveAudio.play();
//     playPromise.then(() => {
//       // If there was a currently playing audio, crossfade. Otherwise fade in new.
//       if (!activeAudio.paused && activeAudio.currentTime > 0) {
//         crossfade(inactiveAudio, activeAudio);
//       } else {
//         fadeIn(inactiveAudio);
//       }

//       // swap active
//       active = active === 0 ? 1 : 0;
//       currentImage = img;

//       // when new audio ends, reset currentImage
//       inactiveAudio.onended = () => {
//         if (currentImage === img) currentImage = null;
//         inactiveAudio.currentTime = 0;
//         inactiveAudio.volume = 1;
//       };
//     }).catch(err => {
//       console.error("Play error (likely blocked):", err);
//     });
//   } catch (err) {
//     console.error("Unexpected error while starting audio:", err);
//   }
// }

// // Attach handler to all images. Use 'pointerup' to cover mouse and touch neatly.
// document.querySelectorAll(".siblings img").forEach(img => {
//   img.addEventListener("pointerup", imageHandler);
//   // if you want backwards compatibility, you can also add:
//   // img.addEventListener("click", imageHandler);
// });

// Crossfade-ready audio player using two Audio objects.
// Uses pointer events for unified mouse/touch support.

const audioA = new Audio();
const audioB = new Audio();
let active = 0;               // 0 => audioA is active, 1 => audioB is active
let currentImage = null;      // image element whose audio is currently playing
let fadeIntervals = { in: null, out: null, crossIn: null, crossOut: null };
let audioUnlocked = false;

// Unlock audio context once to avoid browser restrictions
function unlockAudioOnce() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  const t = new Audio();
  t.muted = true;
  t.play()
    .then(() => {
      t.pause();
      t.currentTime = 0;
    })
    .catch(() => {
      // ignore errors
    });
}

// Clear all fade intervals to avoid overlap/conflict
function clearAllFadeIntervals() {
  Object.values(fadeIntervals).forEach(id => {
    if (id) clearInterval(id);
  });
  fadeIntervals = { in: null, out: null, crossIn: null, crossOut: null };
}

function fadeIn(audio, step = 0.05, intervalMs = 50) {
  if (!audio) return;
  if (fadeIntervals.in) clearInterval(fadeIntervals.in);
  audio.volume = Math.max(0, audio.volume || 0);
  fadeIntervals.in = setInterval(() => {
    audio.volume = Math.min(1, (audio.volume || 0) + step);
    if (audio.volume >= 1) {
      clearInterval(fadeIntervals.in);
      fadeIntervals.in = null;
    }
  }, intervalMs);
}

function fadeOutAndPause(audio, step = 0.05, intervalMs = 50) {
  if (!audio) return;
  if (fadeIntervals.out) clearInterval(fadeIntervals.out);
  fadeIntervals.out = setInterval(() => {
    audio.volume = Math.max(0, (audio.volume || 1) - step);
    if (audio.volume <= 0.01) {
      clearInterval(fadeIntervals.out);
      fadeIntervals.out = null;
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 1; // reset volume for next play
    }
  }, intervalMs);
}

function crossfade(inAudio, outAudio, step = 0.05, intervalMs = 50) {
  // Stop any previous fade intervals for crossfade to avoid conflicts
  if (fadeIntervals.crossIn) clearInterval(fadeIntervals.crossIn);
  if (fadeIntervals.crossOut) clearInterval(fadeIntervals.crossOut);

  inAudio.volume = Math.max(0, inAudio.volume || 0);

  fadeIntervals.crossIn = setInterval(() => {
    inAudio.volume = Math.min(1, (inAudio.volume || 0) + step);
    if (inAudio.volume >= 1) {
      clearInterval(fadeIntervals.crossIn);
      fadeIntervals.crossIn = null;
    }
  }, intervalMs);

  fadeIntervals.crossOut = setInterval(() => {
    outAudio.volume = Math.max(0, (outAudio.volume || 1) - step);
    if (outAudio.volume <= 0.01) {
      clearInterval(fadeIntervals.crossOut);
      fadeIntervals.crossOut = null;
      outAudio.pause();
      outAudio.currentTime = 0;
      outAudio.volume = 1; // reset volume for next play
    }
  }, intervalMs);
}

// Main handler for image interaction (pointerup for unified mouse & touch)
function imageHandler(e) {
  e.preventDefault(); // Prevent duplicate events on some devices

  unlockAudioOnce();

  const img = this;
  const src = img.getAttribute("data-audio");
  if (!src) return;

  const activeAudio = active === 0 ? audioA : audioB;
  const inactiveAudio = active === 0 ? audioB : audioA;

  // If same image clicked: toggle play/pause on active audio
  if (currentImage === img) {
    if (activeAudio.paused) {
      activeAudio.play().catch(err => console.error("Play error:", err));
      fadeIn(activeAudio);
    } else {
      fadeOutAndPause(activeAudio);
    }
    return;
  }

  // Different image clicked: crossfade to new audio
  clearAllFadeIntervals();

  inactiveAudio.src = src;
  inactiveAudio.volume = 0;

  inactiveAudio.play()
    .then(() => {
      if (!activeAudio.paused && activeAudio.currentTime > 0) {
        crossfade(inactiveAudio, activeAudio);
      } else {
        fadeIn(inactiveAudio);
      }

      active = active === 0 ? 1 : 0;
      currentImage = img;

      inactiveAudio.onended = () => {
        if (currentImage === img) currentImage = null;
        inactiveAudio.currentTime = 0;
        inactiveAudio.volume = 1;
      };
    })
    .catch(err => {
      console.error("Play error (likely blocked):", err);
    });
}

// Attach the handler to all images inside .siblings container
document.querySelectorAll(".siblings img").forEach(img => {
  img.addEventListener("pointerup", imageHandler);
  // Optional fallback for older browsers:
  // img.addEventListener("click", imageHandler);
});
