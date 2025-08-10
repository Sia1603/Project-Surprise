// document.querySelectorAll(".siblings img").forEach(img => {
//     img.addEventListener("click", function () {
//         let audioSrc = this.getAttribute("data-audio");
//         if (audioSrc) {
//             let audio = new Audio(audioSrc);
//             audio.play();
//         }
//     });

//     img.addEventListener("touchstart", function () {
//         let audioSrc = this.getAttribute("data-audio");
//         if (audioSrc) {
//             let audio = new Audio(audioSrc);
//             audio.play();
//         }
//     });
// });

// let currentAudio = null;  // Stores the currently playing audio
// let currentImage = null;  // Stores the image whose song is playing

// document.querySelectorAll(".siblings img").forEach(img => {
//     img.addEventListener("click", function () {
//         let audioSrc = this.getAttribute("data-audio");

//         // If same image is clicked again, toggle play/pause
//         if (currentImage === this) {
//             if (currentAudio.paused) {
//                 currentAudio.play();
//             } else {
//                 currentAudio.pause();
//             }
//             return;
//         }

//         // Stop previous audio if another image is clicked
//         if (currentAudio) {
//             currentAudio.pause();
//             currentAudio.currentTime = 0; // reset to start
//         }

//         // Create new audio for clicked image
//         currentAudio = new Audio(audioSrc);
//         currentImage = this;
//         currentAudio.play();
//     });

//     // Touch support for mobile
//     img.addEventListener("touchstart", function () {
//         this.click();
//     });
// });

let currentAudio = new Audio();  // Reuse the same audio object
let currentImage = null;         // Stores the image whose song is playing
let audioUnlocked = false;       // Tracks if user unlocked audio
let fadeOutInterval = null;      // Stores fade-out timer

// Unlock audio on first interaction
function unlockAudio() {
    if (!audioUnlocked) {
        currentAudio.play().catch(() => { }); // Attempt play to unlock
        currentAudio.pause(); // Pause immediately
        currentAudio.currentTime = 0;
        audioUnlocked = true;
        console.log("Audio unlocked for playback!");
    }
}

document.body.addEventListener("click", unlockAudio, { once: true });
document.body.addEventListener("touchstart", unlockAudio, { once: true });

// Smooth fade-out function
function fadeOutAudio(audio, callback) {
    clearInterval(fadeOutInterval);
    fadeOutInterval = setInterval(() => {
        if (audio.volume > 0.05) {
            audio.volume -= 0.05;
        } else {
            clearInterval(fadeOutInterval);
            audio.pause();
            audio.volume = 1.0; // Reset for next play
            if (callback) callback();
        }
    }, 50); // every 50ms
}

document.querySelectorAll(".siblings img").forEach(img => {
    img.addEventListener("click", function () {
        let audioSrc = this.getAttribute("data-audio");

        // If same image is clicked again, toggle play/pause
        if (currentImage === this) {
            if (currentAudio.paused) {
                currentAudio.play().catch(err => console.error("Play error:", err));
            } else {
                fadeOutAudio(currentAudio); // fade out if paused
            }
            return;
        }

        // If another audio is playing, fade it out first
        if (!currentAudio.paused) {
            fadeOutAudio(currentAudio, () => {
                currentAudio.src = audioSrc;
                currentAudio.play().catch(err => console.error("Play error:", err));
            });
        } else {
            currentAudio.src = audioSrc;
            currentAudio.play().catch(err => console.error("Play error:", err));
        }

        // Update current image
        currentImage = this;

        // Reset when song ends
        currentAudio.onended = function () {
            currentImage = null;
            currentAudio.currentTime = 0;
        };
    });

    // Touch support for mobile
    img.addEventListener("touchstart", function () {
        this.click();
    });
});



