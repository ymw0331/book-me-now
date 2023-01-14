export const createConnectAccount =
  async ( user ) =>
    await axios.post( `${ process.env.REACT_APP_API }/register`, user );