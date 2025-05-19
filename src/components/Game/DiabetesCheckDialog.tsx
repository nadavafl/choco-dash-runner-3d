import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Check, Syringe, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import FoodRecognition from "./FoodRecognition";

interface DiabetesCheckDialogProps {
  open: boolean;
  onComplete: (bloodGlucose: string) => void;
  username: string;
}

const formSchema = z.object({
  bloodGlucose: z
    .string()
    .min(1, "Blood glucose reading is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Blood glucose must be a number",
    }),
});

const DiabetesCheckDialog: React.FC<DiabetesCheckDialogProps> = ({
  open,
  onComplete,
  username,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    message: string;
    type: "low" | "normal" | "high" | null;
  }>({ message: "", type: null });
  const [showFoodRecognition, setShowFoodRecognition] = useState(false);
  const [hasValidReading, setHasValidReading] = useState(false);
  const [bloodGlucoseValue, setBloodGlucoseValue] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bloodGlucose: "",
    },
  });

  // Reset form state when the dialog is opened
  useEffect(() => {
    if (open) {
      // Only reset if we're not showing food recognition and don't have a valid reading
      if (!showFoodRecognition && !hasValidReading) {
        form.reset();
        setFeedbackMessage({ message: "", type: null });
        setHasValidReading(false);
      }
    }
  }, [open, form, showFoodRecognition, hasValidReading]);

  // Reset validation when returning from food recognition
  useEffect(() => {
    if (!showFoodRecognition && feedbackMessage.type === "low") {
      // If we're returning from food recognition for low blood sugar,
      // we still need to validate the reading again
      setHasValidReading(false);
    }
  }, [showFoodRecognition, feedbackMessage.type]);

  const submitReading = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Store the blood glucose value
    const inputBloodGlucoseValue = Number(values.bloodGlucose);
    setBloodGlucoseValue(values.bloodGlucose);
    
    // Determine feedback message based on blood glucose value
    if (inputBloodGlucoseValue < 70) {
      setFeedbackMessage({
        message: "Blood glucose is low. Please eat something and check its nutritional value.",
        type: "low",
      });
      setShowFoodRecognition(true);
      setHasValidReading(false); // Will need to revalidate after food analysis
      toast.warning("Low blood glucose detected! Please eat something and check its nutritional value.");
    } else if (inputBloodGlucoseValue >= 70 && inputBloodGlucoseValue < 140) {
      setFeedbackMessage({
        message: "Oh great! I can continue playing.",
        type: "normal",
      });
      setHasValidReading(true);
    } else {
      setFeedbackMessage({
        message: "Blood glucose is high. Consider drinking water or taking medication as needed.",
        type: "high",
      });
      setHasValidReading(false); // High readings are not valid for continuing
      toast.error("High blood glucose detected. Please recheck after taking appropriate measures.");
    }

    try {
      const apiEndpoint =
        "https://api.sheetbest.com/sheets/1b628773-b56f-49e5-9d99-a65d24282f22";

      await axios.post(apiEndpoint, {
        bloodGlucose: values.bloodGlucose,
        timestamp: new Date().toISOString(),
      });

      toast.success("Blood glucose reading submitted", {
        description: "Thank you for tracking your diabetes data.",
      });
    } catch (error) {
      console.error("Error submitting blood glucose reading:", error);
      toast.error("Failed to submit reading", {
        description: "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFoodAnalyzed = (bloodGlucoseEffect: 'low' | 'normal' | 'high') => {
    // Provide feedback based on food analysis
    if (bloodGlucoseEffect === 'normal') {
      setFeedbackMessage({
        message: "Great food choice! Your blood glucose should return to normal soon.",
        type: "normal",
      });
      toast.success("Food analysis complete - please enter a new blood glucose reading");
    } else if (bloodGlucoseEffect === 'high') {
      setFeedbackMessage({
        message: "This food contains high sugar or carbs. Be mindful of your intake.",
        type: "high",
      });
      toast.info("Food analysis complete - please enter a new blood glucose reading");
    } else {
      setFeedbackMessage({
        message: "This food has low carbs. Consider monitoring your blood glucose.",
        type: "low",
      });
      toast.info("Food analysis complete - please enter a new blood glucose reading");
    }
    
    // Important: After food analysis, return to the diabetes check form
    setShowFoodRecognition(false);
    
    // Reset the form so user can enter a new reading after food analysis
    form.reset();
    setHasValidReading(false);
  };
  
  const handleContinue = () => {
    // Only allow continuation if we have a valid reading
    if (hasValidReading) {
      form.reset();
      onComplete(bloodGlucoseValue);
      setFeedbackMessage({ message: "", type: null });
      setShowFoodRecognition(false);
      setHasValidReading(false);
    } else {
      // If we don't have a valid reading, prompt the user to submit one
      toast.error("Please submit a valid blood glucose reading before continuing");
      form.setError("bloodGlucose", { 
        type: "manual", 
        message: "Blood glucose reading is required" 
      });
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md [&>button:last-child]:hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Syringe className="h-6 w-6 text-game-primary" />
            Diabetes Check
          </DialogTitle>
          <DialogDescription>
            It's time for your regular blood glucose check. Please enter your
            current reading before continuing the game.
          </DialogDescription>
        </DialogHeader>

        {!showFoodRecognition ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitReading)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="bloodGlucose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Glucose Reading (mg/dL)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your reading" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {feedbackMessage.type && (
                <Alert
                  className={`
                  ${
                    feedbackMessage.type === "low"
                      ? "bg-[#ADD8E6] border-blue-500"
                      : ""
                  } 
                  ${
                    feedbackMessage.type === "normal"
                      ? "bg-[#A8E6CF] border-green-500"
                      : ""
                  }
                  ${
                    feedbackMessage.type === "high"
                      ? "bg-[#ea384c] text-white border-red-600"
                      : ""
                  }
                `}
                >
                  <AlertTriangle
                    className={`h-4 w-4 ${
                      feedbackMessage.type === "high" ? "text-white" : ""
                    }`}
                  />
                  <AlertTitle
                    className={`${
                      feedbackMessage.type === "high"
                        ? "text-white"
                        : "text-[#403E43]"
                    }`}
                  >
                    Blood Glucose Alert
                  </AlertTitle>
                  <AlertDescription
                    className={`${
                      feedbackMessage.type === "high"
                        ? "text-white"
                        : "text-[#403E43]"
                    }`}
                  >
                    {feedbackMessage.message}
                  </AlertDescription>
                </Alert>
              )}

              <DialogFooter className="gap-2 flex-col sm:flex-row sm:justify-between">
                {!feedbackMessage.type ? (
                  <>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 w-full"
                    >
                      <Check className="h-4 w-4" />
                      {isSubmitting ? "Submitting..." : "Submit Reading"}
                    </Button>
                  </>
                ) : feedbackMessage.type === "normal" ? (
                  // For normal blood glucose, show only Continue button
                  <div className="w-full">
                    <Button
                      type="button"
                      onClick={handleContinue}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      Continue
                    </Button>
                  </div>
                ) : feedbackMessage.type === "high" ? (
                  // For high blood glucose, show only New Reading button
                  <div className="w-full">
                    <Button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2"
                      disabled={isSubmitting}
                    >
                      <Check className="h-4 w-4" />
                      Recheck Blood Sugar
                    </Button>
                  </div>
                ) : (
                  // For low blood glucose, keep existing logic (can lead to food recognition)
                  <div className="w-full flex flex-col sm:flex-row gap-2">
                    <Button
                      type="button"
                      onClick={handleContinue}
                      className="flex-1 flex items-center justify-center gap-2"
                      disabled={!hasValidReading}
                    >
                      Continue
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2"
                      disabled={isSubmitting}
                    >
                      <Check className="h-4 w-4" />
                      New Reading
                    </Button>
                  </div>
                )}
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <FoodRecognition onFoodAnalyzed={handleFoodAnalyzed} />
            
            {feedbackMessage.type && (
              <Alert
                className={`
                ${
                  feedbackMessage.type === "low"
                    ? "bg-[#ADD8E6] border-blue-500"
                    : ""
                } 
                ${
                  feedbackMessage.type === "normal"
                    ? "bg-[#A8E6CF] border-green-500"
                    : ""
                }
                ${
                  feedbackMessage.type === "high"
                    ? "bg-[#ea384c] text-white border-red-600"
                    : ""
                }
              `}
              >
                <AlertTriangle
                  className={`h-4 w-4 ${
                    feedbackMessage.type === "high" ? "text-white" : ""
                  }`}
                />
                <AlertTitle
                  className={`${
                    feedbackMessage.type === "high"
                      ? "text-white"
                      : "text-[#403E43]"
                  }`}
                >
                  Food Analysis
                </AlertTitle>
                <AlertDescription
                  className={`${
                    feedbackMessage.type === "high"
                      ? "text-white"
                      : "text-[#403E43]"
                  }`}
                >
                  {feedbackMessage.message}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DiabetesCheckDialog;
