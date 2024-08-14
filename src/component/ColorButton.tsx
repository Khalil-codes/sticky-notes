import { Color } from "../utils/types";

type Props = {
  color: Color;
  onClick: () => Promise<void>;
  selected: boolean;
};

const ColorButton = ({ color, selected, onClick }: Props) => {
  return (
    <button
      disabled={selected}
      onClick={onClick}
      style={{ backgroundColor: color.colorHeader }}
      className={`h-10 w-10 rounded-full transition duration-300 hover:scale-110 ${selected ? "scale-110 ring ring-white" : ""} disabled:cursor-not-allowed`}
    />
  );
};

export default ColorButton;
