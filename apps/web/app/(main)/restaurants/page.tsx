"use client";

import { getPaymentMethods, getRestaurants } from '@/lib/app';
import { PaymentMethod, Restaurant } from '@/lib/types';
import { useUserStore } from '@/lib/userstore'
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import Restaurants from '@/components/Restaurants';
import Settings from '@/components/Settings';
import { numanFont } from '@/app/fonts';

const RestaurantsPage = () => {
  const { user, paymentMethods } = useUserStore();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrenTab] = useState("restaurants");
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

  if (loading) {
    return (
      <LoadingSpinner />
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
    <div className='flex flex-col flex-1'>
      <Navbar path="restaurants" currentTab={currentTab} setCurrentTab={setCurrenTab}/>
      <div className={'text-xl md:text-2xl lg:text-3xl my-6 ' + numanFont.className}>Hi, {user?.role === "ADMIN" ? "Admin" : user?.role === "MANAGER" ? "Manager" : "Member"}</div>
      {
        currentTab === "restaurants" ? <Restaurants restaurants={restaurants}/> : <Settings paymentMethods={paymentMethods}/>
      }
    </div>
  );
}

export default RestaurantsPage;