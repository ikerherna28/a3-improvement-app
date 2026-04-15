export const A3StepIndicator = ({
  steps = [],
  currentStep = 1,
  onStepClick,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <div className="flex flex-wrap items-center gap-3">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={step.id} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onStepClick?.(stepNumber)}
                className={`w-9 h-9 rounded-full font-bold text-sm transition-colors ${
                  isActive
                    ? 'bg-corporate-orange text-white'
                    : isCompleted
                    ? 'bg-corporate-purple text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                aria-current={isActive ? 'step' : undefined}
                title={step.label}
              >
                {stepNumber}
              </button>

              <div className="min-w-[120px]">
                <p
                  className={`text-sm font-semibold ${
                    isActive ? 'text-corporate-orange' : 'text-gray-700'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="w-8 h-[2px] bg-gray-300 hidden sm:block" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
