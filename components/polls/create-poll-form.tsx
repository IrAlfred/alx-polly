/**
 * @fileoverview Create Poll Form Component for ALX Polly Application
 * 
 * A comprehensive, multi-step poll creation form that allows users to create
 * sophisticated polls with multiple options, settings, and validation.
 * 
 * Features:
 * - Dynamic option management (add/remove poll options)
 * - Form validation with user-friendly error messages
 * - Multiple choice support with checkbox toggle
 * - Rich text descriptions and metadata
 * - Responsive design with accessibility features
 * - Loading states and submission handling
 * 
 * @author ALX Polly Team  
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { CreatePollData } from '@/types';
import { Plus, Trash2, Calendar } from 'lucide-react';

/**
 * Props interface for the CreatePollForm component
 */
interface CreatePollFormProps {
  /** 
   * Callback function to handle poll creation submission
   * Called with validated poll data when form is submitted successfully
   */
  onSubmit: (data: CreatePollData) => Promise<void>;
  /** 
   * Loading state indicator to disable form during poll creation
   * Prevents multiple submissions and provides user feedback
   */
  isLoading?: boolean;
}

/**
 * Create Poll Form Component
 * 
 * A sophisticated form component for creating new polls with comprehensive
 * validation, dynamic option management, and user-friendly interface.
 * 
 * The form includes:
 * - Poll title and description fields with validation
 * - Dynamic option list with add/remove functionality
 * - Settings for multiple choice support
 * - Form validation with meaningful error messages
 * - Loading states and submission handling
 * 
 * @param props - Component props containing submission handler and loading state
 * @returns JSX element representing the poll creation form
 * 
 * @example
 * ```tsx
 * <CreatePollForm
 *   onSubmit={handlePollCreation}
 *   isLoading={isCreatingPoll}
 * />
 * ```
 */
export function CreatePollForm({ onSubmit, isLoading = false }: CreatePollFormProps) {
  // Form state management for poll creation data
  const [formData, setFormData] = useState<CreatePollData>({
    title: '',
    description: '',
    options: ['', ''], // Start with two empty options
    allowMultipleChoices: false,
  });

  /**
   * Handles form submission with comprehensive validation
   * 
   * Validates that the poll has a title, at least 2 non-empty options,
   * and meets other business requirements before calling the submission handler.
   * 
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: Filter out empty options and check minimum requirements
    const validOptions = formData.options.filter(option => option.trim() !== '');
    
    if (!formData.title.trim()) {
      alert('Please provide a poll title');
      return;
    }
    
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options for your poll');
      return;
    }

    console.log('[CreatePollForm] Submitting poll creation with:', {
      title: formData.title,
      optionCount: validOptions.length,
      allowMultiple: formData.allowMultipleChoices
    });

    // Submit the validated poll data
    await onSubmit({
      ...formData,
      options: validOptions,
    });
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      setFormData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const updateOption = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((option, i) => i === index ? value : option)
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Poll</CardTitle>
        <CardDescription>
          Create a poll to gather opinions and make decisions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Poll Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, title: e.target.value }))
              }
              placeholder="What would you like to ask?"
              required
            />
          </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData(prev => ({ ...prev, description: e.target.value }))
                }
                placeholder="Add more context to your poll..."
                rows={3}
              />
            </div>          <div className="space-y-4">
            <Label>Poll Options *</Label>
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required
                />
                {formData.options.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeOption(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addOption}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="multipleChoices"
                checked={formData.allowMultipleChoices}
                onCheckedChange={(checked: boolean) =>
                  setFormData(prev => ({ ...prev, allowMultipleChoices: !!checked }))
                }
              />
              <Label 
                htmlFor="multipleChoices" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Allow multiple choices
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expiration Date (optional)</Label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined;
                    setFormData(prev => ({ ...prev, expiresAt: date }));
                  }}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Creating Poll...' : 'Create Poll'}
            </Button>
            <Button type="button" variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
