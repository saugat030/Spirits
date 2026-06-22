import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { Product } from "@/types/api.types";

interface ProductFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct: Product | null;
  categories: any[];
  onSubmit: (formData: FormData) => void;
  isSubmitting: boolean;
}

export default function ProductFormDialog({
  isOpen,
  onOpenChange,
  editingProduct,
  categories,
  onSubmit,
  isSubmitting,
}: ProductFormDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);

  // Sync state when dialog opens or editingProduct changes
  useEffect(() => {
    if (isOpen) {
      if (editingProduct) {
        setName(editingProduct.name);
        setDescription(editingProduct.description || "");
        setCategoryId(editingProduct.categoryId);
      } else {
        setName("");
        setDescription("");
        setCategoryId("");
      }
      setThumbnailFile(null);
      setImageFiles(null);
    }
  }, [isOpen, editingProduct]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !categoryId) {
      toast.error("Name and Category are required");
      return;
    }

    if (!editingProduct && !thumbnailFile) {
      toast.error("A thumbnail image is required for new products");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("categoryId", categoryId);
    if (description) formData.append("description", description);

    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    if (imageFiles && imageFiles.length > 0) {
      Array.from(imageFiles).forEach((file) => {
        formData.append("images", file);
      });
    }

    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden rounded-2xl shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 bg-white">
          <DialogTitle className="text-2xl font-bold text-slate-800 tracking-tight">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription className="text-slate-500 mt-1">
            {editingProduct
              ? "Update the details for this product below."
              : "Fill in the details below to add a new product to your catalog."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col max-h-[80vh]">
          <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar bg-slate-50/50">
            {editingProduct && (
              <div className="bg-blue-50/80 border border-blue-100 text-blue-800 p-4 rounded-xl text-sm flex gap-3 items-start shadow-sm">
                <AlertCircle
                  size={20}
                  className="flex-shrink-0 mt-0.5 text-blue-500"
                />
                <p className="leading-relaxed">
                  Uploading new images will completely replace the existing
                  gallery. Leave the file inputs empty to keep your current
                  images.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name" className="text-slate-700 font-medium">
                  Product Name *
                </Label>
                <Input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jack Daniel's Old No. 7"
                  className="h-11 rounded-lg"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="category"
                  className="text-slate-700 font-medium"
                >
                  Category *
                </Label>
                <Select
                  required
                  value={categoryId}
                  onValueChange={(value) => setCategoryId(value || "")}
                >
                  <SelectTrigger className="h-11 rounded-lg bg-white">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.category_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="description"
                  className="text-slate-700 font-medium"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product details and tasting notes..."
                  className="resize-none rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">
                  Thumbnail Image {editingProduct ? "(Optional)" : "*"}
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setThumbnailFile(e.target.files?.[0] || null)
                  }
                  className="h-11 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 cursor-pointer pt-2"
                />
                {editingProduct &&
                  !thumbnailFile &&
                  editingProduct.thumbnail_url && (
                    <p className="text-xs text-slate-500 mt-1.5 font-medium">
                      Current thumbnail will be kept.
                    </p>
                  )}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">
                  Gallery Images (Multiple)
                </Label>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImageFiles(e.target.files)}
                  className="h-11 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 cursor-pointer pt-2"
                />
                {imageFiles && imageFiles.length > 0 && (
                  <p className="text-xs text-orange-600 mt-1.5 font-medium">
                    {imageFiles.length} file(s) selected.
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 border-t border-slate-100 bg-white gap-3 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 px-6 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-8 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-colors"
            >
              {isSubmitting ? (
                <ClipLoader color="#ffffff" size={20} />
              ) : editingProduct ? (
                "Save Changes"
              ) : (
                "Create Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
