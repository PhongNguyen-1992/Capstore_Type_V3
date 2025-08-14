import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getListBanner } from "../../../service/movie.api";

export default function Banner() {
  const {
    data = [],isPending,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["get-banner"],
    queryFn: () => getListBanner(),
  });

  return (
    <div>     
      
      {data.map((item) => {
        return (
          <div key={item.maBanner}>
            <img src={item.hinhAnh} />
          </div>
        );
      })}
    </div>
  );
}
