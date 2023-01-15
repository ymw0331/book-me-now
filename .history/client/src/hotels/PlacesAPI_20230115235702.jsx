import { useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";


export default function PlacesAPI ()
{

  const [ location, setlocation ] = useState( "" );
  const [ coordinates, setCoordinates ] = useState(
    { lat: null, lng: null }
  );


  const handleSelect = async ( value ) =>
  {
    const results = await geocodeBylocation( value );
    const latLng = await getLatLng( results[ 0 ] );

    setlocation( value );
    setCoordinates( latLng );
    // console.log( results );
  };

  return (
    <div>
      <PlacesAutocomplete
        value={ location }
        onChange={ setlocation }
        onSelect={ handleSelect }
      >
        { ( { getInputProps, suggestions, getSuggestionItemProps, loading } ) => (
          <div>
            <p>Latitude: { coordinates.lat }</p>
            <p>Longitude: { coordinates.lng }</p>

            <input { ...getInputProps( { placeholder: "Type location" } ) } />

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