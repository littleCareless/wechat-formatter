import type { Metadata } from "next";
import { EDITOR_TITLE, EDITOR_DESCRIPTION } from "@/lib/site-config";

export const metadata: Metadata = {
  title: EDITOR_TITLE,
  description: EDITOR_DESCRIPTION,
};

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
