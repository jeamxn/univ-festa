import React from "react";

import { Guests } from "@/utils/response";

const Guest = ({
  guest,
}: {
  guest: Guests;
}) => {
  const [onClick, setOnClick] = React.useState(false);
  return (
    <button 
      key={guest.id}
      className={[
        "flex flex-row items-end justify-end gap-1 bg-cover bg-center bg-no-repeat rounded-2xl my-1 overflow-hidden w-full",
        onClick ? "h-64" : "",
      ].join(" ")}
      style={{
        backgroundImage: `url(${guest.cover})`,
      }}
      onClick={() => {
        setOnClick(p => !p);
      }}
    >
      <div className="w-full flex flex-row items-center justify-start gap-2 backdrop-blur-lg px-2 py-1 bg-black/20 rounded-2xl">
        {
          guest.icon ? (
            <img src={guest.icon} alt={guest.name} className="w-5 h-5 bg-gray-500 rounded-full" />
          ) : null
        }
        <p className="!text-white">{guest.name}</p>
      </div>
    </button>
  );
};

export default Guest;