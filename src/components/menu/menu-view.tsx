"use client";

import { useState, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ItemCard } from "./item-card";

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

type Category = {
  id: string;
  name: string;
  nameAr: string | null;
  items: Item[];
};

type Restaurant = {
  name: string;
  nameAr: string | null;
  currency: string;
  categories: Category[];
};

type Props = {
  restaurant: Restaurant;
};

export function MenuView({ restaurant }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const getName = (name: string, nameAr: string | null) => {
    return locale === "ar" && nameAr ? nameAr : name;
  };

  const filteredCategories = useMemo(() => {
    return restaurant.categories.map((category) => ({
      ...category,
      items: category.items.filter((item) => {
        if (!search) return true;
        const searchLower = search.toLowerCase();
        return (
          item.name.toLowerCase().includes(searchLower) ||
          item.nameAr?.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.descriptionAr?.toLowerCase().includes(searchLower)
        );
      }),
    }));
  }, [restaurant.categories, search]);

  const allItems = filteredCategories.flatMap((cat) => cat.items);

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t("menu.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
          <TabsTrigger value="all" className="shrink-0">
            {t("menu.allCategories")}
          </TabsTrigger>
          {restaurant.categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="shrink-0"
            >
              {getName(category.name, category.nameAr)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {allItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {t("menu.noItems")}
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  currency={restaurant.currency}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {restaurant.categories.map((category) => {
          const categoryItems = filteredCategories.find(
            (c) => c.id === category.id
          )?.items;

          return (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              {!categoryItems || categoryItems.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  {t("menu.noItems")}
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      currency={restaurant.currency}
                      locale={locale}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
