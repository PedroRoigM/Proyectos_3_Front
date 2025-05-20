import Footer from "../components/Footer";
import TopBarSelector from "./components/TopBarSelector";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Dashboard Topbar */}
            <div className="text-black">
                <TopBarSelector />
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-gray-100 overflow-auto">
                {children}
            </div>
        </div>
    );
}