import Jumbotron from '../components/cards/Jumbotron';
import { useState } from "react";
import { toast } from "react-toastify";
import { DatePicker, Select } from 'antd';
import moment from 'moment';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { createHotel } from '../actions/hotel';
import { useSelector } from 'react-redux';

const config = {
  appId: process.env.REACT_APP_ALGOLIA_APP_ID,
  apiKey: process.env.REACT_APP_ALGOLIA_API_KEY,
  language: "en",
  countries: [ "my" ],
};

const NewHotel = () =>
{
  const { Option } = Select;

  //redux
  const { auth } = useSelector( ( state ) => ( { ...state } ) );
  const { token } = auth;
  // state
  const [ values, setValues ] = useState( {
    title: "",
    content: "",
    image: "",
    price: "",
    from: "",
    to: "",
    bed: "",
  } );

  const [ preview, setPreview ] = useState(
    "https://via.placeholder.com/100x100.png?text=PREVIEW"
  );

  const [ location, setLocation ] = useState( "" );
  const [ coordinates, setCoordinates ] = useState(
    { lat: null, lng: null }
  );


  // destructuring variables from state
  const { title, content, image, price, from, to, bed } = values;

  const handleSubmit = async ( e ) =>
  {
    e.preventDefault();
    // console.log( values );
    // console.log( location );

    //use form data for file data (image)
    let res = await createHotel( token, hotelData );
    console.log( "HOTEL CREATE RES =>", res );
    toast( "New hotel is posted" );


  };

  const handleImageChange = ( e ) =>
  {
    // console.log(e.target.files[0]);
    setPreview( URL.createObjectURL( e.target.files[ 0 ] ) );
    setValues( { ...values, image: e.target.files[ 0 ] } );
  };

  const handleChange = ( e ) =>
  {
    setValues( { ...values, [ e.target.name ]: e.target.value } );
  };

  const handleLocationSelect = async ( value ) =>
  {
    const results = await geocodeByAddress( value );
    const latLng = await getLatLng( results[ 0 ] );

    setLocation( value );
    setCoordinates( latLng );
    // console.log( results );
  };


  const hotelForm = () => (
    <form onSubmit={ handleSubmit }>
      <div className="form-group">
        <label className="btn btn-outline-secondary btn-block m-2 text-left">
          Image
          <input
            type="file"
            name="image"
            onChange={ handleImageChange }
            accept="image/*"
            hidden
          />
        </label>

        <input
          type="text"
          name="title"
          onChange={ handleChange }
          placeholder="Title"
          className="form-control m-2"
          value={ title }
        />

        <textarea
          name="content"
          onChange={ handleChange }
          placeholder="Content"
          className="form-control m-2"
          value={ content }
        />

        {/* <AlgoliaPlaces
          className="form-control m-2"
          placeholder="Location"
          defaultValue={ location }
          options={ config }
          onChange={ ( { suggestion } ) =>
            setLocation( suggestion.value )
          }
          style={ { height: "50px" } }
        /> */}

        <PlacesAutocomplete
          className="form-control m-2"
          value={ location }
          onChange={ setLocation }
          onSelect={ handleLocationSelect }
        >
          { ( { getInputProps, suggestions, getSuggestionItemProps, loading } ) => (
            <div>
              {/* <p>Latitude: { coordinates.lat }</p>
              <p>Longitude: { coordinates.lng }</p> */}
              <input
                className="form-control m-2"
                { ...getInputProps( { placeholder: "Location" } ) } />

              <div
                className="form-control m-2"

              >
                { loading ? <div>...loading</div> : null }
                {
                  suggestions.map( suggestion =>
                  {
                    const style = {
                      backgroundColor: suggestion.active ? "#abdbe3" : "#fff"
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
        <input
          type="number"
          name="price"
          onChange={ handleChange }
          placeholder="Price"
          className="form-control m-2"
          value={ price }
        />

        <Select
          onChange={ ( value ) => setValues( { ...values, bed: value } ) }
          className="w-100 m-2"
          size='large'
          placeholder="Number of beds">
          <Option key={ 1 }>{ 1 }</Option>
          <Option key={ 2 }>{ 2 }</Option>
          <Option key={ 3 }>{ 3 }</Option>
          <Option key={ 4 }>{ 4 }</Option>
        </Select>

        <DatePicker
          placeholder="From date"
          className='form-control m-2'
          onChange={ ( date, dateString ) =>
            setValues( { ...values, from: dateString } )
          }
          disabledDate={ ( current ) =>
            current && current.valueOf() < moment().subtract( 1, 'days' )
          }
        />

        <DatePicker
          placeholder="To date"
          className='form-control m-2'
          onChange={ ( date, dateString ) =>
            setValues( { ...values, to: dateString } )
          }
          disabledDate={ ( current ) =>
            current && current.valueOf() < moment().subtract( 1, 'days' )
          }
        />

      </div>

      <button className="btn btn-outline-primary m-2">Save</button>
    </form>
  );

  return (
    <>

      <Jumbotron
        title="Add new hotel"
      />

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-10">
            <br />
            { hotelForm() }
          </div>
          <div className="col-md-2">
            <img
              src={ preview }
              alt="preview_image"
              className="img img-fluid m-2"
            />
            <pre>{ JSON.stringify( values, null, 4 ) }</pre>
            { JSON.stringify( location ) }
          </div>
        </div>
      </div>


    </>
  );
};

export default NewHotel;
