import { SidebarNavigationSection } from "./sidebarnavigation";
import { AnnualProfitChartSection } from "./AnnualProfitChartSection";
import { SummaryCardsSection } from "./SummaryCardsSection";
import BestProductSection from "./BestProductSection";
import { LoyalCustomerSection } from "./LoyalCustomerSection";
import { DistribusiKategoriPelanggan } from "./DistribusiKategoriPelanggan";
import NavbarAdmin from "./navbar_admin";


export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <NavbarAdmin />

        {/* Header */}
        <div className="pt-16">
        </div>

        <main className="p-8 space-y-6">

          {/* SUMMARY */}
          <SummaryCardsSection />

          {/* CONTENT */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

            {/* ================= LEFT ================= */}
            <div className="xl:col-span-3 flex flex-col gap-6">

              {/* CHART */}
              <div className="h-fit">
                <AnnualProfitChartSection />
              </div>

              {/* BEST PRODUCT */}
              <div>
                <BestProductSection />
              </div>

            </div>

            {/* ================= RIGHT ================= */}
            <div className="xl:col-span-2 flex flex-col gap-6">

              {/* Loyal Customer */}
              <LoyalCustomerSection />

              {/* Distribusi */}
              <DistribusiKategoriPelanggan />

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}