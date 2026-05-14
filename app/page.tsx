import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <ThemeSwitcher />
      <h1 className="font-bold font-heading text-accent text-3xl">STORE FRONT</h1>
    </div>
  );
}
