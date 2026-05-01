import { SidebarNavigationSection } from "./sidebarnavigation";
import { AnnualProfitChartSection } from "./AnnualProfitChartSection";
import { SummaryCardsSection } from "./SummaryCardsSection";
import { BestProductSection } from "./BestProductSection";
import { LoyalCustomerSection } from "./LoyalCustomerSection";
import NavbarAdmin from "./navbar_admin"; 
import TampilanElemen from "./TampilanElemen";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-white">

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar - Berada di paling atas content */}
        <NavbarAdmin />

        {/* 1. Tambahkan pembungkus pt-16 agar tidak tertutup Navbar Fixed */}
        <div className="pt-16"> 
          <TampilanElemen />
        </div> 

        {/* 2. Hapus pt-28 karena sudah ada pt-16 di atas */}
        <main className="p-8 space-y-8"> 
          {/* Top Summary Section */}
          <SummaryCardsSection />

          {/* Bottom Section: Loyal Customers */}
          <LoyalCustomerSection />
        </main>
      </div>
    </div>
  );
}