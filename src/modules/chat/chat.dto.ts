export class CreateMessageBody {
    senderId: string;
    receiverId: string;
    chatId: string;
    content: string;
}

export class CreateChatBody {
    receiverId: string;
    name: string;
}
