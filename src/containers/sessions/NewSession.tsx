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
import { AVAILABLE_DATASETS } from "@/lib/constants";

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

  const [selectedDataset, setSelectedDataset] = useState<DatasetType>({
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
      dataset: selectedDataset,
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
    setSelectedDataset({
      id: "",
      label: "",
    });
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

            <div className="flex gap-2 flex-wrap">
              {AVAILABLE_DATASETS.map((dataset) => {
                const isSelected = selectedDataset.id === dataset;

                const onSelectDataset = () => {
                  setSelectedDataset({
                    id: dataset,
                    label: "",
                  });
                };

                return (
                  <div key={dataset}>
                    <div>
                      <Badge
                        className="cursor-pointer capitalize"
                        variant={isSelected ? "default" : "outline"}
                        onClick={onSelectDataset}
                      >
                        {dataset}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedDataset.id ? (
              <div className="flex flex-col w-full mt-5">
                <Label className="text-xs" htmlFor="datasetLabel">
                  <span className="capitalize">{selectedDataset.id}</span>{" "}
                  dataset label
                </Label>
                <Input
                  type="text"
                  id="datasetLabel"
                  placeholder="Enter dataset label"
                  value={selectedDataset.label}
                  onChange={(e) => {
                    setSelectedDataset({
                      ...selectedDataset,
                      label: e.target.value,
                    });
                  }}
                />
              </div>
            ) : null}

            {selectedDataset.id === "email" ? (
              <div className="grid w-full gap-1.5 mt-5">
                <Label htmlFor="message" className="text-xs">
                  <span className=" capitalize">{selectedDataset.id}</span>{" "}
                  dataset settings
                </Label>

                <DatasetSetting
                  selectedDatasetSetting={selectedDatasetSetting}
                  setSelectedDatasetSetting={setSelectedDatasetSetting}
                />
              </div>
            ) : null}
          </div>

          <Button
            type="button"
            onClick={onCreateSession}
            disabled={
              !title ||
              !description ||
              !selectedDataset ||
              !selectedDatasetSetting ||
              !selectedDataset.label
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
