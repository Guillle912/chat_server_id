// Creación y configuración del SERVER
const http = require('http');
const app = require('./src/app');
const ChatModel = require('./src/models/chat.model');
const chatModel = require('./src/models/chat.model');

// Config .env
require('dotenv').config();
require('./src/config/db')
// Creación server
const server = http.createServer(app);


const PORT = process.env.PORT || 3000;
server.listen(PORT);

// Listeners
server.on('listening', () => {
    console.log(`Servidor escuchando sobre el puerto ${PORT}`);
});

server.on('error', (error) => {
    console.log(error);
})



// Config socket server
const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
});

io.on('connection', async ( socket ) => {
    const messages = await chatModel.find().sort({ createdAt: -1 }).limit(5);
    socket.emit('chat_init', messages );
    console.log('Se ha conectado un nuevo cliente');
    socket.broadcast.emit('chat_message_server', {
        name: 'INFO',
        message: 'Se ha conectado un nuevo usuario'
    })

    io.emit('clients_online', io.engine.clientsCount)

    socket.on('chat_message_client', async ( data ) => {
        console.log( data );
        await chatModel.create( data );
        io.emit('chat_message_server', data);
    });

    socket.on('disconnect', () => {
        io.emit('chat_message_server', {
            name: 'INFO',
            message: 'Se ha desconectado un usuario'
        });
        io.emit('clients_online', io.engine.clientsCount );
    })
});