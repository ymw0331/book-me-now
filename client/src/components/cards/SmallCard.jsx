import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit2, Trash2, MapPin, Calendar, Bed, Eye } from 'lucide-react';
import { Card, CardContent, Badge, Button } from '../ui';
import { formatCurrency, truncateText, diffDays, formatDate } from '../../lib/utils';

export default function SmallCard({
  h,
  handleHotelDelete = (f) => f,
  owner = false,
  showMoreViewButton = true
}) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -2 }}
      className="mb-6"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="md:flex">
          {/* Image */}
          <div className="md:w-1/3 relative">
            <div className="aspect-[4/3] md:h-64 overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={h.image && h.image.contentType 
                  ? `${process.env.REACT_APP_API}/hotel/image/${h._id}`
                  : 'https://via.placeholder.com/900x500.png?text=MERN+Booking'
                }
                alt={h.title}
              />
            </div>
          </div>

          {/* Content */}
          <div className="md:w-2/3">
            <CardContent className="p-6">
              {/* Title and Price */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                  {h.title}
                </h3>
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-primary-600">
                    {formatCurrency(h.price)}
                  </div>
                  <div className="text-sm text-gray-500">per night</div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center mb-3">
                <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                <Badge variant="secondary" className="text-sm">
                  {h.location}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4 line-clamp-3">
                {truncateText(h.content, 150)}
              </p>

              {/* Details */}
              <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  <span>{h.bed} bed{h.bed > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Available from {formatDate(h.from)}</span>
                </div>
                {h.from && h.to && (
                  <div className="flex items-center">
                    <span className="text-primary-600 font-medium">
                      {diffDays(h.from, h.to)} day{diffDays(h.from, h.to) > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {showMoreViewButton && (
                    <Button
                      onClick={() => navigate(`/hotel/${h._id}`)}
                      className="flex items-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </Button>
                  )}
                </div>

                {owner && (
                  <div className="flex items-center space-x-2">
                    <Link to={`/hotel/edit/${h._id}`}>
                      <Button variant="outline" size="icon">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleHotelDelete(h._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}