import * as motion from "motion/react-client";
import { kapakanaFont, numanFont } from "@/app/fonts";
import { Restaurant } from "@/lib/types";
import Image from "next/image";
import { getDescription } from "@/lib/utils";
import { useRouter } from "next/navigation";

const Restaurants = ({ restaurants }: { restaurants: Restaurant[] }) => {
  const router = useRouter();
  return (
    <motion.div 
    className="flex flex-col"
    initial={{
      opacity: 0
    }}
    animate={{
      opacity: 1
    }}
    transition={{
      duration: 0.6
    }}
    >
      <div className={"text-lg md:text-xl lg:text-2xl mb-4 " + numanFont.className}>Our Restaurants :</div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {restaurants.length > 0
          ? restaurants.map((r) => <div key={r.id} className="relative h-[418px] max-w-[360px] border-2 border-[#6750A4] rounded-t-[35px] cursor-pointer"
          onClick={() => router.push(`/restaurants/${r.id}`)}
          >
            <div className={"absolute top-2 left-5 text-[20px] z-40 text-white " + kapakanaFont.className}>{r.country === "AMERICA" ? "America" : "India"}</div>
            <div className="relative rounded-t-[35px] h-[70%]">
              <Image 
              src={ r.country === "AMERICA" ? "/america-reastaurant.jpg" : "/india-restaurant.jpg"}
              alt=""
              fill
              className="rounded-t-[35px] object-cover"
              />
            </div>
            <div className="bg-white rounded-t-[35px] absolute bottom-0 left-0 right-0 h-[50%] -ml-[1.3px] -mb-[1.2px] -mr-[1.2px] shadow-[0px_0px_28px_#6750A440] flex flex-col px-4 pt-6 gap-10">
              <div className="flex justify-between">
                <div className="text-xl text-[#6750A4]">{r.name}</div>
                <div className="flex gap-1 px-3 py-1 rounded-full bg-[#008D00] items-center">
                  <div>
                    <Image 
                    src="/star.svg"
                    alt=""
                    width={12}
                    height={12}
                    className=""
                    />
                  </div>
                  <div className="text-[10px] mt-1 text-white">4.3</div>
                </div>
              </div>
              <div className={"text-xs md:text-sm " + numanFont.className}>{getDescription(r.country)}</div>
            </div>
          </div>)
          : "No Restaurants"}
      </div>
    </motion.div>
  );
};

export default Restaurants;
