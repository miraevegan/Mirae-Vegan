import mongoose from "mongoose";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import cloudinary from "../config/cloudinary.js";
import { uploadFromBuffer } from "../utils/uploadToCloudinary.js";

export const addReview = async (req, res) => {
    try {

        const { rating, comment } = req.body;
        const productId = req.params.productId;

        const product = await Product.findById(productId);
        if (!product)
            return res.status(404).json({ message: "Product not found" });

        let uploadedImage = null;

        if (req.file) {
            const uploaded = await uploadFromBuffer(req.file.buffer, "reviews");

            uploadedImage = {
                url: uploaded.secure_url,
                public_id: uploaded.public_id,
            };
        }

        const existingReview = await Review.findOne({
            product: productId,
            user: req.user._id,
        });

        if (existingReview) {
            existingReview.rating = rating;
            existingReview.comment = comment;

            if (uploadedImage) {
                existingReview.image = uploadedImage;
            }

            await existingReview.save();

        } else {

            await Review.create({
                product: productId,
                user: req.user._id,
                userName: req.user.name,
                rating,
                comment,
                image: uploadedImage,
            });

        }

        /* recalc rating */

        const reviews = await Review.find({ product: productId });

        const totalRating = reviews.reduce(
            (sum, r) => sum + r.rating,
            0
        );

        product.numOfReviews = reviews.length;
        product.ratings = (totalRating / reviews.length).toFixed(1);

        await product.save();

        res.json({ success: true });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADMIN: Get all reviews with filters, sorting & pagination
export const getAllReviewsAdmin = async (req, res) => {
    try {
        const {
            product,
            user,
            rating,
            sort = "latest",
            page = 1,
            limit = 10,
        } = req.query;

        const query = {};

        if (product) query.product = product;
        if (user) query.user = user;
        if (rating) query.rating = Number(rating);

        /* ---------- SORT ---------- */
        let sortOption = { createdAt: -1 };

        if (sort === "oldest") sortOption = { createdAt: 1 };
        if (sort === "rating_desc") sortOption = { rating: -1 };
        if (sort === "rating_asc") sortOption = { rating: 1 };

        /* ---------- PAGINATION ---------- */
        const currentPage = Number(page);
        const perPage = Number(limit);
        const skip = (currentPage - 1) * perPage;

        const total = await Review.countDocuments(query);

        const reviews = await Review.find(query)
            .populate("product", "name")
            .populate("user", "name email")
            .sort(sortOption)
            .skip(skip)
            .limit(perPage);

        res.json({
            success: true,
            reviews,
            pagination: {
                page: currentPage,
                pages: Math.ceil(total / perPage),
                total,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductReviews = async (req, res) => {
    try {
        const productId = req.params.productId;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Fetch all reviews for this product
        const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });

        res.json({
            success: true,
            reviews,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (review.image?.public_id) {
            await cloudinary.uploader.destroy(review.image.public_id);
        }

        // Remove the review
        await review.deleteOne();

        // Update product's ratings and numOfReviews after deletion
        const product = await Product.findById(review.product);
        if (product) {
            const reviews = await Review.find({ product: product._id });

            if (reviews.length > 0) {
                const totalRating = reviews.reduce((acc, r) => acc + r.rating, 0);
                product.numOfReviews = reviews.length;
                product.ratings = (totalRating / reviews.length).toFixed(1);
            } else {
                product.numOfReviews = 0;
                product.ratings = 0;
            }

            await product.save();
        }

        res.json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTestimonials = async (req, res) => {
    try {
        // Fetch only those marked as testimonials and with rating >= 4 (optional filter)
        const testimonials = await Review.find({ testimonial: true, rating: { $gte: 4 } })
            .sort({ createdAt: -1 })
            .limit(10); // You can adjust the limit

        res.json({ success: true, testimonials });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// In review.controller.js

export const updateReviewTestimonial = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const { testimonial } = req.body;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        review.testimonial = testimonial;
        await review.save();

        res.json({ success: true, message: "Testimonial status updated", review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const submitFeedback = async (req, res) => {
    try {
        console.log("Feedback route hit");
        console.log("Body:", req.body);
        console.log("File:", req.file);
        
        const { productId, name, phone, rating, comment } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product id" });
        }

        const product = await Product.findById(productId);

        if (!product)
            return res.status(404).json({ message: "Product not found" });

        const numericRating = Number(rating);

        let image = null;

        if (req.file) {
            const uploaded = await uploadFromBuffer(req.file.buffer, "reviews");

            image = {
                url: uploaded.secure_url,
                public_id: uploaded.public_id,
            };
        }

        const review = await Review.create({
            product: productId,
            userName: name,
            phone,
            rating: numericRating,
            comment,
            image,
            source: "manual",
        });

        res.json({
            success: true,
            review,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};