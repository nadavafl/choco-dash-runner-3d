
import React, { useState } from "react";
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
  const [canContinue, setCanContinue] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bloodGlucose: "",
    },
  });

  const submitReading = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Determine feedback message based on blood glucose value
    const bloodGlucoseValue = Number(values.bloodGlucose);
    
    if (bloodGlucoseValue < 70) {
      setFeedbackMessage({
        message: "I am weak, let's eat and retest afterward.",
        type: "low",
      });
      setShowFoodRecognition(true);
      setCanContinue(false);
      toast.warning("Low blood glucose detected! Please eat something and recheck.");
    } else if (bloodGlucoseValue >= 70 && bloodGlucoseValue < 140) {
      setFeedbackMessage({
        message: "Oh great! I can continue playing.",
        type: "normal",
      });
      setCanContinue(true);
    } else {
      setFeedbackMessage({
        message: "I need to drink some water or take a shot and retest.",
        type: "high",
      });
      setCanContinue(true);
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
    if (bloodGlucoseEffect === 'normal') {
      setFeedbackMessage({
        message: "Great food choice! Your blood glucose should return to normal soon.",
        type: "normal",
      });
      setCanContinue(true);
      toast.success("Good food choice for your current blood glucose level");
    } else if (bloodGlucoseEffect === 'high') {
      setFeedbackMessage({
        message: "This food contains too much sugar or carbs. Try something with more protein and less sugar.",
        type: "high",
      });
      setCanContinue(false);
      toast.warning("Not an ideal food choice for low blood glucose");
    } else {
      setFeedbackMessage({
        message: "This food doesn't have enough carbs to raise your blood glucose. Try something with more carbs.",
        type: "low",
      });
      setCanContinue(false);
      toast.warning("This food may not help with low blood glucose");
    }
  };
  
  const handleContinue = () => {
    form.reset();
    onComplete(form.getValues().bloodGlucose);
    setFeedbackMessage({ message: "", type: null });
    setShowFoodRecognition(false);
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
                ) : (
                  <Button
                    type="button"
                    onClick={handleContinue}
                    disabled={!canContinue}
                    className={`flex items-center gap-2 w-full sm:w-auto ${!canContinue ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Continue
                  </Button>
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
            
            <DialogFooter>
              <Button
                onClick={handleContinue}
                disabled={!canContinue}
                className={`${!canContinue ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Continue Playing
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DiabetesCheckDialog;
