import type { ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";

export interface PaginationBarProps {
  href: string;
  page: number;
  pageCount: number;
}

export default function PaginationBar({
  href,
  page,
  pageCount,
}: PaginationBarProps) {
  return (
    <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
      <PaginationLink href={`${href}?page=${page - 1}`} enabled={page > 1}>
        <ChevronLeftIcon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
        <span className="sr-only">Previous Page</span>
      </PaginationLink>
      {pageCount > 0 ? (
        <span className="mx-2 rounded-lg border border-gray-light-400 bg-white px-3 py-1 text-sm text-gray-800">
          Page {page} / {pageCount}
        </span>
      ) : (
        <span className="mx-2 rounded-lg border border-gray-light-400 bg-white px-3 py-1 text-sm text-gray-800">
          Page {page} / 1
        </span>
      )}
      <PaginationLink
        href={`${href}?page=${page + 1}`}
        enabled={page < pageCount}
      >
        <ChevronRightIcon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
        <span className="sr-only">Next Page</span>
      </PaginationLink>
    </div>
  );
}

interface PaginationLinkProps {
  children: ReactNode;
  enabled: boolean;
  href: string;
}

function PaginationLink({ children, enabled, href }: PaginationLinkProps) {
  if (!enabled) {
    return (
      <span className="cursor-not-allowed rounded border border-gray-light-400 text-sm text-gray-800 dark:text-gray-200">
        {children}
      </span>
    );
  }
  return (
    <Link
      to={href}
      className="rounded border text-sm text-gray-800 hover:bg-orange-100 hover:text-slate-700 dark:text-gray-200"
    >
      {children}
    </Link>
  );
}
