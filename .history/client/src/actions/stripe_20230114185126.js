import axios from 'axios';

export const createConnectAccount =
  async ( user ) =>
    await axios.post( `${ process.env.REACT_APP_API }/create-connect-account`, user );