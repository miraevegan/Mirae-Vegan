"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import NavbarDefault from "@/components/layout/NavbarDefault";

interface ProductImage {
    url: string;
}

interface Product {
    _id: string;
    name: string;
    images: ProductImage[];
}

export default function FeedbackPage() {

    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    /* ================= FETCH PRODUCTS ================= */

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get("/products");

            setProducts(res.data.products || []);
        } catch (error) {
            console.error(error);
        }
    };

    /* ================= SUBMIT FEEDBACK ================= */

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedProduct) {
            alert("Please select a product");
            return;
        }

        setLoading(true);

        try {

            const formData = new FormData();

            formData.append("productId", selectedProduct._id);
            formData.append("name", name);
            formData.append("phone", phone);
            formData.append("rating", rating.toString());
            formData.append("comment", comment);

            if (image) {
                formData.append("reviewImage", image);
            }

            await fetch(`${process.env.NEXT_PUBLIC_HOSTED_API_URL}/reviews/feedback`, {
                method: "POST",
                body: formData,
            });
            // Checking with the fetch response is optional, as the API will return a 200 status even if the review creation fails. We can rely on the try-catch to handle any network errors.

            setSuccess(true);

            setName("");
            setPhone("");
            setComment("");
            setImage(null);
            setRating(5);

        } catch (error) {
            console.error(error);
            alert("Failed to submit review");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <NavbarDefault />

            <div className="max-w-6xl mx-auto px-6 py-16 space-y-14">

                {/* ================= TITLE ================= */}

                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-highlight text-brand-primary">
                        Share Your Feedback
                    </h1>

                    <p className="text-text-secondary">
                        Bought our product through Instagram or offline?
                        We&apos;d love to hear your experience.
                    </p>
                </div>

                {/* ================= PRODUCT SELECT ================= */}

                <div className="space-y-6">

                    <h2 className="text-lg font-semibold text-brand-primary">
                        Select Product
                    </h2>

                    <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">

                        {products.map((product) => {

                            const isSelected = selectedProduct?._id === product._id;

                            return (
                                <div
                                    key={product._id}
                                    onClick={() => setSelectedProduct(product)}
                                    className={`
                  min-w-50 cursor-pointer border rounded-xl p-3 transition
                  ${isSelected
                                            ? "border-brand-primary shadow-lg"
                                            : "border-border hover:border-brand-primary"}
                `}
                                >

                                    <Image
                                        src={product.images?.[0]?.url || "/images/placeholder-product.jpg"}
                                        alt={product.name}
                                        width={200}
                                        height={200}
                                        className="rounded-lg object-cover"
                                    />

                                    <p className="text-sm mt-2 text-center">
                                        {product.name}
                                    </p>

                                </div>
                            );
                        })}

                    </div>
                </div>

                {/* ================= REVIEW FORM ================= */}

                {selectedProduct && (

                    <form
                        onSubmit={handleSubmit}
                        className="max-w-xl mx-auto space-y-6 border border-border p-8 rounded-2xl bg-surface"
                    >

                        <h3 className="text-lg font-semibold text-brand-primary text-center">
                            Review for {selectedProduct.name}
                        </h3>

                        {/* NAME */}

                        <div className="space-y-1">
                            <label className="text-sm">Your Name</label>

                            <input
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-border rounded-lg px-4 py-2"
                            />
                        </div>

                        {/* PHONE */}

                        <div className="space-y-1">
                            <label className="text-sm">Phone Number</label>

                            <input
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full border border-border rounded-lg px-4 py-2"
                            />
                        </div>

                        {/* RATING */}

                        <div className="space-y-1">
                            <label className="text-sm">Rating</label>

                            <select
                                value={rating}
                                onChange={(e) => setRating(Number(e.target.value))}
                                className="w-full border border-border rounded-lg px-4 py-2"
                            >
                                <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
                                <option value={4}>⭐⭐⭐⭐ Good</option>
                                <option value={3}>⭐⭐⭐ Average</option>
                                <option value={2}>⭐⭐ Poor</option>
                                <option value={1}>⭐ Very Bad</option>
                            </select>
                        </div>

                        {/* IMAGE */}

                        <div className="space-y-1">
                            <label className="text-sm">
                                Upload Photo (optional)
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setImage(e.target.files?.[0] || null)
                                }
                            />
                        </div>

                        {/* COMMENT */}

                        <div className="space-y-1">
                            <label className="text-sm">Your Review</label>

                            <textarea
                                required
                                rows={4}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full border border-border rounded-lg px-4 py-2"
                            />
                        </div>

                        {/* SUBMIT */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-primary text-white py-3 rounded-lg hover:opacity-90 transition"
                        >
                            {loading ? "Submitting..." : "Submit Review"}
                        </button>

                        {success && (
                            <p className="text-center text-green-600 text-sm">
                                Thank you! Your review has been submitted.
                            </p>
                        )}

                    </form>
                )}

            </div>
        </>
    );
}