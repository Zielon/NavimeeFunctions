import { ApiResponse, File } from "@google-cloud/storage";

export default interface IStorageRepository {
    downloadFile(filePath: string): Promise<[Buffer]>
    deleteFile(filePath: string): Promise<[ApiResponse]>
}
