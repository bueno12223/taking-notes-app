"use client";

import AppLayout from "@/components/layouts/AppLayout";
import EmptyState from "@/components/home/EmptyState";

const MOCK_CATEGORIES = [
  { name: "Random Thoughts", color: "#EF9C66" },
  { name: "School", color: "#FCDC94" },
  { name: "Personal", color: "#78ABA8" },
];

export default function HomePage() {
  return (
    <AppLayout categories={MOCK_CATEGORIES}>
      <EmptyState />
    </AppLayout>
  );
}
