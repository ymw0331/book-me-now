import { currencyFormatter } from '../../actions/stripe';
import { diffDays } from '../../actions/hotel';


const SmallCard = ( { h } ) => (
  <>
    <div className='card mb-3'>
      <div className='row nol-gutters'>
        <div className='col-md-4'>
          // eslint-disable-next-line jsx-a11y/img-redundant-alt
          <img
            className='card-image img img-fluid'
            src='https://via.placeholder.com/900x500.png?text=MERN+Booking'
            alt='default hotel image'
          />
        </div>

        <div className='col-md-8'>
          <div className='card-body'>
            <h3 className='card-title'>
              { h.title } <span className='float-right text-primart'>
                { currencyFormatter( {
                  amount: h.price,
                  currency: "myr"
                } ) }

              </span>
            </h3>
            <p className='alert alert-info'>{ h.location }</p>
            <p className='card-text'>{ `${ h.content.substring( 0, 200 ) }...` }</p>
            <p classname='card-text'>
              <span className='float-right text-primary'>
                for { diffDays( h.from, h.to ) }{ "" } { diffDays( h.from, h.to ) <= 1 ? 'day' : 'days' }
              </span>
            </p>

            <p className='card-text'> { h.bed } bed </p>
            <p className='card-text'> Available from {new Date(h.from)</p>
          </div>

        </div>

      </div>
    </div>
  </>

);


export default SmallCard;