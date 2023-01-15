import { useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";


export default function PlacesAPI ()
{

  const [ address, setAddress ] = useState( "" );
  const [ coordinates, setCoordinates ] = useState(
    { lat: null, lng: null }
  );


  const handleSelect = async ( value ) =>
  {
    const results = geocodeByAddress

  };

  return (
    <div>
      <PlacesAutocomplete
        value={ address }
        onChange={ setAddress }
        onSelect={ handleSelect }
      >
        { ( { getInputProps, suggestions, getSuggestionItemProps, loading } ) => (
          <div>
            <p>Latitude: { coordinates.lat }</p>
            <p>Longitude: { coordinates.lng }</p>

            <input { ...getInputProps( { placeholder: "Type address" } ) } />

            <div>
              { loading ? <div>...loaidng</div> : null }
              {
                suggestions.map( suggestion =>
                {
                  const style = {
                    backgroundColor: suggestion.active ? "#41b6e6" : "#fff"
                  };
                  return (
                    <div { ...getSuggestionItemProps( suggestion, { style } ) }>
                      { suggestion.description }
                    </div>
                  );
                } )
              }
            </div>

          </div>
        ) }
      </PlacesAutocomplete>
    </div>
  );
}