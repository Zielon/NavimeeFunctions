import { Firestore } from "@google-cloud/firestore";

export default interface IFirestore{
    get(): Firestore;
}