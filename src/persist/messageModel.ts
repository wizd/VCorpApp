class Message {
  static schema = {
    name: 'Message',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      text: 'string',
      isLoading: 'bool',
      isAI: 'bool',
      veid: 'string?',
      createdAt: 'date',
      bypass: 'bool?',
      wavurl: 'string?',
    },
  };
}

export default Message;
