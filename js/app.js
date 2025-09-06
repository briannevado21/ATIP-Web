// js/app.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD4Dq9W_ST1q0m2ZwlNWSpLw08lXeDDrts",
  authDomain: "atip-web-fb5ae.firebaseapp.com",
  projectId: "atip-web-fb5ae",
  storageBucket: "atip-web-fb5ae.firebasestorage.app",
  messagingSenderId: "701902755460",
  appId: "1:701902755460:web:58b16b05fe21af8233d4d1",
  measurementId: "G-J53Q0PCBK0"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
  // ---------------- NAVBAR ----------------
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (toggle && !toggle.hasAttribute('aria-expanded')) toggle.setAttribute('aria-expanded', 'false');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (nav.classList.contains('open')) {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.addEventListener('click', e => {
      if (!nav.contains(e.target) && !toggle.contains(e.target) && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --------------- SMOOTH SCROLL ---------------
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --------------- FOOTER YEAR ---------------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --------------- LOGIN GOOGLE ---------------
  const googleBtn = document.getElementById("google-sign-in");
  const userInfo = document.getElementById("user-info");
  let currentUser = null;

  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      signInWithPopup(auth, provider)
        .then(result => {
          currentUser = result.user;
          userInfo.textContent = `Conectado como: ${currentUser.displayName}`;
          googleBtn.style.display = "none";
        })
        .catch(error => {
          console.error("Error login:", error);
          alert("Error al iniciar sesión");
        });
    });
  }

  onAuthStateChanged(auth, user => {
    currentUser = user;
    if (user) {
      userInfo.textContent = `Conectado como: ${user.displayName}`;
      if (googleBtn) googleBtn.style.display = "none";
    } else {
      userInfo.textContent = "";
      if (googleBtn) googleBtn.style.display = "inline-block";
    }
  });

  // --------------- FORMULARIO CONTACTO ---------------
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();
      if (!currentUser) {
        alert("Debes iniciar sesión para enviar un mensaje.");
        return;
      }

      const name = contactForm.querySelector('input[type="text"]').value;
      const email = contactForm.querySelector('input[type="email"]').value;
      const subject = contactForm.querySelector('input[placeholder="Asunto"]').value;
      const message = contactForm.querySelector('textarea').value;

      try {
        await addDoc(collection(db, "messages"), {
          uid: currentUser.uid,
          name,
          email,
          subject,
          message,
          timestamp: serverTimestamp()
        });
        alert("Mensaje enviado correctamente.");
        contactForm.reset();
      } catch (err) {
        console.error("Error enviando mensaje:", err);
        alert("Error al enviar el mensaje.");
      }
    });
  }
});



