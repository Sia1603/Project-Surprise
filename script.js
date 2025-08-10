// const yesbtn = document.getElementById("yesbtn");
// const nobtn = document.getElementById("nobtn");

// let repel_btn = true;

// yesbtn.addEventListener("click", ()=> {
//     repel_btn =false;
//     alert("Aww, that's so sweet, I know you guys love me! ❤️")

// });


// nobtn.addEventListener("mouseenter", ()=> {
//     if(!repel_btn) return;

//     const maxX = window.innerWidth - nobtn.offsetWidth;
//     const maxY = window.innerHeight - nobtn.offsetHeight;

//     const newX = Math.random() * maxX;   
//     const newY = Math.random() * maxY;   

//     nobtn.style.left =`${newX}px`;
//     nobtn.style.right =`${newY}px`;
// });

// const yesbtn = document.getElementById("yesbtn");
// const nobtn = document.getElementById("nobtn");

//   let repelActive = true;

//   // When Yes is clicked, stop repelling
//   yesbtn.addEventListener("click", () => {
//     repelActive = false;
//     alert("Aww, that's so sweet, I know you guys love me! ❤️");
//   });

//   nobtn.addEventListener("mousemove", (e) => {
//     if (!repelActive) return;

//     const rect = nobtn.getBoundingClientRect();
//     const btnX = rect.left + rect.width / 2;
//     const btnY = rect.top + rect.height / 2;

//     const distX = e.clientX - btnX;
//     const distY = e.clientY - btnY;

//     const distance = Math.sqrt(distX * distX + distY * distY);

//     if (distance < 80) { // repel distance
//       const moveX = (distX / distance) * 80;
//       const moveY = (distY / distance) * 80;

//       let newLeft = rect.left - moveX;
//       let newTop = rect.top - moveY;

//       // Keep inside window
//       newLeft = Math.max(0, Math.min(window.innerWidth - rect.width, newLeft));
//       newTop = Math.max(0, Math.min(window.innerHeight - rect.height, newTop));

//       nobtn.style.left = `${newLeft}px`;
//       nobtn.style.top = `${newTop}px`;
//     }
//   });

  const yesbtn = document.getElementById("yesbtn");
  const nobtn  = document.getElementById("nobtn");

  let repelActive = true; // control flag


  yesbtn.addEventListener("click", () => {
        repelActive = false; // stop repelling when Yes is clicked
        alert("Aww, that's so sweet, I know you guys love me! ❤️");
        nobtn.style.left = "auto";
        nobtn.style.top = "auto"; // reset position
  });

  document.addEventListener("mousemove", (e) => {
    if (!repelActive) return; // only repel if active

    const container = nobtn.closest(".flip-card-back > div");
    const cardRect = container.getBoundingClientRect();
    const rect = nobtn.getBoundingClientRect();

    const btnX = rect.left + rect.width / 2;
    const btnY = rect.top + rect.height / 2;
    
    const distX = e.clientX - btnX;
    const distY = e.clientY - btnY;

    const distance = Math.sqrt(distX **2 + distY **2);

    if(distance < 100){
        const moveX = (distX / distance) * 100; // repel distance
        const moveY = (distY / distance) * 100;
    
        let newLeft = rect.left - cardRect.left - moveX;
        let newTop = rect.top - cardRect.top - moveY;

        // Keep inside the card
        newLeft = Math.max(0, Math.min(cardRect.width - rect.width, newLeft));
        newTop = Math.max(0, Math.min(cardRect.height - rect.height, newTop));

        nobtn.style.left = `${newLeft}px`;
        nobtn.style.top = `${newTop}px`; 
    }

  });
  // Mouse support
document.addEventListener("mousemove", (e) => {
    repelButton(e.clientX, e.clientY);
});

// Touch support
document.addEventListener("touchmove", (e) => {
    if (e.touches.length > 0) {
        repelButton(e.touches[0].clientX, e.touches[0].clientY);
    }
});

document.getElementById("yesbtn").addEventListener("click", function() {
  window.location.href = "secon.html";
});

  