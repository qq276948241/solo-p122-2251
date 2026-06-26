import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: number;
  showValue?: boolean;
}

export default function StarRating({
  rating,
  size = 16,
  showValue = true,
}: StarRatingProps) {
  const fullStars = Math.floor(rating / 2);
  const hasHalf = rating % 2 >= 1;
  const displayStars = 5;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: displayStars }).map((_, i) => {
          const isFull = i < fullStars;
          const isHalf = i === fullStars && hasHalf;

          return (
            <Star
              key={i}
              size={size}
              className={
                isFull || isHalf
                  ? "text-amber-500 fill-amber-500"
                  : "text-midnight-600"
              }
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-amber-400">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
