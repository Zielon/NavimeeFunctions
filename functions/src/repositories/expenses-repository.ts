import { injectable, inject } from "inversify";
import TYPES from "../types";
import IFirestore from "../contracts/services/firestore-service";
import IExpensesRepository from "../contracts/repositories/expenses";
import User from "../models/entities/user";
import FirestorePaths from "../consts/firestore-paths";

@injectable()
export default class ExpensesRepository implements IExpensesRepository {

    @inject(TYPES.IFirestore) private firestore: IFirestore;

    public async deleteExpenses(user: User): Promise<void> {
        return this.firestore.deleteCollection(`${FirestorePaths.expenses}/${user.country}/${user.id}`);
    }
}