import type { JSX } from "react";

import { themed, type IconProps } from "@tamagui/helpers-icon";
import { Svg, Circle, type SvgProps } from "react-native-svg";

export const Disc: (props: IconProps) => JSX.Element = themed(function Disc(props: IconProps) {
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
      <Circle cx="12" cy="12" r="10" stroke={color} />
      <Circle cx="12" cy="12" r="2" stroke={color} />
    </Svg>
  );
});
