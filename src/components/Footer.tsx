"use client";

import { Fish, Phone, MapPin, Mail, Instagram, Facebook, Youtube } from "lucide-react";
import Link from "next/link";
import { useSettings } from "@/hooks/useSettings";

const Footer = () => {
  const { data: settings } = useSettings();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Fish className="h-6 w-6 text-primary" />
              <span className="font-display font-bold text-lg">{settings?.websiteName || "Aquarium World"}</span>
            </div>
            <p className="text-secondary-foreground/70 text-sm leading-relaxed mb-4">
              Bangalore's premium destination for exotic fish, stunning aquariums, and everything aquatic.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-9 w-9 rounded-lg bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-4 text-primary">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2">
              {["Home", "Shop", "Categories", "Contact"].map((item) => (
                <Link
                  key={item}
                  href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-4 text-primary">
              Categories
            </h4>
            <div className="flex flex-col gap-2">
              {["Aquariums", "Exotic Fish", "Aquatic Plants", "Lighting", "Filters", "Decorations"].map((item) => (
                <span key={item} className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors cursor-pointer">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-4 text-primary">
              Contact Us
            </h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3 text-sm text-secondary-foreground/70">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>{settings?.address || "123 MG Road, Bangalore, Karnataka 560001, India"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-secondary-foreground/70">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>{settings?.phone || "+91 98765 43210"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-secondary-foreground/70">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>hello@aquariumworld.in</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-12 pt-6 text-center text-sm text-secondary-foreground/50">
          © {new Date().getFullYear()} {settings?.websiteName || "Aquarium World"}. All rights reserved. Bangalore, India.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
