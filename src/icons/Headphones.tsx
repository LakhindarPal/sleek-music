import type { JSX } from "react";

import { themed, type IconProps } from "@tamagui/helpers-icon";
import { Svg, Path, type SvgProps } from "react-native-svg";

export const Headphones: (props: IconProps) => JSX.Element = themed(function Headphones(
  props: IconProps,
) {
  const {
    color = "black",
    size = 24,
    ...otherProps
  } = props as SvgProps & {
    color?: string;
    size?: number;
  };
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...otherProps}
    >
      <Path
        d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"
        stroke={color}
      />
    </Svg>
  );
});
