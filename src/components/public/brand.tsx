import Image from "next/image";

export function Brand({ name, light = false }: { name: string; light?: boolean }) {
  return name === "Nusa Property" ? (
    <Image src={`/asset/brand/logo-${light ? "light" : "dark"}.svg`} alt={name} width={180} height={62} />
  ) : (
    <span>{name}</span>
  );
}
