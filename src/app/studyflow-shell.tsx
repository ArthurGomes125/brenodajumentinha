"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type Account = { name: string; email: string };
type AuthValue = { account: Account | null; logout: () => void };
const AuthContext = createContext<AuthValue>({ account: null, logout: () => {} });
export const useAuth = () => useContext(AuthContext);

const navigation = [
  { name: "Dashboard", href: "/", icon: 0x1f3e0 },
  { name: "Materi\u00e1s", href: "/materias", icon: 0x1f4da },
  { name: "Tarefas", href: "/tarefas", icon: 0x2705 },
  { name: "Calend\u00e1rio", href: "/calendario", icon: 0x1f4c5 },
  { name: "Cronograma", href: "/cronograma", icon: 0x23f0 },
  { name: "Progresso", href: "/progresso", icon: 0x1f4ca },
  { name: "Configura\u00e7\u00f5es", href: "/configuracoes", icon: 0x2699 },
  { name: "Equipe", href: "/equipe", icon: 0x1f465 },
];

function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return <aside className={"sidebar " + (collapsed ? "collapsed" : "")}>
    <div className="sidebar-header">
      <div className="logo">{collapsed ? "S." : "StudyFlow."}</div>
      <button className="collapse-button" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Expandir menu" : "Recolher menu"} title={collapsed ? "Expandir menu" : "Recolher menu"}>{collapsed ? ">>" : "<<"}</button>
    </div>
    <nav className="menu" aria-label={"Navega\u00e7\u00e3o principal"}>{navigation.map((item) => <Link key={item.href} href={item.href} className={pathname === item.href ? "ativo" : ""} title={item.name}>
      <span className="nav-icon">{String.fromCodePoint(item.icon)}</span>{!collapsed && <span>{item.name}</span>}
    </Link>)}</nav>
  </aside>;
}

export default function StudyFlowShell({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [ready, setReady] = useState(false);
  const [dark, setDark] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    try {
      setAccount(JSON.parse(localStorage.getItem("studyflow-session") || "null"));
      setDark(localStorage.getItem("studyflow-theme") === "dark");
    } catch { setAccount(null); }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const publicRoute = ["/login", "/cadastro"].includes(pathname);
    if (!account && !publicRoute) router.replace("/login");
    if (account && publicRoute) router.replace("/");
  }, [account, pathname, ready, router]);

  useEffect(() => { document.body.classList.toggle("theme-dark", dark); }, [dark]);

  function logout() {
    localStorage.removeItem("studyflow-session");
    setAccount(null);
    router.replace("/login");
  }

  if (!ready) return null;
  return <AuthContext.Provider value={{ account, logout }}>
    {["/login", "/cadastro"].includes(pathname) ? children : account ? <div className="app-layout"><Sidebar /><main className="conteudo">{children}</main></div> : null}
  </AuthContext.Provider>;
}
