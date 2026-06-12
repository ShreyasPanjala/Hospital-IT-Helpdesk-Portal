import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Dashboard() {

    const [tickets, setTickets] = useState([]);

    useEffect(() => {

        fetchTickets();

    }, []);

    const fetchTickets = async () => {

        try {

            const res = await axios.get(
                "http://localhost:5000/api/tickets"
            );

            setTickets(res.data);

        } catch (err) {

            console.log(err);
        }
    };

    const deleteTicket = async (id) => {

        try {

            await axios.delete(
                `http://localhost:5000/api/tickets/${id}`
            );

            fetchTickets();

        } catch (err) {

            console.log(err);
        }
    };

    const updateStatus = async (id, status) => {

        try {

            await axios.put(
                `http://localhost:5000/api/tickets/${id}`,
                { status }
            );

            fetchTickets();

        } catch (err) {

            console.log(err);
        }
    };

    return (

        <div
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(to right, #eef2f3, #dfe9f3)",
                padding: "40px"
            }}
        >

            <div className="container">

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="d-flex justify-content-between align-items-center mb-5"
                >

                    <div>

                        <h1
                            style={{
                                fontWeight: "700",
                                color: "#1f2937"
                            }}
                        >
                            IT Helpdesk Dashboard
                        </h1>

                        <p
                            style={{
                                color: "#6b7280"
                            }}
                        >
                            Monitor and manage support requests
                        </p>

                    </div>

                    <Link
                        to="/create-ticket"
                        className="btn btn-dark px-4 py-2"
                        style={{
                            borderRadius: "12px"
                        }}
                    >
                        + Create Ticket
                    </Link>

                </motion.div>

                <div className="row mb-5">

                    <div className="col-md-4">

                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            className="card border-0 shadow-lg p-4"
                            style={{
                                borderRadius: "20px",
                                background:
                                    "rgba(255,255,255,0.7)",
                                backdropFilter: "blur(10px)"
                            }}
                        >

                            <h5>Total Tickets</h5>

                            <h1>
                                {tickets.length}
                            </h1>

                        </motion.div>

                    </div>

                    <div className="col-md-4">

                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            className="card border-0 shadow-lg p-4"
                            style={{
                                borderRadius: "20px",
                                background:
                                    "rgba(255,255,255,0.7)",
                                backdropFilter: "blur(10px)"
                            }}
                        >

                            <h5>Resolved</h5>

                            <h1>

                                {
                                    tickets.filter(
                                        t =>
                                            t.status === "Resolved"
                                    ).length
                                }

                            </h1>

                        </motion.div>

                    </div>

                    <div className="col-md-4">

                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            className="card border-0 shadow-lg p-4"
                            style={{
                                borderRadius: "20px",
                                background:
                                    "rgba(255,255,255,0.7)",
                                backdropFilter: "blur(10px)"
                            }}
                        >

                            <h5>Pending</h5>

                            <h1>

                                {
                                    tickets.filter(
                                        t =>
                                            t.status !== "Resolved"
                                    ).length
                                }

                            </h1>

                        </motion.div>

                    </div>

                </div>

                {
                    tickets.length === 0 ? (

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="card border-0 shadow-lg p-5 text-center"
                            style={{
                                borderRadius: "20px"
                            }}
                        >

                            <h3>No Tickets Found</h3>

                        </motion.div>

                    ) : (

                        tickets.map((ticket, index) => (

                            <motion.div
                                key={ticket._id}
                                initial={{
                                    opacity: 0,
                                    y: 30
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0
                                }}
                                transition={{
                                    delay: index * 0.1
                                }}
                                whileHover={{
                                    scale: 1.01
                                }}
                                className="card border-0 shadow-lg mb-4"
                                style={{
                                    borderRadius: "20px",
                                    background:
                                        "rgba(255,255,255,0.8)",
                                    backdropFilter: "blur(10px)"
                                }}
                            >

                                <div className="card-body p-4">

                                    <div className="d-flex justify-content-between">

                                        <div>

                                            <h3
                                                style={{
                                                    fontWeight: "600"
                                                }}
                                            >
                                                {ticket.title}
                                            </h3>

                                            <p
                                                style={{
                                                    color: "#6b7280"
                                                }}
                                            >
                                                {ticket.description}
                                            </p>

                                        </div>

                                        <span
                                            className={
                                                ticket.status === "Resolved"
                                                ? "badge bg-success"
                                                : ticket.status === "In Progress"
                                                ? "badge bg-warning text-dark"
                                                : "badge bg-secondary"
                                            }
                                            style={{
                                                height: "fit-content",
                                                padding: "10px 14px",
                                                borderRadius: "10px"
                                            }}
                                        >
                                            {ticket.status}
                                        </span>

                                    </div>

                                    <hr />

                                    <div className="row">

                                        <div className="col-md-6">

                                            <p>

                                                <strong>
                                                    Category:
                                                </strong>

                                                {" "}
                                                {ticket.category}

                                            </p>

                                        </div>

                                        <div className="col-md-6">

                                            <p>

                                                <strong>
                                                    Priority:
                                                </strong>

                                                {" "}
                                                {ticket.priority}

                                            </p>

                                        </div>

                                    </div>

                                    <div className="d-flex gap-3 mt-3">

                                        <button
                                            className="btn btn-outline-warning"
                                            style={{
                                                borderRadius: "10px"
                                            }}
                                            onClick={() =>
                                                updateStatus(
                                                    ticket._id,
                                                    "In Progress"
                                                )
                                            }
                                        >
                                            In Progress
                                        </button>

                                        <button
                                            className="btn btn-outline-success"
                                            style={{
                                                borderRadius: "10px"
                                            }}
                                            onClick={() =>
                                                updateStatus(
                                                    ticket._id,
                                                    "Resolved"
                                                )
                                            }
                                        >
                                            Resolve
                                        </button>

                                        <button
                                            className="btn btn-outline-danger"
                                            style={{
                                                borderRadius: "10px"
                                            }}
                                            onClick={() =>
                                                deleteTicket(ticket._id)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            </motion.div>
                        ))
                    )
                }

            </div>

        </div>
    );
}

export default Dashboard;