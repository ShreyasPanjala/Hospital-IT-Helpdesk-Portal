import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function Register() {

    const [formData, setFormData] = useState({
        name: "",
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
                "http://localhost:5000/api/auth/register",
                formData
            );

            alert(res.data.message);

        } catch (err) {

            console.log(err);

            alert("Registration Failed");
        }
    };

    return (

        <div
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(to right, #dbeafe, #f0f9ff)",
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
                    Create Account
                </h1>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        className="form-control mb-3"
                        onChange={handleChange}
                        style={{
                            padding: "14px",
                            borderRadius: "12px"
                        }}
                    />

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
                        Register
                    </motion.button>

                </form>

            </motion.div>

        </div>
    );
}

export default Register;