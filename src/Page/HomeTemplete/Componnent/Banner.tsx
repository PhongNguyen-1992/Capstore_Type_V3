import { useQuery } from "@tanstack/react-query";
import { getListBanner } from "../../../service/movie.api";

export default function Banner() {
  const {
    data = []
    
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
