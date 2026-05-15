import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function Home() {
  return (
    <div className="relative p-10 flex flex-col flex-1 items-center justify-start">
      <div className="absolute top-10 right-10">
        <ThemeSwitcher />
      </div>
      <h1 className="mt-64 font-bold font-heading text-accent text-3xl">WELCOME TO THE STORE FRONT</h1>
    </div>
  );
}
