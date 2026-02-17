"use client";

import { useUserStore } from '@/lib/userstore'
import { useEffect, useState } from 'react';

const RestaurantsPage = () => {
  const { user } = useUserStore();
  const [restaurants, setRestaurants] = useState();
  useEffect(() => {}, []);
  return (
    <div>{ user?.role }</div>
  )
}

export default RestaurantsPage