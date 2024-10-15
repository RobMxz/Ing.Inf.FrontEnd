import { LogIn } from "./components/AuthForms/LogIn";
import Header from "./components/Header";
import { Separator } from "@/components/ui/separator";

import { ThemeProvider } from "@/components/theme-provider";
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header />
      <Separator className="px-6" />
      <LogIn />
    </ThemeProvider>
  );
}

export default App;
