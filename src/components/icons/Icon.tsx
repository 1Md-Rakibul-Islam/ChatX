import { icons } from "./registry";

type IconName = keyof typeof icons;

export default function Icon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  const Component = icons[name];

  return <Component className={className} />;
}
