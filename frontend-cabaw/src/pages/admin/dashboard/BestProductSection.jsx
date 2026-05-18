import React from "react";

import Gorok from "../../../assets/krupuk_gorok.png";
import Ikan from "../../../assets/krupuk_ikan.png";
import Jari from "../../../assets/krupuk_jari.png";
import Keong from "../../../assets/krupuk_keong.png";

export default function BestProductSection() {

  const bestSeller = [
    { name: "Krupuk Gorok", img: Gorok },
    { name: "Krupuk Ikan", img: Ikan },
    { name: "Krupuk Jari", img: Jari },
    { name: "Krupuk Keong", img: Keong },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 h-full shadow-sm">

      <h2 className="text-xl font-semibold mb-2">
        Produk Terlaris
      </h2>

      <p className="text-sm text-gray-500 mb-6">
        Rekomendasi produk terlaris Krupuk Cap Bawang
      </p>

      <div className="flex gap-4 overflow-x-auto pb-2">
  {bestSeller.map((item, i) => (
    <div
      key={i}
      className="min-w-[280px] bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition"
    >
      <div className="overflow-hidden rounded-xl mb-2">
        <img
          src={item.img}
          alt={item.name}
          className="w-full h-40 object-cover"
        />
      </div>

      <p className="text-sm font-semibold">
        {item.name}
      </p>

      <p className="text-xs text-gray-500">
        Rp 2.500 / Bungkus
      </p>
    </div>
  ))}
</div>

    </div>
  );
}