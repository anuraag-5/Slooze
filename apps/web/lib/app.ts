import axios from "axios";
import { Restaurant } from "./types";

export const getRestaurants = async (access_token: string) => {
  try {
    const resp = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL! + `/restaurants`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    const data = resp.data as [
      {
        id: string;
        name: string;
        country: "INDIA" | "AMERICA";
        createdAt: string;
      },
    ];
    const restaurants = data.map((restaurant) => ({
      id: restaurant.id,
      name: restaurant.name,
      country: restaurant.country,
    }));

    return restaurants;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Server Error";
    console.log(errorMessage);
    return null;
  }
};
