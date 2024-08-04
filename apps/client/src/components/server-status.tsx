import { useEffect, useState } from "react";

export default function ServerStatus() {
  const [serverStatus, setServerStatus] = useState<string | null>(null);

  useEffect(() => {
    const serverOn = async () => {
      try {
        const response = await fetch("https://file-fusion-server.vercel.app");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        response.json().then((text) => {
          console.log(text.message);
        });

        setServerStatus("Online");
      } catch (error) {
        setServerStatus("Offline");
        console.error("Erro ao conectar ao server:", error);
      }
    };

    serverOn();
  }, []);

  return (
    <span className="absolute bottom-0 right-2">
      <div className="relative flex">
        Server: {serverStatus}
        <span className="relative flex w-3 h-3">
          <span
            className={`absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping ${
              serverStatus == "Online" ? "bg-green-400" : "bg-red-400"
            }`}
          ></span>
          <span
            className={`relative inline-flex w-3 h-3 rounded-full ${
              serverStatus == "Online" ? "bg-green-400" : "bg-red-400"
            }`}
          ></span>
        </span>
      </div>
    </span>
  );
}
