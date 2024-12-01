import DeployButton from "@/components/deploy-button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Card,
} from "@/components/ui/card"

import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold">
                    <Link href={"/"}>Vlrpusher</Link>
                    <NavigationMenu>
                      <NavigationMenuList>
                        {/* Push Dropdown */}
                        <NavigationMenuItem>
                          <NavigationMenuTrigger>Push</NavigationMenuTrigger>
                          <NavigationMenuContent className="flex min-w-[300px] flex-col gap-2 p-4 bg-card text-card-foreground rounded-lg shadow-lg space-y-2 sm:flex-row sm:min-w-[600px] sm:space-y-0">
                            {/* Left Column */}
                            <Card className="px-4 py-2 w-full sm:w-1/3 bg-muted border-0">
                              <h3 className="text-lg font-semibold text-foreground">Setup</h3>
                              <p className="text-sm font-normal text-muted-foreground">
                                Learn about the Push setup and configuration options available for seamless integration.
                              </p>
                            </Card>
                            {/* Right Column */}
                            <Card className="flex flex-col gap-2 w-full sm:w-2/3 border-0">
                              <Link href="/push/lineup" legacyBehavior passHref>
                                <NavigationMenuLink className="px-4 py-2 hover:bg-muted rounded-md">
                                  <h3 className="text-lg font-semibold text-foreground">Lineup</h3>
                                  <p className="text-sm font-normal text-muted-foreground">
                                    Explore lineups for the best setups and strategies.
                                  </p>
                                </NavigationMenuLink>
                              </Link>
                              <Link href="/#push/Setup#" legacyBehavior passHref>
                                <NavigationMenuLink className="px-4 py-2 hover:bg-muted rounded-md">
                                  <h3 className="text-lg font-semibold text-foreground">Setup</h3>
                                  <p className="text-sm font-normal text-muted-foreground">
                                    Understand the configuration options in detail.
                                  </p>
                                </NavigationMenuLink>
                              </Link>
                            </Card>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>

                  </div>
                  <div className="flex items-center space-x-2">
                    {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                    {/* Hide ThemeSwitcher on mobile */}
                    <div className="hidden md:block">
                      <ThemeSwitcher />
                    </div>
                  </div>

                </div>
              </nav>
              <div className="flex flex-col item-center gap-20">
                {children}
              </div>

              <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
                <p>
                  Powered by{" "}
                  <a
                    href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    Supabase
                  </a>
                </p>
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
