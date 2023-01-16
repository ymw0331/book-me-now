import Jumbotron from '../../src/components/cards/Jumbotron';
import { LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';


const StripeCallback = () =>
{
  return (
    <div className='d-flex justify-content-center p-5'>
      <LoadingOutlined className='display-1 p-5 text-danger' />
    </div>
  );
};

export default StripeCallback;