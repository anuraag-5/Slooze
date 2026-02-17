"use client";

import { getRestaurants } from '@/lib/app';
import { Restaurant } from '@/lib/types';
import { useUserStore } from '@/lib/userstore'
import { useEffect, useState } from 'react';
import { america, india } from '@/lib/contants';
import { numanFont } from '@/app/fonts';

const RestaurantsPage = () => {
  const { user } = useUserStore();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if(!access_token) {
        return
    }
    const getRests = async () => {
        const restaurants = await getRestaurants(access_token);
        if(!restaurants) {
            setError("Failed to get Restaurants")
        }
        return restaurants;
    }

    getRests().then((r) => setRestaurants(r!)).finally(() => setLoading(false));
  }, []);

  const getDescription = (country: "INDIA" | "AMERICA") => {
    return country === "AMERICA" ? america : india;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#F5F1FF] to-[#E5DBFF]">
        <div className="animate-spin rounded-full border-b-4 border-[#6750A4] h-16 w-16"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#F5F1FF] to-[#E5DBFF]">
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#F5F1FF] to-[#E5DBFF] py-8 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className={`${numanFont.className} text-4xl md:text-5xl lg:text-6xl text-[#6750A4] mb-4`}>
            Slooze
          </h1>
          <p className="text-2xl md:text-3xl text-gray-800">Discover Our Restaurants</p>
          {user && (
            <p className="text-sm text-gray-600 mt-2">Welcome, {user.role}</p>
          )}
        </div>

        {restaurants.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 shadow-lg text-center">
            <p className="text-xl text-gray-600">No restaurants available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="bg-linear-to-r from-[#6750A4] to-[#8B7BC8] p-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {restaurant.name}
                  </h2>
                  <div className="inline-block bg-[#E5DBFF] px-4 py-1 rounded-full">
                    <span className="text-[#6750A4] font-semibold text-sm">
                      {restaurant.country}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    {getDescription(restaurant.country)}
                  </p>
                </div>

                <div className="px-6 pb-6">
                  <button className="w-full bg-[#6750A4] hover:bg-[#5640A0] text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200">
                    View Menu
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RestaurantsPage