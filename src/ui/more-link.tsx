import { Link, type RelativePathString } from "expo-router";
import { ArrowRight as ArrowRightIcon } from "src/icons";
import { Button } from "tamagui";

export function MoreLink({ path }: { path: string }) {
  return (
    <Link href={path as RelativePathString} asChild>
      <Button
        size="sm"
        color="accent-background"
        fontSize={13}
        fontWeight="600"
        opacity="hover:0.85 press:0.75"
        scale="press:0.96"
        variant="quiet"
        px="2"
        h={28}
        iconAfter=<ArrowRightIcon size={14} color="accent-background" />
      >
        See all
      </Button>
    </Link>
  );
}
