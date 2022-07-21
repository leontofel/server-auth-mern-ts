import express from "express";
import db from './config/dbConnect';
import routes from './routes/index';
import cors from 'cors';


db.on("error", console.log.bind(console, 'Connection Error'));
db.once("open", () => {
    console.log("Connection with database established");
});

const app = express();
const corsOption = {
  origin: ['http://localhost:3000'],
};
app.use(cors(corsOption));



app.use(express.json());

routes(app);


export default app;