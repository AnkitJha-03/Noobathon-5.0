import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Supe } from "@/types/database";
import mockData from "@/data/db.json";

interface SupeFormProps {
  supe?: Supe;
  onSubmit: (data: Partial<Supe>) => void;
  trigger?: React.ReactNode;
}

export function SupeForm({ supe, onSubmit, trigger }: SupeFormProps) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<Supe>>({
    defaultValues: supe || {
      name: "",
      image: "",
      affiliation: "",
      powers: [],
      status: {
        lastLocation: "",
        currentActivity: "",
        timestamp: new Date().toISOString(),
      },
      rating: 0,
      controversies: [],
      achievements: [],
    },
  });

  const handleFormSubmit = (data: Partial<Supe>) => {
    onSubmit({
      ...data,
      powers: typeof data.powers === "string" 
        ? data.powers.split(",").map(p => p.trim())
        : data.powers,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default" className="bg-primary hover:bg-primary/90">
            Add New Supe
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background text-foreground border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {supe ? "Edit Supe" : "Add New Supe"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
          <div>
            <Input
              {...register("name", { required: "Name is required" })}
              placeholder="Name"
              className="bg-background"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Input
              {...register("image", { required: "Image URL is required" })}
              placeholder="Image URL"
              className="bg-background"
            />
            {errors.image && (
              <p className="text-sm text-destructive mt-1">{errors.image.message}</p>
            )}
          </div>
          <div>
            <Input
              {...register("affiliation")}
              placeholder="Affiliation"
              className="bg-background"
            />
          </div>
          <div>
            <Input
              {...register("powers")}
              placeholder="Powers (comma-separated)"
              className="bg-background"
            />
          </div>
          <div>
            <Input
              {...register("status.lastLocation")}
              placeholder="Last Known Location"
              className="bg-background"
            />
          </div>
          <div>
            <Input
              {...register("status.currentActivity")}
              placeholder="Current Activity"
              className="bg-background"
            />
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
            {supe ? "Save Changes" : "Add Supe"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
