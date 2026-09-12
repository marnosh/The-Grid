import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import Component from "@/components/ui/noise-dark-blue-gradient-with-squares";

export function DemoOne() {
  return <Component />;
}

export default function LiquidMetalButtonDemo() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8">
      <div className="flex items-center gap-8">
        <LiquidMetalButton label="Get Started" />
        <LiquidMetalButton viewMode="icon" />
      </div>
    </div>
  );
}
