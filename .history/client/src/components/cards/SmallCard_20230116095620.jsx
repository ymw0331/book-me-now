import { currencyFormatter } from '../../actions/stripe';
import {diffDays}
/* eslint-disable jsx-a11y/img-redundant-alt */
const SmallCard = ( { h } ) => (
  <>
    <div className='card mb-3'>
      <div className='row nol-gutters'>
        <div className='col-md-4'>
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

          </div>

        </div>

      </div>
    </div>
  </>

);


export default SmallCard;