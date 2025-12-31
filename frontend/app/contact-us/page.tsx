import NavbarDefault from "@/components/layout/NavbarDefault";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Store
} from "lucide-react";

export default function ContactUsPage() {
  return (
    <>
      <NavbarDefault />
      <section className="bg-surface/40 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-semibold tracking-tight mb-4">
              Contact Us
            </h1>
            <p className="text-sm text-text-secondary max-w-xl mx-auto">
              Have a question about your order, shipping, or our products?
              We’re here to help — reach out anytime.
            </p>
          </div>

          {/* Card */}
          <div className="bg-surface border border-border p-8 space-y-6">
            {/* Business Name */}
            <div className="flex items-start gap-4">
              <Store className="w-5 h-5 text-brand-primary mt-1" />
              <div>
                <p className="text-sm text-text-secondary">Business Name</p>
                <p className="font-medium">Mirae Vegan</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <Mail className="w-5 h-5 text-brand-primary mt-1" />
              <div>
                <p className="text-sm text-text-secondary">Email</p>
                <a
                  href="mailto:support@miraevegan.com"
                  className="font-medium hover:underline"
                >
                  support@miraevegan.com
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <Phone className="w-5 h-5 text-brand-primary mt-1" />
              <div>
                <p className="text-sm text-text-secondary">Phone</p>
                <a
                  href="tel:+91XXXXXXXXXX"
                  className="font-medium hover:underline"
                >
                  +91-9360696158
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-brand-primary mt-1" />
              <div>
                <p className="text-sm text-text-secondary">Business Address</p>
                <p className="font-medium">
                  Patna, Bihar, India
                </p>
              </div>
            </div>

            {/* Working Hours */}
            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-brand-primary mt-1" />
              <div>
                <p className="text-sm text-text-secondary">Working Hours</p>
                <p className="font-medium">
                  Monday – Saturday, 10:00 AM – 6:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
