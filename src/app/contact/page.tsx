"use client";
import { motion } from "framer-motion";
import { Phone, MapPin, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/useSettings";

const Contact = () => {
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", message: "", email: "no-email@contact.form" });
  const { data: settings } = useSettings();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        setSent(true);
        toast({ title: "Message Sent", description: "We will get back to you shortly." });
        setFormData({ name: "", phone: "", message: "", email: "no-email@contact.form" });
      } else {
        toast({ title: "Failed to send", description: data.error || "Please try again later.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 md:pt-28 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-14"
          >
            <h1 className="font-display font-bold text-3xl md:text-5xl">Get in Touch</h1>
            <p className="text-muted-foreground mt-2">We'd love to hear from you</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="glass rounded-2xl p-6 card-hover">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-semibold">Phone</p>
                    <p className="text-muted-foreground text-sm">{settings?.phone || "+91 98765 43210"}</p>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 card-hover">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-[hsl(142,70%,45%)]/10 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-[hsl(142,70%,45%)]" />
                  </div>
                  <div>
                    <p className="font-display font-semibold">WhatsApp</p>
                    <a href={`https://wa.me/${settings?.phone?.replace(/\D/g, '') || "919876543210"}`} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline">
                      Chat with us
                    </a>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 card-hover">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-semibold">Address</p>
                    <p className="text-muted-foreground text-sm">{settings?.address || "123 MG Road, Bangalore 560001"}</p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="rounded-2xl overflow-hidden h-[200px]">
                <iframe
                  src={`/api/resolve-map?url=${encodeURIComponent(settings?.mapLocation || "")}&address=${encodeURIComponent(settings?.address || "123 MG Road, Bangalore 560001")}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Store Location"
                />
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <form
                onSubmit={handleSubmit}
                className="glass rounded-2xl p-6 md:p-8 space-y-5"
              >
                <h3 className="font-display font-bold text-xl mb-2">Send us a Message</h3>
                <div>
                  <label className="font-display font-semibold text-sm mb-1.5 block">Name</label>
                  <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-input bg-background font-body focus:ring-2 focus:ring-ring outline-none" placeholder="Your name" />
                </div>
                <div>
                  <label className="font-display font-semibold text-sm mb-1.5 block">Phone</label>
                  <input required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value, email: `${e.target.value}@phone.contact` })} className="w-full px-4 py-3 rounded-xl border border-input bg-background font-body focus:ring-2 focus:ring-ring outline-none" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="font-display font-semibold text-sm mb-1.5 block">Message</label>
                  <textarea required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={5} className="w-full px-4 py-3 rounded-xl border border-input bg-background font-body focus:ring-2 focus:ring-ring outline-none resize-none" placeholder="How can we help?" />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={sent || isLoading}>
                  {isLoading ? "Sending..." : sent ? "Message Sent ✓" : <><Send className="h-4 w-4 mr-2" /> Send Message</>}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Contact;
