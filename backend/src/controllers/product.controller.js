import Product from "../models/Product.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import { uploadFromBuffer } from "../utils/uploadToCloudinary.js";

/**
 * ===============================
 * HELPERS
 * ===============================
 */

// Extract lowest variant price (industry standard)
const getMinVariantPrice = (variants = []) => {
  const prices = variants
    .map(v => Number(v.price))
    .filter(p => !isNaN(p));

  return prices.length ? Math.min(...prices) : 0;
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * ===============================
 * CREATE PRODUCT (ADMIN)
 * ===============================
 */
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      variants,
      discount,
      isBestSeller,
      isJustLanded,
      attributes,
      specifications,
    } = req.body;

    if (!name || !description || !category || !variants) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const parsedVariants =
      typeof variants === "string" ? JSON.parse(variants) : variants;

    if (!Array.isArray(parsedVariants) || parsedVariants.length === 0) {
      return res.status(400).json({
        message: "At least one variant is required",
      });
    }

    // Upload base product images
    let images = [];
    if (req.files?.productImages?.length) {
      for (const file of req.files.productImages) {
        const uploaded = await uploadFromBuffer(file.buffer, "products");
        images.push({
          url: uploaded.secure_url,
          public_id: uploaded.public_id,
        });
      }
    }

    // Map variant imageIndexes to actual images
    const mappedVariants = parsedVariants.map((variant) => {
      if (!variant.imageIndexes || !Array.isArray(variant.imageIndexes)) {
        return { ...variant, images: [] };
      }

      const variantImages = variant.imageIndexes
        .map((index) => images[index])
        .filter(Boolean); // Filter out invalid indexes

      return {
        ...variant,
        images: variantImages,
        imageIndexes: undefined, // Remove imageIndexes before saving if you want
      };
    });

    const product = await Product.create({
      name,
      description,
      category,
      variants: mappedVariants,
      images,
      discount: discount ? typeof discount === "string" ? JSON.parse(discount) : discount : { percentage: 0 },
      isBestSeller,
      isJustLanded,
      attributes: attributes
        ? typeof attributes === "string"
          ? JSON.parse(attributes)
          : attributes
        : {},
      specifications: specifications
        ? typeof specifications === "string"
          ? JSON.parse(specifications)
          : specifications
        : {},
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    res.status(500).json({ message: "Failed to create product" });
  }
};

/**
 * ===============================
 * GET ALL PRODUCTS (USER)
 * Zara / Nike style listing
 * ===============================
 */
export const getAllProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      sort = "newest",
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    if (keyword) {
      query.name = { $regex: keyword, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    let products = await Product.find(query).lean();

    // Price filtering (variant-aware)
    if (minPrice || maxPrice) {
      products = products.filter((p) => {
        const price = getMinVariantPrice(p.variants);

        const min = minPrice ? Number(minPrice) : null;
        const max = maxPrice ? Number(maxPrice) : null;

        if (min !== null && price < min) return false;
        if (max !== null && price > max) return false;

        return true;
      });
    }

    // Sorting
    if (sort === "price-low") {
      products.sort(
        (a, b) =>
          getMinVariantPrice(a.variants) -
          getMinVariantPrice(b.variants)
      );
    }

    if (sort === "price-high") {
      products.sort(
        (a, b) =>
          getMinVariantPrice(b.variants) -
          getMinVariantPrice(a.variants)
      );
    }

    if (sort === "newest") {
      products.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    // Pagination
    const start = (page - 1) * limit;
    const paginated = products.slice(start, start + Number(limit));

    res.json({
      total: products.length,
      page: Number(page),
      products: paginated,
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// Add variant images
export const addVariantImages = async (req, res) => {
  try {
    const { productId, variantId } = req.params;

    if (!isValidObjectId(productId) || !isValidObjectId(variantId)) {
      return res.status(400).json({ message: "Invalid product or variant ID" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (!req.files?.productImages || req.files.productImages.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedImages = [];

    for (const file of req.files.productImages) {
      const uploaded = await uploadFromBuffer(file.buffer, "products/variants");

      uploadedImages.push({
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      });
    }

    // Find variant and push images
    const variant = product.variants.id(variantId);
    if (!variant) return res.status(404).json({ message: "Variant not found" });

    variant.images.push(...uploadedImages);
    await product.save();

    res.json(variant);
  } catch (error) {
    console.error("ADD VARIANT IMAGES ERROR:", error);
    res.status(500).json({ message: "Failed to add variant images" });
  }
};

// Delete variant image
export const deleteVariantImage = async (req, res) => {
  try {
    const { productId, variantId, publicId } = req.params;

    if (
      !isValidObjectId(productId) ||
      !isValidObjectId(variantId) ||
      !publicId
    ) {
      return res.status(400).json({ message: "Invalid IDs" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const variant = product.variants.id(variantId);
    if (!variant) return res.status(404).json({ message: "Variant not found" });

    variant.images = variant.images.filter((img) => img.public_id !== publicId);

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    await product.save();

    res.json(variant);
  } catch (error) {
    console.error("DELETE VARIANT IMAGE ERROR:", error);
    res.status(500).json({ message: "Failed to delete variant image" });
  }
};

/**
 * ===============================
 * GET SINGLE PRODUCT (SLUG)
 * ===============================
 */
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

/**
 * ===============================
 * UPDATE PRODUCT (ADMIN)
 * ===============================
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    /* -------- BASIC FIELDS -------- */
    if (req.body.name !== undefined) product.name = req.body.name;
    if (req.body.description !== undefined) product.description = req.body.description;
    if (req.body.category !== undefined) product.category = req.body.category;
    if (req.body.isBestSeller !== undefined) product.isBestSeller = req.body.isBestSeller;
    if (req.body.isJustLanded !== undefined) product.isJustLanded = req.body.isJustLanded;

    /* -------- DISCOUNT (VERY IMPORTANT) -------- */
    if (req.body.discount !== undefined) {
      product.discount =
        typeof req.body.discount === "string"
          ? JSON.parse(req.body.discount)
          : req.body.discount;
    }

    /* -------- ATTRIBUTES -------- */
    if (req.body.attributes !== undefined) {
      product.attributes =
        typeof req.body.attributes === "string"
          ? JSON.parse(req.body.attributes)
          : req.body.attributes;
    }

    /* -------- SPECIFICATIONS -------- */
    if (req.body.specifications !== undefined) {
      product.specifications =
        typeof req.body.specifications === "string"
          ? JSON.parse(req.body.specifications)
          : req.body.specifications;
    }

    /* -------- VARIANTS -------- */
    if (req.body.variants !== undefined) {
      product.variants =
        typeof req.body.variants === "string"
          ? JSON.parse(req.body.variants)
          : req.body.variants;
    }

    /* -------- PRODUCT IMAGES -------- */
    if (req.files?.productImages?.length) {
      for (const file of req.files.productImages) {
        const uploaded = await uploadFromBuffer(file.buffer, "products");
        product.images.push({
          url: uploaded.secure_url,
          public_id: uploaded.public_id,
        });
      }
    }

    await product.save();
    res.json(product);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
};

/**
 * ===============================
 * DELETE PRODUCT (ADMIN)
 * ===============================
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete all images from Cloudinary
    for (const img of product.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};

/**
 * ===============================
 * ADD PRODUCT IMAGES (ADMIN)
 * ===============================
 */
export const addProductImages = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const uploadedImages = [];

    for (const file of req.files.productImages) {
      const uploaded = await uploadFromBuffer(file.buffer, "products");

      uploadedImages.push({
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      });
    }

    product.images.push(...uploadedImages);
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to add images" });
  }
};

/**
 * ===============================
 * DELETE PRODUCT IMAGE (ADMIN)
 * ===============================
 */
export const deleteProductImage = async (req, res) => {
  try {
    const { id, publicId } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.images = product.images.filter(
      (img) => img.public_id !== publicId
    );

    await cloudinary.uploader.destroy(publicId);
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete image" });
  }
};

export const getVariantAvailability = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne(
      { slug },
      { variants: 1 }
    ).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const availability = product.variants.map((variant) => ({
      variantId: variant._id,
      attributes: variant.attributes,
      inStock: variant.stock > 0,
      stock: variant.stock, // optional (useful for “Only X left”)
    }));

    res.json({
      productId: product._id,
      availability,
    });
  } catch (error) {
    console.error("VARIANT AVAILABILITY ERROR:", error);
    res.status(500).json({ message: "Failed to fetch availability" });
  }
};

/**
 * ===============================
 * HOME PAGE SECTIONS
 * ===============================
 */
export const bestSellers = async (req, res) => {
  const products = await Product.find({ isBestSeller: true }).limit(12);
  res.json(products);
};

export const justLanded = async (req, res) => {
  const products = await Product.find({ isJustLanded: true })
    .sort({ createdAt: -1 })
    .limit(12);
  res.json(products);
};
