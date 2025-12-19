import { CheckCircle } from "lucide-react";

const StepIndicator = ({
  currentStep,
  stepNumber,
  label,
}: {
  currentStep: number;
  stepNumber: number;
  label: string;
}) => (
  <div className="flex items-center gap-2">
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
        currentStep > stepNumber
          ? "bg-green-600 text-white"
          : currentStep === stepNumber
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          : "bg-slate-200 dark:bg-slate-700 text-muted-foreground"
      }`}
    >
      {currentStep > stepNumber ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        stepNumber
      )}
    </div>
    <span
      className={`text-sm font-medium ${
        currentStep >= stepNumber ? "text-foreground" : "text-muted-foreground"
      }`}
    >
      {label}
    </span>
  </div>
);

export default StepIndicator;
