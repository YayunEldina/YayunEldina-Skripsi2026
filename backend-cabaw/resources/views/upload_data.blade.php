<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Import Data Mitra</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background-color: #f8f9fa; }
        .card { border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    </style>
</head>
<body class="p-5">
    <div class="container card p-4" style="max-width: 600px;">
        <h3 class="mb-3">Upload File Excel Mitra</h3>
        
        <div class="alert alert-info">
            <strong>Petunjuk:</strong>
            <ul class="mb-0">
                <li>Gunakan format file <strong>.xlsx</strong> atau <strong>.xls</strong>.</li>
                <li>Pastikan file memiliki sheet bernama: <strong>2021, 2022, 2023, 2024, 2025</strong>.</li>
                <li>Header data harus dimulai dari baris ke-6.</li>
            </ul>
        </div>
        
        <form action="{{ route('import.semua') }}" method="POST" enctype="multipart/form-data">
            @csrf
            <div class="mb-4">
                <label for="file" class="form-label">Pilih File Excel</label>
                <input type="file" name="file" id="file" class="form-control" accept=".xlsx, .xls" required>
            </div>
            
            <div class="d-grid">
                <button type="submit" class="btn btn-primary btn-lg">Mulai Import ke Database</button>
            </div>
        </form>

        <div id="loading" class="text-center mt-3" style="display: none;">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2">Sedang memproses banyak data, mohon tunggu...</p>
        </div>
    </div>

    <script>
        // Opsional: Menampilkan loading spinner saat tombol diklik
        document.querySelector('form').addEventListener('submit', function() {
            document.getElementById('loading').style.display = 'block';
            document.querySelector('button').disabled = true;
        });
    </script>
</body>
</html>