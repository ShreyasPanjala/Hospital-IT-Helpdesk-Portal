const express = require("express");

const router = express.Router();

const Ticket = require("../models/Ticket");


// CREATE TICKET
router.post("/", async (req, res) => {

    try {

        const newTicket = new Ticket(req.body);

        await newTicket.save();

        res.json({
            message: "Ticket Created"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });
    }
});


// GET ALL TICKETS
router.get("/", async (req, res) => {

    try {

        const tickets = await Ticket.find().sort({
            createdAt: -1
        });

        res.json(tickets);

    } catch (err) {

        res.status(500).json({
            message: "Error fetching tickets"
        });
    }
});


// DELETE TICKET
router.delete("/:id", async (req, res) => {

    try {

        await Ticket.findByIdAndDelete(req.params.id);

        res.json({
            message: "Ticket Deleted"
        });

    } catch (err) {

        res.status(500).json({
            message: "Delete Failed"
        });
    }
});

module.exports = router;