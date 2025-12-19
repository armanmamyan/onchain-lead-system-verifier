"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatAddress } from "@/lib/utils/web3";
import Link from "next/link";
import { useAirkit } from "@/hooks/useAirkit";
import { Button } from "../ui/button";
import { DialogHeader } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { PlusCircle } from "lucide-react";

export const Header = () => {
  const { airService, isLoggedIn, loginResult } = useAirkit();

  const logout = async () => {
    if (airService.isLoggedIn) {
      await airService.logout();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between mx-auto">
        <Link
          href="/"
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Oyunfor
          </h1>
        </Link>
        <div className="flex items-center space-x-2">
        <Link
          href="submit-ad"
        >
          <Button variant="default" size="sm" className="mr-4 cursor-pointer">
            <PlusCircle className="mr-2 h-4 w-4" />
            Advertise with us
          </Button>
        </Link>
        {isLoggedIn ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="mr-4 cursor-pointer">
                Logout
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[300px]">
              <DialogHeader>
                <DialogTitle>Account</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-mono text-sm">
                    {loginResult?.abstractAccountAddress
                      ? formatAddress(loginResult?.abstractAccountAddress)
                      : "N/A"}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => logout()}
                  className="w-full"
                >
                  Logout
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Badge variant="secondary" className="hidden sm:flex">
            AIR Kit Partner
          </Badge>
        )}
        </div>
      </div>
    </header>
  );
};
