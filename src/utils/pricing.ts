export function hargaJualPerUnit(params: {
  modal: number | string;
  biayaOp: number | string;
  keuntungan: number | string;      // ←
  jumlahProduk: number | string;
}) {
  const modal = Number(params.modal || 0);
  const biaya = Number(params.biayaOp || 0);
  const untung = Number(params.keuntungan || 0);
  const denom = Math.max(1, Number(params.jumlahProduk || 1)); // cegah /0
  return (modal + biaya + untung) / denom;
}

export function hargaJualPerUnitDariPersen(params: {
  modal: number | string;
  biayaOp: number | string;
  persenKeuntungan: number | string; // persen
  jumlahProduk: number | string;
}) {
  const modal = Number(params.modal || 0);
  const biaya = Number(params.biayaOp || 0);
  const persen = Number(params.persenKeuntungan || 0);
  const keuntunganNominal = (modal + biaya) * (persen / 100);
  return hargaJualPerUnit({
    modal,
    biayaOp: biaya,
    keuntungan: keuntunganNominal,
    jumlahProduk: params.jumlahProduk
  });
}
