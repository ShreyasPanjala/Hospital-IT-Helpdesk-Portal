import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await axios.post(
                "http://localhost:5000/api/auth/login",
                formData
            );

            alert(res.data.message);

            navigate("/dashboard");

        } catch (err) {

            console.log(err);

            alert("Login Failed");
        }
    };

    return (

        <div
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(to right, #e0f2fe, #f8fafc)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >

            <motion.div
                initial={{
                    opacity: 0,
                    y: 40
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                transition={{
                    duration: 0.5
                }}
                className="card border-0 shadow-lg p-5"
                style={{
                    width: "450px",
                    borderRadius: "25px",
                    background:
                        "rgba(255,255,255,0.75)",
                    backdropFilter: "blur(12px)"
                }}
            >

                <h1
                    className="mb-4 text-center"
                    style={{
                        fontWeight: "700",
                        color: "#111827"
                    }}
                >
                    Welcome Back
                </h1>

                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        className="form-control mb-3"
                        onChange={handleChange}
                        style={{
                            padding: "14px",
                            borderRadius: "12px"
                        }}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="form-control mb-4"
                        onChange={handleChange}
                        style={{
                            padding: "14px",
                            borderRadius: "12px"
                        }}
                    />

                    <motion.button
                        whileHover={{
                            scale: 1.03
                        }}
                        whileTap={{
                            scale: 0.97
                        }}
                        className="btn btn-dark w-100"
                        style={{
                            padding: "14px",
                            borderRadius: "12px",
                            fontWeight: "600"
                        }}
                    >
                        Login
                    </motion.button>

                </form>

            </motion.div>

        </div>
    );
}

export default Login;