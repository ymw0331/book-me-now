import Jumbotron from '../components/cards/Jumbotron';
import { useState } from "react";
import { toast } from "react-toastify";
import AlgoliaPlaces from "algolia-places-react";
import { DatePicker, Select } from 'antd';
import moment from 'moment';

const config = {
  appId: process.env.REACT_APP_ALGOLIA_APP_ID,
  apiKey: process.env.REACT_APP_ALGOLIA_API_KEY,
  language: "en",
  countries: [ "my" ],
};

const NewHotel = () =>
{

  const { Option } = Select;
  // state
  const [ values, setValues ] = useState( {
    title: "",
    content: "",
    location: "",
    image: "",
    price: "",
    from: "",
    to: "",
    bed: "",
  } );

  const [ preview, setPreview ] = useState(
    "https://via.placeholder.com/100x100.png?text=PREVIEW"
  );
  // destructuring variables from state
  const { title, content, location, image, price, from, to, bed } = values;

  const handleSubmit = ( e ) =>
  {
    //
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

        <AlgoliaPlaces
          className="form-control m-2"
          placeholder="Location"
          defaultValue={ location }
          options={ config }
          onChange={ ( { suggestion } ) =>
            setValues( { ...values, location: suggestion.value } )
          }
          style={ { height: "50px" } }
        />

        <input
          type="number"
          name="price"
          onChange={ handleChange }
          placeholder="Price"
          className="form-control m-2"
          value={ price }
        />
        {/* 
        <input
          type="number"
          name="bed"
          onChange={ handleChange }
          placeholder="Number of Beds"
          className="form-control m-2"
          value={ bed }
        /> */}


        <Select>
          <Option key={ 1 }>{ 1 }</Option>
          <Option key={ 2 }>{ 2 }</Option>
          <Option key={ 3 }>{ 1 }</Option>
          <Option key={ 1 }>{ 1 }</Option>
          <Option key={ 1 }>{ 1 }</Option>
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
          </div>
        </div>
      </div>


    </>
  );
};

export default NewHotel;
