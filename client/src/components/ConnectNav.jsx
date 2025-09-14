import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { getAccountBalance, currencyFormatter, payoutSetting } from '../actions/stripe';
import { Settings } from 'lucide-react';
import { toast } from 'react-toastify';
import Avatar from './ui/Avatar';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

const ConnectNav = () =>
{
  const { auth } = useSelector( ( state ) => ( { ...state } ) );
  const { user, token } = auth;
  const [ balance, setBalance ] = useState( 0 );
  const [ loading, setLoading ] = useState( false );

  useEffect( () =>
  {
    getAccountBalance( auth.token ).then( res =>
    {
      // console.log( res );
      setBalance( res.data );
    } );
  } );

  const handlePayoutSettings = async () =>
  {
    setLoading( true );
    try
    {
      const res = await payoutSetting( token );
      console.log( "RES FOR PAYOUT SETTING LINK ==>", res );
      window.location.href = res.data.url;

      setLoading( false );

    } catch ( error )
    {
      console.log( error );
      setLoading( false );
      toast.error( "Unable to access settings. Try again" );
    }
  };


  return (
    <div className='flex justify-around gap-4'>
      <Card className="flex-1">
        <div className="flex items-center space-x-3">
          <Avatar
            fallback={user.name[0]}
            size="large"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">
              Joined {moment(user.createdAt).fromNow()}
            </p>
          </div>
        </div>
      </Card>

      {auth && auth.user
        && auth.user.stripe_seller
        && auth.user.stripe_seller.charges_enabled &&
        (
          <>
            <div className="relative flex-1">
              <Badge content="Available" variant="secondary" position="top-right">
                <Card className="bg-gray-50 h-full">
                  <div className="pt-2">
                    {balance &&
                      balance.pending &&
                      balance.pending.map((bp, i) => (
                        <span key={i} className="block font-semibold text-gray-700">
                          {currencyFormatter(bp)}
                        </span>
                      ))}
                  </div>
                </Card>
              </Badge>
            </div>

            <div className="relative flex-1">
              <Badge content="Payouts" variant="default" position="top-right">
                <Card
                  className="bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors h-full"
                  onClick={handlePayoutSettings}
                >
                  <div className="pt-2 flex justify-center">
                    <Settings className='w-6 h-6 text-gray-600' />
                  </div>
                </Card>
              </Badge>
            </div>
          </>
        )
      }
    </div>
  );
};


export default ConnectNav;

