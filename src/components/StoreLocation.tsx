import { MapPin, Phone, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useSettings } from "@/hooks/useSettings";

const StoreLocation = () => {
  const { data: settings } = useSettings();
  const address = settings?.address || "123 MG Road, Near Brigade Road Junction, Bangalore, Karnataka 560001";
  const phone = settings?.phone || "+91 98765 43210";
  const directionsUrl = settings?.mapLocation || "https://www.google.com/maps/dir//12.9715987,77.5945627";

  // Use our internal resolver to unpack shortlinks natively into the iframe
  const mapEmbedUrl = `/api/resolve-map?url=${encodeURIComponent(settings?.mapLocation || "")}&address=${encodeURIComponent(address)}`;

  return (
    <section className="py-20 md:py-28 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-primary font-display font-semibold text-sm tracking-widest uppercase">
            Visit Us
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-2">
            Our Store Location
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl overflow-hidden shadow-lg min-h-[350px]"
          >
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 350 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${settings?.websiteName || "Aquarium World"} - Store Location`}
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl p-8 md:p-10 flex flex-col justify-center"
          >
            <h3 className="font-display font-bold text-2xl mb-6">
              {settings?.websiteName || "Aquarium World"} – Bangalore
            </h3>

            <div className="space-y-5 mb-8">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-display font-semibold text-sm">Address</p>
                  <p className="text-muted-foreground text-sm whitespace-pre-line">
                    {address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-display font-semibold text-sm">Phone</p>
                  <p className="text-muted-foreground text-sm">{phone}</p>
                </div>
              </div>
            </div>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="default" size="lg" className="w-full sm:w-auto">
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StoreLocation;
