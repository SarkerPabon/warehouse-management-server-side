const express = require("express");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

// Database
const { connectDB, getDb } = require("./db");
let db;
connectDB((err) => {
	if (!err) {
		app.listen(port, () => console.log(`Server is running on port ${port}`));

		db = getDb();
	}
});

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Running Server");
});

app.get("/products", (req, res) => {
	let products = [];

	db.collection("products")
		.find()
		.forEach((product) => products.push())
		.then(() => res.status(200).json(products))
		.catch((error) =>
			res.status(500).json({ error: "Could not fetch the documents" })
		);
});
