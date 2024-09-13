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
import { createSession } from "@/server/session";
import { toast } from "sonner";

export type DatasetSettingType = {
  id: string;
  value: string;
}[];

export type DatasetType = {
  id: string;
  label: string;
};

export const NewSession = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [selectedDataset, setSelectedDataset] = useState<string>("");
  const [newSelectedDataset, setNewSelectedDataset] = useState<DatasetType>({
    id: "",
    label: "",
  });
  const [selectedDatasetSetting, setSelectedDatasetSetting] =
    useState<DatasetSettingType>([]);

  const [open, setOpen] = useState(false);

  const onCreateSession = async () => {
    const res = await createSession({
      title,
      description,
      dataset: newSelectedDataset,
      selectedDatasetSetting,
    });

    if (!res.toString()) {
      toast.error("Failed to create session");
      return;
    }

    setOpen(false);
    toast.success("Session created successfully");
    setTitle("");
    setDescription("");
    setSelectedDataset("");
    setSelectedDatasetSetting([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

          <div className="grid w-full gap-1.5 border p-4 rounded-md">
            <Label htmlFor="message">Dataset</Label>
            <div>
              <Badge
                className="cursor-pointer"
                variant={selectedDataset === "email" ? "default" : "outline"}
                onClick={() => {
                  setSelectedDataset("email");
                  setNewSelectedDataset({
                    id: "email",
                    label: "",
                  });
                }}
              >
                Email
              </Badge>
            </div>

            <div className="flex flex-col w-full mt-5">
              <Label className="text-xs" htmlFor="datasetLabel">
                Dataset label
              </Label>
              <Input
                type="text"
                id="datasetLabel"
                placeholder="Enter dataset label"
                value={newSelectedDataset.label}
                onChange={(e) => {
                  setNewSelectedDataset({
                    ...newSelectedDataset,
                    label: e.target.value,
                  });
                }}
              />
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
              !selectedDatasetSetting ||
              !newSelectedDataset.label
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
