
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { updateStudentProfile } from "@/services/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const studentFormSchema = z.object({
  university: z.string().min(1, "University is required"),
  degree: z.string().min(1, "Degree is required"),
  graduation_year: z.string().refine(val => !isNaN(parseInt(val)), {
    message: "Graduation year must be a number"
  }),
  skills: z.string().min(1, "Skills are required"),
  linkedin: z.string().optional(),
  portfolio: z.string().optional()
});

const StudentProfileForm = () => {
  const { user, updateCurrentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const userProfile = user?.profile || {};
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      university: userProfile.university || "",
      degree: userProfile.degree || "",
      graduation_year: userProfile.graduation_year?.toString() || "",
      skills: userProfile.skills || "",
      linkedin: userProfile.linkedin || "",
      portfolio: userProfile.portfolio || ""
    }
  });
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Parse graduation_year to number
      const formattedData = {
        ...data,
        graduation_year: parseInt(data.graduation_year)
      };
      
      await updateStudentProfile(formattedData);
      
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
        <CardTitle>Student Profile</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="university">University</Label>
              <Input 
                id="university" 
                {...register("university")} 
                placeholder="Enter your university"
              />
              {errors.university && (
                <p className="text-sm text-red-500">{errors.university.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="degree">Degree</Label>
              <Input 
                id="degree" 
                {...register("degree")} 
                placeholder="Enter your degree"
              />
              {errors.degree && (
                <p className="text-sm text-red-500">{errors.degree.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="graduation_year">Graduation Year</Label>
            <Input 
              id="graduation_year" 
              {...register("graduation_year")} 
              placeholder="Enter your graduation year"
            />
            {errors.graduation_year && (
              <p className="text-sm text-red-500">{errors.graduation_year.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <Textarea 
              id="skills" 
              {...register("skills")} 
              placeholder="Enter your skills (comma separated)"
              className="min-h-[100px]"
            />
            {errors.skills && (
              <p className="text-sm text-red-500">{errors.skills.message}</p>
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

export default StudentProfileForm;
