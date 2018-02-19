// Types for the composition root.

const TYPES = {
    IFcmService: Symbol("IFcmService"),
    IChatNotifier: Symbol("IChatNotifier"),
    ISlackService: Symbol("ISlackService"),
    IUsersRepository: Symbol("IUsersRepository"),
    IFirestore: Symbol("IFirestore"),
    IChatRepository: Symbol("IChatRepository")
}

export default TYPES;