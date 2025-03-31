
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { updateInvestorProfile } from "@/services/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const investorFormSchema = z.object({
  investment_firm: z.string().min(1, "Investment firm is required"),
  investment_categories: z.string().min(1, "Investment categories are required"),
  min_investment: z.string().refine(val => !isNaN(parseInt(val)), {
    message: "Minimum investment must be a number"
  }),
  max_investment: z.string().refine(val => !isNaN(parseInt(val)), {
    message: "Maximum investment must be a number"
  }),
  stage_of_interest: z.string().min(1, "Stage of interest is required"),
  linkedin: z.string().optional(),
  portfolio: z.string().optional()
});

const InvestorProfileForm = () => {
  const { user, updateCurrentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const userProfile = user?.profile || {};
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(investorFormSchema),
    defaultValues: {
      investment_firm: userProfile.investment_firm || "",
      investment_categories: userProfile.investment_categories || "",
      min_investment: userProfile.min_investment?.toString() || "",
      max_investment: userProfile.max_investment?.toString() || "",
      stage_of_interest: userProfile.stage_of_interest || "",
      linkedin: userProfile.linkedin || "",
      portfolio: userProfile.portfolio || ""
    }
  });
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Parse numeric values
      const formattedData = {
        ...data,
        min_investment: parseInt(data.min_investment),
        max_investment: parseInt(data.max_investment)
      };
      
      await updateInvestorProfile(formattedData);
      
      // Update local user state
      updateCurrentUser({
        ...user,
        profile: {
          ...user.profile,
          ...formattedData
        }
      });
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Investor Profile</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="investment_firm">Investment Firm</Label>
            <Input 
              id="investment_firm" 
              {...register("investment_firm")} 
              placeholder="Enter your investment firm"
            />
            {errors.investment_firm && (
              <p className="text-sm text-red-500">{errors.investment_firm.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="investment_categories">Investment Categories</Label>
            <Textarea 
              id="investment_categories" 
              {...register("investment_categories")} 
              placeholder="Enter your investment categories (comma separated)"
              className="min-h-[100px]"
            />
            {errors.investment_categories && (
              <p className="text-sm text-red-500">{errors.investment_categories.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="min_investment">Minimum Investment ($)</Label>
              <Input 
                id="min_investment" 
                {...register("min_investment")} 
                placeholder="Enter your minimum investment"
              />
              {errors.min_investment && (
                <p className="text-sm text-red-500">{errors.min_investment.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="max_investment">Maximum Investment ($)</Label>
              <Input 
                id="max_investment" 
                {...register("max_investment")} 
                placeholder="Enter your maximum investment"
              />
              {errors.max_investment && (
                <p className="text-sm text-red-500">{errors.max_investment.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stage_of_interest">Stage of Interest</Label>
            <Input 
              id="stage_of_interest" 
              {...register("stage_of_interest")} 
              placeholder="Enter your stage of interest"
            />
            {errors.stage_of_interest && (
              <p className="text-sm text-red-500">{errors.stage_of_interest.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input 
                id="linkedin" 
                {...register("linkedin")} 
                placeholder="Enter your LinkedIn profile URL"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="portfolio">Portfolio URL</Label>
              <Input 
                id="portfolio" 
                {...register("portfolio")} 
                placeholder="Enter your portfolio URL"
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Profile"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default InvestorProfileForm;
