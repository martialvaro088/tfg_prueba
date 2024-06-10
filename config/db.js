const mongoose = require('mongoose');

const mongoDBURI = 'mongodb+srv://alvaro:1234@tfgappresultados.hpkyslk.mongodb.net/tfg';

// Definiendo el esquema de las selecciones
const seleccionesSchema = new mongoose.Schema({
  id: Number,
  nombre: String,
  seleccionador: String,
  escudo: String,
  jugadores: Array
});

// Creando el modelo
const Selecciones = mongoose.model('Selecciones', seleccionesSchema);

// Definiendo el esquema de la eurocopa
const eurocopaSchema = new mongoose.Schema({
  temporada: String,
  fases: Array
});

// Creando el modelo
const Eurocopa = mongoose.model('Eurocopa', eurocopaSchema);

// Definiendo el esquema de los grupos
const gruposSchema = new mongoose.Schema({
  grupos: Array
});

// Creando el modelo
const Grupos = mongoose.model('Grupos', gruposSchema);

// Definiendo el esquema del usuario
const usuariosSchema = new mongoose.Schema({
  username: String,
  password: String,
  jugador_favorito: String,
  equipo_favorito: { type: mongoose.Schema.Types.ObjectId, ref: 'Selecciones' } // Referencia al modelo Selecciones
});

// Creando el modelo
const Usuarios = mongoose.model('Usuarios', usuariosSchema);

// Definiendo el esquema de los jugadores
const jugadorSchema = new mongoose.Schema({
  nombre: String,
  posicion: String,
  club: String,
  foto: String,
  seleccion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Selecciones'
  }
});

// Creando el modelo
const Jugadores = mongoose.model('Jugadores', jugadorSchema);

// Función de conexión a la base de datos
const conectarDB = async () => {
  try {
    await mongoose.connect(mongoDBURI);
    console.log('Conectado a MongoDB');
  } catch (err) {
    console.error('Error al conectar a MongoDB:', err);
    process.exit(1); // Detiene la aplicación en caso de error
  }
};

module.exports = { Selecciones, Eurocopa, Grupos, Usuarios, Jugadores, conectarDB };
