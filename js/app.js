document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav-links');
    const yearEl = document.getElementById('year');
  
    if (toggle && !toggle.hasAttribute('aria-expanded')) toggle.setAttribute('aria-expanded','false');
  
    if(toggle && nav){
      toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
  
      nav.querySelectorAll('a').forEach(a=>{
        a.addEventListener('click', () => {
          if(nav.classList.contains('open')){
            nav.classList.remove('open');
            toggle.setAttribute('aria-expanded','false');
          }
        });
      });
  
      document.addEventListener('click', e=>{
        if(!nav.contains(e.target) && !toggle.contains(e.target) && nav.classList.contains('open')){
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded','false');
        }
      });
  
      document.addEventListener('keydown', e=>{
        if(e.key==='Escape' && nav.classList.contains('open')){
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded','false');
        }
      });
    }
  
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(link=>{
      link.addEventListener('click', e=>{
        const href = link.getAttribute('href');
        if(href.length>1){
          e.preventDefault();
          const target = document.querySelector(href);
          if(target) target.scrollIntoView({behavior:'smooth'});
        }
      });
    });
  
    if(yearEl) yearEl.textContent = new Date().getFullYear();
  });
  
  
  