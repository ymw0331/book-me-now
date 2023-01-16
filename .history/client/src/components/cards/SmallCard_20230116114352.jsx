/* eslint-disable jsx-a11y/img-redundant-alt */
import { currencyFormatter } from '../../actions/stripe';
import { diffDays } from '../../actions/hotel';
import { useNavigate, Link } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';


export default function SmallCard ( {
  h,
  handleHotelDelete = ( f ) => f,
  owner = false,
  showMoreViewButton = true
  handleHotelDelete
} )
{
  const navigate = useNavigate();

  return (
    <>
      <div className='card mb-3'>
        <div className='row nol-gutters'>
          <div className='col-md-4'>
            { h.image && h.image.contentType ? (
              <img
                className='card-image img img-fluid'
                src={ `${ process.env.REACT_APP_API }/hotel/image/${ h._id }` }
                alt='default hotel image'
              />
            ) : (
              <img
                className='card-image img img-fluid'
                src='https://via.placeholder.com/900x500.png?text=MERN+Booking'
                alt='default hotel image'
              />
            ) }

          </div>

          <div className='col-md-8'>
            <div className='card-body'>
              <h3 className='card-title'>
                { h.title } <span className='float-right text-primary'>
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

              <p className='card-text'>
                Available from { new Date( h.from ).toLocaleDateString() }
              </p>



              <div className='d-flex justify-content-between h4'>
                {
                  showMoreViewButton &&
                  <button className='btn btn-primary'
                    onClick={ () => navigate( `/hotel/${ h._id }` ) }
                  >Show More
                  </button>
                }


                { owner && <>
                  <Link to={ `/hotel/edit/${ h._id }` }>
                    <EditOutlined className='text-warning' />
                  </Link>

                  <DeleteOutlined
                    onClick={ () => handleHotelDelete( h._id ) }
                    className="text-danger"
                    handleHotelDelete
                  />
                </> }

              </div>

            </div>

          </div>

        </div>
      </div>
    </> );

}