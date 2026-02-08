export const LoyalCustomerSection = () => {
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h3 className="font-semibold text-lg mb-2">Pelanggan Setia</h3>
        <p className="text-sm text-gray-500 mb-4">
          Rekomendasi pelanggan setia per-tahunnya
        </p>
  
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Berlianti Putri</p>
              <p className="text-sm text-gray-500">berliantiputri@gmail.com</p>
            </div>
            <p className="font-semibold">2.235</p>
          </div>
  
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Henky Prasetyo</p>
              <p className="text-sm text-gray-500">henkyprasetyo@gmail.com</p>
            </div>
            <p className="font-semibold">1.750</p>
          </div>
  
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Sukma Aurora</p>
              <p className="text-sm text-gray-500">sukmaaurora@gmail.com</p>
            </div>
            <p className="font-semibold">865</p>
          </div>
        </div>
      </div>
    );
  };
  