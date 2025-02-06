const inputs = document.querySelectorAll(".input-field");
const toggle_btn = document.querySelectorAll(".toggle");
const main = document.querySelector("main");
const bullets = document.querySelectorAll(".bullets span");
const images = document.querySelectorAll(".image");


inputs.forEach((inp) => {
  inp.addEventListener("focus", () => {
    inp.classList.add("active");
  });
  inp.addEventListener("blur", () => {
    if (inp.value != "") return;
    inp.classList.remove("active");
  });
});

toggle_btn.forEach((btn) => {
  btn.addEventListener("click", () => {
    main.classList.toggle("sign-up-mode");
  });
});

function moveSlider() {
  let index = this.dataset.value;

  let currentImage = document.querySelector(`.img-${index}`);
  images.forEach((img) => img.classList.remove("show"));
  currentImage.classList.add("show");

  const textSlider = document.querySelector(".text-group");
  textSlider.style.transform = `translateY(${-(index - 1) * 2.2}rem)`;

  bullets.forEach((bull) => bull.classList.remove("active"));
  this.classList.add("active");
}

bullets.forEach((bullet) => {
  bullet.addEventListener("click", moveSlider);
});



document.getElementById("registerForm").addEventListener("submit", submitForm);

document.querySelector(".sign-in-form").addEventListener("submit", loginForm);




function submitForm(event) {
  
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("errorMessage");

  
  errorMessage.textContent = "";

  
  if (!name) {
    errorMessage.textContent = "Name field is empty";
    return;
  }

  if (!email) {
    errorMessage.textContent = "Email field is empty";
    return;
  }

  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorMessage.textContent = "Invalid email format";
    return;
  }

  if (!password) {
    errorMessage.textContent = "Password field is empty";
    return;
  }

  
  const userData = { name, email, password };
  localStorage.setItem("user", JSON.stringify(userData));

  alert("Registration successful");

  
  document.getElementById("registerForm").reset();
}




function loginForm(event){
  event.preventDefault();


  const names = document.getElementById('name1').value;
  const passwordd = document.getElementById('password1').value;



  const storedUser = JSON.parse(localStorage.getItem("user"));


  if (!storedUser) {
    alert("No user is registered. Please sign up first.");
    return;
  }

  if (names !== storedUser.name || passwordd !== storedUser.password) {
    alert("Invalid username or password. Please try again.");
    return;
  }


  alert("Login successful");

  window.location.href = "dashboard.html";


  
}
