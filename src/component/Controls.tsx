import AddButton from "./AddButton";
import colors from "../assets/colors.json";
import ColorButton from "./ColorButton";
import { useEffect, useState } from "react";
import { Color, RawNote } from "../utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { Models } from "appwrite";
import { db } from "../lib/databases";
import useURLChange from "../hooks/useUrlChange";

const Controls = () => {
  const [currentNote, setCurrentNote] = useState<RawNote | null>(null);
  const client = useQueryClient();
  const path = useURLChange();

  useEffect(() => {
    const searchParams = new URL(path).searchParams;
    const id = searchParams.get("id");
    try {
      if (!id) throw new Error("No ID provided");
      const notes = client.getQueryData<Models.DocumentList<RawNote>>([
        "notes",
      ]);
      if (!notes) throw new Error("No notes found");

      const note = notes.documents.find((note) => note.$id === id);
      if (!note) throw new Error("Note not found");

      setCurrentNote(note);
    } catch {
      return setCurrentNote(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  const handleClick = async (color: Color) => {
    if (!currentNote) return;

    const payload = { colors: JSON.stringify(color) };

    if (currentNote.colors === payload.colors) return;

    await db.notes.update(currentNote.$id, payload);
    client.invalidateQueries({
      queryKey: ["notes"],
      exact: true,
    });
    setCurrentNote({ ...currentNote, ...payload });
  };

  return (
    <div className="fixed left-4 top-1/2 z-50 flex translate-y-[-50%] flex-col gap-3 rounded-full bg-[#35363e] p-4 shadow-sm shadow-black">
      <AddButton />
      {colors.map((color) => {
        const onClick = async () => {
          await handleClick(color);
        };
        const selected =
          color.id === JSON.parse(currentNote?.colors || "{}").id;

        return (
          <ColorButton
            key={color.id}
            color={color}
            onClick={onClick}
            selected={selected}
          />
        );
      })}
    </div>
  );
};

export default Controls;
