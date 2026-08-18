# Kalharam Backend API Documentation

Welcome to the **Kalharam REST API Documentation**. This guide provides an exhaustive list of all 21 API endpoints provided by the backend service (`backend/server.js`).

Every endpoint includes a beginner-friendly explanation, the exact `curl` command to test it from your terminal, and the expected JSON response.

---

## Quickstart Guide

### 1. Base URL
When running locally, the API server operates at:
```
http://localhost:3000
```

### 2. How to Start the Server
Before running any `curl` tests, start the backend server:
```bash
cd backend
npm run dev
```
You should see:
```
Backend server running on http://localhost:3000
```

---

## Summary Table of Endpoints

| # | Method | Endpoint Path | Access Level | Description |
|---|--------|---------------|--------------|-------------|
| 1 | `GET` | `/api/tiles` | Public | List homepage category layout tiles |
| 2 | `GET` | `/api/categories` | Public | List all public product categories |
| 3 | `GET` | `/api/products` | Public | Search/filter products by category, tile, search query, or limit |
| 4 | `GET` | `/api/products/:id` | Public | Get single product details + photo gallery |
| 5 | `POST` | `/api/orders` | Public | Submit customer order & deduct stock |
| 6 | `POST` | `/api/auth/login` | Public | Customer shopper login (mock) |
| 7 | `POST` | `/api/auth/signup` | Public | Customer shopper registration (mock) |
| 8 | `GET` | `/api/admin/orders` | Admin | List all orders for fulfillment console |
| 9 | `PUT` | `/api/admin/orders/:id/status` | Admin | Update order status (new/processing/shipped/delivered/cancelled) |
| 10 | `GET` | `/api/admin/products` | Admin | List all catalog products with inventory stock levels |
| 11 | `POST` | `/api/admin/products` | Admin | Create a new product listing |
| 12 | `PUT` | `/api/admin/products/:id` | Admin | Update existing product details or stock |
| 13 | `GET` | `/api/admin/tiles` | Admin | List all 18 layout tile configurations |
| 14 | `PUT` | `/api/admin/tiles/:id` | Admin | Update layout tile title, assigned categories, or image |
| 15 | `GET` | `/api/admin/images` | Admin | List all uploaded image records |
| 16 | `POST` | `/api/admin/images/upload` | Admin | Upload photo binary (auto-creates WebP high-res & thumb) |
| 17 | `DELETE` | `/api/admin/images/:uid` | Admin | Delete an unassigned image from database and disk storage |
| 18 | `GET` | `/api/admin/raw-categories` | Admin | Get raw category list for admin dropdowns |
| 19 | `POST` | `/api/admin/categories` | Admin | Create a new category |
| 20 | `PUT` | `/api/admin/categories/:id` | Admin | Update category name or cover image |
| 21 | `DELETE` | `/api/admin/categories/:id` | Admin | Delete an empty category |

---

## Exhaustive Endpoint Reference

### Public Storefront Endpoints (`web/`)

#### 1. `GET /api/tiles`
- **Purpose**: Fetch dynamic homepage layout tiles.
- **`curl` Command**:
  ```bash
  curl -s http://localhost:3000/api/tiles
  ```
- **Expected Response ($200\text{ OK}$)**:
  ```json
  [
    {
      "id": "1",
      "name": "Mul Cotton",
      "image": "/assets/uploads/mul/example-thumb.webp",
      "categoryIds": ["mul"]
    }
  ]
  ```

---

#### 2. `GET /api/categories`
- **Purpose**: Fetch public categories for navigation and catalog headers.
- **`curl` Command**:
  ```bash
  curl -s http://localhost:3000/api/categories
  ```
- **Expected Response ($200\text{ OK}$)**:
  ```json
  [
    {
      "id": "mul",
      "name": "Mul",
      "image": "/assets/uploads/mul/example-thumb.webp"
    }
  ]
  ```

---

#### 3. `GET /api/products`
- **Purpose**: Retrieve product catalog items with optional filtering.
- **Query Parameters**:
  - `categoryId` (optional): Filter by category ID (e.g. `mul`).
  - `tileId` (optional): Filter by layout tile ID.
  - `q` (optional): Search term matching title or description.
  - `limit` (optional): Maximum items to return.
- **`curl` Command**:
  ```bash
  curl -s "http://localhost:3000/api/products?categoryId=mul&limit=5"
  ```
- **Expected Response ($200\text{ OK}$)**:
  ```json
  [
    {
      "id": "mul-prod-1786286910224",
      "title": "M1",
      "subtitle": "Mul Saree",
      "details": "Handloom Cotton Saree",
      "categoryId": "mul",
      "color": "Green",
      "rating": 4.5,
      "mrp": 999,
      "salePrice": 699,
      "stock": 10,
      "image": "/assets/uploads/mul/mul-prod-1786286910224/example-thumb.webp"
    }
  ]
  ```

---

#### 4. `GET /api/products/:id`
- **Purpose**: Get complete product details and full multi-photo gallery.
- **`curl` Command**:
  ```bash
  curl -s http://localhost:3000/api/products/mul-prod-1786286910224
  ```
- **Expected Response ($200\text{ OK}$)**:
  ```json
  {
    "id": "mul-prod-1786286910224",
    "title": "M1",
    "subtitle": "Mul Saree",
    "details": "Handloom Cotton Saree",
    "categoryId": "mul",
    "color": "Green",
    "rating": 4.5,
    "mrp": 999,
    "salePrice": 699,
    "stock": 10,
    "image": "/assets/uploads/mul/mul-prod-1786286910224/example-thumb.webp",
    "highResImage": "/assets/uploads/mul/mul-prod-1786286910224/example.webp",
    "gallery": [
      {
        "url": "/assets/uploads/mul/mul-prod-1786286910224/listing/img_sample.webp",
        "thumb_url": "/assets/uploads/mul/mul-prod-1786286910224/listing/img_sample-thumb.webp",
        "alt": "Photo 1"
      }
    ]
  }
  ```

---

#### 5. `POST /api/orders`
- **Purpose**: Submit a new customer order and automatically deduct stock in an atomic SQLite transaction.
- **Request Body**:
  ```json
  {
    "customerName": "Lakshmi Narayanan",
    "email": "lakshmi@example.com",
    "phone": "+919876543210",
    "address": "12 Temple Road",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "pin": "600004",
    "total": 699,
    "items": [
      { "id": "mul-prod-1786286910224", "title": "M1", "price": 699, "quantity": 1 }
    ]
  }
  ```
- **`curl` Command**:
  ```bash
  curl -s -X POST http://localhost:3000/api/orders \
    -H "Content-Type: application/json" \
    -d '{
      "customerName": "Lakshmi Narayanan",
      "email": "lakshmi@example.com",
      "phone": "+919876543210",
      "address": "12 Temple Road",
      "city": "Chennai",
      "state": "Tamil Nadu",
      "pin": "600004",
      "total": 699,
      "items": [
        {"id": "mul-prod-1786286910224", "title": "M1", "price": 699, "quantity": 1}
      ]
    }'
  ```
- **Expected Response ($200\text{ OK}$)**:
  ```json
  {
    "id": 1,
    "message": "Order created successfully"
  }
  ```

---

#### 6. `POST /api/auth/login`
- **Purpose**: Customer shopper login authentication.
- **`curl` Command**:
  ```bash
  curl -s -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "shopper@example.com", "password": "password123"}'
  ```
- **Expected Response ($200\text{ OK}$)**:
  ```json
  {
    "token": "mock-jwt-token",
    "message": "Logged in successfully"
  }
  ```

---

#### 7. `POST /api/auth/signup`
- **Purpose**: Register a new customer account.
- **`curl` Command**:
  ```bash
  curl -s -X POST http://localhost:3000/api/auth/signup \
    -H "Content-Type: application/json" \
    -d '{"name": "Lakshmi", "email": "lakshmi@example.com", "password": "password123"}'
  ```
- **Expected Response ($200\text{ OK}$)**:
  ```json
  {
    "token": "mock-jwt-token",
    "message": "Account created successfully"
  }
  ```

---

### Admin Operations Endpoints (`app/`)

#### 8. `GET /api/admin/orders`
- **Purpose**: List all orders for the admin fulfillment console.
- **`curl` Command**:
  ```bash
  curl -s http://localhost:3000/api/admin/orders
  ```
- **Expected Response ($200\text{ OK}$)**:
  ```json
  [
    {
      "id": "1-0",
      "orderId": 1,
      "customer": "Lakshmi Narayanan",
      "email": "lakshmi@example.com",
      "phone": "+919876543210",
      "address": "12 Temple Road",
      "city": "Chennai",
      "state": "Tamil Nadu",
      "pin": "600004",
      "item": "M1",
      "productId": "mul-prod-1786286910224",
      "qty": 1,
      "total": 699,
      "status": "new",
      "time": "2026-08-10 12:00:00"
    }
  ]
  ```

---

#### 9. `PUT /api/admin/orders/:id/status`
- **Purpose**: Advance order status (`new` $\to$ `processing` $\to$ `shipped` $\to$ `delivered` or `cancelled`). Automatically refunds stock if cancelled.
- **`curl` Command**:
  ```bash
  curl -s -X PUT http://localhost:3000/api/admin/orders/1/status \
    -H "Content-Type: application/json" \
    -d '{"status": "processing"}'
  ```
- **Expected Response ($200\text{ OK}$)**:
  ```json
  {
    "message": "Order status updated"
  }
  ```

---

#### 10. `GET /api/admin/products`
- **Purpose**: Retrieve all catalog products with inventory stock levels for management.
- **`curl` Command**:
  ```bash
  curl -s http://localhost:3000/api/admin/products
  ```
- **Expected Response ($200\text{ OK}$)**:
  ```json
  [
    {
      "id": "mul-prod-1786286910224",
      "name": "M1",
      "category": "mul",
      "details": "Handloom Cotton",
      "color": "Green",
      "price": 699,
      "offerPrice": 999,
      "stock": 10,
      "sold": 0,
      "demand": 0,
      "deadStockDays": null,
      "imageId": "img_sample",
      "image": "/assets/uploads/mul/mul-prod-1786286910224/example-thumb.webp",
      "images": ["img_sample"]
    }
  ]
  ```

---

#### 11. `POST /api/admin/products`
- **Purpose**: Publish a new product item.
- **`curl` Command**:
  ```bash
  curl -s -X POST http://localhost:3000/api/admin/products \
    -H "Content-Type: application/json" \
    -d '{
      "id": "mul-prod-999",
      "title": "Kanchi Silk Saree",
      "subtitle": "Traditional Golden Zari",
      "categoryId": "kanchi",
      "color": "Red",
      "stock": 10,
      "mrp": 2500,
      "salePrice": 1900,
      "imageId": "img_sample"
    }'
  ```
- **Expected Response ($200\text{ OK}$)**:
  ```json
  {
    "message": "Product created successfully"
  }
  ```

---

#### 12. `PUT /api/admin/products/:id`
- **Purpose**: Update product metadata, price, or stock levels.
- **`curl` Command**:
  ```bash
  curl -s -X PUT http://localhost:3000/api/admin/products/mul-prod-999 \
    -H "Content-Type: application/json" \
    -d '{"stock": 25, "salePrice": 1850}'
  ```
- **Expected Response ($200\text{ OK}$)**:
  ```json
  {
    "message": "Product updated successfully"
  }
  ```

---

#### 13. `GET /api/admin/tiles`
- **Purpose**: Retrieve all 18 layout tile slot configurations.
- **`curl` Command**:
  ```bash
  curl -s http://localhost:3000/api/admin/tiles
  ```
- **Expected Response ($200\text{ OK}$)**:
  ```json
  [
    {
      "id": 1,
      "title": "Tile 1",
      "imageId": null,
      "categoryIds": [],
      "image": null
    }
  ]
  ```

---

#### 14. `PUT /api/admin/tiles/:id`
- **Purpose**: Update layout tile title, assigned category IDs, or cover image ID.
- **`curl` Command**:
  ```bash
  curl -s -X PUT http://localhost:3000/api/admin/tiles/1 \
    -H "Content-Type: application/json" \
    -d '{
      "title": "Mul Cotton Collection",
      "categoryIds": ["mul"],
      "imageId": "img_sample"
    }'
  ```
- **Expected Response ($200\text{ OK}$)**:
  ```json
  {
    "message": "Tile updated successfully"
  }
  ```

---

#### 15. `GET /api/admin/images`
- **Purpose**: List all uploaded images stored in the database.
- **`curl` Command**:
  ```bash
  curl -s http://localhost:3000/api/admin/images
  ```
- **Expected Response ($200\text{ OK}$)**:
  ```json
  [
    {
      "uid": "img_sample",
      "high_res_url": "/assets/uploads/mul/example.webp",
      "thumb_url": "/assets/uploads/mul/example-thumb.webp",
      "alt_text": "Sample Photo",
      "type": "product"
    }
  ]
  ```

---

#### 16. `POST /api/admin/images/upload`
- **Purpose**: Upload a photo file or camera capture binary (`multipart/form-data`). Automatically resizes and converts to WebP high-res ($1600\times1600$) and thumbnail ($600\times600$).
- **`curl` Command**:
  ```bash
  curl -s -X POST http://localhost:3000/api/admin/images/upload \
    -F "image=@/path/to/saree.jpg" \
    -F "alt_text=Handloom Silk Saree" \
    -F "type=product"
  ```
- **Expected Response ($200\text{ OK}$)**:
  ```json
  {
    "uid": "img_a1b2c3d4e5f67890",
    "high_res_url": "/assets/uploads/_staging/img_a1b2c3d4e5f67890.webp",
    "thumb_url": "/assets/uploads/_staging/img_a1b2c3d4e5f67890-thumb.webp",
    "alt_text": "Handloom Silk Saree",
    "type": "product"
  }
  ```

---

#### 17. `DELETE /api/admin/images/:uid`
- **Purpose**: Delete an unassigned image from database and disk storage.
- **`curl` Command**:
  ```bash
  curl -s -X DELETE http://localhost:3000/api/admin/images/img_a1b2c3d4e5f67890
  ```
- **Expected Response ($200\text{ OK}$)**:
  ```json
  {
    "message": "Image deleted"
  }
  ```

---

#### 18. `GET /api/admin/raw-categories`
- **Purpose**: Get raw category definitions for admin drop-down selection menus.
- **`curl` Command**:
  ```bash
  curl -s http://localhost:3000/api/admin/raw-categories
  ```
- **Expected Response ($200\text{ OK}$)**:
  ```json
  [
    {
      "id": "mul",
      "name": "Mul Cotton",
      "imageId": "img_sample"
    }
  ]
  ```

---

#### 19. `POST /api/admin/categories`
- **Purpose**: Create a new category.
- **`curl` Command**:
  ```bash
  curl -s -X POST http://localhost:3000/api/admin/categories \
    -H "Content-Type: application/json" \
    -d '{
      "id": "organza",
      "name": "Organza Silk",
      "imageId": "img_sample"
    }'
  ```
- **Expected Response ($200\text{ OK}$)**:
  ```json
  {
    "message": "Category created"
  }
  ```

---

#### 20. `PUT /api/admin/categories/:id`
- **Purpose**: Update an existing category name or cover image.
- **`curl` Command**:
  ```bash
  curl -s -X PUT http://localhost:3000/api/admin/categories/organza \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Organza Pure Silk",
      "imageId": "img_sample"
    }'
  ```
- **Expected Response ($200\text{ OK}$)**:
  ```json
  {
    "message": "Category updated"
  }
  ```

---

#### 21. `DELETE /api/admin/categories/:id`
- **Purpose**: Delete a category (only permitted if no products are assigned to it).
- **`curl` Command**:
  ```bash
  curl -s -X DELETE http://localhost:3000/api/admin/categories/organza
  ```
- **Expected Response ($200\text{ OK}$)**:
  ```json
  {
    "message": "Category deleted"
  }
  ```

---

## Standard Error Response Format

If a request fails (e.g. invalid parameters or missing required fields), the API returns an appropriate HTTP status code along with a JSON error object:

```json
{
  "error": "Detailed error explanation string"
}
```

### Common HTTP Status Codes
- **$200\text{ OK}$**: Request succeeded.
- **$400\text{ Bad Request}$**: Missing required body fields or validation error (e.g. sale price greater than MRP).
- **$404\text{ Not Found}$**: Requested product or image ID does not exist.
- **$500\text{ Internal Server Error}$**: Unhandled database or server exception.
