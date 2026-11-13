import type { JSX } from "react";

import { themed, type IconProps } from "@tamagui/helpers-icon";
import { Svg, Path, type SvgProps } from "react-native-svg";

export const Library: (props: IconProps) => JSX.Element = themed(function Library(
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
      <Path d="m16 6 4 14" stroke={color} />
      <Path d="M12 6v14" stroke={color} />
      <Path d="M8 8v12" stroke={color} />
      <Path d="M4 4v16" stroke={color} />
    </Svg>
  );
});
