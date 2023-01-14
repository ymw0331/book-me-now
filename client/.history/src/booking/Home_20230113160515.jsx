import { useSelector } from 'react-redux';


const Home = () =>
{
  const state = useSelector( ( state ) => state );

  return (
    (
      <div className='container-fluid h-1 p-5 text-center'>
        <pre>
          
        </pre>
      </div>
    )
  );
};


export default Home;