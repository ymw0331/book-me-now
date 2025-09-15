import Jumbotron from '../components/cards/Jumbotron';
import { useState } from "react";
import { toast } from "react-toastify";
import { createHotel } from '../actions/hotel';
import { useSelector } from 'react-redux';
import HotelCreateForm from '../components/forms/HotelCreateForm';
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { Card } from '../components/ui/Card';

const NewHotel = () => {
  //redux
  const { auth } = useSelector((state) => ({ ...state }));
  const { token } = auth;
  // state
  const [values, setValues] = useState({
    title: "",
    content: "",
    image: "",
    price: "",
    from: "",
    to: "",
    bed: "",
  });

  const [preview, setPreview] = useState(
    "https://via.placeholder.com/100x100.png?text=PREVIEW"
  );

  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  // destructuring variables from state
  const { title, content, image, price, from, to, bed } = values;

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hotelData = new FormData();
    hotelData.append('title', title);
    hotelData.append('content', content);
    hotelData.append('location', location);
    hotelData.append('price', price);
    image && hotelData.append('image', image);
    hotelData.append('from', from);
    hotelData.append('to', to);
    hotelData.append('bed', bed);

    console.log([...hotelData]);

    try {
      //use form data for file data (image)
      let res = await createHotel(token, hotelData);
      console.log("HOTEL CREATE RES =>", res);
      toast.success("New hotel is posted");
      setTimeout(() => {
        //reload to clear fields
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
    }
  };

  const handleImageChange = (e) => {
    setPreview(URL.createObjectURL(e.target.files[0]));
    setValues({ ...values, image: e.target.files[0] });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleLocationSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);

    setLocation(value);
    setCoordinates(latLng);
  };

  return (
    <>
      <Jumbotron title="Add new hotel" />

      <div className="w-full px-4 py-6">
        <div className="flex flex-wrap -mx-2">
          <div className="w-full lg:w-2/3 px-2">
            <Card className="p-6">
              <HotelCreateForm
                handleSubmit={handleSubmit}
                handleImageChange={handleImageChange}
                handleChange={handleChange}
                handleLocationSelect={handleLocationSelect}
                title={title}
                content={content}
                location={location}
                price={price}
                values={values}
                setLocation={setLocation}
                setValues={setValues}
              />
            </Card>
          </div>

          <div className="w-full lg:w-1/3 px-2 mt-4 lg:mt-0">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Preview</h3>
              <img
                src={preview}
                alt="preview_image"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />

              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Debug Info</h4>
                  <pre className="text-xs text-gray-600 overflow-auto">
                    {JSON.stringify(values, null, 2)}
                  </pre>
                  <p className="text-xs text-gray-600 mt-2">
                    Location: {location}
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewHotel;