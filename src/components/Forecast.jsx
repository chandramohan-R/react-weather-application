import React from 'react'
import { iconUrlFromCode } from '../sevices/weatherService'

function Forecast({title, items}) {
  
  if (!items) {
    // Handle the case where items is undefined
    return null; // Or render an appropriate message or fallback
  }
  
  return (
    <div>
      <div className='flex items-center justify-start my-6 '>
        <p className='text-white font-medium uppercase'>{title}</p>
      </div>
      <hr className='my-2' />
      <div className="flex flex-row items-center justify-between">
        {items.map(item => (
          <div className='flex flex-col items-center justify-center' key={item.title}>
            <p className='font-light text-sm'>
              {item.title}
            </p>
            <img src={iconUrlFromCode(item.icon)} alt="" className='w-12 my-1' />
            <p className='font-medium'>{`${item.temp.toFixed()}°`}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast