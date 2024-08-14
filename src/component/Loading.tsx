import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex h-[calc(100dvh-2rem)] w-full items-center justify-center bg-white/10">
      <Loader className="animate-spin" size={48} />
    </div>
  );
};

export default Loading;
