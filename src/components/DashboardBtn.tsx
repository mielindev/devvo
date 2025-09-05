"use client";

import { SparkleIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import useUserRole from "@/hooks/useUserRole";

const DashboardBtn = () => {
  const { isLoading, isCandidate } = useUserRole();

  if (isCandidate || isLoading) return null;
  return (
    <Link href="/dashboard">
      <Button className="gap-2 font-medium">
        <SparkleIcon className="size-4" />
        Dashboard
      </Button>
    </Link>
  );
};

export default DashboardBtn;
