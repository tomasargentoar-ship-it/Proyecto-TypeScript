import {Collection, MongoClient,ObjectId} from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI || "mongodb://localhost:27017/Proyecto-typescript";

const client =new MongoClient(uri);

interface estructura{

titulo: string;

autor: string;

precio: number;

stock: number;
}

async function crearLibro(libro:estructura[],collection:Collection){
    await collection.insertMany(libro);
}

async function leerLibro(collection:Collection){
   console.table(await collection.find().toArray());
}

async function actualizarLibro(id:string,libro:estructura[],collection:Collection){
   await collection.updateMany({_id: new ObjectId(id)},{$set: libro});
}

async function eliminarLibro(id:string,libro:estructura[],collection:Collection){
   await collection.deleteMany({_id: new ObjectId(id)});
}

async function main(){
    try{
        await client.connect();
        console.log("Conectado a la base de datos");
        const db = client.db("Libreria");
        const collection=db.collection("libros");
    }
    catch(error){
        console.error("Error al conectar a la base de datos", error);
    }
    finally{
        await client.close();
    }
}

