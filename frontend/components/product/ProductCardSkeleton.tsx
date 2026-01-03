export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Image */}
      <div className="w-full aspect-3/4 bg-border" />

      {/* Text */}
      <div className="mt-4 space-y-2">
        <div className="h-4 w-3/4 bg-border" />
        <div className="h-4 w-1/2 bg-border" />
      </div>
    </div>
  );
}
