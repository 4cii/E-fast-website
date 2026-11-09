// Menentukan nama tempat data disimpan di localStorage
const KUNCI_STORAGE = "E_REPORT_DATA";

// variable global utk menyimpan data laporan
let daftarLaporan = [];

// mencegah input user dibaca sebagai HTML
function esc(teks) {
  const d = document.createElement("div");
  d.textContent = teks;
  return d.innerHTML;
}

// fungsi muat data itu di eksekusi ketika halaman HTML selesai di muat
document.addEventListener("DOMContentLoaded", () => {
  muatData();

  document
    .getElementById("reports-table-body")
    .addEventListener("click", handleAksiTabel);

  document
    .getElementById("facility-report-form")
    .addEventListener("submit", handelFormSubmit);
});

// READ => mengambil data dari data.js
function muatData() {
  const tersimpan = localStorage.getItem(KUNCI_STORAGE);

  if (tersimpan) {
    try {
      daftarLaporan = JSON.parse(tersimpan);
    } catch {
      daftarLaporan = [];
    }
  } else {
    daftarLaporan =
      typeof dataAwalLaportan !== "undefined" ? [...dataAwalLaportan] : [];
    simpanData();
  }
  tampilkanDataTable();
}

// Menampilkan data ke halaman web
function tampilkanDataTable() {
  const tableBody = document.getElementById("reports-table-body");

  //memastikan tablebody kosong
  tableBody.innerHTML = "";

  // menampilkan baris
  daftarLaporan.forEach((laporan) => {
    tableBody.appendChild(buatBarisLaporan(laporan)); //utk menambahkan anak(data laporan "tr")
  });

  perbaruiStatistik();
}

function perbaruiStatistik() {
  const total = document.getElementById("stat-total");
  const finished = document.getElementById("stat-finished");

  const jumlahSelesai = daftarLaporan.filter((l) =>
    ["finished", "finsih"].includes(String(l.status).toLowerCase())
  ).length;

  if (total) total.textContent = daftarLaporan.length;
  if (finished) finished.textContent = jumlahSelesai;
}

// Membuat satu baris <tr> utk satu laporan\
function buatBarisLaporan(laporan) {
  // membaut tr baru
  const baris = document.createElement("tr");
  baris.className = "report-item";
  baris.dataset.id = laporan.id;

  const selesai = ["finished", "finish"].includes(
    String(laporan.status).toLowerCase(),
  );


  if (selesai) baris.classList.add("is-finished");

  baris.innerHTML = ` <td class="cell-reporter">
        <span class="name">${esc(laporan.pelapor)}</span>
    </td>

    <td class="cell-category">
        <span class="category-badge">${esc(laporan.kategori)}</span>
    </td>

    <td class="cell-desc">
        <p class="desc-content">${esc(laporan.deskripsi)}</p>
    </td>

    <td class="cell-status">
        <span class="status-badge ${selesai ? "status-finished" : "status-pending"}">
            ${selesai ? "Finish" : "Waiting"}
        </span>
    </td>

    <td class="cell-actions">
        <div class="item-actions">
            <button class="btn-finish" type="button" data-aksi="finish">Finished</button>
            <button class="btn-delete" type="button" data-aksi="delete">Delete</button>
        </div>
    </td>
    `;
  return baris;
}

//CREATE => menambahkan data laporan baru dri form
function handelFormSubmit(event) {
  event.preventDefault();
  // mengambil isi form
  const form = event.target;
  const nama = form.reporter.value.trim();
  const kategori = form.category.value;
  const deskripsi = form.description.value.trim();

  // pengecekan value (validasi) => mengecek apakah semua input terisi
  if (!nama || !kategori || !deskripsi) {
  Swal.fire({
    title: "Oops!",
    text: "Please complete all fields.",
    icon: "warning",
    iconColor: "#68F12A",
    buttonsStyling: false,
    customClass: {
      popup: "swal-popup",
      title: "swal-title",
      htmlContainer: "swal-text",
      confirmButton: "swal-btn",
    },
    });
    return;
  }

  // Membuat objek laporan baru
  const laporanBaru = {
    id: `rep-${Date.now()}`,
    pelapor: nama,
    kategori: kategori,
    deskripsi: deskripsi,
    status: "Waiting",
  };

  // Menambahkan laporan baru ke data lama
  daftarLaporan.unshift(laporanBaru);
  // Menyimpan ke dlm local storage
  simpanData();
  tampilkanDataTable();

  // mengosongkan form
  form.reset();
  Swal.fire({
    title: "We'll be on time!",
    text: "You have sent the report ^<^ thank you so much!",
    icon: "success",
    iconColor: "#68F12A", 
    confirmButtonText: "Okay!",
    buttonsStyling: false, // matikan style bawaan tombol
    customClass: {
      popup: "swal-popup",
      title: "swal-title",
      htmlContainer: "swal-text",
      confirmButton: "swal-btn",
    },
  });
}

// proses menyimpan data ke local storage
function simpanData() {
  localStorage.setItem(KUNCI_STORAGE, JSON.stringify(daftarLaporan)); //convert ke string
}

// UPDATE + DELETE: satu listener untuk semua tombol di tabel
function handleAksiTabel(event) {
  const tombol = event.target.closest("button[data-aksi]");
  if (!tombol) return;

  const id = tombol.closest("tr").dataset.id;

  if (tombol.dataset.aksi === "finish") {
    const item = daftarLaporan.find((l) => l.id === id);
    if (item) item.status = "finished";
    simpanData();
    tampilkanDataTable();
  }

  if (tombol.dataset.aksi === "delete") {
    Swal.fire({
      title: "Delete this report?",
      text: "This can't be undone.",
      icon: "warning",
      iconColor: "#E7164A",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        popup: "swal-popup",
        title: "swal-title",
        htmlContainer: "swal-text",
        confirmButton: "swal-btn",
        cancelButton: "swal-btn",
      },
    }).then((hasil) => {
      if (!hasil.isConfirmed) return;
      daftarLaporan = daftarLaporan.filter((l) => l.id !== id);
      simpanData();
      tampilkanDataTable();
    });
  }
}
