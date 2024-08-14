import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { db } from "../lib/databases";
import { RawNote } from "../utils/types";
import { useRef } from "react";
import colors from "../assets/colors.json";
import { Models } from "appwrite";
import { shallowUpdateUrlAndNotify } from "../hooks/useUrlChange";

const getRandomColor = () => {
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
};

const AddButton = () => {
  const initPosition = useRef({ x: 65, y: 50 });
  const client = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["notes", "create"],
    onSuccess: (data) => {
      // Option 1
      const notes = client.getQueryData<Models.DocumentList<RawNote>>([
        "notes",
      ]);

      if (!notes) return;
      const updatedNotes = [...notes.documents, data];

      shallowUpdateUrlAndNotify(`?id=${data.$id}`);

      client.setQueryData(["notes"], {
        documents: updatedNotes,
        total: updatedNotes.length,
      });

      // Option 2
      // client.invalidateQueries({ queryKey: ["notes"], exact: true });
    },
    mutationFn: async () => {
      const note: Partial<RawNote> = {
        colors: JSON.stringify(getRandomColor()),
        position: JSON.stringify({
          x: initPosition.current.x,
          y: initPosition.current.y,
        }),
      };

      initPosition.current = {
        x: initPosition.current.x + 5,
        y: initPosition.current.y,
      };
      return await db.notes.create<RawNote>(note);
    },
  });
  const onClick = () => {
    mutate();
  };
  return (
    <button
      disabled={isPending}
      className="rounded-full bg-[#6b6b6b] p-2 transition duration-300 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
      onClick={onClick}
      type="button">
      <Plus />
    </button>
  );
};

export default AddButton;
