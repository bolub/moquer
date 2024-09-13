import Dexie, { type EntityTable } from "dexie";

export type DatasetSetting = {
  id: string;
  value: string;
};

export type Dataset = {
  id: string;
  label: string;
  settings: DatasetSetting[];
};

export type Session = {
  id: number;
  title: string;
  description: string;
  datasets: Dataset[];
  createdAt: Date;
};

export type SessionData = {
  id: number;
  sessionId: number;
  dataset: {
    id: string;
    label: string;
  };
  data: string;
  createdAt: Date;
  version: number;
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
  sessions: "++id, title, description, *datasets, createdAt", // primary key "id" (for the runtime!)
  sessionData: "++id, sessionId, data, createdAt, *dataset",
});
