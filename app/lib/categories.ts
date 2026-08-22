import {
  Armchair,
  Gamepad2,
  type LucideIcon,
  Plane,
  Smartphone,
  Speaker,
} from "lucide-react";

export type Category = {
  slug: string;
  label: string;
  icon: LucideIcon;
  count: number;
};

export const categories: Category[] = [
  { slug: "eletronicos", label: "Eletrônicos", icon: Smartphone, count: 24 },
  { slug: "moveis", label: "Móveis", icon: Armchair, count: 12 },
  { slug: "viagens", label: "Viagens", icon: Plane, count: 5 },
  { slug: "lazer", label: "Lazer", icon: Gamepad2, count: 9 },
  { slug: "caixas-de-som", label: "Caixas de Som", icon: Speaker, count: 7 },
];
