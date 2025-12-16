"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import {
    Linkedin,
    Facebook,
    Instagram,
} from "lucide-react";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="relative px-10 pt-20 pb-8 bg-brand-primary">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
                {/* Main Menu */}
                <div>
                    <h4 className="mb-4 text-sm font-semibold tracking-widest uppercase text-background">
                        Main Menu
                    </h4>
                    <ul className="space-y-2 text-sm text-background">
                        <li><Link href="/just-landed">Just Landed</Link></li>
                        <li><Link href="/shop">Shop</Link></li>
                        <li><Link href="/about">About Us</Link></li>
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h4 className="mb-4 text-sm font-semibold tracking-widest uppercase text-background">
                        Legal
                    </h4>
                    <ul className="space-y-2 text-sm text-background">
                        <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                        <li><Link href="/licensing">Licensing</Link></li>
                    </ul>
                </div>

                {/* Reach Us */}
                <div>
                    <h4 className="mb-4 text-sm font-semibold tracking-widest uppercase text-background">
                        Reach Us
                    </h4>
                    <ul className="space-y-2 text-sm text-background">
                        <li><Link href="/contact">Contact Us</Link></li>
                        <li><Link href="https://wa.me/XXXXXXXXXX">WhatsApp</Link></li>
                        <li><Link href="#">Facebook</Link></li>
                        <li><Link href="#">Instagram</Link></li>
                        <li><Link href="#">Telegram</Link></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div className="text-background">
                    <h3 className="text-xl font-semibold tracking-wider font-highlight">
                        Join Our Newsletter
                    </h3>
                    <p className="mt-1 text-sm">
                        Updates, exclusive offers & early access.
                    </p>

                    <div className="flex flex-col gap-4 mt-5">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-5 py-3 text-sm bg-transparent border outline-none border-background focus:bg-background/80 focus:text-brand-primary"
                        />

                        <button className="px-6 py-3 text-sm tracking-widest transition cursor-pointer text-brand-primary bg-background hover:opacity-90">
                            Subscribe
                        </button>
                    </div>

                    {/* Social Buttons */}
                    <div className="flex justify-between mt-6">
                        <SocialButton icon={Linkedin} label="LinkedIn" />
                        <SocialButton icon={Facebook} label="Facebook" />
                        <SocialButton icon={Instagram} label="Instagram" />
                    </div>
                </div>
            </div>

            <div className="mt-16 text-center">
                {/* Copyright */}
                <p className="text-sm text-background">
                    © {new Date().getFullYear()} Miraé. All rights reserved.
                </p>
            </div>

            {/* =========================
                FLOATING BRANDING (SVG LOGO)
            ========================== */}
            <Image
                src="/logo/Miraé.svg"
                alt="Mirae"
                width={500}
                height={100}
                className="absolute bottom-0 left-0 pointer-events-none select-none bg-brand-primary"
            />
        </footer>
    );
}

/* -------------------------
   Social Button Component
-------------------------- */
function SocialButton({
    icon: Icon,
    label,
}: {
    icon: LucideIcon;
    label: string;
}) {
    return (
        <Link
            href="#"
            className="flex items-center gap-1 px-4 py-3 text-xs transition border border-background text-background hover:bg-background hover:text-brand-primary"
        >
            <Icon className="w-4 h-4" />
            {label}
        </Link>
    );
}
