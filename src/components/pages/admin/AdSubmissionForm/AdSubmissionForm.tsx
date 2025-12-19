"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { createAdSubmission } from "@/lib/actions/ad-submissions";
import { type AdSubmissionInput } from "@/lib/schemas/ad-submission";
import { toast } from "sonner";
import { Loader2, Megaphone, ArrowLeft, CheckCircle } from "lucide-react";

const AdSubmissionForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<{
    adName: string;
    adDescription: string;
    maximumIssuance: string;
    accessibleFrom: string;
    accessibleUntil: string;
    contactEmail: string;
    contactPersonName: string;
  }>({
    adName: "",
    adDescription: "",
    maximumIssuance: "",
    accessibleFrom: "",
    accessibleUntil: "",
    contactEmail: "",
    contactPersonName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData({
      adName: "",
      adDescription: "",
      maximumIssuance: "",
      accessibleFrom: "",
      accessibleUntil: "",
      contactEmail: "",
      contactPersonName: "",
    });
    setIsSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submissionData: AdSubmissionInput = {
        adName: formData.adName,
        adDescription: formData.adDescription,
        maximumIssuance: parseInt(formData.maximumIssuance, 10),
        accessibleFrom: new Date(formData.accessibleFrom),
        accessibleUntil: new Date(formData.accessibleUntil),
        contactEmail: formData.contactEmail,
        contactPersonName: formData.contactPersonName,
      };

      const result = await createAdSubmission(submissionData);

      if (result.success) {
        toast.success("Ad submission created successfully!");
        setIsSuccess(true);
      } else {
        toast.error(typeof result.error === "string" ? result.error : "Failed to create ad submission");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="max-w-3xl mx-auto border-2 border-green-500/20 shadow-lg">
        <CardContent className="pt-8 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/50 flex items-center justify-center mx-auto">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">
              Submission Received!
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your ad campaign has been submitted for review. Our team will review it and get back to you shortly.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={resetForm} variant="outline">
              Submit Another
            </Button>
            <Link href="/" className="cursor-pointer">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
            <Megaphone className="h-5 w-5 text-white" />
          </div>
          <Badge variant="secondary">
            Advertiser Portal
          </Badge>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Submit Your Ad Campaign
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Reach verified Web3 users through DAT Network&apos;s credential-based targeting system
        </p>
      </div>

      <div className="flex justify-start">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <Card className="border-2 border-amber-500/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Campaign Details</CardTitle>
          <CardDescription>
            Fill out the form below to submit your advertising campaign for review
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ad Name */}
            <div className="space-y-2">
              <Label htmlFor="adName">Campaign Name *</Label>
              <Input
                id="adName"
                name="adName"
                placeholder="Enter your ad campaign name"
                value={formData.adName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Ad Description */}
            <div className="space-y-2">
              <Label htmlFor="adDescription">Campaign Description *</Label>
              <Textarea
                id="adDescription"
                name="adDescription"
                placeholder="Describe your ad campaign, target audience, and goals..."
                value={formData.adDescription}
                onChange={handleChange}
                rows={5}
                required
              />
            </div>

            <Separator />

            {/* Maximum Issuance Amount */}
            <div className="space-y-2">
              <Label htmlFor="maximumIssuance">Maximum Slots *</Label>
              <Input
                id="maximumIssuance"
                name="maximumIssuance"
                type="number"
                min="1"
                placeholder="e.g., 500"
                value={formData.maximumIssuance}
                onChange={handleChange}
                required
              />
              <p className="text-sm text-muted-foreground">
                Maximum number of verified users who can access this campaign
              </p>
            </div>

            {/* Accessible Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accessibleFrom">Campaign Start *</Label>
                <Input
                  id="accessibleFrom"
                  name="accessibleFrom"
                  type="datetime-local"
                  value={formData.accessibleFrom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accessibleUntil">Campaign End *</Label>
                <Input
                  id="accessibleUntil"
                  name="accessibleUntil"
                  type="datetime-local"
                  value={formData.accessibleUntil}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPersonName">Contact Person *</Label>
                  <Input
                    id="contactPersonName"
                    name="contactPersonName"
                    placeholder="John Doe"
                    value={formData.contactPersonName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    placeholder="contact@company.com"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-500/20">
              <p className="text-sm text-muted-foreground">
                <strong>What happens next:</strong> Our team will review your submission within 24-48 hours. 
                Once approved, your campaign will be activated and visible to verified users who meet your targeting criteria.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isSubmitting}
              >
                Reset Form
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Campaign"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdSubmissionForm;