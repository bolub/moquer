import Dexie, { type EntityTable } from "dexie";

export type Session = {
  id: number;
  title: string;
  description: string;
  dataset: {
    id: string;
  };
  datasetSetting: {
    id: string;
    value: string;
  }[];
  createdAt: Date;
};

export type SessionData = {
  id: number;
  label: string;
  sessionId: number;
  data: string;
  createdAt: Date;
};

export const db = new Dexie("SessionsDatabase") as Dexie & {
  sessions: EntityTable<
    Session,
    "id" // primary key "id" (for the typings only)
  >;
  sessionData: EntityTable<SessionData, "id">;
};

// Schema declaration:
db.version(1).stores({
  sessions: "++id, title, description, dataset, createdAt, *datasetSetting", // primary key "id" (for the runtime!)
  sessionData: "++id, sessionId, data, createdAt",
});
