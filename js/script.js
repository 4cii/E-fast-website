const pageReport = document.getElementById('page-report');
const pageDash   = document.getElementById('page-dashboard');
const navLinks   = document.querySelectorAll('.btn-nav-item');

//nav
function showPage() {
  const isDash = location.hash === '#dashboard';
  pageReport.hidden = isDash;
  pageDash.hidden   = !isDash;

  const current = isDash? '#dashboard' : '#report';
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === current);
  });

  reportPage.classList.remove('open');
}

//slide form
const reportPage = document.querySelector('.report-page');
const btnSlide = document.querySelector('.btn-slide');

btnSlide.addEventListener('click', () => {
  const isOpen = reportPage.classList.toggle('open');

  btnSlide.setAttribute('aria-label', isOpen ? 'Tutup form' : 'Buka form');
});

//close form
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && reportPage.classList.contains('open')) {
    reportPage.classList.remove('open');
    btnSlide.focus();
    btnSlide.setAttribute('aria-label', 'Buka form');
  }
});

//angka
function perbaruiStatistik() {
  document.getElementById('stat-total').textContent = daftarLaporan.length;
  document.getElementById('stat-finished').textContent =
    daftarLaporan.filter((l) => l.status === 'finished').length;
}

window.addEventListener('hashchange', showPage);
showPage(); 

