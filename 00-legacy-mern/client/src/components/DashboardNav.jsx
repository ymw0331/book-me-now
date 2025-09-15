import { Link } from 'react-router-dom';
import { TabsList, TabsTrigger } from './ui/Tabs';

const DashboardNav = () => {
  const active = window.location.pathname;

  return (
    <TabsList>
      <TabsTrigger
        active={active === "/dashboard"}
        className="no-underline"
      >
        <Link to="/dashboard" className="text-inherit no-underline">
          Your Bookings
        </Link>
      </TabsTrigger>

      <TabsTrigger
        active={active === "/dashboard/seller"}
        className="no-underline"
      >
        <Link to="/dashboard/seller" className="text-inherit no-underline">
          Your Hotels
        </Link>
      </TabsTrigger>
    </TabsList>
  );
};

export default DashboardNav;