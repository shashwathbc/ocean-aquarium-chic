"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero-underwater.jpg";
import { useSettings } from "@/hooks/useSettings";

const Hero = () => {
  const { data: settings } = useSettings();
  const bgUrl = settings?.heroBackground || (heroImg as any).src || (heroImg as unknown as string);
  const isVideo = bgUrl?.match(/\.(mp4|webm|ogg)$/i);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0">
        {isVideo ? (
          <video
            src={bgUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={bgUrl}
            alt="Underwater coral reef with tropical fish"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(210,50%,10%,0.4)] via-[hsl(210,50%,10%,0.3)] to-[hsl(210,50%,10%,0.8)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-block px-4 py-1.5 rounded-full text-xs font-display font-semibold tracking-widest uppercase mb-6 bg-primary/20 text-[hsl(185,80%,70%)] border border-primary/30 backdrop-blur-sm"
          >
            Bangalore's Premium Aquarium Store
          </motion.span>

          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-7xl leading-tight mb-6 text-[hsl(0,0%,100%)]">
            Bring the Ocean
            <br />
            <span className="text-[hsl(185,80%,65%)]">Into Your Home</span>
          </h1>

          <p className="text-lg md:text-xl text-[hsl(200,20%,80%)] max-w-xl mx-auto mb-10 font-body">
            Premium Aquariums, Exotic Fish & Accessories — curated for enthusiasts who demand the extraordinary.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button variant="hero" size="xl">
                Shop Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="hero-outline" size="xl">
                Contact Us
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
