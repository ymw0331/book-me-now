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
      >{ ( { getInputProps, suggestions, getSuggestionItemProps, loading } ) =>
      (
        <div>
          <input { ...getInputProps( { placeholder: "Type address" } ) } />

          <div>
            { loading ? <div>...loaidng</div> : null }
            {
              suggestions.map( ( suggestion ) =>
              {
                const style = {
                  backgroundColor: suggestion.active ? "#41b6e6" : ""
                };
                return <div { ...getSuggestionItemProps() }>{ suggestion.description }</div>;
              } )
            }
          </div>

        </div>
      )
        }
      </PlacesAutocomplete>
    </div>
  );
}