import Jumbotron from '../../src/components/cards/Jumbotron';
import { LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const StripeCallback = () =>
{
  return (
    <div className='d-flex justify-content-center p-5'>
      <LoadingOutlined  className=''/>
    </div>
  );
};


export default StripeCallback;