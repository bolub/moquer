import { Session } from "@/server/db";
import {
  createSessionData,
  deleteSession,
  deleteSessionData,
  getSessionData,
} from "@/server/session";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLiveQuery } from "dexie-react-hooks";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CopyIcon,
  DotsHorizontalIcon,
  Pencil2Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useCopyToClipboard } from "usehooks-ts";

export const SessionCard = ({ session }: { session: Session }) => {
  const sessionData = useLiveQuery(() => getSessionData(session.id)) ?? [];
  const [, copy] = useCopyToClipboard();

  const handleCopy = (text: string) => {
    copy(text)
      .then(() => {
        toast.success("Copied to clipboard");
      })
      .catch((error) => {
        console.error("Failed to copy", error);
        toast.error("Failed to copy");
      });
  };

  const onDeleteSessionData = async (id: number) => {
    await deleteSessionData(id);
    toast.success("Session data deleted successfully");
  };

  const lastSessionDataIndex = sessionData.length - 1;

  return (
    <Card key={session.id}>
      <CardHeader>
        <CardTitle className="flex justify-between">
          {session.title}

          <DropdownMenu>
            <DropdownMenuTrigger>
              <DotsHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem disabled>
                <Pencil2Icon className="mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500"
                onClick={async () => {
                  await deleteSession(session.id);
                  toast.success("Session deleted successfully");
                }}
              >
                <TrashIcon className="mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
        <CardDescription>{session.description}</CardDescription>
      </CardHeader>

      <CardContent className="bg-gray-100 pt-5 pb-4">
        <div className="flex flex-col gap-2">
          {sessionData?.map((d) => {
            return (
              <div key={d.id} className="text-sm">
                <h3 className="font-semibold text-sm text-gray-600 mb-2">
                  {d.label}
                </h3>
                <div className="flex gap-2 items-center">
                  {d.data}

                  <button onClick={() => handleCopy(d.data)}>
                    <CopyIcon className="ml-2" />
                  </button>

                  <button onClick={() => onDeleteSessionData(d.id)}>
                    <TrashIcon className="ml-2 text-red-500" />
                  </button>
                </div>

                <p className="text-gray-400 text-xs mt-1">
                  {format(d.createdAt, "qo MMM, yyyy")} at{" "}
                  {format(d.createdAt, "HH:mm")}
                </p>
              </div>
            );
          })}
        </div>

        <Button
          className="mt-8"
          variant="outline"
          onClick={async () => {
            await createSessionData({
              sessionId: session.id,
              dataset: {
                id: session.dataset.id,
                label: `Data ${lastSessionDataIndex + 2}`,
              },
              selectedDatasetSetting: session.datasetSetting,
            });
          }}
        >
          ➕ New session data
        </Button>
      </CardContent>
    </Card>
  );
};
