import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  SkipForward,
  Maximize2,
  ShieldCheck,
  Zap,
  Globe,
  Mail,
  ChevronRight,
  Tv,
  Users,
  Github,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

// Branding & Config
const BRAND_NAME = "StreamZen";
const COMPANY_NAME = "Victhereum Technologies";
const COMPANY_URL = "https://victhereum.com";
const SUPPORT_EMAIL = "hi@victhereum.com";
const GITHUB_URL = "https://github.com/victhereum/StreamZen";

const SUPPORTED_SITES = [
  "moviebox.ph",
  "123movienow.cc",
  "netnaija.film",
  "sflix.film",
  "movieboxonline.net",
  "moviebox.id",
  "moviebox.pk",
  "moviebox.in",
];

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              {/* <Zap className="text-black w-5 h-5" /> */}
              
               <img src="logo-black.png" className="w-6 h-6" alt="logo" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              {BRAND_NAME}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a
              href="#features"
              className="hover:text-primary transition-colors"
            >
              Features
            </a>
            <a href="#about" className="hover:text-primary transition-colors">
              About
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-2"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
          </div>
          <Button size="sm" className="font-semibold px-6">
            Get StreamZen
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden lg:pt-48 lg:pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge
                variant="secondary"
                className="mb-6 py-1 px-4 border-primary/20 text-primary"
              >
                Your Movie Night, Upgraded.
              </Badge>
              <h1 className="text-6xl lg:text-8xl font-extrabold tracking-tighter mb-8 leading-[0.9]">
                Watch Movies. <br />
                <span className="text-primary">Skip the Rest.</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                StreamZen automates the annoying parts of moviebox streaming.
                No more manually skipping intros or fumbling with your mouse
                between episodes.
              </p>
              <div className="flex flex-col items-center justify-center gap-6">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                  <Button
                    size="lg"
                    className="h-14 px-10 text-lg font-bold w-full sm:w-auto shadow-lg shadow-primary/20"
                  >
                    Add to Chrome — It's Free
                  </Button>
                </div>

                <motion.a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border hover:bg-muted transition-colors text-sm font-medium"
                >
                  <Github className="w-4 h-4" />
                  <span>Open Source on GitHub</span>
                  <div className="w-[1px] h-3 bg-border mx-1" />
                  <div className="flex items-center gap-1 text-primary">
                    <Star className="w-3 h-3 fill-primary" />
                    <span>1.2k+</span>
                  </div>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scrolling Supported Sites */}
      <section className="py-12 border-y border-border/50 bg-muted/20 overflow-hidden">
        <div className="container mx-auto px-4 mb-6">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-50">
            Works Seamlessly On
          </p>
        </div>
        <div className="relative flex overflow-x-hidden">
          <div className="animate-marquee whitespace-nowrap flex items-center">
            {[...SUPPORTED_SITES, ...SUPPORTED_SITES].map((site, i) => (
              <span
                key={i}
                className="mx-8 text-2xl font-bold tracking-tighter text-muted-foreground/30 hover:text-primary/50 transition-colors cursor-default"
              >
                {site}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Simplified features focus */}
      <section id="features" className="py-24 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Instant Skip",
                desc: "Intros disappear with one click. StreamZen knows exactly when the story starts.",
                icon: <SkipForward className="w-6 h-6" />,
              },
              {
                title: "Smart Autoplay",
                desc: "The next episode starts automatically. No manual clicking required.",
                icon: <Play className="w-6 h-6" />,
              },
              {
                title: "Total Fullscreen",
                desc: "Once you go fullscreen, you stay there. Episodes swap without exiting.",
                icon: <Maximize2 className="w-6 h-6" />,
              },
              {
                title: "Pure Focus",
                desc: "We clear away ads and distractions so you can just enjoy the film.",
                icon: <ShieldCheck className="w-6 h-6" />,
              },
            ].map((f, i) => (
              <div key={i} className="flex flex-col">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary border border-primary/20">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section id="about" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-background border rounded-3xl p-8 md:p-16 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Tv className="w-64 h-64" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4">Simplified Experience</Badge>
                <h2 className="text-4xl font-bold mb-6 tracking-tight">
                  The "Netflix Experience" on Every Site.
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Streaming should be relaxing. But for many sites, you have to
                  stay alert just to skip the boring parts. StreamZen changes
                  that.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-primary/20 p-1 rounded">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <span className="font-bold">Zero Setup.</span>
                      <p className="text-sm text-muted-foreground">
                        Just install and start watching. StreamZen handles
                        everything.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-primary/20 p-1 rounded">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <span className="font-bold">Made for Everyone.</span>
                      <p className="text-sm text-muted-foreground">
                        Used by thousands of movie fans across the globe.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-muted/50 border-none">
                  <CardHeader className="p-6">
                    <div className="text-3xl font-bold text-primary mb-1">
                      100%
                    </div>
                    <CardDescription className="text-xs uppercase font-bold tracking-widest text-foreground">
                      Automation
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card className="bg-muted/50 border-none">
                  <CardHeader className="p-6">
                    <div className="text-3xl font-bold text-primary mb-1">
                      FREE
                    </div>
                    <CardDescription className="text-xs uppercase font-bold tracking-widest text-foreground">
                      Forever
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card className="bg-muted/50 border-none col-span-2">
                  <CardHeader className="p-6">
                    <div className="text-lg font-bold mb-1 italic">
                      "It just works. I haven't clicked 'Skip' in months."
                    </div>
                    <CardDescription className="text-xs opacity-50">
                      — Happy User
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Victhereum Banner Section - Professional Minimal */}
      <section className="py-24 text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Crafted for Excellence by
          </p>
          <a
            href={COMPANY_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 grayscale hover:grayscale-0 transition-all group"
          >
            <span className="text-2xl font-bold tracking-tighter group-hover:text-primary">
              {COMPANY_NAME}
            </span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <p className="mt-4 text-muted-foreground max-w-sm mx-auto">
            Providing professional web services for your next big idea.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50 text-muted-foreground">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
               <img src="logo.png" className="w-6 h-6 text-primary" alt="logo" />
            <span className="font-bold text-foreground tracking-tight">
              {BRAND_NAME}
            </span>
          </div>

          <div className="flex gap-8 text-sm">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="hover:text-primary transition-colors flex items-center gap-2"
            >
              <Mail className="w-4 h-4" /> Support
            </a>
            <a
              href={GITHUB_URL}
              className="hover:text-primary transition-colors flex items-center gap-2"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a
              href={COMPANY_URL}
              className="hover:text-primary transition-colors flex items-center gap-2"
            >
              <Globe className="w-4 h-4" /> Our Website
            </a>
          </div>

          <div className="text-xs font-mono opacity-50">
            © 2026 Victhereum Technologies.
          </div>
        </div>
      </footer>
    </div>
  );
}
