const RegisterForm = () =>
{

  <form onSubmit={ handleSubmit } className="mt-3">
    <label className='form-label' />Name:
    <input
      type="text"
      className="form-control mb-4 p-2"
      placeholder="Enter your name"
      value={ name }
      onChange={ ( e ) => setName( e.target.value ) }
      autoFocus
    >
    </input>
    <label className='form-label' />Email:
    <input
      type="email"
      className="form-control mb-4 p-2"
      placeholder="Enter your email"
      value={ email }
      onChange={ ( e ) => setEmail( e.target.value ) }
    >
    </input>
    <label className='form-label' />Password
    <input
      type="password"
      className="form-control mb-4 p-2"
      placeholder="Enter your password"
      value={ password }
      onChange={ ( e ) => setPassword( e.target.value ) }
    >
    </input>
    <button className="btn btn-primary " type="submit" onClick={ handleSubmit }>
      Submit
    </button>
  </form>;

};