"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import React, { useState } from "react";
import { DatasetSetting } from "./DatasetSetting";

export type DatasetSettingType = {
  id: string;
  value: string;
}[];

export const NewSession = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [selectedDataset, setSelectedDataset] = useState<string>("");
  const [selectedDatasetSetting, setSelectedDatasetSetting] =
    useState<DatasetSettingType>([]);

  const onCreateSession = () => {
    console.log({
      title,
      description,
      selectedDataset,
      selectedDatasetSetting,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New Session</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start new session</DialogTitle>
          <DialogDescription className="mb-20">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-6 w-full">
          <div className="flex flex-col w-full">
            <Label htmlFor="sessionTitle">Session title</Label>
            <Input
              type="text"
              id="sessionTitle"
              placeholder="Test onboarding flow"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="sessionDescription">Session description</Label>
            <Textarea
              placeholder="Type your message here."
              id="sessionDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="message">Dataset</Label>
            <div className="cursor-pointer">
              <Badge
                variant={selectedDataset === "email" ? "default" : "outline"}
                onClick={() => setSelectedDataset("email")}
              >
                Email
              </Badge>
            </div>
          </div>

          {selectedDataset ? (
            <div className="grid w-full gap-1.5">
              <Label htmlFor="message">
                <span className=" capitalize">{selectedDataset}</span> dataset
                settings
              </Label>

              <DatasetSetting
                selectedDatasetSetting={selectedDatasetSetting}
                setSelectedDatasetSetting={setSelectedDatasetSetting}
              />
            </div>
          ) : null}

          <Button
            type="button"
            onClick={onCreateSession}
            disabled={
              !title ||
              !description ||
              !selectedDataset ||
              !selectedDatasetSetting
            }
            className="mt-4"
          >
            Create session
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
