import { injectable, inject } from "inversify";
import IStorageRepository from "../contracts/repositories/storage";
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { ApiResponse, File } from "@google-cloud/storage";
import IFirestore from "../contracts/services/firestore-service";
import TYPES from "../types";

@injectable()
export default class StorageRepository implements IStorageRepository {

    @inject(TYPES.IFirestore) private firestore: IFirestore;
    private bucketName: string;

    constructor() {
        this.bucketName = `${process.env.GCLOUD_PROJECT}.appspot.com`;
    }

    public async downloadFile(filePath): Promise<[Buffer]> {
        const bucket = this.firestore.getBucket();
        return bucket.file(filePath).download();
    }
}