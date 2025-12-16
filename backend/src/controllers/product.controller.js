import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "mirae/products", resource_type: "image" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

/**
 * ===============================
 * ADMIN: CREATE PRODUCT
 * ===============================
 */
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPercentage,
      category,
      stock,
      isBestSeller,
      isJustLanded,
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Product images are required" });
    }

    const images = [];

    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer);

      images.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    const discountedPrice = discountPercentage
      ? price - (price * discountPercentage) / 100
      : price;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      isBestSeller,
      isJustLanded,
      discount: {
        percentage: discountPercentage || 0,
        discountedPrice,
      },
      images,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * ===============================
 * ADMIN: ADD PRODUCT IMAGES 
 * ===============================
 */
export const addProductImages = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Images required" });
    }

    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer);

      product.images.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    await product.save();

    res.json({
      success: true,
      message: "Images added successfully",
      images: product.images,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ===============================
 * USER: GET ALL PRODUCTS (SHOP)
 * ===============================
 */
export const getAllProducts = async (req, res) => {
  try {
    const { keyword, category, sort } = req.query;

    const query = {};

    if (keyword) {
      query.name = { $regex: keyword, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    let products = Product.find(query);

    if (sort === "price-low") products.sort({ price: 1 });
    if (sort === "price-high") products.sort({ price: -1 });
    if (sort === "latest") products.sort({ createdAt: -1 });

    products = await products.exec();

    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ===============================
 * USER: GET SINGLE PRODUCT (BY SLUG)
 * ===============================
 */
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ===============================
 * ADMIN: UPDATE PRODUCT
 * ===============================
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // Update primitive fields
    Object.assign(product, req.body);

    // If new images uploaded
    if (req.files && req.files.length > 0) {
      // Remove old images from Cloudinary
      for (const img of product.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }

      product.images = [];

      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer);

        product.images.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * ===============================
 * ADMIN: DELETE PRODUCT
 * ===============================
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    for (const img of product.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ===============================
 * ADMIN: DELETE PRODUCT IMAGE
 * ===============================
 */
export const deleteProductImage = async (req, res) => {
  try {
    const { id, publicId } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Remove from DB
    product.images = product.images.filter(
      (img) => img.public_id !== publicId
    );

    await product.save();

    res.json({
      success: true,
      message: "Image deleted successfully",
      images: product.images,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ===============================
 * USER: BEST SELLERS
 * ===============================
 */
export const bestSellers = async (req, res) => {
  const products = await Product.find({ isBestSeller: true }).limit(10);
  res.json({ success: true, products });
};

/**
 * ===============================
 * USER: JUST LANDED
 * ===============================
 */
export const justLanded = async (req, res) => {
  try {
    const products = await Product.find({ isJustLanded: true })
      .sort({ createdAt: -1 })  // sort descending by creation date
      .limit(10);               // limit to 10 products

    res.json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
