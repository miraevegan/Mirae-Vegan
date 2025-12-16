import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";

export const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.productId;
        const userId = req.user._id;

        // 1️⃣ Check product exists
        const product = await Product.findById(productId);
        if (!product)
            return res.status(404).json({ message: "Product not found" });

        // 2️⃣ Check if user has purchased this product
        const hasPurchased = await Order.findOne({
            user: req.user._id,
            "orderItems.product": new mongoose.Types.ObjectId(productId),
            isDelivered: true,
        });

        if (!hasPurchased) {
            return res.status(403).json({
                message: "You can review this product only after purchasing it",
            });
        }

        // 3️⃣ One review per user per product
        const existingReview = await Review.findOne({
            product: productId,
            user: userId,
        });

        if (existingReview) {
            existingReview.rating = rating;
            existingReview.comment = comment;
            await existingReview.save();
        } else {
            await Review.create({
                product: productId,
                user: userId,
                userName: req.user.name,
                rating,
                comment,
            });
        }

        // 4️⃣ Recalculate product rating
        const reviews = await Review.find({ product: productId });

        const totalRating = reviews.reduce(
            (sum, review) => sum + review.rating,
            0
        );

        product.numOfReviews = reviews.length;
        product.ratings = (totalRating / reviews.length).toFixed(1);

        await product.save();

        res.json({
            success: true,
            message: "Review submitted successfully",
        });
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