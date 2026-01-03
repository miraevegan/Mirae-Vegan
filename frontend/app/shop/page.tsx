"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import { Search, LayoutGrid, LayoutList } from "lucide-react";
import NavbarDefault from "@/components/layout/NavbarDefault";
import api from "@/lib/axios";
import type { Product } from "@/types/product";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<string[]>([]);

    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [columns, setColumns] = useState<2 | 3>(3);

    useEffect(() => {
        let isMounted = true; // to avoid setting state if component unmounts

        const fetchProducts = async () => {
            setLoading(true); // show loading spinner/text but keep old products visible

            try {
                let endpoint = "/products";

                if (activeCategory === "Best Sellers") {
                    endpoint = "/products/best-sellers";
                } else if (activeCategory === "New In") {
                    endpoint = "/products/just-landed";
                } else if (activeCategory !== "All") {
                    endpoint = `/products?category=${encodeURIComponent(activeCategory)}`;
                }

                const res = await api.get(endpoint);

                if (isMounted) {
                    const data = res.data;

                    setProducts(
                        Array.isArray(data) ? data : data.products ?? []
                    );
                }
            } catch (err) {
                console.error("Failed to fetch products", err);
                if (isMounted) setProducts([]);
            } finally {
                if (isMounted) setLoading(false); // stop loading spinner after data arrives
            }
        };

        fetchProducts();

        return () => {
            isMounted = false; // cleanup if component unmounts
        };
    }, [activeCategory]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get("/products/categories");
                setCategories([
                    "All",
                    "New In",
                    "Best Sellers",
                    "Vegan",
                    ...res.data.categories,
                ]);
            } catch {
                setCategories(["All", "New In", "Best Sellers"]);
            }
        };

        fetchCategories();
    }, []);

    // Filter by search on already fetched products
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <NavbarDefault />

            <section className="text-center max-w-[90%] px-6 py-20 bg-surface-canvas mx-auto">
                {/* ===== HEADER ===== */}
                <div className="mb-14">
                    <h1 className="text-5xl leading-none uppercase font-highlight text-brand-primary text-center">
                        Our Collection
                    </h1>

                    <p className="mt-4 text-base leading-relaxed text-text-secondary">
                        Discover consciously crafted pieces designed for movement,
                        <br />
                        comfort, and timeless elegance. Elevated essentials made to last.
                    </p>

                    {/* Search */}
                    <div className="relative mt-8 max-w-2xl mx-auto">
                        <Search className="absolute w-5 h-5 -translate-y-1/2 left-4 top-1/2 text-text-secondary" />
                        <input
                            type="text"
                            placeholder="Search products"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full py-4 pl-12 pr-4 text-sm tracking-wide bg-transparent border border-border focus:outline-none focus:border-brand-primary"
                        />
                    </div>
                </div>

                {/* ===== FILTER BAR ===== */}
                <div className="flex items-center justify-between pb-6 mb-10 border-b border-border">
                    {/* Categories */}
                    <div className="flex gap-8 overflow-x-auto no-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`text-xs tracking-widest uppercase transition ${activeCategory === cat
                                    ? "text-brand-primary border-b border-brand-primary pb-1"
                                    : "text-text-secondary hover:text-text-primary"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Grid Toggle */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setColumns(2)}
                            className={`p-2 border ${columns === 2 ? "border-brand-primary" : "border-border"
                                }`}
                            aria-label="2 column layout"
                        >
                            <LayoutList className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => setColumns(3)}
                            className={`p-2 border ${columns === 3 ? "border-brand-primary" : "border-border"
                                }`}
                            aria-label="3 column layout"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* ===== PRODUCTS ===== */}
                <div
                    className={`grid gap-x-8 gap-y-16 ${columns === 3
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                        : "grid-cols-1 md:grid-cols-2"
                        }`}
                >
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    ) : loading ? (
                        Array.from({ length: columns === 3 ? 6 : 4 }).map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center">
                            <h3 className="text-lg font-medium text-brand-primary">
                                No products found
                            </h3>
                            <p className="mt-2 text-sm text-text-secondary">
                                Try a different category or clear your search.
                            </p>
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setActiveCategory("All");
                                }}
                                className="mt-6 px-6 py-3 text-xs tracking-widest uppercase border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition"
                            >
                                View all products
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
