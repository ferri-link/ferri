import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

const variants = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const;

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <main className="flex w-full max-w-200 flex-col gap-8 px-6 py-12 sm:px-[60px] sm:py-[120px]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-balance">
              Button variants
            </h1>
            <p className="text-muted-foreground">
              Every variant of the shadcn/ui Button component.
            </p>
          </div>
          <ModeToggle />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {variants.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </div>
      </main>
    </div>
  );
}
