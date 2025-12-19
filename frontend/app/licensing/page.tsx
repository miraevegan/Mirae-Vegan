"use client";

import NavbarDefault from "@/components/layout/NavbarDefault";

export default function LicensingPage() {
  return (
    <>
      <NavbarDefault />

      {/* HERO */}
      <section className="bg-surface-canvas px-6 pt-28 pb-20">
        <div className="max-w-6xl mx-auto">

          <p className="text-xs tracking-[0.3em] uppercase text-text-secondary mb-4">
            Legal
          </p>

          <h1 className="text-5xl md:text-6xl font-highlight uppercase text-brand-primary leading-tight max-w-3xl">
            Licensing & Usage.
          </h1>

          <p className="mt-6 text-lg text-text-secondary max-w-2xl">
            All creative assets, content, and materials associated with Miraé
            Vegan are protected and licensed to preserve the integrity of our
            brand.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-surface-canvas px-6 pb-32">
        <div className="max-w-4xl mx-auto space-y-24">

          {/* BLOCK */}
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Brand Ownership
            </h2>
            <p className="text-text-secondary leading-relaxed">
              All content published on the Miraé Vegan website — including but
              not limited to logos, product designs, imagery, videos, text,
              graphics, and visual compositions — is the exclusive property of
              Miraé Vegan unless otherwise stated.
            </p>
          </div>

          <div className="h-px bg-border" />

          {/* BLOCK */}
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Permitted Use
            </h2>
            <p className="text-text-secondary leading-relaxed">
              You may access and use Miraé Vegan content for personal,
              non-commercial purposes only. Any form of reproduction,
              modification, distribution, or public display without written
              permission is strictly prohibited.
            </p>
          </div>

          <div className="h-px bg-border" />

          {/* BLOCK */}
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Commercial Licensing
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Use of Miraé Vegan assets for commercial purposes — including
              marketing, resale, collaborations, press usage, or third-party
              promotions — requires prior written authorization from Miraé
              Vegan.
            </p>
          </div>

          <div className="h-px bg-border" />

          {/* BLOCK */}
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Trademarks
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Miraé Vegan™, its logo, wordmarks, and associated brand elements
              are registered or unregistered trademarks. Unauthorized use may
              result in legal action.
            </p>
          </div>

          <div className="h-px bg-border" />

          {/* BLOCK */}
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Third-Party Content
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Any third-party trademarks, imagery, or content appearing on the
              site remain the property of their respective owners and are used
              under license or fair use where applicable.
            </p>
          </div>

          <div className="h-px bg-border" />

          {/* BLOCK */}
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Licensing Requests
            </h2>
            <p className="text-text-secondary leading-relaxed">
              For licensing inquiries, collaborations, or permission requests,
              please reach out to our team directly.
            </p>

            <p className="mt-4 text-text-primary font-medium">
              legal@miraevegan.com
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
