"use client";

import Image from "next/image";

export default function AboutPage() {
    return (
        <section className="bg-surface-canvas text-text-primary font-body">

            {/* ===== HERO ===== */}
            <div className="relative w-full h-[60vh] flex items-center justify-center bg-[url('/images/hero_image.jpg')] bg-cover bg-center">
                <div className="backdrop-blur-sm bg-background/50 p-6 text-center max-w-lg mx-auto">
                    <h1 className="text-5xl font-highlight uppercase text-brand-primary">
                        Miraé Vegan
                    </h1>
                    <p className="mt-4 text-base text-text-secondary">
                        Fashion that feels as good as it looks — beautiful, conscious, intentional.
                    </p>
                </div>
            </div>

            {/* ===== OUR STORY ===== */}
            <div className="mt-20 px-10 lg:px-32 max-w-5xl mx-auto text-center">
                <h2 className="text-3xl font-highlight text-brand-primary uppercase mb-4">
                    Our Story
                </h2>
                <p className="text-base text-text-secondary leading-relaxed">
                    Once imagined as a voice for conscious fashion, Miraé Vegan emerged from the desire to
                    design with purpose. We saw an opportunity to create garments that tell a story —
                    quality, compassion, and design without compromise. Each collection is rooted in
                    intention — from thoughtful silhouettes to the materials we choose.
                </p>
            </div>

            {/* ===== PHILOSOPHY GRID ===== */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-10 lg:px-32 max-w-6xl mx-auto text-center">
                {[
                    { title: "Conscious Craftsmanship", desc: "Elevated design meets intentional production." },
                    { title: "Vegan Materials", desc: "Cruelty-free. Beautiful. Sustainable." },
                    { title: "Timeless Style", desc: "Designed to be worn beyond seasons." },
                    { title: "Responsible Sourcing", desc: "Materials selected for ethics & performance." },
                ].map((item) => (
                    <div key={item.title} className="p-6 border border-ui-border rounded-md">
                        <h3 className="text-xl font-semibold text-brand-primary">{item.title}</h3>
                        <p className="mt-2 text-text-secondary text-sm">{item.desc}</p>
                    </div>
                ))}
            </div>

            {/* ===== CRAFT & MATERIALS ===== */}
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 px-10 lg:px-32 mt-24 max-w-6xl mx-auto items-center">
                <div className="lg:w-1/2">
                    <Image
                        src="/images/hero_image.jpg"
                        alt="Craft and materials"
                        width={700}
                        height={500}
                        className="rounded-lg object-cover"
                    />
                </div>
                <div className="lg:w-1/2 text-left">
                    <h2 className="text-2xl font-highlight text-brand-primary uppercase">
                        Craft & Materials
                    </h2>
                    <p className="mt-4 text-text-secondary text-base leading-relaxed">
                        We partner with artisans who share our vision — a blend of craftsmanship and
                        conscience. From vegan leather alternatives to organic fabrics, every material is
                        chosen for how it feels, how it lasts, and how it treats the world around us.
                    </p>
                </div>
            </div>

            {/* ===== SUSTAINABILITY COMMITMENT ===== */}
            <div className="mt-24 px-10 lg:px-32 text-center max-w-5xl mx-auto">
                <h2 className="text-3xl font-highlight text-brand-primary uppercase mb-4">
                    Sustainability Commitment
                </h2>
                <p className="text-text-secondary text-base leading-relaxed">
                    Sustainability isn’t a trend — it’s our foundation. We are committed to reducing our
                    environmental footprint while elevating timeless, functional design. Every decision we
                    make reflects this promise.
                </p>
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {["Ethical Production", "Cruelty-Free Materials", "Transparent Supply Chain"].map((item) => (
                        <div key={item} className="border border-ui-border p-5 rounded-md">
                            <h3 className="text-xl font-semibold text-brand-primary">{item}</h3>
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== FINAL CTA ===== */}
            <div className="mt-24 bg-brand-primary text-background py-16 text-center">
                <h2 className="text-3xl font-highlight uppercase">
                    Become Part Of Our Journey
                </h2>
                <p className="mt-4 text-base">
                    Explore the collections and experience Miraé for yourself.
                </p>
            </div>

        </section>
    );
}
