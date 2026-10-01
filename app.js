// Import Express
const express = require("express");
const app = express();

// Middleware parsing JSON
app.use(express.json());

// Data Awal (minimal 3 data)
let bouquets = [
  {
    id: 1,
    nama: "Buket Wisuda Merah",
    jenisBunga: "mawar",
    warna: "merah",
    harga: 175000,
    stok: 8,
  },
  {
    id: 2,
    nama: "Buket Anggrek Putih",
    jenisBunga: "anggrek",
    warna: "putih",
    harga: 250000,
    stok: 5,
  },
  {
    id: 3,
    nama: "Buket Tulip Kuning",
    jenisBunga: "tulip",
    warna: "kuning",
    harga: 200000,
    stok: 10,
  },
];

let nextId = 4;

// GET / -> Info API
app.get("/", (req, res) => {
  res.json({
    nama: "Sherafli Rusli",
    nim: "2327240072",
    topik: "Topik 3 - Toko Bunga",
    endpoints: [
      "GET /bouquets",
      "GET /bouquets/:id",
      "GET /bouquets?jenisBunga=nilai",
      "POST /bouquets",
      "PUT /bouquets/:id",
      "DELETE /bouquets/:id",
    ],
  });
});

// 1. GET /bouquets & Filter Query String ?jenisBunga=...
app.get("/bouquets", (req, res) => {
  const { jenisBunga } = req.query;
  if (jenisBunga) {
    const filtered = bouquets.filter(
      (b) => b.jenisBunga.toLowerCase() === jenisBunga.toLowerCase()
    );
    return res.json(filtered);
  }
  res.json(bouquets);
});

// 2. GET /bouquets/:id
app.get("/bouquets/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const bouquet = bouquets.find((b) => b.id === id);

  if (!bouquet) {
    return res.status(404).json({
      status: "error",
      message: `Data dengan id ${id} tidak ditemukan`,
      data: null,
    });
  }

  res.json(bouquet);
});

// 3. POST /bouquets
app.post("/bouquets", (req, res) => {
  const { nama, jenisBunga, warna, harga, stok } = req.body;

  // Validasi field wajib (*): jenisBunga dan harga
  if (!jenisBunga || harga === undefined) {
    return res.status(400).json({
      status: "error",
      message: "Field jenisBunga dan harga wajib diisi",
      data: null,
    });
  }

  const baru = {
    id: nextId++,
    nama: nama || "",
    jenisBunga,
    warna: warna || "",
    harga: Number(harga),
    stok: stok !== undefined ? Number(stok) : 0,
  };

  bouquets.push(baru);

  res.status(201).json({
    status: "success",
    message: "Data berhasil ditambahkan",
    data: baru,
  });
});

// 4. PUT /bouquets/:id
app.put("/bouquets/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = bouquets.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: `Data dengan id ${id} tidak ditemukan`,
      data: null,
    });
  }

  const { nama, jenisBunga, warna, harga, stok } = req.body;

  // Validasi field wajib (*): jenisBunga dan harga
  if (!jenisBunga || harga === undefined) {
    return res.status(400).json({
      status: "error",
      message: "Field jenisBunga dan harga wajib diisi",
      data: null,
    });
  }

  bouquets[index] = {
    id,
    nama: nama || "",
    jenisBunga,
    warna: warna || "",
    harga: Number(harga),
    stok: stok !== undefined ? Number(stok) : 0,
  };

  res.status(200).json({
    status: "success",
    message: "Data berhasil diperbarui",
    data: bouquets[index],
  });
});

// 5. DELETE /bouquets/:id
app.delete("/bouquets/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = bouquets.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: `Data dengan id ${id} tidak ditemukan`,
      data: null,
    });
  }

  bouquets.splice(index, 1);

  res.status(200).json({
    status: "success",
    message: `Data bunga dengan id ${id} berhasil dihapus`,
    data: null,
  });
});

// Middleware Catch-All 404 Endpoint
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint tidak ditemukan",
    data: null,
  });
});

// Jalankan Server Lokal & Export untuk Vercel
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () =>
    console.log(`Server berjalan di http://localhost:${PORT}`)
  );
}

module.exports = app;