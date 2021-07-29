import { Furniture } from "./Furniture";

export  interface FurnitureCollectionResponse{
  furniture: Array<Furniture>;
  total: number;
  size: number;
  skip: number;
}
