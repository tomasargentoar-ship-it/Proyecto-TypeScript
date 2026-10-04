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

async function eliminarLibro(id:string,collection:Collection){
   await collection.deleteMany({_id: new ObjectId(id)});
}

async function main(){
    try{
        await client.connect();
        console.log("Conectado a la base de datos");
        const db = client.db("Libreria");
        const collection=db.collection("libros");

        const args= process.argv.slice(2);
        const accion = args[0];
        switch(accion){
            case "crear":{
                const libro:estructura[]=[{
                    
                    titulo: args[1] || "",

                    autor: args[2] || "",

                    precio: Number(args[3]),

                    stock: Number(args[4])
                }]
                await crearLibro(libro, collection);

                console.log("Libro creado:",libro);
                break;
            }
            case "leer":{
                await leerLibro(collection);
                break;
            }
            case "actualizar":{
                const id = args[1] || "";
                const libro:estructura[]=[{

                    titulo: args[2] || "",

                    autor: args[3] || "",

                    precio: Number(args[4]),

                    stock: Number(args[5])
               }]
                await actualizarLibro(id, libro, collection)
                console.table("Libro actualizado");

                break;
            }
            case "eliminar":{
                const id = args[1] || "";
                await eliminarLibro(id,collection);
                console.log("Libro eliminado:",id);
                break;
            }
            default:{
                console.log("comando no valido");
                break;
            }
        }
    }
    catch(error){
        console.error("Error al conectar a la base de datos", error);
    }
    finally{
        await client.close();
    }
}

main();
