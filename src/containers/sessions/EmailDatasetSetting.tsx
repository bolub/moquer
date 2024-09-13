import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatasetSetting } from "@/server/db";
import { useState } from "react";

const idToLabel = {
  local_username: {
    label: "Local Username",
    placeholder: "brad",
  },
  subaddress: {
    label: "Subaddress",
    placeholder: "+123",
  },
  domain: {
    label: "Domain",
    placeholder: "acme.com",
  },
} as const;

type idToLabelType = keyof typeof idToLabel;

const BluePrint = ({
  children,
  id,
  onSelect,
}: {
  children: React.ReactNode;
  id: idToLabelType;
  onSelect: (id: idToLabelType) => void;
}) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <button
        id={id}
        className={
          isActive
            ? "cursor-pointer bg-black text-white border rounded px-1 text-sm"
            : "cursor-pointer hover:bg-gray-100 border rounded px-1 text-sm"
        }
        onClick={() => {
          setIsActive(!isActive);
          onSelect(id);
        }}
      >
        {children}
      </button>
    </>
  );
};

export const EmailDatasetSetting = ({
  selectedDatasetSetting,
  setSelectedDatasetSetting,
}: {
  selectedDatasetSetting: DatasetSetting[];
  setSelectedDatasetSetting: (settings: DatasetSetting[]) => void;
}) => {
  const onSelect = (id: keyof typeof idToLabel) => {
    const copiedIds = [...selectedDatasetSetting];

    const index = copiedIds.findIndex((selectedId) => selectedId.id === id);

    if (index === -1) {
      copiedIds.push({ id, value: "" });
    } else {
      copiedIds.splice(index, 1);
    }

    setSelectedDatasetSetting(copiedIds);
  };

  return (
    <>
      <div className="flex gap-1">
        <BluePrint id="local_username" onSelect={onSelect}>
          brad
        </BluePrint>

        <BluePrint id="subaddress" onSelect={onSelect}>
          +123
        </BluePrint>

        <button>@</button>

        <BluePrint id="domain" onSelect={onSelect}>
          acme.com
        </BluePrint>
      </div>

      {selectedDatasetSetting.map((selectedId) => {
        const input = idToLabel[selectedId.id as idToLabelType];

        return (
          <div key={selectedId.id}>
            <Label className="text-xs font-semibold" htmlFor={input.label}>
              {input.label}
            </Label>
            <Input
              type="text"
              id={input.label}
              placeholder={input.placeholder}
              value={selectedId.value}
              onChange={(e) => {
                const copiedIds = [...selectedDatasetSetting];
                const index = copiedIds.findIndex(
                  (v) => selectedId.id === v.id
                );
                copiedIds[index].value = e.target.value;
                setSelectedDatasetSetting(copiedIds);
              }}
            />
          </div>
        );
      })}
    </>
  );
};
