import React, { use } from 'react'

const MenuPage = ({ params } : { params: Promise<{ restId: string}>}) => {
  const { restId } = use(params);
  return (
    <div>{restId}</div>
  )
}

export default MenuPage