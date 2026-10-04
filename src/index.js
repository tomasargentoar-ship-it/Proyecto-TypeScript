"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const uri = process.env.MONGO_URI || "mongodb://localhost:27017/Proyecto-typescript";
const client = new mongodb_1.MongoClient(uri);
async function crearLibro(libro, collection) {
    await collection.insertMany(libro);
}
async function leerLibro(collection) {
    console.table(await collection.find().toArray());
}
async function actualizarLibro(id, libro, collection) {
    await collection.updateMany({ _id: new mongodb_1.ObjectId(id) }, { $set: libro });
}
async function eliminarLibro(id, collection) {
    await collection.deleteMany({ _id: new mongodb_1.ObjectId(id) });
}
async function main() {
    try {
        await client.connect();
        console.log("Conectado a la base de datos");
        const db = client.db("Libreria");
        const collection = db.collection("libros");
        const args = process.argv.slice(2);
        const accion = args[0];
        switch (accion) {
            case "crear": {
                const libro = [{
                        titulo: args[1] || "",
                        autor: args[2] || "",
                        precio: Number(args[3]),
                        stock: Number(args[4])
                    }];
                await crearLibro(libro, collection);
                console.log("Libro creado:", libro);
                break;
            }
            case "leer": {
                await leerLibro(collection);
                break;
            }
            case "actualizar": {
                const id = args[1] || "";
                const libro = [{
                        titulo: args[2] || "",
                        autor: args[3] || "",
                        precio: Number(args[4]),
                        stock: Number(args[5])
                    }];
                await actualizarLibro(id, libro, collection);
                console.table("Libro actualizado");
                break;
            }
            case "eliminar": {
                const id = args[1] || "";
                await eliminarLibro(id, collection);
                console.log("Libro eliminado:", id);
                break;
            }
            default: {
                console.log("comando no valido");
                break;
            }
        }
    }
    catch (error) {
        console.error("Error al conectar a la base de datos", error);
    }
    finally {
        await client.close();
    }
}
main();
//# sourceMappingURL=index.js.map