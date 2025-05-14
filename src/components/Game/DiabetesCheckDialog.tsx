
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
    
    if (bloodGlucoseValue < 80) {
      setFeedbackMessage({
        message: "Low blood sugar – please eat something and retest.",
        type: "low",
      });
    } else if (bloodGlucoseValue >= 80 && bloodGlucoseValue < 120) {
      setFeedbackMessage({
        message: "Well done! Your test result is normal!",
        type: "normal",
      });
    } else {
      setFeedbackMessage({
        message: "You need to take care of yourself immediately and retest afterward.",
        type: "high",
      });
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
        description: "Please try again or play without submitting.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleContinue = () => {
    form.reset();
    onComplete(form.getValues().bloodGlucose);
    setFeedbackMessage({ message: "", type: null });
  };

  const handleSkip = () => {
    toast.info("Submission skipped", {
      description: "Remember to track your levels regularly!",
    });
    onComplete("");
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
            Please enter your current blood glucose reading before continuing.
            This helps track your diabetes management while gaming.
          </DialogDescription>
        </DialogHeader>

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
                    ? "bg-[#FEC6A1] border-orange-400"
                    : ""
                } 
                ${
                  feedbackMessage.type === "normal"
                    ? "bg-[#F2FCE2] border-green-400"
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
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={handleSkip}
                  >
                    Skip for now
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    {isSubmitting ? "Submitting..." : "Submit Reading"}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={handleContinue}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  Continue
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DiabetesCheckDialog;
