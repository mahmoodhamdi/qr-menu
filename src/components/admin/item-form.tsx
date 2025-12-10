"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Upload } from "lucide-react";

type Category = {
  id: string;
  name: string;
  nameAr: string | null;
};

type Item = {
  id: string;
  name: string;
  nameAr: string | null;
  description: string | null;
  descriptionAr: string | null;
  price: number;
  image: string | null;
  isAvailable: boolean;
  categoryId: string;
};

type Props = {
  item: Item | null;
  categories: Category[];
  onSave: () => void;
  onCancel: () => void;
};

export function ItemForm({ item, categories, onSave, onCancel }: Props) {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: item?.name || "",
    nameAr: item?.nameAr || "",
    description: item?.description || "",
    descriptionAr: item?.descriptionAr || "",
    price: item?.price?.toString() || "",
    categoryId: item?.categoryId || categories[0]?.id || "",
    isAvailable: item?.isAvailable ?? true,
    image: item?.image || "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });
      const data = await res.json();
      if (data.success) {
        setFormData({ ...formData, image: data.url });
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = item ? `/api/items/${item.id}` : "/api/items";
      const method = item ? "PATCH" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      onSave();
    } catch (error) {
      console.error("Error saving item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{t("items.itemName")}</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nameAr">{t("items.itemNameAr")}</Label>
          <Input
            id="nameAr"
            value={formData.nameAr}
            onChange={(e) =>
              setFormData({ ...formData, nameAr: e.target.value })
            }
            dir="rtl"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="description">{t("items.description")}</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="descriptionAr">{t("items.descriptionAr")}</Label>
          <Textarea
            id="descriptionAr"
            value={formData.descriptionAr}
            onChange={(e) =>
              setFormData({ ...formData, descriptionAr: e.target.value })
            }
            rows={3}
            dir="rtl"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">{t("items.price")}</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">{t("items.category")}</Label>
          <select
            id="category"
            value={formData.categoryId}
            onChange={(e) =>
              setFormData({ ...formData, categoryId: e.target.value })
            }
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            required
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("items.image")}</Label>
        <div className="flex items-center gap-4">
          {formData.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={formData.image}
              alt="Preview"
              className="h-20 w-20 object-cover rounded"
            />
          )}
          <label className="cursor-pointer">
            <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent">
              <Upload className="h-4 w-4" />
              {t("items.uploadImage")}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={formData.isAvailable}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, isAvailable: checked })
          }
        />
        <Label>{t("items.isAvailable")}</Label>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("common.loading") : t("common.save")}
        </Button>
      </div>
    </form>
  );
}
