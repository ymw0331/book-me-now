//1.import from react-redux and redux
//2.create user reducer function, 
const authReducer = ( state = { name: "Wayne", role: "Seller" }, action ) =>
{
  //{type: "LOGGED_IN_USER", payload: {name: "Wayne", role:"Seller"}
  switch ( action.type )
  {
    case "LOGGED_IN_USER":
      return { ...state, ...action.payload };
    case "LOGOUT":
      return action.payload;
    default:
      return state;
  }
};

//3.combine multiple reducers


