import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { RawNote } from "../utils/types";
import type { Models } from "appwrite";
import { db } from "../lib/databases";

type Props = {
  id: string;
};

const DeleteButton = ({ id }: Props) => {
  const client = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["notes", { id: id }, "delete"],
    onSuccess: () => {
      // Option 1
      const notes = client.getQueryData<Models.DocumentList<RawNote>>([
        "notes",
      ]);

      if (!notes) return;
      const updatedNotes = notes.documents.filter((note) => note.$id !== id);
      client.setQueryData(["notes"], {
        documents: updatedNotes,
        total: updatedNotes.length,
      });

      // Option 2
      // client.invalidateQueries({ queryKey: ["notes"], exact: true });
    },
    mutationFn: async (id: string) => {
      await db.notes.delete(id);
    },
  });

  return (
    <button
      disabled={isPending}
      className="disabled:opacity-50"
      onClick={() => {
        console.log("delete", id);
        mutate(id);
      }}>
      <Trash size={20} />
    </button>
  );
};

export default DeleteButton;
