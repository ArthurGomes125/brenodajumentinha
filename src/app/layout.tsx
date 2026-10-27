import type { Metadata } from "next";
import "./globals.css";
import StudyFlowShell from "./studyflow-shell";
export const metadata: Metadata = { title: "StudyFlow", description: "Sua rotina de estudos em um so lugar." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body><StudyFlowShell>{children}</StudyFlowShell></body></html>; }
