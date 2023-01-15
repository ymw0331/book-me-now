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
        onChange={ }
        onSelect={ handleSelect }
      >

      </PlacesAutocomplete>
    </div>
  );
}