import type { JSX } from "react";

import { themed, type IconProps } from "@tamagui/helpers-icon";
import { Svg, Path, type SvgProps } from "react-native-svg";

export const LetterText: (props: IconProps) => JSX.Element = themed(function LetterText(
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
      <Path d="M15 5h6" stroke={color} />
      <Path d="M15 12h6" stroke={color} />
      <Path d="M3 19h18" stroke={color} />
      <Path d="m3 12 3.553-7.724a.5.5 0 0 1 .894 0L11 12" stroke={color} />
      <Path d="M3.92 10h6.16" stroke={color} />
    </Svg>
  );
});
