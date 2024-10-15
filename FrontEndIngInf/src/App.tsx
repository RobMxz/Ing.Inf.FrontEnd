import { AgregarItemSede } from "./components/AuthForms/AgregarItemSede";
import { LogIn } from "./components/AuthForms/LogIn";
import { SignUp } from "./components/AuthForms/SignUp";
import { VisualizarInventarioSede } from "./components/AuthForms/VisualizarInventarioSede";
import Header from "./components/Header";
import { Separator } from "@/components/ui/separator";

import { ThemeProvider } from "@/components/theme-provider";
import { EditarItem } from "./components/AuthForms/EditarItem";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header />
      <Separator className="px-6" />
      <AgregarItemSede />
    </ThemeProvider>
  );
}

export default App;
