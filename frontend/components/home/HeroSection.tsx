import { MoveRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="flex items-center justify-center w-full bg-center bg-cover min-h-200"
      style={{ backgroundImage: "url('/images/hero_image.jpg')" }}
    >
      <div className="max-w-3xl text-center">
        <h1 className="text-[140px] font-light font-brand text-background leading-none">
            Miraé
        </h1>

        <p className="mt-0 mb-32 text-3xl text-background font-extralight font-brand">
            Conscious & Timeless
        </p>

        <button className="inline-flex items-center gap-3 px-6 py-3 text-sm font-normal transition border border-background text-background hover:bg-background hover:text-brand-primary">
          <MoveRight className="w-6 h-6 stroke-[1.5]" />
          NEW ARRIVALS IN STORE
        </button>
      </div>
    </section>
  );
}
