import { LoanModel } from "../models/loanModel.js";

const ALLOWED_FIELDS = [
  "member_name", "member_id", "book_title", "book_author",
  "loan_date", "due_date", "return_date", "status",
];
const VALID_STATUS = ["Dipinjam", "Dikembalikan", "Terlambat"];

const pick = (body = {}) =>
  Object.fromEntries(
    Object.entries(body).filter(([key]) => ALLOWED_FIELDS.includes(key))
  );

const handleError = (res, err) => {
  const clientErrors = ["22P02", "22007", "23502", "23514"];
  const code = clientErrors.includes(err.code) ? 400 : 500;
  res.status(code).json({ success: false, error: err.message });
};

export const LoanController = {
  async getAll(req, res) {
    try {
      const { status } = req.query;
      if (status && !VALID_STATUS.includes(status)) {
        return res.status(400).json({
          success: false,
          error: `Status harus salah satu dari: ${VALID_STATUS.join(", ")}`,
        });
      }
      const loans = await LoanModel.getAll(req.query);
      res.json({ success: true, count: loans.length, data: loans });
    } catch (err) {
      handleError(res, err);
    }
  },

  async getById(req, res) {
    try {
      const loan = await LoanModel.getById(req.params.id);
      if (!loan) {
        return res.status(404).json({ success: false, error: "Data peminjaman tidak ditemukan" });
      }
      res.json({ success: true, data: loan });
    } catch (err) {
      handleError(res, err);
    }
  },

  async create(req, res) {
    try {
      const payload = pick(req.body);
      const required = ["member_name", "member_id", "book_title", "due_date"];
      const missing = required.filter((f) => !payload[f]);
      if (missing.length) {
        return res.status(400).json({
          success: false,
          error: `Field wajib belum diisi: ${missing.join(", ")}`,
        });
      }
      if (payload.status && !VALID_STATUS.includes(payload.status)) {
        return res.status(400).json({
          success: false,
          error: `Status harus salah satu dari: ${VALID_STATUS.join(", ")}`,
        });
      }
      const loan = await LoanModel.create(payload);
      res.status(201).json({ success: true, message: "Peminjaman berhasil dicatat", data: loan });
    } catch (err) {
      handleError(res, err);
    }
  },

  async update(req, res) {
    try {
      const payload = pick(req.body);
      if (Object.keys(payload).length === 0) {
        return res.status(400).json({ success: false, error: "Tidak ada data yang diubah" });
      }
      if (payload.status && !VALID_STATUS.includes(payload.status)) {
        return res.status(400).json({
          success: false,
          error: `Status harus salah satu dari: ${VALID_STATUS.join(", ")}`,
        });
      }
      const loan = await LoanModel.update(req.params.id, payload);
      if (!loan) {
        return res.status(404).json({ success: false, error: "Data peminjaman tidak ditemukan" });
      }
      res.json({ success: true, message: "Data berhasil diperbarui", data: loan });
    } catch (err) {
      handleError(res, err);
    }
  },

  async remove(req, res) {
    try {
      const deleted = await LoanModel.remove(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: "Data peminjaman tidak ditemukan" });
      }
      res.json({ success: true, message: "Data berhasil dihapus" });
    } catch (err) {
      handleError(res, err);
    }
  },
};