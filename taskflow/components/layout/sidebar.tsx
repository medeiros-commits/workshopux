"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Columns3,
  CreditCard,
  AtSign,
  LogOut,
  ChevronDown,
  Check,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTodoLists } from "@/hooks/use-todo-lists";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Active sprints",
    href: "/dashboard",
    icon: Columns3,
    exact: true,
  },
];

const BOTTOM_ITEMS = [
  {
    label: "Planos e pagamentos",
    href: "/settings/billing",
    icon: CreditCard,
  },
];

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: lists } = useTodoLists();

  const selectedListId = searchParams.get("list");
  const activeList =
    lists?.find((l) => l.id === selectedListId) || lists?.[0] || null;

  function handleSelectList(listId: string) {
    router.push(`/dashboard?list=${listId}`);
  }

  return (
    <aside className="flex h-full w-[240px] shrink-0 flex-col border-r border-[#E5E9EB] bg-[#F6F8F9]">
      {/* Project header */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex w-full items-center gap-2 px-4 pt-4 pb-4 text-left hover:bg-[#E5E9EB]/50 transition-colors rounded-md mx-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#0E73F6] text-white">
              <AtSign className="h-5 w-5" />
            </div>
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="truncate text-sm font-semibold leading-6 tracking-[-0.084px] text-[#252C32]">
                {activeList?.name || "Task Manager"}
              </span>
              <span className="text-xs leading-4 text-[#84919A]">
                {lists?.length
                  ? `${lists.length} board${lists.length !== 1 ? "s" : ""}`
                  : "Nenhum board"}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 text-[#84919A]" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[220px]">
          <DropdownMenuLabel>Seus boards</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {lists && lists.length > 0 ? (
            lists.map((list) => (
              <DropdownMenuItem
                key={list.id}
                onClick={() => handleSelectList(list.id)}
                className="flex items-center justify-between"
              >
                <span className="truncate">{list.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#9AA6AC]">
                    {list.items.length}
                  </span>
                  {list.id === activeList?.id && (
                    <Check className="h-4 w-4 text-[#0E73F6]" />
                  )}
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>
              Crie um board para começar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0 px-4">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-2 rounded-md px-2 py-1 text-sm tracking-[-0.084px] transition-colors ${
                isActive
                  ? "bg-[#D7EDFF] font-semibold text-[#0E73F6]"
                  : "font-normal text-[#252C32] hover:bg-[#E5E9EB]"
              }`}
            >
              <Icon className="h-6 w-6 shrink-0" />
              <span className="leading-6">{item.label}</span>
            </Link>
          );
        })}

        {/* Divider */}
        <div className="my-2 h-px bg-[#E5E9EB]" />

        {BOTTOM_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-2 rounded-md px-2 py-1 text-sm tracking-[-0.084px] transition-colors ${
                isActive
                  ? "bg-[#D7EDFF] font-semibold text-[#0E73F6]"
                  : "font-normal text-[#252C32] hover:bg-[#E5E9EB]"
              }`}
            >
              <Icon className="h-6 w-6 shrink-0" />
              <span className="leading-6">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      {session?.user && (
        <div className="border-t border-[#E5E9EB] px-4 py-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={session.user.image || ""}
                alt={session.user.name || ""}
              />
              <AvatarFallback className="bg-[#D7EDFF] text-xs font-semibold text-[#0452C8]">
                {session.user.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="truncate text-sm font-medium text-[#252C32]">
                {session.user.name}
              </span>
              <span className="truncate text-xs text-[#84919A]">
                {session.user.email}
              </span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="shrink-0 rounded-md p-1 text-[#84919A] hover:bg-[#E5E9EB] hover:text-[#252C32]"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
