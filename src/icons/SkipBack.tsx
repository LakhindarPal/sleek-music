import type { JSX } from "react";

import { themed, type IconProps } from "@tamagui/helpers-icon";
import { Svg, Path, type SvgProps } from "react-native-svg";

export const SkipBack: (props: IconProps) => JSX.Element = themed(function SkipBack(
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
        d="M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z"
        stroke={color}
      />
      <Path d="M3 20V4" stroke={color} />
    </Svg>
  );
});
