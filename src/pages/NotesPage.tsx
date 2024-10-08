import { useQuery } from "@tanstack/react-query";
import NoteCard from "../component/NoteCard";
import { db } from "../lib/databases";
import { RawNote } from "../utils/types";
import ErrorCard from "../component/ErrorCard";
import Loading from "../component/Loading";
import Controls from "../component/Controls";

const NotesPage = () => {
  const {
    data: notes,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["notes"],
    placeholderData: (previousData) => previousData,
    queryFn: async () => {
      return await db.notes.list<RawNote>();
    },
  });

  if (error) {
    console.error(error);
    return <ErrorCard error={error.message || "Something went wrong"} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="relative">
        {notes?.documents.map((note) => (
          <NoteCard key={note.$id} note={note} />
        ))}
      </div>
      <Controls />
    </>
  );
};

export default NotesPage;
