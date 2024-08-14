import { databases, collections } from "./appwrite";
import { ID, Models } from "appwrite";

type Payload<D> = Omit<D, keyof Models.Document>;

// Define the Methods interface with a generic type T
interface Methods {
  create: <Document extends Models.Document>(
    payload: Payload<Document>,
    id?: string
  ) => Promise<Document>;
  update: <Document extends Models.Document>(
    id: string,
    payload: Payload<Document>
  ) => Promise<Document>;
  delete: (id: string) => Promise<object>;
  get: <Document extends Models.Document>(id: string) => Promise<Document>;
  list: <Document extends Models.Document>(
    queries?: string[]
  ) => Promise<Models.DocumentList<Document>>;
}

type Database = {
  [K in (typeof collections)[number]["name"]]: Methods;
};

// Initialize the db variable
const db: Database = {} as Database;

collections.forEach((collection) => {
  db[collection.name] = {
    create: async <D extends Models.Document>(
      payload: Payload<D>,
      id = ID.unique()
    ) => {
      return await databases.createDocument(
        collection.dbId,
        collection.id,
        id,
        payload
      );
    },
    update: async <D extends Models.Document>(
      id: string,
      payload: Payload<D>
    ) => {
      return await databases.updateDocument(
        collection.dbId,
        collection.id,
        id,
        payload
      );
    },
    delete: async (id) => {
      return await databases.deleteDocument(collection.dbId, collection.id, id);
    },
    get: async <D extends Models.Document>(id: string) => {
      return await databases.getDocument<D>(collection.dbId, collection.id, id);
    },
    list: async <D extends Models.Document>(queries?: string[]) => {
      return await databases.listDocuments<D>(
        collection.dbId,
        collection.id,
        queries
      );
    },
  };
});

export { db };
