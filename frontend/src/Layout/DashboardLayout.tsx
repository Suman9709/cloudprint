import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"



export const DashboardLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}