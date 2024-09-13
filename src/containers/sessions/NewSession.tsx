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
import { createSession } from "@/server/session";
import { toast } from "sonner";
import { AVAILABLE_DATASETS } from "@/lib/constants";
import { EmailDatasetSetting } from "./EmailDatasetSetting";
import { Dataset, DatasetSetting } from "@/server/db";

export const NewSession = () => {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedDatasets, setSelectedDatasets] = useState<Dataset[]>([]);

  const onCreateSession = async () => {
    const res = await createSession({
      title,
      description,
      datasets: selectedDatasets,
    });

    if (!res.toString()) {
      toast.error("Failed to create session");
      return;
    }

    setOpen(false);
    toast.success("Session created successfully");
    setTitle("");
    setDescription("");
    setSelectedDatasets([]);
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
                const isNewSelected = selectedDatasets.some(
                  (ds) => ds.id === dataset
                );

                const onSelectNewDataset = () => {
                  const copiedSelectedDatasets = [...selectedDatasets];

                  const existingDatasetIndex = copiedSelectedDatasets.findIndex(
                    (d) => d.id === dataset
                  );

                  if (existingDatasetIndex === -1) {
                    // Dataset doesn't exist, add it
                    copiedSelectedDatasets.push({
                      id: dataset,
                      label: "",
                      settings: [],
                    });
                  } else {
                    // Dataset exists, remove it
                    copiedSelectedDatasets.splice(existingDatasetIndex, 1);
                  }

                  setSelectedDatasets(copiedSelectedDatasets);
                };

                return (
                  <div key={dataset}>
                    <div>
                      <Badge
                        className="cursor-pointer capitalize"
                        variant={isNewSelected ? "default" : "outline"}
                        onClick={onSelectNewDataset}
                      >
                        {dataset}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Label */}
            {selectedDatasets?.length > 0 ? (
              <>
                {selectedDatasets.map((dataset) => {
                  return (
                    <div key={dataset.id} className="flex flex-col w-full mt-5">
                      <Label className="text-xs" htmlFor="datasetLabel">
                        <span className="capitalize">{dataset.id}</span> dataset
                        label
                      </Label>

                      <Input
                        type="text"
                        id="datasetLabel"
                        placeholder="Enter dataset label"
                        value={dataset.label}
                        onChange={(e) => {
                          const copiedSelectedDatasets = [...selectedDatasets];

                          const existingDatasetIndex =
                            copiedSelectedDatasets.findIndex(
                              (d) => d.id === dataset.id
                            );

                          if (existingDatasetIndex === -1) {
                            // Dataset doesn't exist, add it
                            copiedSelectedDatasets.push({
                              id: dataset.id,
                              label: e.target.value,
                              settings: [],
                            });
                          } else {
                            copiedSelectedDatasets[existingDatasetIndex].label =
                              e.target.value;
                          }

                          setSelectedDatasets(copiedSelectedDatasets);
                        }}
                      />
                    </div>
                  );
                })}
              </>
            ) : null}

            {/* Settings */}
            {selectedDatasets?.length > 0 ? (
              <>
                {selectedDatasets?.map((dataset) => {
                  if (dataset.id !== "email") return null;

                  const selectedDatasetSetting = dataset.settings;
                  const setSelectedDatasetSetting = (
                    settings: DatasetSetting[]
                  ) => {
                    const copiedSelectedDatasets = [...selectedDatasets];
                    const existingDatasetIndex =
                      copiedSelectedDatasets.findIndex(
                        (d) => d.id === dataset.id
                      );

                    if (existingDatasetIndex === -1) {
                      // Dataset doesn't exist, add it
                      copiedSelectedDatasets.push({
                        id: dataset.id,
                        label: dataset.label,
                        settings: settings,
                      });
                    } else {
                      copiedSelectedDatasets[existingDatasetIndex].settings =
                        settings;
                    }

                    setSelectedDatasets(copiedSelectedDatasets);
                  };
                  return (
                    <div key={dataset.id} className="grid w-full gap-1.5 mt-5">
                      <Label htmlFor="message" className="text-xs">
                        <span className=" capitalize">{dataset.id}</span>{" "}
                        dataset settings
                      </Label>

                      <EmailDatasetSetting
                        selectedDatasetSetting={selectedDatasetSetting}
                        setSelectedDatasetSetting={setSelectedDatasetSetting}
                      />
                    </div>
                  );
                })}
              </>
            ) : null}
          </div>

          <Button
            type="button"
            onClick={onCreateSession}
            disabled={!title || !description || selectedDatasets.length === 0}
            className="mt-4"
          >
            Create session
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
