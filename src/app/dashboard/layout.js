import TopBar from "./components/TopBar";

export default function DashboardLayout({ children }) {
    return (
        <div>
            <div className="flex-1 flex flex-col">
                {/* Dashboard Topbar */}
                <div className="text-black">
                    <TopBar />
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-gray-100 overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
