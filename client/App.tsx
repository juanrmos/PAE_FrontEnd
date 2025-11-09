import "./global.css";

import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home";
import Placeholder from "./pages/Placeholder";
import GroupsModuleLayout from "./components/modules/Groups/ModuleLayout";
import RepositoryModuleLayout from "./components/modules/Repository/ModuleLayout";
import MyCommunities from "./pages/groups/MyCommunities";
import Forums from "./pages/groups/Forums";
import Resources from "./pages/groups/Resources";
import GroupsPublic from "./pages/GroupsPublic";
import GroupDetail from "./pages/GroupDetail";
import Popular from "./pages/repository/Popular";
import MyRepositories from "./pages/repository/MyRepositories";
import Manage from "./pages/repository/Manage";
import SearchRepo from "./pages/repository/Search";
import Favorites from "./pages/repository/Favorites";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<AppLayout><Home /></AppLayout>} />
        <Route path="/cursos" element={<AppLayout><Placeholder title="Cursos" /></AppLayout>} />
        <Route path="/evaluaciones" element={<AppLayout><Placeholder title="Evaluaciones" /></AppLayout>} />
        <Route path="/repositorio" element={<AppLayout><RepositoryModuleLayout /></AppLayout>}>
          <Route index element={<Popular />} />
          <Route path="populares" element={<Popular />} />
          <Route path="mis" element={<MyRepositories />} />
          <Route path="gestionar/:id" element={<Manage />} />
          <Route path="buscar" element={<SearchRepo />} />
          <Route path="favoritos" element={<Favorites />} />
        </Route>
        <Route path="/grupos" element={<AppLayout><GroupsModuleLayout /></AppLayout>}>
          <Route index element={<MyCommunities />} />
          <Route path="publicos" element={<GroupsPublic />} />
          <Route path="foros" element={<Forums />} />
          <Route path="recursos" element={<Resources />} />
          <Route path=":id" element={<GroupDetail />} />
        </Route>
        <Route path="/docente" element={<AppLayout><Placeholder title="Dashboard Docente" /></AppLayout>} />
        <Route path="/habitos" element={<AppLayout><Placeholder title="Planificación y Hábitos" /></AppLayout>} />
        <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

const rootEl = document.getElementById("root")! as HTMLElement & { __root?: ReturnType<typeof createRoot> };
let root = rootEl.__root;
if (!root) {
  root = createRoot(rootEl);
  rootEl.__root = root;
}
root.render(<App />);

if (import.meta.hot) {
  import.meta.hot.accept?.();
  import.meta.hot.dispose?.(() => {
    try {
      rootEl.__root?.unmount();
    } finally {
      delete rootEl.__root;
    }
  });
}
