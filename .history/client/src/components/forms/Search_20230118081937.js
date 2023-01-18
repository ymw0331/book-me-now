import React, { useState } from "react";
import { DatePicker, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import AlgoliaPlaces from "algolia-places-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";

// destructure values from ant components
const { RangePicker } = DatePicker;
const { Option } = Select;

const config = {
  appId: process.env.REACT_APP_ALGOLIA_APP_ID,
  apiKey: process.env.REACT_APP_ALGOLIA_API_KEY,
  language: "en",
  // countries: ["au"],
};

const Search = () =>
{
  // state
  const [ location, setLocation ] = useState( "" );
  const [ coordinates, setCoordinates ] = useState(
    { lat: null, lng: null }
  );

  const [ date, setDate ] = useState( "" );
  const [ bed, setBed ] = useState( "" );
  // route
  const navigate = useNavigate();


  const handleLocationSelect = async ( value ) =>
  {
    const results = await geocodeByAddress( value );
    const latLng = await getLatLng( results[ 0 ] );

    setLocation( value );
    setCoordinates( latLng );
    // console.log( results );
  };
  const handleSubmit = () =>
  {
    navigate( `/search-result?location=${ location }&date=${ date }&bed=${ bed }` );
  };

  return (
    <div className="d-flex pb-4">
      <div className="w-100">
        {/* <AlgoliaPlaces
          placeholder="Location"
          defaultValue={ location }
          options={ config }
          onChange={ ( { suggestion } ) => setLocation( suggestion.value ) }
          style={ { height: "50px" } }
        /> */}
        {/* 

        <PlacesAutocomplete
          className="form-control m-2 w-100"
          value={ location }
          onChange={ setLocation }
          onSelect={ handleLocationSelect }
        >
          { ( { getInputProps, suggestions, getSuggestionItemProps, loading } ) => (
            <div>

              <input
                className="form-control m-2"
                { ...getInputProps( { placeholder: "Location" } ) } />

              <p
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
              </p>

            </div>
          ) }
        </PlacesAutocomplete> */}
      </div>

      <RangePicker
        onChange={ ( value, dateString ) => setDate( dateString ) }
        disabledDate={ ( current ) =>
          current && current.valueOf() < moment().subtract( 1, "days" )
        }
        className="w-100"
      />

      <Select
        onChange={ ( value ) => setBed( value ) }
        className="w-100"
        size="large"
        placeholder="Number of beds"
      >
        <Option key={ 1 }>{ 1 }</Option>
        <Option key={ 2 }>{ 2 }</Option>
        <Option key={ 3 }>{ 3 }</Option>
        <Option key={ 4 }>{ 4 }</Option>
      </Select>

      <SearchOutlined
        onClick={ handleSubmit }
        className="btn btn-primary p-3 btn-square"
      />
    </div>
  );
};

export default Search;
