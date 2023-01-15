import axios from "axios";

export const createHotel = async ( token ) =>
  await axios.post( `${ process.env.REACT_APP_API }/create-hotel`, data,
    {
      headers: {
        Authorization: `Bearer ${ token }`,

      }
    }
  );