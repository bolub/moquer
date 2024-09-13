"use client";

import React from "react";
import { NewSession } from "./NewSession";
import { useLiveQuery } from "dexie-react-hooks";
import { SessionCard } from "./SessionCard";
import { getSessions } from "@/server/session";

export const SessionsPageInner = () => {
  const sessions = useLiveQuery(getSessions);
  const isLoading = sessions === undefined;
  const hasSessions = !isLoading && sessions?.length > 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-44">
        <p className="text-gray-500">Fetching sessions...</p>
      </div>
    );
  }

  if (!hasSessions) {
    return (
      <div className="flex justify-center items-center h-44">
        <p className="text-gray-500">No sessions found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8">
      {sessions?.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  );
};

export const SessionsPage = () => {
  return (
    <main className="container mx-auto mt-32">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sessions</h1>

        <NewSession />
      </div>

      <div className="mt-8 mb-32">
        <SessionsPageInner />
      </div>
    </main>
  );
};
