import { ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";

export default function Message({
  text,
  typeMessage,
}: {
  text: string;
  typeMessage: "success" | "error";
}) {
  const [barAnimation, setBarAnimation] = useState(false);

  useEffect(() => {
    setBarAnimation(true);
  }, []);

  return (
    <div
      key={text} // Adiciona a key para garantir a re-renderização
      className={`message ${
        typeMessage === "success" ? "text-green-500" : "text-red-500"
      } backdrop-blur-sm bg-zinc-950/30 p-4 mb-4 rounded fixed top-0 right-0 z-40 flex gap-2 font-bold`}
    >
      {typeMessage ? <ShieldAlert /> : null}
      {text}
      <div
        className={`absolute bottom-0 left-0 h-1 out rounded duration-message ${
          typeMessage === "success" ? "bg-green-500" : "bg-red-500"
        } ${barAnimation ? "w-0" : "w-full"}`}
      ></div>
    </div>
  );
}
