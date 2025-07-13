"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./asistencia/infrastructure/config/database");
const asistencia_routes_1 = __importDefault(require("./asistencia/infrastructure/http/routes/asistencia.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rutas
app.use('/api', asistencia_routes_1.default);
// Inicializar conexión a la base de datos
database_1.AppDataSource.initialize()
    .then(() => {
    console.log('Base de datos conectada');
})
    .catch((error) => {
    console.error('Error al conectar la base de datos:', error);
});
exports.default = app;
