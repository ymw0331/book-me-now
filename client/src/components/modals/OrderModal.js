import Modal from '../ui/Modal';

const OrderModal = ({ session, orderedBy, showModal, setShowModal }) => {
  return (
    <Modal
      isOpen={showModal}
      onClose={() => setShowModal(!showModal)}
      title="Order Payment Info"
      size="default"
    >
      <div className="space-y-3">
        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-600">Payment Intent:</span>
          <span className="font-mono text-sm">{session.payment_intent}</span>
        </div>

        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-600">Payment Status:</span>
          <span className={`font-semibold ${
            session.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
          }`}>
            {session.payment_status}
          </span>
        </div>

        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-600">Amount Total:</span>
          <span className="font-semibold">
            {session.currency.toUpperCase()} {session.amount_total / 100}
          </span>
        </div>

        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-600">Stripe Customer ID:</span>
          <span className="font-mono text-sm">{session.customer}</span>
        </div>

        <div className="flex justify-between py-2">
          <span className="text-gray-600">Customer Name:</span>
          <span className="font-semibold">{orderedBy.name}</span>
        </div>
      </div>
    </Modal>
  );
};

export default OrderModal;
