// Types for the composition root.

const TYPES = {
    IFcmService: Symbol("IFcmService"),
    IChatNotifier: Symbol("IChatNotifier"),
    ISlackService: Symbol("ISlackService"),
    IUsersRepository: Symbol("IUsersRepository"),
    IFirestore: Symbol("IFirestore"),
    IChatRepository: Symbol("IChatRepository"),
    ISystemEvents: Symbol("ISystemEvents"),
    IUserAuth: Symbol("IUserAuth"),
    IEmailService: Symbol("IEmailService"),
    IStorageRepository: Symbol("IStorageRepository"),
    IExpensesRepository: Symbol("IExpensesRepository")
}

export default TYPES;