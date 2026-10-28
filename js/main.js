// Mobile nav toggle
  const toggle = document.getElementById('mnavToggle');
  const navlist = document.getElementById('navlist');
  toggle.addEventListener('click', () => navlist.classList.toggle('open'));
  navlist.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navlist.classList.remove('open')));

  // Active nav highlight on scroll
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.navlist a');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector('.navlist a[href="#'+entry.target.id+'"]');
        if(active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s => observer.observe(s));

  // Shared tab logic (works for Publications tabs and CV tabs, scoped per tab-group)
  document.querySelectorAll('.tabs').forEach(group => {
    const btns = group.querySelectorAll('.tab-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btns.forEach(b => {
          const panel = document.getElementById(b.dataset.tab);
          if(panel) panel.classList.remove('active');
        });
        btn.classList.add('active');
        const target = document.getElementById(btn.dataset.tab);
        if(target) target.classList.add('active');
      });
    });
  });
