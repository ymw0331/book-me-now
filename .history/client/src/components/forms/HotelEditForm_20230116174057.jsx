import PlacesAutocomplete from "react-places-autocomplete";
import { DatePicker, Select } from 'antd';
import moment from 'moment';

const HotelEditForm = ( {
  handleSubmit,
  handleImageChange,
  handleChange,
  title,
  content,
  price,
  values,
  setValues,
  location,
  setLocation,
  handleLocationSelect

} ) =>
{
  const { Option } = Select;

  return (
    <>
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

          {
            location ? () : ()
       

          }




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

    </>
  );
};

export default HotelEditForm;