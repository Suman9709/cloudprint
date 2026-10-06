import { Link } from "react-router-dom"

const Footer = () => {
    return (
        <div>
            <div className="footer sm:footer-horizontal bg-base-200 text-base-content p-4">
                <div>
                    <img src="" alt="logo" />
                </div>
                <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-4">

                    <nav>
                        <h6 className="footer-title">Company</h6>
                        <Link to="/about" className="link link-hover">About us</Link>
                        <Link to="/contact" className="link link-hover">Contact</Link>

                    </nav>
                    <nav>
                        <h6 className="footer-title">Legal</h6>
                        <Link to="/terms" className="link link-hover">Our Terms</Link>
                        <Link to="/cookie" className="link link-hover">Cookie policy</Link>

                    </nav>
                </footer>
            </div>
            <footer className="footer bg-base-200 text-base-content border-base-300 border-t px-4 py-4 flex flex-row justify-between">
                <p>Copyright ©{new Date().getFullYear()} - All right reserved by Cloudprint</p>
                <div className="flex gap-4">
                    <Link to="/terms" className="link link-hover">Terms of Service</Link>
                    <Link to="/privacy" className="link link-hover">Privacy Policy</Link>
                </div>

            </footer>
        </div>
    )
}

export default Footer
