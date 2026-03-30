import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface CityDisplayProps {
  cityName: string;
}

export default function CityDisplay({ cityName }: CityDisplayProps) {
  return (
    <section
      aria-live="polite"
      aria-label={`Weather results for ${cityName}`}
    >
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <MapPin
              className="h-5 w-5 text-primary shrink-0"
              aria-hidden="true"
            />
            <span>{cityName}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground italic text-sm sm:text-base leading-relaxed">
            Weather data for{" "}
            <strong className="text-foreground not-italic font-medium">
              {cityName}
            </strong>{" "}
            will appear here once the API is connected.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
