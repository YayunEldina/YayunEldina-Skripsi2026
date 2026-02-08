export const BestProductSection = () => {
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h3 className="font-semibold text-lg mb-2">Produk Terlaris</h3>
        <p className="text-sm text-gray-500 mb-4">
          Rekomendasi produk terlaris krupuk cap bawang
        </p>
  
        <div className="space-y-4">
          {/* Krupuk Bawang */}
          <div className="p-4 bg-gray-100 rounded-xl">
            <p className="font-medium">Krupuk Bawang</p>
            <p className="text-sm text-gray-500">⭐ 4.5</p>
            <p className="font-semibold">$2.500</p>
          </div>
  
          {/* Krupuk Udang */}
          <div className="p-4 bg-gray-100 rounded-xl">
            <p className="font-medium">Krupuk Udang</p>
            <p className="text-sm text-gray-500">⭐ 4.5</p>
            <p className="font-semibold">$2.500</p>
          </div>
        </div>
      </div>
    );
  };
  