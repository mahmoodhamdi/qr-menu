import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create demo restaurant
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: "demo-restaurant" },
    update: {},
    create: {
      name: "Demo Restaurant",
      nameAr: "مطعم تجريبي",
      slug: "demo-restaurant",
      currency: "SAR",
      isActive: true,
    },
  });

  console.log(`Created restaurant: ${restaurant.name}`);

  // Create categories
  const categories = [
    { name: "Appetizers", nameAr: "المقبلات", order: 1 },
    { name: "Main Dishes", nameAr: "الأطباق الرئيسية", order: 2 },
    { name: "Drinks", nameAr: "المشروبات", order: 3 },
    { name: "Desserts", nameAr: "الحلويات", order: 4 },
  ];

  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: {
        id: `${restaurant.id}-${cat.name.toLowerCase().replace(" ", "-")}`,
      },
      update: {},
      create: {
        id: `${restaurant.id}-${cat.name.toLowerCase().replace(" ", "-")}`,
        restaurantId: restaurant.id,
        name: cat.name,
        nameAr: cat.nameAr,
        order: cat.order,
        isActive: true,
      },
    });
    console.log(`Created category: ${category.name}`);
  }

  // Create sample items
  const appetizersCategory = await prisma.category.findFirst({
    where: { restaurantId: restaurant.id, name: "Appetizers" },
  });

  const mainCategory = await prisma.category.findFirst({
    where: { restaurantId: restaurant.id, name: "Main Dishes" },
  });

  const drinksCategory = await prisma.category.findFirst({
    where: { restaurantId: restaurant.id, name: "Drinks" },
  });

  const dessertsCategory = await prisma.category.findFirst({
    where: { restaurantId: restaurant.id, name: "Desserts" },
  });

  if (appetizersCategory) {
    await prisma.item.upsert({
      where: { id: "item-hummus" },
      update: {},
      create: {
        id: "item-hummus",
        categoryId: appetizersCategory.id,
        name: "Hummus",
        nameAr: "حمص",
        description: "Creamy chickpea dip with olive oil and spices",
        descriptionAr: "غمس الحمص الكريمي مع زيت الزيتون والتوابل",
        price: 25,
        isAvailable: true,
        order: 1,
      },
    });

    await prisma.item.upsert({
      where: { id: "item-falafel" },
      update: {},
      create: {
        id: "item-falafel",
        categoryId: appetizersCategory.id,
        name: "Falafel",
        nameAr: "فلافل",
        description: "Crispy chickpea fritters served with tahini",
        descriptionAr: "فطائر الحمص المقرمشة مع الطحينة",
        price: 30,
        isAvailable: true,
        order: 2,
      },
    });
  }

  if (mainCategory) {
    await prisma.item.upsert({
      where: { id: "item-shawarma" },
      update: {},
      create: {
        id: "item-shawarma",
        categoryId: mainCategory.id,
        name: "Chicken Shawarma",
        nameAr: "شاورما دجاج",
        description: "Marinated chicken wrapped in fresh bread",
        descriptionAr: "دجاج متبل ملفوف بالخبز الطازج",
        price: 45,
        isAvailable: true,
        order: 1,
      },
    });

    await prisma.item.upsert({
      where: { id: "item-kabsa" },
      update: {},
      create: {
        id: "item-kabsa",
        categoryId: mainCategory.id,
        name: "Kabsa",
        nameAr: "كبسة",
        description: "Traditional Saudi rice dish with chicken",
        descriptionAr: "طبق الأرز السعودي التقليدي مع الدجاج",
        price: 65,
        isAvailable: true,
        order: 2,
      },
    });
  }

  if (drinksCategory) {
    await prisma.item.upsert({
      where: { id: "item-tea" },
      update: {},
      create: {
        id: "item-tea",
        categoryId: drinksCategory.id,
        name: "Arabic Tea",
        nameAr: "شاي عربي",
        description: "Traditional tea with mint",
        descriptionAr: "شاي تقليدي بالنعناع",
        price: 10,
        isAvailable: true,
        order: 1,
      },
    });

    await prisma.item.upsert({
      where: { id: "item-coffee" },
      update: {},
      create: {
        id: "item-coffee",
        categoryId: drinksCategory.id,
        name: "Arabic Coffee",
        nameAr: "قهوة عربية",
        description: "Traditional Arabic coffee with cardamom",
        descriptionAr: "قهوة عربية تقليدية بالهيل",
        price: 15,
        isAvailable: true,
        order: 2,
      },
    });
  }

  if (dessertsCategory) {
    await prisma.item.upsert({
      where: { id: "item-kunafa" },
      update: {},
      create: {
        id: "item-kunafa",
        categoryId: dessertsCategory.id,
        name: "Kunafa",
        nameAr: "كنافة",
        description: "Sweet cheese pastry with sugar syrup",
        descriptionAr: "حلوى الجبن مع شراب السكر",
        price: 35,
        isAvailable: true,
        order: 1,
      },
    });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
