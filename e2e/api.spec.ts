import { test, expect } from "@playwright/test";

test.describe("API Endpoints", () => {
  test("GET /api/health returns healthy status", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.status).toBe("healthy");
  });

  test("GET /api/restaurants returns restaurants list", async ({ request }) => {
    const response = await request.get("/api/restaurants");
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  test("GET /api/restaurants/demo-restaurant returns restaurant with menu", async ({
    request,
  }) => {
    const response = await request.get("/api/restaurants/demo-restaurant");
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.slug).toBe("demo-restaurant");
    expect(Array.isArray(data.data.categories)).toBe(true);
  });

  test("GET /api/restaurants/non-existent returns 404", async ({ request }) => {
    const response = await request.get("/api/restaurants/non-existent");
    expect(response.status()).toBe(404);

    const data = await response.json();
    expect(data.success).toBe(false);
  });

  test("GET /api/categories returns categories list", async ({ request }) => {
    const response = await request.get("/api/categories");
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  test("GET /api/items returns items list", async ({ request }) => {
    const response = await request.get("/api/items");
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  test("POST /api/categories creates new category", async ({ request }) => {
    // First get a restaurant ID
    const restaurantsRes = await request.get("/api/restaurants");
    const restaurantsData = await restaurantsRes.json();
    const restaurantId = restaurantsData.data[0]?.id;

    if (!restaurantId) {
      test.skip();
      return;
    }

    const response = await request.post("/api/categories", {
      data: {
        restaurantId,
        name: "Test Category",
        nameAr: "فئة اختبار",
      },
    });

    expect(response.status()).toBe(201);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.name).toBe("Test Category");

    // Cleanup: delete the created category
    await request.delete(`/api/categories/${data.data.id}`);
  });

  test("POST /api/items requires categoryId, name, and price", async ({
    request,
  }) => {
    const response = await request.post("/api/items", {
      data: { name: "Test Item" },
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data.success).toBe(false);
  });
});
