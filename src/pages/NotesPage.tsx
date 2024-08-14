import { fakeData as notes } from "../assets/data";
import NoteCard from "../component/NoteCard";
import ErrorCard from "../component/ErrorCard";
import Loading from "../component/Loading";

const isLoading = false;
// const error = {
//   message: "Something went wrong",
// };
const error = null;

const NotesPage = () => {
  if (error) {
    console.error(error);
    return <ErrorCard error={error.message || "Something went wrong"} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="relative">
      {notes?.map((note) => <NoteCard key={note.$id} note={note} />)}
    </div>
  );
};

export default NotesPage;
