/* eslint-disable jsx-a11y/img-redundant-alt */
import { useState } from "react";
import { currencyFormatter } from "../../actions/stripe";
import { diffDays } from "../../actions/hotel";
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import OrderModal from "../modals/OrderModal";

const BookingCard = ({ hotel, session, orderedBy }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card className="overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3">
            {hotel.image && hotel.image.contentType ? (
              <img
                src={`${process.env.REACT_APP_API}/hotel/image/${hotel._id}`}
                alt="Hotel image"
                className="w-full h-48 md:h-full object-cover"
              />
            ) : (
              <img
                src="https://via.placeholder.com/900x500.png?text=MERN+Booking"
                alt="Default hotel image"
                className="w-full h-48 md:h-full object-cover"
              />
            )}
          </div>

          <div className="md:w-2/3 p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold text-gray-900">
                {hotel.title}
              </h3>
              <span className="text-lg font-bold text-blue-600">
                {currencyFormatter({
                  amount: hotel.price * 100,
                  currency: "usd",
                })}
              </span>
            </div>

            <div className="mb-3">
              <Badge variant="info" className="inline-flex">
                {hotel.location}
              </Badge>
            </div>

            <p className="text-gray-600 mb-3">
              {`${hotel.content.substring(0, 200)}...`}
            </p>

            <div className="space-y-2 text-sm text-gray-700 mb-4">
              <div className="flex justify-between">
                <span>{hotel.bed} bed{hotel.bed > 1 ? 's' : ''}</span>
                <span className="text-blue-600 font-medium">
                  for {diffDays(hotel.from, hotel.to)}{" "}
                  {diffDays(hotel.from, hotel.to) <= 1 ? "day" : "days"}
                </span>
              </div>
              <div>
                Available from {new Date(hotel.from).toLocaleDateString()}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setShowModal(!showModal)}
                variant="primary"
              >
                Show Payment Info
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {showModal && (
        <OrderModal
          session={session}
          orderedBy={orderedBy}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
};

export default BookingCard;