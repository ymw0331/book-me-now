import PlacesAutocomplete from "react-places-autocomplete";
import moment from 'moment';
import DatePicker from '../ui/DatePicker';
import Select from '../ui/Select';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const HotelCreateForm = ({
  handleSubmit,
  handleImageChange,
  handleChange,
  handleLocationSelect,
  title,
  content,
  location,
  price,
  values,
  setLocation,
  setValues,
  auth
}) => {
  const bedOptions = [
    { value: 1, label: '1 Bed' },
    { value: 2, label: '2 Beds' },
    { value: 3, label: '3 Beds' },
    { value: 4, label: '4 Beds' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="flex items-center justify-center w-full px-4 py-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
          <span className="text-gray-600">Click to upload image</span>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            hidden
          />
        </label>
      </div>

      <div>
        <Input
          type="text"
          name="title"
          onChange={handleChange}
          placeholder="Title"
          value={title}
        />
      </div>

      <div>
        <textarea
          name="content"
          onChange={handleChange}
          placeholder="Content"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows="4"
          value={content}
        />
      </div>



      <div>
        <PlacesAutocomplete
          value={location}
          onChange={setLocation}
          onSelect={handleLocationSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div className="relative">
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                {...getInputProps({ placeholder: "Location" })}
              />
              {suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {loading && (
                    <div className="px-3 py-2 text-sm text-gray-500">Loading...</div>
                  )}
                  {suggestions.map((suggestion, index) => {
                    const className = suggestion.active
                      ? "px-3 py-2 cursor-pointer bg-blue-50 hover:bg-blue-100"
                      : "px-3 py-2 cursor-pointer hover:bg-gray-50";
                    return (
                      <div
                        key={index}
                        {...getSuggestionItemProps(suggestion, { className })}
                      >
                        {suggestion.description}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </PlacesAutocomplete>
      </div>

      <div>
        <Input
          type="number"
          name="price"
          onChange={handleChange}
          placeholder="Price per night"
          value={price}
        />
      </div>

      <div>
        <Select
          value={values.bed}
          onChange={(value) => setValues({ ...values, bed: value })}
          options={bedOptions}
          placeholder="Number of beds"
          size="large"
        />
      </div>

      <div>
        <DatePicker
          placeholder="From date"
          value={values.from ? new Date(values.from) : null}
          onChange={(date) =>
            setValues({ ...values, from: date ? date.toISOString().split('T')[0] : '' })
          }
          minDate={new Date()}
        />
      </div>

      <div>
        <DatePicker
          placeholder="To date"
          value={values.to ? new Date(values.to) : null}
          onChange={(date) =>
            setValues({ ...values, to: date ? date.toISOString().split('T')[0] : '' })
          }
          minDate={values.from ? new Date(values.from) : new Date()}
        />
      </div>

      <div>
        <Button
          type="submit"
          variant="primary"
          className="w-full"
        >
          Save Hotel
        </Button>
      </div>
    </form>
  );
};

export default HotelCreateForm;