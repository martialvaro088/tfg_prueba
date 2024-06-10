const express = require('express');
const app = express();
const fs = require('fs');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { Selecciones, Eurocopa, Grupos, Usuarios, Jugadores, conectarDB } = require('./config/db'); // Importar modelos y función de conexión desde db.js
const Parser = require('rss-parser');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const privateKey = fs.readFileSync('miclave.key', 'utf8');
const certificate = fs.readFileSync('micertificado.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate, passphrase: '123456' };
const https = require('http');

const server = https.createServer(credentials, app);
const port = process.env.PORT || 3000;

const io = require('socket.io')(server);

app.use(session({
    secret: 'tu cadena secreta', // Cambia esto por una cadena segura
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://alvaro:1234@tfgappresultados.hpkyslk.mongodb.net/tfg', // Asegúrate de que la URL de MongoDB es correcta
        collectionName: 'sessions'
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 }  // 1 día
}));

app.use(cookieParser('tu cadena secreta'));

let usuariosConectados = {};

// Middleware de autenticación
const auth = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.sendStatus(401);
    }
};

// Rutas GET
app.get('/getEurocopa', async (req, res) => {
    try {
        const eurocopa = await Eurocopa.find();
        console.log(eurocopa);
        if (!eurocopa || eurocopa.length === 0) {
            return res.status(404).json({ message: 'No se encontraro la eurocopa.' });
        }
        res.status(200).json(eurocopa);
    } catch (error) {
        console.error('Error al obtener los datos de la eurocopa:', error);
        res.status(500).json({ error: 'Error al obtener los datos de la eurocopa.' });
    }
});

app.get('/getSelecciones', async (req, res) => {
    try {
        const selecciones = await Selecciones.find();
        console.log(selecciones);
        if (!selecciones || selecciones.length === 0) {
            return res.status(404).json({ message: 'No se encontraron selecciones.' });
        }
        res.status(200).json(selecciones);
    } catch (error) {
        console.error('Error al obtener las selecciones:', error);
        res.status(500).json({ error: 'Error al obtener las selecciones.' });
    }
});

//FUNCIÓN PARA RECUPERAR LAS SELECCIONES POR ID
app.get('/getSeleccion/:id', async (req, res) => {
    console.log('Request recibido para /getSeleccion/:id');
    try {
        const seleccionId = parseInt(req.params.id, 10);
        console.log('ID de selección:', seleccionId);
        const seleccion = await Selecciones.findOne({ id: seleccionId });
        console.log('Resultado de la base de datos:', seleccion);
        if (!seleccion) {
            return res.status(404).json({ message: 'Selección no encontrada.' });
        }
        res.status(200).json(seleccion);
    } catch (error) {
        console.error('Error al obtener la selección:', error);
        res.status(500).json({ error: 'Error al obtener la selección.' });
    }
});

app.get('/getJugadores', async (req, res) => {
    const { seleccionId } = req.query;
    try {
        const seleccion = selecciones.find(sel => sel.id === parseInt(seleccionId));
        if (!seleccion) {
            return res.status(404).json({ message: 'Selección no encontrada' });
        }
        res.status(200).json(seleccion.jugadores);
    } catch (error) {
        console.error('Error al obtener los jugadores:', error);
        res.status(500).json({ error: 'Error al obtener los jugadores.' });
    }
});


app.get('/getGrupos', async (req, res) => {
    try {
        const grupos = await Grupos.find();
        console.log(grupos);
        if (!grupos || grupos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron los grupos.' });
        }
        res.status(200).json(grupos);
    } catch (error) {
        console.error('Error al obtener los datos de los grupos:', error);
        res.status(500).json({ error: 'Error al obtener los datos de los grupos.' });
    }
});

const RSS_URL = 'https://e00-marca.uecdn.es/rss/futbol/seleccion.xml'; // URL del feed RSS de Marca

app.get('/feed', async (req, res) => {
    const parser = new Parser();
    try {
        const feed = await parser.parseURL(RSS_URL);
        res.json(feed);  // Enviar el feed como JSON
    } catch (error) {
        console.error('Error al obtener el feed RSS:', error);
        res.status(500).json({ error: 'Error al obtener el feed RSS' });
    }
});

// Rutas para servir archivos estáticos
const rutasEstaticas = [
    'noticias', 'cuartos', 'equipos', 'final', 'grupos', 
    'infoGrupos', 'resumen', 'selecciones', 'semifinales', 'servicioAPI', 'chat'
];

rutasEstaticas.forEach(ruta => {
    app.get(`/${ruta}`, (req, response) => {
        const contenido = fs.readFileSync(`public/${ruta}.html`);
        response.setHeader("Content-type", "text/html");
        response.send(contenido);
    });
});

app.get('/', (req, response) => {
    const contenido = fs.readFileSync("public/resumen.html");
    response.setHeader("Content-type", "text/html");
    response.send(contenido);
});

app.get('/rutaSegura', auth, (req, response) => {
    const contenido = fs.readFileSync("public/chat.html");
    response.setHeader("Content-type", "text/html");
    response.send(contenido);
});

// Rutas POST
app.post('/identificar', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.send({ "res": "login failed" });
    }

    try {
        const usuarioEncontrado = await Usuarios.findOne({
            username: req.body.username,
            password: req.body.password
        });

        if (usuarioEncontrado) {
            req.session.user = usuarioEncontrado.username;
            req.session.userId = usuarioEncontrado._id;
            return res.send({ "res": "login true" });
        } else {
            return res.send({ "res": "usuario no valido" });
        }
    } catch (error) {
        console.error('Error al identificar el usuario:', error);
        return res.status(500).send({ "res": "login failed" });
    }
});

app.post('/registrar', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.send({ "res": "register failed" });
    }

    try {
        const usuarioExiste = await Usuarios.findOne({ username: req.body.username });

        if (usuarioExiste) {
            return res.send({ "res": "usuario ya existe" });
        } else {
            const nuevoUsuario = new Usuarios({
                username: req.body.username,
                password: req.body.password,
                jugador_favorito: req.body.jugador_favorito,
                equipo_favorito: req.body.equipo_favorito
            });

            await nuevoUsuario.save();
            return res.send({ "res": "register true" });
        }
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        return res.status(500).send({ "res": "register failed" });
    }
});

app.post('/marcarFavorito', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ res: 'No estás autenticado' });
    }

    const { seleccionId } = req.body;
    try {
        const usuario = await Usuarios.findById(req.session.userId);
        if (usuario) {
            usuario.equipo_favorito = new mongoose.Types.ObjectId(seleccionId); // Convertir a ObjectId y guardar en equipo_favorito
            await usuario.save();
            res.json({ res: 'Favorito marcado correctamente' });
        } else {
            res.status(404).json({ res: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al marcar favorito:', error);
        res.status(500).json({ res: 'Error al marcar favorito' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ res: 'Error al cerrar sesión' });
        }
        res.json({ res: 'Sesión cerrada exitosamente' });
    });
});

app.get('/usuario', async (req, res) => {
    if (req.session.userId) {
        try {
            const usuario = await Usuarios.findById(req.session.userId).populate('equipo_favorito');
            if (usuario) {
                res.json({
                    loggedIn: true,
                    username: usuario.username,
                    equipoFavorito: usuario.equipo_favorito ? usuario.equipo_favorito.nombre : 'No tiene'
                });
            } else {
                res.json({ loggedIn: false });
            }
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
            res.status(500).json({ loggedIn: false });
        }
    } else {
        res.json({ loggedIn: false });
    }
});


// Ejemplo de ruta protegida
app.get('/perfil', auth, async (req, res) => {
    try {
        const usuario = await Usuarios.findById(req.session.userId);
        res.json({ res: 'Perfil del usuario', usuario });
    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        res.status(500).json({ res: 'Error al obtener el perfil del usuario' });
    }
});

// Socket.io
io.on('connection', (socket) => {
    usuariosConectados[socket.id] = socket.id;
    io.emit('usuarios conectados', Object.keys(usuariosConectados));

    socket.on('chat message', (msg) => {
        io.emit('chat message', { msg: msg, from: socket.id, to: null });
    });

    socket.on('private message', (data) => {
        socket.to(data.to).emit('private message', { msg: data.msg, from: socket.id, to: data.to });
        socket.emit('private message', { msg: data.msg, from: socket.id, to: data.to });
    });

    socket.on('disconnect', () => {
        delete usuariosConectados[socket.id];
        io.emit('usuarios conectados', Object.keys(usuariosConectados));
    });
});

// Conectar a la base de datos y luego iniciar el servidor
conectarDB().then(() => {
    server.listen(port, () => {
        console.log(`Escuchando en el puerto ${port}`);
    });
}).catch(err => {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1);
});
