import React, { useState } from 'react'
import { UilSearch,UilLocationPoint } from '@iconscout/react-unicons'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Inputs({setQuery, Units, setUnits}) {
  const [city, setCity] = useState("");

const handleUnitsChange =(e)=>{
  const selectedUnit= e.currentTarget.name
  if (Units !== selectedUnit) setUnits(selectedUnit)
}

  const handleSearchClick = ()=>{
    if (city !=='') setQuery({q: city})
  }

  const handleLocationClick = ()=>{
    if (navigator.geolocation){
      toast.info('Fetching users location.')
      navigator.geolocation.getCurrentPosition((position)=>{
       toast.sucess('Location fetched!')
        let lat = position.coords.langitude
        let lon = position.coords.longitude
         setQuery({
          lat,
          lon,
         })
      })
    }
  }

  return (
    <div className='flex flex-row justify-center my-6'>
     <div className='flex flex-row w-3/4 items-center justify-centerspace-x-4'>
     <input
  type='text'
  value={city}
  placeholder='search for city...'
  className='text-xl font-light p-2 w-full shadow-xl focus:outline-none capitalize placeholder:lowercase'
  onChange={(e) => setCity(e.target.value)}
/>

         <UilSearch 
         size={25}
         onClick={handleSearchClick}
         className="text-white cursor-pointer transition ease-out hover:scale-125"
         />
         <UilLocationPoint 
         size={25}
         onClick={handleLocationClick}
         className="text-white cursor-pointer transition ease-out hover:scale-125"
          />
     </div>
     <div className='flex flex-row w-1/4 items-center justify-center'>
        <button name="metric" 
        onClick={handleUnitsChange}
        className='text-xl
         text-white font-light transition ease-out hover:scale-125'>
        °C
        </button>
        <p className='text-xl text-white mx-1'>|</p>

        <button 
        name="imperial"
        onClick={handleUnitsChange}
         className='text-xl
         text-white font-light transition ease-out hover:scale-125 '>
        °F
        </button>
     </div>
    </div>
  )
}

export default Inputs