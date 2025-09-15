import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Jumbotron from '../components/cards/Jumbotron';
import SmallCard from '../components/cards/SmallCard';
import { Container, Section } from '../components/layout';
import { allHotels } from '../actions/hotel';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllHotels();
  }, []);

  const loadAllHotels = async () => {
    try {
      setLoading(true);
      let res = await allHotels();
      setHotels(res.data);
    } catch (error) {
      console.error('Error loading hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHotelDelete = () => {
    // Empty function for now
  };

  return (
    <>
      <Jumbotron title="All Services" />

      <Section>
        <Container>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              <span className="ml-2 text-gray-600">Loading services...</span>
            </div>
          ) : hotels.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No services available
              </h3>
              <p className="text-gray-600">
                Check back later for new services.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Available Services
                </h2>
                <p className="text-gray-600">
                  Discover {hotels.length} amazing service{hotels.length !== 1 ? 's' : ''} from trusted providers
                </p>
              </div>
              
              <motion.div
                className="grid gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {hotels.map((h, index) => (
                  <motion.div
                    key={h._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <SmallCard
                      h={h}
                      handleHotelDelete={handleHotelDelete}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
};

export default Home;