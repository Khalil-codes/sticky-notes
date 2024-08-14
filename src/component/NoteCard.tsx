import { FC, MutableRefObject, useEffect, useRef, useState } from "react";
import { Note, RawNote } from "../utils/types";
import { RefreshCcw } from "lucide-react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { bodyParser, setZIndex } from "../utils/helpers";
import DeleteButton from "./DeleteButton";

interface Props {
  note: RawNote;
  shouldDisabledDrag?: boolean;
}

const isPending = false;

const autoGrow = (ref: MutableRefObject<HTMLTextAreaElement | null>) => {
  const { current } = ref;
  if (current) {
    current.style.height = "auto";
    current.style.height = current.scrollHeight + "px";
  }
};

const NoteCard: FC<Props> = ({ note, shouldDisabledDrag = false }) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const body = bodyParser(note.body);

  const [position, setPosition] = useState<Note["position"]>(
    JSON.parse(note.position)
  );
  const { colorHeader, colorBody, colorText } = JSON.parse(note.colors);

  const onStop = (_: DraggableEvent, position: DraggableData) => {
    setPosition({ x: position.x, y: position.y });
  };

  useEffect(() => {
    autoGrow(textAreaRef);
  }, []);

  return (
    <Draggable
      bounds="body"
      nodeRef={cardRef}
      axis="both"
      handle="#header"
      defaultPosition={{ x: 0, y: 0 }}
      position={position}
      onStop={onStop}
      onStart={() => {
        if (cardRef.current) {
          setZIndex(cardRef.current);
        }
      }}
      disabled={shouldDisabledDrag}>
      <article
        ref={cardRef}
        className="relative w-[25rem] cursor-pointer rounded shadow-sm shadow-slate-200"
        style={{
          backgroundColor: colorBody,
        }}>
        <div
          id="header"
          className="flex justify-between rounded-e p-2"
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
            onFocus={() => {
              if (cardRef.current) {
                setZIndex(cardRef.current);
              }
            }}
            onInput={() => {
              autoGrow(textAreaRef);
            }}
            onBlur={() => {
              if (
                textAreaRef.current &&
                note.body !== textAreaRef.current.value
              ) {
                console.log("Data changed");
                // perform update here
              }
            }}
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
