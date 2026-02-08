export const SummaryCardsSection = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-8">
        {/* Total Keuntungan */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <p className="text-gray-500">Total Keuntungan Tahunan</p>
          <h2 className="text-3xl font-bold">$20.000.000</h2>
        </div>
  
        {/* Tahun Sebelumnya */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <p className="text-gray-500">Tahun Sebelumnya</p>
          <h2 className="text-3xl font-bold">$4.000.000</h2>
        </div>
      </div>
    );
  };
  