"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import WalletAuth from '../WalletAuth'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const contests = [
  {
    title: "Daily Challenge",
    href: "/contests/daily",
    description: "Compete daily to recreate the image of the day using AI prompts.",
  },
  {
    title: "Weekly Tournament",
    href: "/contests/weekly",
    description: "Join our weekly tournament with higher stakes and bigger rewards.",
  },
  {
    title: "Community Choice",
    href: "/contests/community",
    description: "Community-voted themes and challenges with unique rewards.",
  },
  {
    title: "Pro League",
    href: "/contests/pro",
    description: "Exclusive contests for top performers with premium prizes.",
  },
]

const ListItem = React.forwardRef((props, ref) => {
  const { className, title, children, ...rest } = props;
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-amber-50 hover:text-amber-900 focus:bg-amber-50 focus:text-amber-900",
            className
          )}
          {...rest}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 mx-4 my-2 bg-amber-100 bg-opacity-80 backdrop-filter backdrop-blur-lg text-amber-900 p-4 rounded-2xl z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold font-mono">
          <Link href="/">
            WhoIsTheBoss
          </Link>
        </div>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent hover:bg-amber-50 hover:text-amber-900">
                Contests
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {contests.map((contest) => (
                    <ListItem
                      key={contest.title}
                      title={contest.title}
                      href={contest.href}
                    >
                      {contest.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link href="/#faq" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  FAQs
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/leaderboard" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Leaderboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <WalletAuth />
      </div>
    </nav>
  )
}
