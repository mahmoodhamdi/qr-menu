"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

type Item = {
  id: string;
  name: string;
  nameAr: string | null;
  description: string | null;
  descriptionAr: string | null;
  price: number;
  image: string | null;
  isAvailable: boolean;
};

type Props = {
  item: Item;
  currency: string;
  locale: string;
};

export function ItemCard({ item, currency, locale }: Props) {
  const t = useTranslations();

  const name = locale === "ar" && item.nameAr ? item.nameAr : item.name;
  const description =
    locale === "ar" && item.descriptionAr
      ? item.descriptionAr
      : item.description;

  return (
    <Card className={`overflow-hidden ${!item.isAvailable ? "opacity-60" : ""}`}>
      {item.image && (
        <div className="relative h-48 w-full">
          <Image
            src={item.image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-medium px-3 py-1 bg-red-500 rounded">
                {t("menu.unavailable")}
              </span>
            </div>
          )}
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <h3 className="font-semibold">{name}</h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {description}
              </p>
            )}
          </div>
          <span className="font-bold text-primary shrink-0">
            {formatPrice(item.price, currency)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
