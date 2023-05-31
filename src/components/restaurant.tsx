import React from "react";

interface IRestaurantProps {
  id: string;
  coverImg: string;
  name: string;
  categoryName?: string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({
  coverImg,
  name,
  categoryName,
}) => (
  <div>
    <div
      style={{ backgroundImage: `url(${coverImg})` }}
      className='bg-cover bg-center mb-2 py-32'
    ></div>
    <h3 className='text-lg font-medium'>{name}</h3>
    <span className='border-t mt-3 py-2 text-xs opacity-50 border-gray-300'>
      {categoryName}
    </span>
  </div>
);
