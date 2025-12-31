"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import api from "@/lib/axios"; // Your axios instance or fetch wrapper

type Testimonial = {
    _id: string;
    rating: number;
    userName: string;
    comment: string;
};

// Helper: Render stars based on rating
const Stars = ({ rating }: { rating: number }) => {
    const stars = Array(5)
        .fill(0)
        .map((_, i) => (
            <svg
                key={i}
                className={`w-5 h-5 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.176c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.784.57-1.838-.197-1.54-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.049 9.4c-.783-.57-.38-1.81.588-1.81h4.176a1 1 0 00.95-.69l1.286-3.974z" />
            </svg>
        ));
    return <div className="flex space-x-1">{stars}</div>;
};

// Helper: Get initials from name
const getInitials = (name?: string) => {
    if (!name) return ""; // Return empty string if name is undefined or null

    const names = name.trim().split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    else return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
};

// Motion variants
const easeOut = [0.16, 1, 0.3, 1] as const;

const sectionFade: Variants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 1.1, ease: easeOut },
    },
};

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: easeOut },
    },
};

export default function TestimonialsSection() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State to track which testimonial is expanded
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const fetchTestimonials = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data } = await api.get("/reviews/testimonials");
                if (data.success) {
                    setTestimonials(data.testimonials);
                } else {
                    setError("Failed to load testimonials.");
                }
            } catch {
                setError("Error fetching testimonials.");
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    const toggleExpand = (id: string) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    if (loading) return <p className="text-center py-10">Loading testimonials...</p>;
    if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

    return (
        <motion.section
            className="mx-auto px-4 sm:px-6 lg:px-10 pt-4 pb-20 sm:pb-24 lg:pb-28"
            variants={sectionFade}
            initial="hidden"
            animate="visible"
            viewport={{ once: true }}
        >
            <div>
                <div className="mb-10">
                    <h2 className="uppercase font-highlight text-brand-primary text-3xl sm:text-4xl">
                        Testimonials
                    </h2>
                </div>

                <motion.div
                    className="w-full flex space-x-6 overflow-x-auto no-scrollbar"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {testimonials.map((testi) => {
                        const isExpanded = expanded[testi._id];
                        return (
                            <motion.div
                                key={testi._id}
                                className="shrink-0 w-lg bg-background border border-border p-6 shadow-md rounded-md"
                                variants={itemVariants}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-primary text-background font-medium text-sm">
                                            {getInitials(testi.userName)}
                                        </div>

                                        <p className="font-semibold text-base text-black">{testi.userName || "Anonymous"}</p>
                                    </div>
                                    <Stars rating={testi.rating} />
                                </div>

                                <p
                                    className={`mt-4 text-gray-700 text-xs leading-relaxed transition-all duration-300 ease-in-out ${!isExpanded ? "line-clamp-4" : ""
                                        }`}
                                >
                                    {testi.comment}
                                </p>

                                {/* Show toggle button only if comment is longer than 4 lines (approximate check) */}
                                {testi.comment.length > 200 && (
                                    <button
                                        onClick={() => toggleExpand(testi._id)}
                                        className="mt-2 text-sm text-brand-primary font-semibold hover:underline focus:outline-none"
                                    >
                                        {isExpanded ? "Read less" : "Read more"}
                                    </button>
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </motion.section>
    );
}
