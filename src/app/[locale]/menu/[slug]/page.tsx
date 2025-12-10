import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import prisma from "@/lib/db";
import { MenuView } from "@/components/menu/menu-view";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { QrCode } from "lucide-react";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: { name: true, nameAr: true },
  });

  if (!restaurant) {
    return { title: "Menu Not Found" };
  }

  return {
    title: `${restaurant.name} - Menu`,
    description: `View the menu for ${restaurant.name}`,
  };
}

export default async function MenuPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug, isActive: true },
    include: {
      categories: {
        where: { isActive: true },
        orderBy: { order: "asc" },
        include: {
          items: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!restaurant) {
    notFound();
  }

  const displayName =
    locale === "ar" && restaurant.nameAr ? restaurant.nameAr : restaurant.name;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {restaurant.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={restaurant.logo}
                alt={displayName}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <QrCode className="h-8 w-8 text-primary" />
            )}
            <span className="font-bold text-xl">{displayName}</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Menu Content */}
      <main className="container mx-auto px-4 py-6">
        <MenuView restaurant={restaurant} />
      </main>
    </div>
  );
}
