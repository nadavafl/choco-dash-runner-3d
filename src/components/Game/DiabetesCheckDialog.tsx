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
import { Check, Syringe } from "lucide-react";
import { toast } from "sonner";

interface DiabetesCheckDialogProps {
  open: boolean;
  onComplete: () => void;
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
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bloodGlucose: "",
    },
  });

  const submitReading = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      // This would normally be an environment variable or configured endpoint
      const apiEndpoint =
        "https://script.google.com/macros/s/YOUR_GOOGLE_SCRIPT_ID/exec";

      const response = await fetch(apiEndpoint, {
        method: "POST",
        mode: "no-cors", // Using no-cors as Google Scripts have CORS restrictions
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bloodGlucose: values.bloodGlucose,
          timestamp: new Date().toISOString(),
        }),
      });

      // Since we're using no-cors, we can't actually know if it succeeded
      // So we'll assume it did if no error is thrown
      toast.success("Blood glucose reading submitted", {
        description: "Thank you for tracking your diabetes data.",
      });

      form.reset();
      onComplete();
    } catch (error) {
      console.error("Error submitting blood glucose reading:", error);
      toast.error("Failed to submit reading", {
        description: "Please try again or play without submitting.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md">
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

            <DialogFooter className="gap-2 flex-col sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => {
                  toast.info("Submission skipped", {
                    description: "Remember to track your levels regularly!",
                  });
                  onComplete();
                }}
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
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DiabetesCheckDialog;
