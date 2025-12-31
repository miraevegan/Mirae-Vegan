"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/lib/axios";
import { Product, ProductImage, Variant } from "@/types/product";
import { Review } from "@/types/review";
import { useCart } from "@/context/CartContext";
import NavbarDefault from "@/components/layout/NavbarDefault";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import ReviewForm from "@/components/review/ReviewForm";

export default function ProductDetailsPage() {
    const { slug } = useParams<{ slug: string }>();
    const router = useRouter();
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const { user } = useAuth();

    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [activeImage, setActiveImage] = useState(0);
    const [qty, setQty] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [displayImages, setDisplayImages] = useState<ProductImage[]>([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [hasPurchased, setHasPurchased] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await api.get(`/products/${slug}`);
                console.log("Product", res.data);

                setProduct(res.data);

                if (res.data.variants?.length > 0) {
                    const firstVariant = res.data.variants[0];
                    setSelectedVariant(firstVariant);

                    // initial images
                    setDisplayImages(
                        firstVariant.images?.length
                            ? firstVariant.images
                            : res.data.images
                    );
                } else {
                    setDisplayImages(res.data.images);
                }

                if (user) {
                    const purchaseRes = await api.get(
                        `/orders/has-purchased/${res.data._id}`
                    );
                    setHasPurchased(purchaseRes.data.hasPurchased);
                }

                const reviewRes = await api.get(`/reviews/${res.data._id}`);
                setReviews(reviewRes.data.reviews);
            } catch (err) {
                console.error(err);
                setError("Failed to load product data.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    useEffect(() => {
        if (!product || !selectedVariant) return;

        if (selectedVariant.images?.length) {
            setDisplayImages(selectedVariant.images);
            setActiveImage(0);
            return;
        }

        // fallback: filter product images by color keyword
        const colorName = selectedVariant.attributes?.color?.name;

        if (colorName) {
            const filtered = product.images.filter((img) =>
                img.url.toLowerCase().includes(colorName)
            );

            setDisplayImages(filtered.length ? filtered : product.images);
            setActiveImage(0);
        }
    }, [selectedVariant, product]);


    if (loading) return <p className="p-10">Loading...</p>;
    if (error) return <p className="p-10 text-red-600">{error}</p>;
    const variants = product?.variants ?? [];
    if (!product) return <p className="p-10">Product not found</p>;

    const discountPercentage = product.discount?.percentage ?? 0;
    const basePrice = selectedVariant?.price ?? 0;

    const discountedPrice =
        discountPercentage > 0
            ? Math.round(basePrice * (1 - discountPercentage / 100))
            : basePrice;

    const activeImageUrl = displayImages?.[activeImage]?.url || "/images/placeholder-product.jpg";

    const stock = selectedVariant?.stock ?? 0;
    const isLowStock = stock === 1;
    const isOutOfStock = stock === 0;


    const handleAddToCart = async () => {
        if (!user) {
            showToast("Please login to add items to cart", "info");
            return;
        }

        if (!selectedVariant) {
            showToast("Please select a variant", "error");
            return;
        }

        if (isOutOfStock) {
            showToast("This variant is out of stock", "error");
            return;
        }

        setActionLoading(true);
        try {
            await addToCart(product._id, qty, selectedVariant._id);
            showToast("Added to cart 🛒", "success");
        } finally {
            setActionLoading(false);
        }
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            showToast("Please login to submit a review", "info");
            return;
        }
        if (!comment.trim()) {
            showToast("Please enter a comment", "error");
            return;
        }
        setReviewSubmitting(true);

        try {
            const res = await api.post(`/reviews/${product._id}`, {
                rating,
                comment,
            });
            if (res.data.success) {
                showToast("Review submitted successfully", "success");
                // Fetch latest reviews again after submission
                const reviewRes = await api.get(`/reviews/${product._id}`);
                setReviews(reviewRes.data.reviews);

                // Reset form
                setRating(5);
                setComment("");
            } else {
                showToast("Failed to submit review", "error");
            }
        } catch (error) {
            console.error(error);
            showToast("Error submitting review", "error");
        } finally {
            setReviewSubmitting(false);
        }
    };

    const refreshReviews = async (productId: string) => {
        const reviewRes = await api.get(`/reviews/${productId}`);
        setReviews(reviewRes.data.reviews);
    };

    return (
        <>
            <NavbarDefault />
            <section className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-2 gap-14">
                {/* IMAGES */}
                <div className="space-y-4">
                    <Image
                        src={activeImageUrl}
                        alt={product.name}
                        width={700}
                        height={900}
                        priority
                        className="w-full object-cover rounded-xl"
                    />

                    <div className="flex gap-3 overflow-x-auto">
                        {displayImages.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                className={`border rounded-lg p-1 ${idx === activeImage ? "border-black" : "opacity-60"}`}
                                aria-label={`View image ${idx + 1}`}
                            >
                                <Image src={img.url} alt={`${product.name} image ${idx + 1}`} width={80} height={100} className="rounded-md" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* DETAILS */}
                <div className="space-y-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-light">{product.name}</h1>
                        <p className="text-xs uppercase tracking-widest opacity-60">{product.category}</p>
                    </div>

                    {/* Rating */}
                    <p className="text-sm">
                        ⭐ {product.ratings}{" "}
                        <span className="opacity-60">({product.numOfReviews} reviews)</span>
                    </p>

                    {/* Price */}
                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-medium">₹{discountedPrice}</span>

                        {discountPercentage > 0 && (
                            <>
                                <span className="line-through text-sm opacity-50">₹{basePrice}</span>
                                <span className="text-xs font-medium text-green-600">
                                    {discountPercentage}% OFF
                                </span>
                            </>
                        )}
                    </div>

                    {/* Variant Selector */}
                    {variants.length > 0 && (
                        <div className="space-y-4">
                            <p className="text-sm font-medium">Color</p>

                            <div className="flex gap-3">
                                {variants.map((variant) => {
                                    const color = variant.attributes?.color;
                                    const isSelected = selectedVariant?._id === variant._id;
                                    const isOutOfStock = variant.stock === 0;

                                    return (
                                        <button
                                            key={variant._id}
                                            disabled={isOutOfStock}
                                            onClick={() => {
                                                setSelectedVariant(variant);
                                                setQty(1);
                                            }}
                                            className={`
                                            w-10 h-10 rounded-full border-2 transition
                                            ${isSelected ? "border-black" : "border-gray-300"}
                                            ${isOutOfStock ? "opacity-40 cursor-not-allowed" : "hover:border-black"}
                                        `}
                                            style={{
                                                backgroundColor: color?.hex || "#e5e7eb",
                                            }}
                                            title={color?.name || "Default"}
                                            aria-label={`Select ${color?.name || "variant"}`}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Stock */}
                    <div className="text-sm space-y-1">
                        {isOutOfStock && (
                            <p className="text-red-500">Out of stock</p>
                        )}

                        {!isOutOfStock && (
                            <p className="text-green-600">In stock</p>
                        )}

                        {isLowStock && (
                            <p className="text-orange-600 font-medium">
                                Only 1 left
                            </p>
                        )}
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-4">
                        <span className="text-sm">Quantity</span>

                        <div className="flex items-center border rounded-lg overflow-hidden">
                            <button
                                onClick={() => setQty((q) => Math.max(1, q - 1))}
                                className="px-3 py-2 hover:bg-gray-100"
                                disabled={qty <= 1}
                                aria-label="Decrease quantity"
                            >
                                −
                            </button>
                            <span className="px-4 text-sm" aria-live="polite">{qty}</span>
                            <button
                                onClick={() => setQty((q) => Math.min(stock, q + 1))}
                                className="px-3 py-2 hover:bg-gray-100"
                                disabled={qty >= stock}
                                aria-label="Increase quantity"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={stock === 0 || actionLoading}
                            className="flex-1 px-6 py-4 border border-black text-black hover:bg-black hover:text-white transition disabled:opacity-40"
                        >
                            Add to Cart
                        </button>
                    </div>

                    {/* Description */}
                    <div className="pt-8 border-t space-y-3">
                        <h3 className="text-sm uppercase tracking-widest">Product Details</h3>
                        <p className="text-sm leading-relaxed opacity-80">{product.description}</p>
                    </div>
                </div>
                {/* REVIEWS */}
                <div className="lg:col-span-2 pt-14 space-y-6">
                    <h2 className="text-xl font-light">
                        Reviews ({reviews.length})
                    </h2>

                    {reviews.length === 0 && (
                        <p className="text-sm opacity-60">No reviews yet</p>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                        {reviews.map((review) => (
                            <div
                                key={review._id}
                                className="border border-border p-5 bg-surface space-y-2"
                            >
                                <p className="text-sm font-medium">{review.userName}</p>
                                <p className="text-xs opacity-60">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-sm">⭐ {review.rating}</p>
                                <p className="text-sm opacity-80">{review.comment}</p>
                            </div>
                        ))}
                    </div>

                    {/* WRITE REVIEW */}
                    {user && hasPurchased && (
                        <ReviewForm
                            productId={product._id}
                            onSuccess={() => refreshReviews(product._id)}
                        />
                    )}

                    {user && !hasPurchased && (
                        <p className="text-sm italic opacity-60">
                            You can review this product only after purchasing it.
                        </p>
                    )}

                    {!user && (
                        <p className="text-sm italic opacity-60">
                            Please login to write a review.
                        </p>
                    )}
                </div>
            </section>
        </>
    );
}
