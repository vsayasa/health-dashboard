import logo from "../../assets/vitametrics-logo.svg";
import { Link } from "react-router";

export default function Logo({ size = "md", clickable = false }: {
  size?: "xs" | "s" | "md" | "lg" | "xl" | "xxl" | "xxxl",
  clickable?: boolean
}) {
  const sizeClasses = {
    xs: "h-8",
    s: "h-16",
    md: "h-24",
    lg: "h-32",
    xl: "h-40",
    xxl: "h-48",
    xxxl: "h-56"
  };

  const img = (
    <img
      src={logo}
      alt="VitaMetrics Logo"
      className={`${sizeClasses[size]} object-contain block`}
    />
  );

  return clickable ? <Link to="/">{img}</Link> : img;
}