import { useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";


export default function PlacesAPI ()
{

  const [ address, setAddress ] = useState( "" );

  const handleSelect = async ( value ) =>
  {

  };

  return (
    <div>
      <PlacesAutocomplete
        value={ address }
        onChange={ setAddress }
        onSelect={ handleSelect }
      >{ ( getInputProps, suggestions, getSuggestionItemProps, loading ) =>
      (
        <div>
          <input { ...getInputProps( { placeholder: "Type address" } ) } />



        </div>
      )
        }
      </PlacesAutocomplete>
    </div>
  );
}