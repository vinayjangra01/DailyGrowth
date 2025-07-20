import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X, Check } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertImprovement } from "@shared/schema";

interface AddImprovementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillData?: {
    note: string;
    category: string;
  };
}

const categories = [
  { value: "fitness", label: "Fitness" },
  { value: "learning", label: "Learning" },
  { value: "mindset", label: "Mindset" },
  { value: "health", label: "Health" },
  { value: "skills", label: "Skills" },
  { value: "relationships", label: "Relationships" },
  { value: "other", label: "Other" },
];

export default function AddImprovementModal({ 
  open, 
  onOpenChange, 
  prefillData 
}: AddImprovementModalProps) {
  const [note, setNote] = useState(prefillData?.note || "");
  const [category, setCategory] = useState(prefillData?.category || "");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: Omit<InsertImprovement, 'userId'>) => {
      const response = await apiRequest("POST", "/api/improvements", data);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/improvements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      
      toast({
        title: "Success!",
        description: "Your improvement has been logged successfully.",
      });
      
      // Reset form and close modal
      setNote("");
      setCategory("");
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to log improvement. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!note.trim() || !category) {
      toast({
        title: "Missing information",
        description: "Please fill in both the improvement note and category.",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate({
      note: note.trim(),
      category,
    });
  };

  // Update form when prefillData changes
  useEffect(() => {
    if (prefillData) {
      setNote(prefillData.note);
      setCategory(prefillData.category);
    }
  }, [prefillData]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md mx-4 rounded-t-3xl sm:rounded-lg animate-slide-up">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Log Your 1% Today</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="note" className="text-sm font-medium">
              What did you improve today?
            </Label>
            <Textarea
              id="note"
              placeholder="e.g., Read 5 extra pages, did 10 push-ups..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-2 min-h-[80px] resize-none"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {note.length}/500 characters
            </div>
          </div>
          
          <div>
            <Label htmlFor="category" className="text-sm font-medium">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            type="submit" 
            className="w-full primary-gradient text-white hover:opacity-90 transition-opacity"
            disabled={createMutation.isPending}
          >
            <Check className="w-4 h-4 mr-2" />
            {createMutation.isPending ? "Logging..." : "Log Improvement"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
