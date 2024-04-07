import express from 'express';
import { DB } from './Config/database.js';
import VeterinarioRouter from './Routes/VeterinarioRouter.js';
import PacienteRouter from './Routes/PacienteRouter.js';
import cors from "cors";

const app = express();
const port = process.env.PORT || 4000;

DB();

const allowedDomains = [
    "http://localhost:5173",
    "http://localhost:4000",
    "http://localhost:4173",
];

const corsOptions = {
    origin: function(origin, callback) {
        if(allowedDomains.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('No permitido | CORS policy'));
        }
    }
}
app.use(cors(corsOptions));

app.use(express.json());
app.use('/api/veterinarios', VeterinarioRouter);
app.use('/api/pacientes', PacienteRouter);
app.listen(port, () => {
    console.log(`Server opened on port ${port}`);
});