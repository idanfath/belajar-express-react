const express = require("express");
const router = express.Router();
const { Artikels } = require("../models");
const { where } = require("sequelize");

router.post("/", async (req, res) => {
  const data = req.body;
  await Artikels.create(data);
  res.json(data);
});
router.get("/:id?", async (req, res) => {
  // id diambil dari parameter url, jika tidak ada maka diambil dari body
  const id = req.params.id ? req.params.id : req.body.id; 
  const data = id ? await Artikels.findOne({ where: { id } }) : await Artikels.findAll();
  data ? res.json(data) : res.json("Data tidak ditemukan");
});
router.put("/:id?", async (req, res) => {
  // sama seperti id di atas
  const id = req.params.id ? req.params.id : req.body.id;
  if (!id) return res.json("ID tidak ditentukan");
  const update = await Artikels.update(req.body, {
    where: { id },
  });
  update ? res.json("Berhasil Diupdate") : res.json("Gagal Diupdate");
});
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  // cek apakah data ada
  const isExist = await Artikels.findByPk(id);
  // jika tidak ada maka kirim pesan
  if (!isExist) return res.json("Data tidak ditemukan");
  await Artikels.destroy({ where: { id: id } });
  res.json("Data berhasil dihapus");
});

module.exports = router;
