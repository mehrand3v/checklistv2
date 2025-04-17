import { useTheme } from "@/components/ThemeProvider";
import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";

function Home() {
  const { theme, setTheme } = useTheme();

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] gap-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Current Theme: {theme}</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setTheme("light")}
          >
            Light Mode
          </Button>
          <Button
            variant="outline"
            onClick={() => setTheme("dark")}
          >
            Dark Mode
          </Button>
          <Button
            variant="outline"
            onClick={() => setTheme("system")}
          >
            System Mode
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Home;
