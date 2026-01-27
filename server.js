const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');
const fs = require('fs');
const { main } = require('./bot');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const leadsFilePath = path.join(__dirname, 'leads.json');

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');

  if (fs.existsSync(leadsFilePath)) {
    const leads = JSON.parse(fs.readFileSync(leadsFilePath));
    socket.emit('initial-leads', leads);
  }

  socket.on('delete-industry', (industry) => {
    if (fs.existsSync(leadsFilePath)) {
        let leads = JSON.parse(fs.readFileSync(leadsFilePath));
        const remainingLeads = leads.filter(l => l.industry !== industry);
        fs.writeFileSync(leadsFilePath, JSON.stringify(remainingLeads, null, 2));
        io.emit('initial-leads', remainingLeads);
    }
  });

  socket.on('delete-leads', (leadsToDelete) => {
    if (fs.existsSync(leadsFilePath)) {
        let leads = JSON.parse(fs.readFileSync(leadsFilePath));
        const remainingLeads = leads.filter(l => !leadsToDelete.includes(l.website));
        fs.writeFileSync(leadsFilePath, JSON.stringify(remainingLeads, null, 2));
        io.emit('initial-leads', remainingLeads);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

setTimeout(() => main(io), 0);

server.listen(3000, () => {
  console.log('listening on *:3000');
});