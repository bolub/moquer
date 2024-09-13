import { Dataset, DatasetSetting, db } from "../db";
import { faker } from "@faker-js/faker";

type CreateSessionParams = {
  title: string;
  description: string;
  datasets: Dataset[];
};

const generateEmailData = ({ data }: { data: DatasetSetting[] }) => {
  let localUsername = faker.person.firstName();
  let subaddress = faker.string.alpha(3);
  let domain = faker.internet.domainName();

  data.forEach((setting) => {
    if (setting.id === "local_username") {
      localUsername = setting.value;
    }

    if (setting.id === "subaddress") {
      subaddress = setting.value;
    }

    if (setting.id === "domain") {
      domain = setting.value;
    }
  });

  return `${localUsername}+${subaddress}@${domain}`;
};

const generateFullnameData = () => {
  const fullname = faker.person.fullName();

  return fullname;
};

export const createSessionData = async ({
  sessionId,
  datasets,
  version,
}: {
  sessionId: number;
  datasets: Dataset[];
  version: number;
}) => {
  datasets.forEach(async (dataset) => {
    let datasetInfo = "";

    if (dataset.id === "email") {
      datasetInfo = generateEmailData({ data: dataset.settings });
    }

    if (dataset.id === "fullname") {
      datasetInfo = generateFullnameData();
    }

    await db.sessionData.add({
      sessionId,
      data: datasetInfo,
      dataset,
      createdAt: new Date(),
      version,
    });
  });
};

export const createSession = async ({
  title,
  description,
  datasets,
}: CreateSessionParams) => {
  const response = await db.transaction(
    "rw",
    db.sessions,
    db.sessionData,
    async () => {
      const session = await db.sessions.add({
        title,
        description,
        datasets,
        createdAt: new Date(),
      });

      // Sessions are top level. A session can have multiple mock data, not just one
      // So after creating a session, we need to add the first session data to it to form a relationship
      await createSessionData({
        sessionId: Number(session.toString()),
        datasets,
        version: 1,
      });

      return session;
    }
  );

  return response;
};

export const deleteSession = async (id: number) => {
  await db.sessions.delete(id);
  await db.sessionData.where("sessionId").equals(id).delete();
};

export const getSessions = async () => {
  return await db.sessions.toArray();
};

export const getSessionData = async (sessionId: number) => {
  return await db.sessionData.where("sessionId").equals(sessionId).toArray();
};

export const deleteSessionData = async (id: number) => {
  await db.sessionData.delete(id);
};
