import User from "../../models/entities/user";

export default interface IExpensesRepository {
    deleteExpenses(user: User): Promise<void>
}