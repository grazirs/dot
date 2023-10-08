import Dexie, { Table } from 'dexie';

export interface Session {
  sessionId: string;
  lastInteractionAt: Date;
}
export interface Message {
  sender: string;
  text: string;
  direction: 'RECEIVED' | 'SENT';
  createdAt: Date;
}


export class AppDB extends Dexie {
  messages!: Table<Message, string>;
  sessions!: Table<Session, string>;

  constructor() {
    super('dot');
    this.version(1).stores({
      sessions: 'sessionId, lastInteractionAt',
      messages: '++id',
    });
  }
}

export const db = new AppDB();
