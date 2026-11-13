import LANGUAGES from "src/consts/languages";
import {
  Check as CheckIcon,
  Headphones as HeadphonesIcon,
  Heart as HeartIcon,
  Languages as LanguagesIcon,
  Moon as MoonIcon,
  Sun as SunIcon,
  SunMoon as SunMoonIcon,
} from "src/icons";
import { usePreferenceStore } from "src/utils";
import {
  Anchor,
  Card,
  H3,
  H4,
  Paragraph,
  RadioGroup,
  ScrollView,
  Separator,
  SizableText,
  ToggleGroup,
  XStack,
  YStack,
} from "tamagui";

const THEME_OPTIONS = [
  { value: "Auto", label: "Auto", icon: SunMoonIcon },
  { value: "Dark", label: "Dark", icon: MoonIcon },
  { value: "Light", label: "Light", icon: SunIcon },
];

const QUALITY_OPTIONS = [
  { value: "_320", label: "320 kbps", badge: "Studio" },
  { value: "_160", label: "160 kbps", badge: "Premium" },
  { value: "_96", label: "96 kbps", badge: "Standard" },
  { value: "_48", label: "48 kbps", badge: "Basic" },
  { value: "_12", label: "12 kbps", badge: "Data Saver" },
];

export default function ConfigPage() {
  const { theme, quality, languages, setTheme, setQuality, setLanguages } = usePreferenceStore();

  return (
    <ScrollView
      px="3"
      py="3"
      bg="background"
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <YStack gap="4">
        <YStack gap="2-5">
          <XStack items="center" gap="2">
            <YStack p="1-5" bg="color-3" rounded="xl">
              <LanguagesIcon size={18} color="accent-background" />
            </YStack>
            <YStack flex={1}>
              <H3 fontSize={16} fontWeight="700" letterSpacing={-0.2}>
                Languages
              </H3>
              <Paragraph color="color-9" fontSize={13}>
                Select your preferred languages for music
              </Paragraph>
            </YStack>
          </XStack>

          <ToggleGroup
            type="multiple"
            value={languages}
            onValueChange={(val) => {
              if (val && val.length > 0) {
                setLanguages(val);
              }
            }}
            orientation="horizontal"
            flexDirection="row"
            flexWrap="wrap"
            gap="2"
            pt="0-5"
          >
            {Object.keys(LANGUAGES).map((lang) => {
              const isSelected = languages.includes(lang);
              return (
                <ToggleGroup.Item
                  key={lang}
                  value={lang}
                  w="auto"
                  h="auto"
                  shrink={0}
                  rounded="full"
                  px="3"
                  py="1-5"
                  bg={
                    isSelected
                      ? "accent-background hover:accent-background"
                      : "color-3 hover:color-4"
                  }
                  borderColor={isSelected ? "accent-background" : "border-color"}
                  borderWidth={1}
                  scale="press:0.96"
                  opacity="press:0.9"
                >
                  <XStack items="center" gap="1-5">
                    {isSelected && <CheckIcon size={13} color="white" />}
                    <SizableText
                      size="1"
                      fontWeight={isSelected ? "700" : "500"}
                      color={isSelected ? "white" : "color"}
                    >
                      {lang}
                    </SizableText>
                  </XStack>
                </ToggleGroup.Item>
              );
            })}
          </ToggleGroup>
        </YStack>

        <Separator borderColor="border-color" />

        <YStack gap="2-5">
          <XStack items="center" gap="2">
            <YStack p="1-5" bg="color-3" rounded="xl">
              <SunMoonIcon size={18} color="accent-background" />
            </YStack>
            <YStack flex={1}>
              <H3 fontSize={16} fontWeight="700" letterSpacing={-0.2}>
                Appearance
              </H3>
              <Paragraph color="color-9" fontSize={13}>
                Choose light, dark, or follow device settings
              </Paragraph>
            </YStack>
          </XStack>

          <ToggleGroup
            type="single"
            value={theme}
            onValueChange={(val) => {
              if (val) {
                setTheme(val);
              }
            }}
            orientation="horizontal"
            flexDirection="row"
            gap="2"
            pt="0-5"
          >
            {THEME_OPTIONS.map((item) => {
              const isSelected = theme === item.value;
              return (
                <ToggleGroup.Item
                  key={item.value}
                  value={item.value}
                  flex={1}
                  h="auto"
                  rounded="xl"
                  p="2-5"
                  bg={isSelected ? "color-4 hover:color-5" : "color-2 hover:color-3"}
                  borderColor={isSelected ? "accent-background" : "border-color"}
                  borderWidth={1}
                  items="center"
                  gap="1-5"
                  scale="press:0.97"
                  opacity="press:0.9"
                >
                  <item.icon size={18} color={isSelected ? "accent-background" : "color-9"} />
                  <SizableText
                    size="1"
                    fontWeight={isSelected ? "700" : "500"}
                    color={isSelected ? "color" : "color-9"}
                  >
                    {item.label}
                  </SizableText>
                </ToggleGroup.Item>
              );
            })}
          </ToggleGroup>
        </YStack>

        <Separator borderColor="border-color" />

        <YStack gap="2-5">
          <XStack items="center" gap="2">
            <YStack p="1-5" bg="color-3" rounded="xl">
              <HeadphonesIcon size={18} color="accent-background" />
            </YStack>
            <YStack flex={1}>
              <H3 fontSize={16} fontWeight="700" letterSpacing={-0.2}>
                Quality
              </H3>
              <Paragraph color="color-9" fontSize={13}>
                Select audio streaming resolution and bitrate
              </Paragraph>
            </YStack>
          </XStack>

          <RadioGroup value={quality} onValueChange={setQuality} gap="1-5" pt="0-5">
            {QUALITY_OPTIONS.map((item) => {
              const isSelected = quality === item.value;
              return (
                <XStack
                  key={item.value}
                  items="center"
                  justify="space-between"
                  p="2-5"
                  rounded="xl"
                  bg={isSelected ? "color-4" : "color-2"}
                  borderWidth={1}
                  borderColor={isSelected ? "accent-background" : "border-color"}
                  scale="press:0.98"
                  opacity="press:0.9"
                  onPress={() => setQuality(item.value)}
                >
                  <XStack items="center" gap="2-5" flex={1}>
                    <RadioGroup.Item
                      value={item.value}
                      id={`quality-${item.value}`}
                      size="sm"
                      bg="transparent"
                      borderColor={isSelected ? "accent-background" : "color-8"}
                      borderWidth={1.5}
                    >
                      <RadioGroup.Indicator bg="accent-background" />
                    </RadioGroup.Item>
                    <YStack flex={1}>
                      <SizableText size="2" fontWeight={isSelected ? "700" : "600"}>
                        {item.label}
                      </SizableText>
                    </YStack>
                  </XStack>

                  <YStack
                    px="2"
                    py="0-5"
                    rounded="full"
                    bg={isSelected ? "accent-background" : "color-4"}
                  >
                    <SizableText size="1" fontWeight="700" color={isSelected ? "white" : "color-9"}>
                      {item.badge}
                    </SizableText>
                  </YStack>
                </XStack>
              );
            })}
          </RadioGroup>
        </YStack>

        <Separator borderColor="border-color" />

        <Card
          p="3"
          rounded="2xl"
          bg="color-2"
          borderWidth={1}
          borderColor="border-color"
          items="center"
          gap="1-5"
        >
          <H4 fontSize={16} fontWeight="700" letterSpacing={-0.2}>
            Sleek Music
          </H4>
          <XStack items="center" gap="1-5">
            <Paragraph size="1" color="color-9">
              Crafted with
            </Paragraph>
            <HeartIcon size={13} color="accent-background" fill="accent-background" />
            <Paragraph size="1" color="color-9">
              by
            </Paragraph>
            <Anchor
              color="accent-background"
              fontWeight="600"
              size="1"
              href="https://github.com/LakhindarPal/sleek-music"
              target="_blank"
            >
              @Lakhindar
            </Anchor>
          </XStack>
        </Card>
      </YStack>
    </ScrollView>
  );
}
