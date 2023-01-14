let userState;

if ( window.localStorage.getItem( "auth" ) )
{

  userState = JSON.parse( window.localStorage.getItem( "auth" ) );
}else{
  
}


const authReducer = ( state = {}, action ) =>
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

export default authReducer;