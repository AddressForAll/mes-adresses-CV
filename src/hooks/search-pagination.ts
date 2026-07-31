import { useSearchParams, usePathname } from "next/navigation";
import { useCallback, useContext, useEffect } from "react";
import useFuse from "./fuse";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";
import SearchPaginationContext from "@/contexts/search-pagination";

export const QUERY_PAGE = "page";
export const QUERY_SEARCH = "search";

type UsePaginationType<T> = [
  page: number,
  changePage: (page: number) => void,
  search: string | null,
  changeFilter: (page: string) => void,
  filtered: Array<T>,
];

export function getLinkWithPagination(
  href: string,
  savedSearchPagination: { page: number; search: string }
): string {
  const { page, search } = savedSearchPagination;

  if (page > 1) {
    href += `?${QUERY_PAGE}=${page}`;
  }

  if (search) {
    if (href.includes("?")) {
      href += `&${QUERY_SEARCH}=${encodeURIComponent(search)}`;
    } else {
      href += `?${QUERY_SEARCH}=${encodeURIComponent(search)}`;
    }
  }

  return href;
}

export function useSearchPagination<T>(
  tab: TabsEnum,
  items: Array<T>
): UsePaginationType<T> {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { setSavedSearchPagination } = useContext(SearchPaginationContext);

  const page = Number(searchParams.get(QUERY_PAGE)) || 1;
  const search: string = searchParams.get(QUERY_SEARCH) || "";
  const [filtered, setFilter] = useFuse(
    items,
    200,
    {
      keys: ["nom"],
    },
    search
  );

  useEffect(() => {
    setSavedSearchPagination((prev) => ({
      ...prev,
      [tab]: { page, search },
    }));
  }, [search, page, tab, setSavedSearchPagination]);

  const changePage = useCallback(
    (change: number) => {
      const nextSearchParams = new URLSearchParams(searchParams.toString());
      if (change === 1) {
        nextSearchParams.delete(QUERY_PAGE);
      } else {
        nextSearchParams.set(QUERY_PAGE, String(change));
      }
      // Shallow update: keeps useSearchParams() in sync without a server
      // round-trip (router.replace refetches the RSC payload on every call,
      // which wedges the UI when the server is slow)
      window.history.replaceState(null, "", `${pathname}?${nextSearchParams}`);
    },
    [pathname, searchParams]
  );

  const changeFilter = useCallback(
    (change: string) => {
      const nextSearchParams = new URLSearchParams(searchParams.toString());
      if (!change || change === "") {
        nextSearchParams.delete(QUERY_SEARCH);
      } else {
        nextSearchParams.set(QUERY_SEARCH, change);
      }
      nextSearchParams.delete(QUERY_PAGE);
      // Shallow update (see changePage): a per-keystroke router.replace made
      // the controlled search input revert to the stale URL value between
      // keystrokes, eating typed characters
      window.history.replaceState(null, "", `${pathname}?${nextSearchParams}`);

      setFilter(change);
    },
    [setFilter, pathname, searchParams]
  );

  return [page, changePage, search, changeFilter, filtered];
}
