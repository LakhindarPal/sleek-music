import { decodeHTML } from "entities";
import { Link, type RelativePathString } from "expo-router";
import { parsePath } from "src/utils";
import { Avatar, Card, H3, Paragraph } from "tamagui";

export type MediaCardProps = {
  title: string;
  subtitle?: string | null;
  image?: string | null;
  perma_url: string;
  circle?: boolean;
};

export function MediaCard({ title, subtitle, image, perma_url, circle }: MediaCardProps) {
  const isCircle = circle || /\/artist\//i.test(perma_url);

  return (
    <Link href={parsePath(perma_url) as RelativePathString} asChild>
      <Card
        group
        w={142}
        rounded="xl"
        items="center"
        opacity="hover:0.88 press:0.8"
        scale="press:0.96"
        bg="transparent"
        p="0"
      >
        <Card.Header items="center" p="0" pb="1">
          <Avatar
            circular={isCircle}
            rounded={isCircle ? undefined : 12}
            size={138}
            borderWidth={0.5}
            borderColor="border-color"
          >
            <Avatar.Image src={image ?? undefined} />
            <Avatar.Fallback bg="color-4" rounded={isCircle ? undefined : 12} />
          </Avatar>
        </Card.Header>

        <Card.Footer flexDirection="column" items="center" p="0" w="100%" gap="0-5" pt="1">
          <H3
            fontSize={14}
            fontWeight="600"
            letterSpacing={-0.1}
            text="center"
            numberOfLines={1}
            px="0-5"
            w="100%"
            color="color"
          >
            {decodeHTML(title)}
          </H3>

          {subtitle && (
            <Paragraph
              text="center"
              numberOfLines={1}
              px="0-5"
              w="100%"
              fontSize={12}
              color="color-10"
              fontWeight="400"
            >
              {decodeHTML(subtitle)}
            </Paragraph>
          )}
        </Card.Footer>
      </Card>
    </Link>
  );
}
