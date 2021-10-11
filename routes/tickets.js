const router = require('express').Router();
const verify = require('./verifyToken');
const Ticket = require('../model/ticket');

router.get("/", verify , async (req,res) =>{
  if(req.query.id){
    var ticketId = req.query.id;
    console.log(ticketId);
    var tickets =  await Ticket.findById(ticketId);
    res.status(200).json({tickets: tickets, msg : "Ticket fetched succesfully" });
  }
  else {
    var tickets =  await Ticket.find();
    res.status(200).json({tickets: tickets, msg : "Tickets fetched succesfully" });
  }
    
});

// router.get("/:id", verify , async (req,res) =>{
//   var ticketId = req.params.id;
//   var tickets =  await Ticket.findById(ticketId);
//   res.status(200).json({tickets: tickets, msg : "Ticket fetched succesfully" });
// });

// Create
router.post("/create",verify, async (req,res) => {
    //Creating new ticket
    const ticket = new Ticket({
      ticketId : req.body.ticketId,
      ticketName : req.body.ticketName,
      description : req.body.description,
      status : req.body.status
    });
    try {
      const savedTicket = await ticket.save();
      res.status(200).send({ticket : ticket._id});
    }
    catch(err) {
        res.status(400).send(err);
    }
});

module.exports = router;