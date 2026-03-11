const STEPS = ['RECEIVED', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED'];
const LABELS = {
  RECEIVED: 'Order Received',
  PREPARING: 'Preparing',
  READY_FOR_PICKUP: 'Ready for Pickup',
  COMPLETED: 'Completed',
};

export default function OrderStatusStepper({ status }) {
  const isCancelled = status === 'CANCELLED';
  const currentIndex = STEPS.indexOf(status);

  if (isCancelled) {
    return (
      <div className="text-center py-4">
        <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold">
          ❌ Order Cancelled
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full">
      {STEPS.map((step, idx) => {
        const isActive = idx <= currentIndex;
        const isCurrent = idx === currentIndex;
        return (
          <div key={step} className="flex-1 flex flex-col items-center relative">
            {/* Connector line */}
            {idx > 0 && (
              <div
                className={`absolute top-4 right-1/2 w-full h-0.5 -z-10 ${
                  idx <= currentIndex ? 'bg-pure-veg' : 'bg-gray-200'
                }`}
              />
            )}
            {/* Circle */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 ${
                isCurrent
                  ? 'bg-primary text-white ring-4 ring-primary/20'
                  : isActive
                  ? 'bg-pure-veg text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {isActive && !isCurrent ? '✓' : idx + 1}
            </div>
            {/* Label */}
            <p
              className={`text-xs mt-2 text-center ${
                isCurrent ? 'text-primary font-semibold' : isActive ? 'text-pure-veg' : 'text-gray-400'
              }`}
            >
              {LABELS[step]}
            </p>
          </div>
        );
      })}
    </div>
  );
}
