import { Models } from "appwrite";

export interface RawNote extends Models.Document {
  body: string;
  colors: string;
  position: string;
}
export interface Note {
  $id: number;
  body: string;
  colors: {
    id: string;
    colorHeader: string;
    colorBody: string;
    colorText: string;
  };
  position: {
    x: number;
    y: number;
  };
}
