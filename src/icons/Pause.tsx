import type { JSX } from "react";

import { themed, type IconProps } from "@tamagui/helpers-icon";
import { Svg, Rect, type SvgProps } from "react-native-svg";

export const Pause: (props: IconProps) => JSX.Element = themed(function Pause(props: IconProps) {
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
      <Rect x="14" y="3" width="5" height="18" rx="1" stroke={color} />
      <Rect x="5" y="3" width="5" height="18" rx="1" stroke={color} />
    </Svg>
  );
});
