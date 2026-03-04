import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Rajesh Kumar",
    review: "Absolutely stunning collection! The discus fish I bought are healthy and vibrant. Best aquarium store in Bangalore.",
    rating: 5,
    initials: "RK",
  },
  {
    name: "Priya Sharma",
    review: "Amazing variety of plants and expert advice on aquascaping. My planted tank has never looked better!",
    rating: 5,
    initials: "PS",
  },
  {
    name: "Arun Mehta",
    review: "Great customer service and quality products. The LED lighting system transformed my aquarium. Highly recommend!",
    rating: 4,
    initials: "AM",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-primary font-display font-semibold text-sm tracking-widest uppercase">
            Testimonials
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-2">
            What Our Customers Say
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="glass rounded-2xl p-6 md:p-8 card-hover animate-float"
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star
                    key={si}
                    className={`h-4 w-4 ${
                      si < t.rating ? "fill-accent text-accent" : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <p className="text-foreground/80 text-sm leading-relaxed mb-6">
                "{t.review}"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-display font-bold text-sm text-primary">
                  {t.initials}
                </div>
                <span className="font-display font-semibold text-sm">{t.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
