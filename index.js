const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB, getDb } = require("./db");
const { ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;

const app = express();

// Database

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
		.forEach((product) => products.push(product))
		.then(() => res.status(200).json(products))
		.catch((error) =>
			res.status(500).json({ error: "Could not fetch the documents" })
		);
});

app.get("/products/myProducts", (req, res) => {
	const email = req.body;
	console.log(email);
	let products = [];

	db.collection("products")
		.find(email)
		.forEach((product) => products.push(product))
		.then(() => res.status(200).json(products))
		.catch((error) =>
			res.status(500).json({ error: "Could not fetch the documents" })
		);
});

app.post("/products", (req, res) => {
	const product = req.body;
	// console.log(product);
	console.log("Add Product: ", product);
	db.collection("products")
		.insertOne(product)
		.then((result) => res.status(201).json(result))
		.catch((err) =>
			res.status(500).json({ error: "Could not create new document" })
		);
});

app.get("/products/:id", (req, res) => {
	console.log("Single Product Request Id: ", req.params.id);
	if (ObjectId.isValid(req.params.id)) {
		db.collection("products")
			.findOne({ _id: ObjectId(req.params.id) })
			.then((result) => res.status(200).json(result))
			.catch((err) =>
				res.status(500).json({ error: "Could not fetch the document" })
			);
	} else {
		res.status(500).json({ error: "Not valid document ID" });
	}
});

app.patch("/products/:id", (req, res) => {
	console.log("Updating Reuest ID: ", req.params.id);

	if (ObjectId.isValid(req.params.id)) {
		db.collection("products")
			.updateOne(
				{ _id: ObjectId(req.params.id) },
				{ $inc: { quantity: -1, sold: 1 } }
			)
			.then((result) => res.status(200).json(result))
			.catch((err) =>
				res.status(500).json({ error: "Could not update the document" })
			);
	} else {
		res.status(500).json({ error: "Not valid document ID" });
	}
});

app.delete("/products/:id", (req, res) => {
	console.log("Delete Request Id: ", req.params.id);
	if (ObjectId.isValid(req.params.id)) {
		db.collection("products")
			.deleteOne({ _id: ObjectId(req.params.id) })
			.then((result) => res.status(200).json(result))
			.catch((err) =>
				res.status(500).json({ error: "Could not delete the document" })
			);
	} else {
		res.status(500).json({ error: "Not valid document ID" });
	}
});
