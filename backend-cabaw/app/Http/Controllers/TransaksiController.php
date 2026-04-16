<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaksi;

class TransaksiController extends Controller
{
    public function index(Request $request)
    {
        $tahun = $request->query('tahun');

        // Memuat pelanggan dan detail_transaksi beserta data produknya
        $query = Transaksi::with(['pelanggan', 'detailTransaksi.produk']);

        if ($tahun) {
            $query->whereYear('tanggal', $tahun);
        }

        $data = $query->get();

        return response()->json($data);
    }

    public function destroy($id)
    {
        $transaksi = Transaksi::find($id);
        if ($transaksi) {
            $transaksi->delete(); 
            return response()->json(['message' => 'Data berhasil dihapus']);
        }
        return response()->json(['message' => 'Data tidak ditemukan'], 404);
    }
}