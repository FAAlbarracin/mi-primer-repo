import express from "express";
import fs, { read } from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json())

const readData = () => {
    try {
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    }
    catch (error) {
        console.log(error);
    }
};

const writedata = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data));
    }
    catch (error) {
        console.log(error);
    }
}

app.get("/", (req, res) => {
    res.send("Bienvenido a mi primera API con NodeJS!");
});

app.get("/books", (req, res) => {
    const data = readData();
    res.json(data.books);
})

app.get("/books/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const book = data.books.find((book) => book.id === id);
    res.json(book)
})

app.post("/books", (req, res) => {
    const data = readData();
    const body = req.body;
    const newbook = {
        id: data.books.length + 1,
        ...body,
    }
    data.books.push(newbook);
    writedata(data);
    res.json(newbook);
})

app.put("/books/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book) => book.id === id);
    data.books[bookIndex] = {
        ...data.books[bookIndex],
        ...body,
    }
    writedata(data);
    res.json({ message: "El libro se ha actualizado correctamente" });
})

app.delete("/books/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book) => book.id === id);
    data.books.splice (bookIndex, 1);
    writedata(data);
    res.json({ message: "El libro se ha borrado correctamente" });

})

app.listen(3000, () => {
    console.log("El servidor esta escuchando en el puerto 3000");
});