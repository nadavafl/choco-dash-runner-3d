
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { User, Rocket } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface RegistrationScreenProps {
  onRegistrationComplete: (username: string) => void;
}

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
});

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({
  onRegistrationComplete,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const handleRegistration = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Google Apps Script endpoint with sheetbest
      const apiEndpoint =
        "https://api.sheetbest.com/sheets/1b628773-b56f-49e5-9d99-a65d24282f22";
      
      const data = {
        username: values.username,
        bloodGlucose: "",
        // gameScore: "",
        timestamp: new Date().toISOString(),
      };

      await axios({
        method: "POST",
        url: apiEndpoint,
        data: data,
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Registration successful!", {
        description: "Welcome to Choco Dash!",
      });
      onRegistrationComplete(values.username);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed", {
        description: "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-game-dark to-black bg-opacity-80">
      <Card className="w-[350px] bg-game-dark border-game-primary">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-game-primary">
            CHOCO DODGE
          </CardTitle>
          <CardDescription className="text-center text-game-light">
            Please register to play the game
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleRegistration)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-game-light">Username</FormLabel>
                    <FormControl>
                      <div className="flex items-center border border-game-accent rounded-md overflow-hidden">
                        <div className="bg-game-accent p-2">
                          <User className="h-5 w-5 text-black" />
                        </div>
                        <Input
                          placeholder="Enter username"
                          className="border-0 focus-visible:ring-0 bg-transparent text-white"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CardFooter className="px-0 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-game-primary hover:bg-game-secondary text-white flex items-center justify-center gap-2"
                >
                  <Rocket className="h-5 w-5" />
                  REGISTERING
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationScreen;
