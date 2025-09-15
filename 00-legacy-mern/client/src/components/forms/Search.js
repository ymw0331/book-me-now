import React, { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import DatePicker from '../ui/DatePicker';
import Select from '../ui/Select';
import { Button } from '../ui/Button';

const Search = () => {
  // state
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [bed, setBed] = useState("");

  // route
  const navigate = useNavigate();

  const bedOptions = [
    { value: 1, label: '1 Bed' },
    { value: 2, label: '2 Beds' },
    { value: 3, label: '3 Beds' },
    { value: 4, label: '4 Beds' },
  ];

  const handleLocationSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);

    setLocation(value);
    setCoordinates(latLng);
  };

  const handleSubmit = () => {
    const dateRange = dateFrom && dateTo
      ? `${dateFrom.toISOString().split('T')[0]},${dateTo.toISOString().split('T')[0]}`
      : '';
    navigate(`/search-result?location=${location}&date=${dateRange}&bed=${bed}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 pb-4">
      <div className="flex-1">
        <PlacesAutocomplete
          value={location}
          onChange={setLocation}
          onSelect={handleLocationSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div className="relative">
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                {...getInputProps({ placeholder: "Where are you going?" })}
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
                        <div className="text-sm">{suggestion.description}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </PlacesAutocomplete>
      </div>

      <div className="flex-1 md:max-w-xs">
        <DatePicker
          placeholder="Check-in date"
          value={dateFrom}
          onChange={setDateFrom}
          minDate={new Date()}
        />
      </div>

      <div className="flex-1 md:max-w-xs">
        <DatePicker
          placeholder="Check-out date"
          value={dateTo}
          onChange={setDateTo}
          minDate={dateFrom || new Date()}
        />
      </div>

      <div className="flex-1 md:max-w-xs">
        <Select
          value={bed}
          onChange={setBed}
          options={bedOptions}
          placeholder="Number of beds"
          size="default"
        />
      </div>

      <Button
        onClick={handleSubmit}
        variant="primary"
        className="px-6"
        disabled={!location || !dateFrom || !dateTo}
      >
        <SearchIcon className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default Search;