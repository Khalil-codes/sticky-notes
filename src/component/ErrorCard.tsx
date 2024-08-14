type Props = {
  error: string;
};

const colors = {
  id: "color-red",
  colorHeader: "#fe5959",
  colorBody: "#ff8b8b",
  colorText: "#18181A",
};

const ErrorCard = ({ error }: Props) => {
  return (
    <div className="absolute left-1/2 top-1/2 w-[25rem] translate-x-[-50%] translate-y-[-50%] cursor-pointer rounded shadow-sm shadow-slate-200">
      <div
        id="header"
        className="flex justify-center rounded-e p-2 text-xl"
        style={{
          backgroundColor: colors.colorHeader,
          color: colors.colorText,
        }}>
        Error
      </div>
      <div
        className="flex h-[15rem] items-center justify-center"
        style={{ backgroundColor: colors.colorBody, color: colors.colorText }}>
        {error}
      </div>
    </div>
  );
};

export default ErrorCard;
