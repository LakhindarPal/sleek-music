import { ArrowDown as ArrowDownIcon, ArrowUp as ArrowUpIcon } from "src/icons";
import { Button, SizableText, XStack } from "tamagui";

export type FilterOption = {
  label: string;
  value: string;
  canSort: boolean;
  defaultOrder: "asc" | "desc";
};

export const DEFAULT_FILTER_OPTIONS: readonly FilterOption[] = [
  { label: "Popular", value: "", canSort: false, defaultOrder: "asc" },
  { label: "Date", value: "latest", canSort: true, defaultOrder: "desc" },
  { label: "Name", value: "alphabetical", canSort: true, defaultOrder: "asc" },
] as const;

export function FilterBar({
  options = DEFAULT_FILTER_OPTIONS,
  category,
  sortOrder,
  onSelectOption,
}: {
  options?: readonly FilterOption[];
  category: string;
  sortOrder: "asc" | "desc";
  onSelectOption: (option: FilterOption) => void;
}) {
  return (
    <XStack mb="2" w="100%" gap="1-5">
      {options.map((opt) => {
        const isSelected = category === opt.value;
        const OrderIcon = sortOrder === "asc" ? ArrowUpIcon : ArrowDownIcon;
        return (
          <Button
            key={opt.value}
            flex={1}
            size="sm"
            rounded="full"
            bg={isSelected ? "accent-background" : "color-3"}
            borderColor={isSelected ? "accent-background" : "border-color"}
            borderWidth={1}
            scale="press:0.97"
            onPress={() => onSelectOption(opt)}
          >
            <XStack items="center" justify="center" gap="1">
              <SizableText
                size="1"
                fontWeight={isSelected ? "700" : "500"}
                color={isSelected ? "white" : "color-9"}
              >
                {opt.label}
              </SizableText>
              {isSelected && opt.canSort && <OrderIcon size={13} color="white" strokeWidth={2.5} />}
            </XStack>
          </Button>
        );
      })}
    </XStack>
  );
}
