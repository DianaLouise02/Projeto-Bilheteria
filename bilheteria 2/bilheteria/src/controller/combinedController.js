const usersController = require('./userController');
const ticketsController = require('./ticketController');



exports.getCombinedData = (req, res) => {
  const users = usersController.getDbData().users;
  const tickets = ticketsController.getTicketsData().tickets;

  res.json({ users, tickets });
};
