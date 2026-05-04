import { FiCheck } from 'react-icons/fi';

const STEPS = ['RECEIVED', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED'];
const LABELS = {
  RECEIVED: 'Order Received',
  PREPARING: 'Preparing',
  READY_FOR_PICKUP: 'Ready for Pickup',
  COMPLETED: 'Completed',
};

const CATERING_STEPS = ['RECEIVED', 'PREPARING'];
const CATERING_LABELS = { RECEIVED: 'Pending', PREPARING: 'Accepted' };

function Stepper({ steps, labels, status }) {
  const currentIndex = steps.indexOf(status);
  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, idx) => {
        const isActive = idx <= currentIndex;
        const isCurrent = idx === currentIndex;
        const isLast = idx === steps.length - 1;
        const isDone = isActive && !isCurrent;
        return (
          <div key={step} className="flex-1 flex flex-col items-center relative">
            {idx > 0 && (
              <div
                className={`absolute top-4 right-1/2 w-full h-0.5 -z-10 ${
                  idx <= currentIndex ? 'bg-pure-veg' : 'bg-gray-200'
                }`}
              />
            )}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 ${
                isActive && isLast
                  ? 'bg-pure-veg text-white ring-4 ring-pure-veg/20'
                  : isCurrent
                  ? 'bg-primary text-white ring-4 ring-primary/20'
                  : isDone
                  ? 'bg-pure-veg text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {isDone || (isActive && isLast) ? <FiCheck className="w-4 h-4" /> : idx + 1}
            </div>
            <p
              className={`text-xs mt-2 text-center ${
                isActive && isLast
                  ? 'text-pure-veg font-semibold'
                  : isCurrent
                  ? 'text-primary font-semibold'
                  : isDone
                  ? 'text-pure-veg'
                  : 'text-gray-400'
              }`}
            >
              {labels[step]}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default function OrderStatusStepper({ status, orderType }) {
  if (status === 'CANCELLED') {
    return (
      <div className="text-center py-4">
        <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold">
          {orderType === 'CATERING' ? 'Request Cancelled' : 'Order Cancelled'}
        </span>
      </div>
    );
  }

  if (orderType === 'CATERING') {
    return <Stepper steps={CATERING_STEPS} labels={CATERING_LABELS} status={status} />;
  }

  return <Stepper steps={STEPS} labels={LABELS} status={status} />;
}
