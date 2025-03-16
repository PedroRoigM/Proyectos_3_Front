
import Topbar from "./components/TopBar";

export default function RootLayout({ children }) {
    return (
        <div>
            <div className="flex-1 flex flex-col">
                {/* Topbar */}
                <div className=" text-white">
                    <Topbar />
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-gray-100 overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
