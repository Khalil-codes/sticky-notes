import { FC, MutableRefObject, useEffect, useRef, useState } from "react";
import { Note, RawNote } from "../utils/types";
import { RefreshCcw } from "lucide-react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { bodyParser, setZIndex } from "../utils/helpers";
import { useMutation } from "@tanstack/react-query";
import { db } from "../lib/databases";
import DeleteButton from "./DeleteButton";
import { shallowUpdateUrlAndNotify } from "../hooks/useUrlChange";

interface Props {
  note: RawNote;
  shouldDisabledDrag?: boolean;
}

const autoGrow = (ref: MutableRefObject<HTMLTextAreaElement | null>) => {
  const { current } = ref;
  if (current) {
    current.style.height = "auto";
    current.style.height = current.scrollHeight + "px";
  }
};

const NoteCard: FC<Props> = ({ note, shouldDisabledDrag = false }) => {
  const body = bodyParser(note.body);
  const { colorHeader, colorBody, colorText } = JSON.parse(note.colors);

  const [position, setPosition] = useState<Note["position"]>(
    JSON.parse(note.position)
  );

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const { isPending, mutate } = useMutation({
    mutationKey: ["notes", { id: note.$id }],
    mutationFn: async (variables: {
      id: string;
      key: keyof Note;
      value: unknown;
    }) => {
      const { id, key, value } = variables;
      const payload = { [key]: JSON.stringify(value) };
      await db.notes.update(id, payload);
    },
  });

  const handleStop = (_: DraggableEvent, _position: DraggableData) => {
    const hasCardMoved =
      position.x !== _position.x || position.y !== _position.y;

    if (hasCardMoved) {
      setPosition({ x: _position.x, y: _position.y });
      mutate({
        id: note.$id,
        key: "position",
        value: { x: _position.x, y: _position.y },
      });
    }
  };

  const handleNoteClick = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("id") !== note.$id.toString()) {
      params.set("id", note.$id.toString());
      shallowUpdateUrlAndNotify(`?${params.toString()}`);
    }
  };

  const handleTextAreaBlue = () => {
    if (textAreaRef.current && body !== textAreaRef.current.value) {
      console.log("Updating Body");
      mutate({
        id: note.$id,
        key: "body",
        value: textAreaRef.current.value,
      });
    }
  };

  useEffect(() => {
    autoGrow(textAreaRef);

    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []);

  return (
    <Draggable
      bounds="body"
      nodeRef={cardRef}
      axis="both"
      handle="#header"
      defaultPosition={{ x: 0, y: 0 }}
      position={position}
      onStop={handleStop}
      onStart={() => setZIndex(cardRef.current!)}
      disabled={shouldDisabledDrag}>
      <article
        onClick={handleNoteClick}
        ref={cardRef}
        className="relative w-[25rem] cursor-pointer rounded shadow-sm shadow-slate-200"
        style={{
          backgroundColor: colorBody,
        }}>
        <div
          id="header"
          className="flex h-10 justify-between rounded-e px-2"
          style={{ backgroundColor: colorHeader, color: colorText }}>
          <DeleteButton id={note.$id} />
          {isPending && (
            <div className="flex items-center gap-2">
              <RefreshCcw size={20} className="animate-spin-slow" /> Saving
            </div>
          )}
        </div>
        <div className="rounded-b rounded-l p-4">
          <textarea
            ref={textAreaRef}
            className="h-full w-full resize-none appearance-none whitespace-pre-wrap border-none bg-inherit focus:outline-none"
            id={note.$id.toString()}
            name="note"
            onFocus={() => setZIndex(cardRef.current!)}
            onInput={() => {
              autoGrow(textAreaRef);
            }}
            onBlur={handleTextAreaBlue}
            rows={4}
            defaultValue={body}
            style={{ color: colorText }}
          />
        </div>
      </article>
    </Draggable>
  );
};

export default NoteCard;
