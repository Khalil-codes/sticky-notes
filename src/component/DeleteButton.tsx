import { Trash } from "lucide-react";

type Props = {
  id: string;
};

const DeleteButton = ({ id }: Props) => {
  return (
    <button
      onClick={() => {
        console.log("delete", id);
      }}>
      <Trash size={20} />
    </button>
  );
};

export default DeleteButton;
