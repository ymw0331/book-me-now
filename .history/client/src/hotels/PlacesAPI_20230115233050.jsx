import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";


export default function PlacesAPI ()
{

  const [ address, setAddress ] = useState( "" );

  return (
    <div>
      <PlacesAutocomplete
        value={ }
        onChange={ }
        onSelect={ }
      >

      </PlacesAutocomplete>
    </div>
  );
}