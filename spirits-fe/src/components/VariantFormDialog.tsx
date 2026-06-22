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
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { ProductVariant } from "@/types/api.types";

interface VariantFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingVariant: ProductVariant | null;
  onSubmit: (formData: FormData) => void;
  isSubmitting: boolean;
}

export default function VariantFormDialog({
  isOpen,
  onOpenChange,
  editingVariant,
  onSubmit,
  isSubmitting,
}: VariantFormDialogProps) {
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [inventoryQuantity, setInventoryQuantity] = useState("");
  const [variantImageFile, setVariantImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (editingVariant) {
        setSize(editingVariant.size);
        setPrice(editingVariant.price.toString());
        setInventoryQuantity(editingVariant.inventoryQuantity.toString());
      } else {
        setSize("");
        setPrice("");
        setInventoryQuantity("");
      }
      setVariantImageFile(null);
    }
  }, [isOpen, editingVariant]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!size || !price || !inventoryQuantity) {
      toast.error("Size, price, and inventory quantity are required");
      return;
    }

    const formData = new FormData();
    formData.append("size", size);
    formData.append("price", price);
    formData.append("inventoryQuantity", inventoryQuantity);

    if (variantImageFile) {
      formData.append("variantImage", variantImageFile);
    }

    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl shadow-2xl gap-0">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 bg-white">
          <DialogTitle className="text-2xl font-bold text-slate-800 tracking-tight font-poppins">
            {editingVariant ? "Edit Variant" : "Add New Variant"}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            {editingVariant
              ? "Update the details for this variant below."
              : "Fill in the details below to add a new variant."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col max-h-[80vh]">
          <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar">
            {editingVariant && (
              <div className="bg-blue-50/80 border border-blue-100 text-blue-800 p-4 rounded-xl text-sm flex gap-3 items-start shadow-sm">
                <AlertCircle size={20} className="shrink-0 mt-0.5 text-blue-500" />
                <p className="leading-relaxed">
                  Uploading a new image will replace the existing one. Leave the
                  file input empty to keep the current image.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="size" className="text-slate-700 font-medium">
                Size *
              </Label>
              <Input
                id="size"
                required
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g. 750ml"
                className="h-11 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-slate-700 font-medium">
                  Price *
                </Label>
                <Input
                  id="price"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="h-11 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inventory" className="text-slate-700 font-medium">
                  Inventory *
                </Label>
                <Input
                  id="inventory"
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={inventoryQuantity}
                  onChange={(e) => setInventoryQuantity(e.target.value)}
                  placeholder="Quantity"
                  className="h-11 rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">
                Variant Image {editingVariant ? "(Optional)" : ""}
              </Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setVariantImageFile(e.target.files?.[0] || null)}
                className="h-11 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 cursor-pointer pt-2"
              />
              {editingVariant && !variantImageFile && editingVariant.variantImage && (
                <p className="text-xs text-slate-500 mt-1.5 font-medium">
                  Current variant image will be kept.
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="p-6 border-t border-slate-100 bg-white gap-3 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
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
              ) : editingVariant ? (
                "Save Changes"
              ) : (
                "Create Variant"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
