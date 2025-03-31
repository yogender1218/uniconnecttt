
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfessorProfile } from "@/services/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const professorFormSchema = z.object({
  company: z.string().min(1, "Institution is required"),
  industry: z.string().min(1, "Department is required"),
  work_experience: z.string().min(1, "Experience is required"),
  expertise_areas: z.string().min(1, "Expertise areas are required"),
  open_for_mentorship: z.boolean(),
  availability: z.string().optional()
});

const ProfessorProfileForm = () => {
  const { user, updateCurrentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const userProfile = user?.profile || {};
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: zodResolver(professorFormSchema),
    defaultValues: {
      company: userProfile.company || "",
      industry: userProfile.industry || "",
      work_experience: userProfile.work_experience || "",
      expertise_areas: userProfile.expertise_areas || "",
      open_for_mentorship: userProfile.open_for_mentorship || false,
      availability: userProfile.availability || ""
    }
  });
  
  const isOpenForMentorship = watch("open_for_mentorship");
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      await updateProfessorProfile(data);
      
      // Update local user state
      updateCurrentUser({
        ...user,
        profile: {
          ...user.profile,
          ...data
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
        <CardTitle>Professor Profile</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">Institution</Label>
              <Input 
                id="company" 
                {...register("company")} 
                placeholder="Enter your institution"
              />
              {errors.company && (
                <p className="text-sm text-red-500">{errors.company.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="industry">Department</Label>
              <Input 
                id="industry" 
                {...register("industry")} 
                placeholder="Enter your department"
              />
              {errors.industry && (
                <p className="text-sm text-red-500">{errors.industry.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="work_experience">Experience</Label>
            <Textarea 
              id="work_experience" 
              {...register("work_experience")} 
              placeholder="Enter your work experience"
              className="min-h-[100px]"
            />
            {errors.work_experience && (
              <p className="text-sm text-red-500">{errors.work_experience.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expertise_areas">Areas of Expertise</Label>
            <Textarea 
              id="expertise_areas" 
              {...register("expertise_areas")} 
              placeholder="Enter your areas of expertise (comma separated)"
              className="min-h-[100px]"
            />
            {errors.expertise_areas && (
              <p className="text-sm text-red-500">{errors.expertise_areas.message}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="open_for_mentorship" 
              checked={isOpenForMentorship} 
              onCheckedChange={value => setValue("open_for_mentorship", value)}
            />
            <Label htmlFor="open_for_mentorship">Available for Mentorship</Label>
          </div>
          
          {isOpenForMentorship && (
            <div className="space-y-2">
              <Label htmlFor="availability">Mentorship Availability</Label>
              <Textarea 
                id="availability" 
                {...register("availability")} 
                placeholder="Describe your availability for mentorship"
              />
            </div>
          )}
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

export default ProfessorProfileForm;
