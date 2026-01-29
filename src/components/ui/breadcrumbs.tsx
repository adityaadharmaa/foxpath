import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadCrumbItem {
  label: string;
  path?: string;
}

interface BreadCrumbsProps {
  items?: BreadCrumbItem[];
  className?: string;
}

export default function BreadCrumbs({
  items = [],
  className,
}: BreadCrumbsProps) {
  return (
    <nav
      aria-label="BreadCrumb"
      className={cn(
        "flex items-center text-sm text-slate-500 dark:text-slate-400 mb-4",
        className,
      )}
    >
      <Link
        to="/admin/dashboard"
        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
      >
        <Home size={16} />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center">
            <ChevronRight size={14} className="mx-2 text-slate-400" />

            {isLast ? (
              <span className="font-medium text-slate-900 dark:text-slate-200">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path || "#"}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
