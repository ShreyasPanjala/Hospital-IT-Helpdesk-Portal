import { Link } from "react-router-dom";

function Navbar() {

    return (

        <nav
            className="navbar navbar-expand-lg shadow-sm"
            style={{
                background: "rgba(17,24,39,0.95)",
                backdropFilter: "blur(10px)"
            }}
        >

            <div className="container">

                <Link
                    className="navbar-brand text-light fw-bold"
                    to="/dashboard"
                    style={{
                        letterSpacing: "1px"
                    }}
                >
                    Hospital IT Helpdesk
                </Link>

                <div className="d-flex gap-2">

                    <Link
                        className="btn btn-outline-light"
                        to="/"
                        style={{
                            borderRadius: "10px"
                        }}
                    >
                        Login
                    </Link>

                    <Link
                        className="btn btn-light"
                        to="/register"
                        style={{
                            borderRadius: "10px"
                        }}
                    >
                        Register
                    </Link>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;