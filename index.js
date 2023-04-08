const express = require("express");
const app = express();
const morgan = require("morgan");
const DB = require("./db/dbConnect");
const cors = require("cors");
require("dotenv/config");

const SERVER_PORT = process.env.SERVER_PORT;
const SERVER_HOST = process.env.SERVER_HOST;
const API = process.env.API_URL

// avoir la possibiliter de traiter le contenue JSON de requette
app.use(express.json());

//Autoriser au front d'acceder au NodeJS
app.use(cors());
app.options("*", cors);
// Affichage au console de chaque requette
app.use(morgan("tiny"));
//Declarer le dossier comme static folder pour stocker les images
app.use("/public/uploads", express.static(__dirname + "/public/uploads/plans"))

// Les routes
const chefProjetRouter = require("./Routes/chefProjetRouter");
const chantierRouter = require("./Routes/chantierRouter");
const etageRouter = require("./Routes/etageRouter");
const elementRouter = require("./Routes/elementRouter");
const planRouter = require("./Routes/planRouter");
const tacheRouter = require("./Routes/tacheRouter");
const chefChantierRouter = require("./Routes/chefChantierRouter");
const zoneRouter = require("./Routes/zoneRouter");


// APIs
app.use(`${API}/chefProjets`, chefProjetRouter);
app.use(`${API}/chantiers`, chantierRouter);
app.use(`${API}/etages`, etageRouter);
app.use(`${API}/elements`, elementRouter);
app.use(`${API}/plans`, planRouter);
app.use(`${API}/taches`, tacheRouter);
app.use(`${API}/chefChantiers`, chefChantierRouter);
app.use(`${API}/zones`, zoneRouter);


// Connexion a la base de données
DB.sync()
  .then(console.log("database connected"))
  .catch((err) => {
    console.log(err);
  });

// Connexion au serveur NodeJS
app.listen(SERVER_PORT, SERVER_HOST,() => {
  console.log("Server Started :"+ SERVER_HOST+ ":" + SERVER_PORT);
});
