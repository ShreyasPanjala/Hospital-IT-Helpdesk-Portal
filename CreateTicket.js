import { useState } from "react";
import axios from "axios";

function CreateTicket() {

    const [ticket, setTicket] = useState({
        title: "",
        description: "",
        category: "",
        priority: "Low"
    });

    const handleChange = (e) => {

        setTicket({
            ...ticket,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await axios.post(
                "http://localhost:5000/api/tickets",
                ticket
            );

            alert("Ticket Created");

            setTicket({
                title: "",
                description: "",
                category: "",
                priority: "Low"
            });

        } catch (err) {

            console.log(err);

            alert("Error creating ticket");
        }
    };

    return (

        <div className="container mt-5">

            <div
                className="card shadow-lg border-0 p-4"
                style={{
                    borderRadius: "20px",
                    animation: "fadeIn 0.6s ease"
                }}
            >

                <h2 className="mb-4 fw-bold">
                    Create IT Support Ticket
                </h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="title"
                        placeholder="Issue Title"
                        className="form-control mb-3"
                        value={ticket.title}
                        onChange={handleChange}
                    />

                    <textarea
                        name="description"
                        placeholder="Describe the issue"
                        className="form-control mb-3"
                        rows="4"
                        value={ticket.description}
                        onChange={handleChange}
                    />

                    <select
                        name="category"
                        className="form-control mb-3"
                        value={ticket.category}
                        onChange={handleChange}
                    >
                        <option value="">
                            Select Category
                        </option>

                        <option>
                            Network
                        </option>

                        <option>
                            Hardware
                        </option>

                        <option>
                            Software
                        </option>

                        <option>
                            Printer
                        </option>

                        <option>
                            Security
                        </option>
                    </select>

                    <select
                        name="priority"
                        className="form-control mb-4"
                        value={ticket.priority}
                        onChange={handleChange}
                    >
                        <option>
                            Low
                        </option>

                        <option>
                            Medium
                        </option>

                        <option>
                            High
                        </option>
                    </select>

                    <button className="btn btn-dark w-100 py-2">
                        Submit Ticket
                    </button>

                </form>

            </div>

        </div>
    );
}

export default CreateTicket;