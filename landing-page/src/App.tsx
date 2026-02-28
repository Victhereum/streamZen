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
import { useMemo } from "react";

// Branding & Config
const BRAND_NAME = "StreamZen";
const COMPANY_NAME = "Victhereum Technologies";
const COMPANY_URL = "https://victhereum.com";
const SUPPORT_EMAIL = "hi@victhereum.com";
const GITHUB_URL = "https://github.com/victhereum/streamZen";
const CHROME_STORE_URL =
  "https://chromewebstore.google.com/detail/streamzen-cinematic-compa/ffkoailjikbieofjmojdpnhfcighomli";

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

// Browser SVG icons (inline for zero-dependency)
function ChromeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Google Chrome</title>
      <path d="M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545h10.691A12 12 0 0 0 12 0zM1.931 5.47A11.943 11.943 0 0 0 0 12c0 6.012 4.42 10.991 10.189 11.864l3.953-6.847a5.45 5.45 0 0 1-6.865-2.29zm13.342 2.166a5.446 5.446 0 0 1 1.45 7.09l.002.001h-.002l-5.344 9.257c.206.01.413.016.621.016 6.627 0 12-5.373 12-12 0-1.54-.29-3.011-.818-4.364zM12 16.364a4.364 4.364 0 1 1 0-8.728 4.364 4.364 0 0 1 0 8.728Z" />
    </svg>
  );
}

function EdgeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="800px"
      height="800px"
      viewBox="0 0 192 192"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <path
        fill="#000000"
        d="m155.601 132.18 2.767 5.324.024-.012.023-.013-2.814-5.299Zm-6.128 2.719-2.089-5.625-.005.002 2.094 5.623Zm-20.754 3.701.02-6h-.02v6ZM77.556 95.627l-6-.066v.066h6Zm9.481-15.79-2.547-5.432-.053.025-.052.025 2.652 5.382Zm33.126 86.12 1.765 5.735.098-.03.097-.034-1.96-5.671Zm38.502-30.538 5.075 3.201.031-.051.031-.051-5.137-3.099Zm-75.56 26.143-3.166 5.096 1.455.904h1.712v-6Zm-13.122-12.32 4.886-3.482-.02-.028-.02-.028-4.846 3.538Zm26.072-71.718-.084 6h.039l.045-6Zm14.858 7.519 4.815-3.58-.004-.005-.005-.007-4.806 3.592Zm-81.86 42.395-5.443 2.525.006.012.006.012 5.43-2.549Zm90.416 38.751 1.901 5.691-3.709-11.412 1.808 5.721Zm-36.305-4.627 3.184-5.085-1.46-.915h-1.724v6Zm51.74-41.065v6h.004l-.004-6Zm17.517-4.8-3.03-5.179-.013.007-.012.008 3.055 5.164Zm17.574-30.596-5.999-.08-.001.035v.035l6 .01Zm-6.532-25.391 5.367-2.682-.016-.031-.015-.031-5.336 2.744ZM95.998 22v6-6ZM22 94.99l-6-.081 12 .166-6-.084Zm70.53-32.388-2.788 5.313.058.03.058.03 2.671-5.373Zm17.863 16.946-5.225 2.95.012.021.012.02 5.201-2.99Zm1.078 36.609-3.373 4.962 3.373-4.962Zm41.362 10.7a48.23 48.23 0 0 1-5.449 2.417l4.177 11.249a60.077 60.077 0 0 0 6.807-3.019l-5.535-10.647Zm-5.454 2.419a52.899 52.899 0 0 1-18.64 3.324l-.041 12a64.865 64.865 0 0 0 22.868-4.079l-4.187-11.245Zm-18.66 3.324c-25.171 0-45.163-17.146-45.163-36.973h-12c0 28.525 27.645 48.973 57.163 48.973v-12ZM83.556 95.693a12.226 12.226 0 0 1 1.743-6.16l-10.288-6.177a24.225 24.225 0 0 0-3.454 12.205l11.999.132Zm1.743-6.16a12.213 12.213 0 0 1 4.615-4.43l-5.754-10.53a24.215 24.215 0 0 0-9.149 8.784L85.3 89.534Zm35.877 82.39.752-.231-3.531-11.469-.751.231 3.53 11.469Zm.947-.295a80.18 80.18 0 0 0 41.617-33.008l-10.151-6.401a68.177 68.177 0 0 1-35.387 28.068l3.921 11.341Zm41.679-33.11a8.311 8.311 0 0 0 1.147-5.185l-11.931 1.286a3.691 3.691 0 0 1 .509-2.299l10.275 6.198Zm1.147-5.185a8.312 8.312 0 0 0-2.226-4.823l-8.717 8.247a3.687 3.687 0 0 1-.988-2.138l11.931-1.286Zm-2.226-4.823a8.31 8.31 0 0 0-4.693-2.49l-1.942 11.842a3.687 3.687 0 0 1-2.082-1.105l8.717-8.247Zm-4.693-2.49a8.31 8.31 0 0 0-5.244.861l5.629 10.598a3.691 3.691 0 0 1-2.327.383l1.942-11.842Zm-71.757 30.445a39.79 39.79 0 0 1-11.404-10.705l-9.772 6.965a51.81 51.81 0 0 0 14.842 13.933l6.334-10.193Zm-11.445-10.761a40.684 40.684 0 0 1-7.058-16.116l-11.772 2.324a52.682 52.682 0 0 0 9.14 20.869l9.69-7.077Zm-7.058-16.116a40.696 40.696 0 0 1 .406-17.591l-11.654-2.864a52.699 52.699 0 0 0-.524 22.779l11.772-2.324Zm.406-17.591a40.68 40.68 0 0 1 7.792-15.773l-9.354-7.516a52.685 52.685 0 0 0-10.092 20.425l11.654 2.864Zm7.792-15.773A40.657 40.657 0 0 1 89.69 85.219l-5.304-10.763a52.658 52.658 0 0 0-17.771 14.252l9.354 7.516ZM89.585 85.27c1.865-.875 3.803-1.783 6.386-1.747l.169-11.998c-5.626-.08-9.816 2.02-11.65 2.88l5.095 10.865Zm6.424-1.746c1.963.015 3.895.484 5.647 1.37l5.418-10.707a24.722 24.722 0 0 0-10.972-2.663l-.093 12Zm5.647 1.37a12.722 12.722 0 0 1 4.45 3.74l9.613-7.183a24.724 24.724 0 0 0-8.645-7.263l-5.418 10.706Zm4.441 3.728a12.449 12.449 0 0 1 2.458 7.3l12-.127a24.458 24.458 0 0 0-4.827-14.331l-9.631 7.158Zm-90.039 6.373a81.335 81.335 0 0 0 7.552 34.968l10.886-5.051a69.333 69.333 0 0 1-6.438-29.81l-12-.107Zm7.564 34.992a80.009 80.009 0 0 0 40.908 39.546l4.727-11.029a68.013 68.013 0 0 1-34.773-33.616l-10.863 5.099Zm40.908 39.546a79.968 79.968 0 0 0 56.84 2.347l-3.802-11.382a67.97 67.97 0 0 1-48.31-1.994l-4.728 11.029Zm53.131-9.065a37.628 37.628 0 0 1-16.094 1.446l-1.517 11.904c7.13.909 14.372.258 21.227-1.908l-3.616-11.442Zm-16.094 1.446a37.637 37.637 0 0 1-15.218-5.437l-6.37 10.17a49.647 49.647 0 0 0 20.071 7.171l1.517-11.904Zm-18.403-6.352h-.058v12h.058v-12Zm24.934-34.443c5.432 3.693 12.601 4.862 17.649 5.271 5.124.414 9.76.107 9.157.107v-12c-.654 0-3.651.299-8.189-.068-4.614-.373-9.135-1.374-11.871-3.234l-6.746 9.924Zm26.81 5.378a40.437 40.437 0 0 0 20.568-5.637l-6.11-10.327a28.44 28.44 0 0 1-14.466 3.964l.008 12Zm20.543-5.622a41.494 41.494 0 0 0 15.027-15.149l-10.405-5.977a29.509 29.509 0 0 1-10.682 10.769l6.06 10.357Zm15.027-15.149a41.514 41.514 0 0 0 5.517-20.616l-12-.02a29.52 29.52 0 0 1-3.922 14.659l10.405 5.977Zm5.517-20.545c.195-14.55-5.254-24.33-7.165-28.153l-10.734 5.364c1.905 3.812 6.052 11.267 5.9 22.628l11.999.16Zm-7.196-28.215C155.266 30.65 126.527 16 95.998 16v12c26.935 0 51.035 12.88 62.129 34.454l10.672-5.488ZM95.999 16a79.98 79.98 0 0 0-56.175 23.042l8.427 8.544A67.98 67.98 0 0 1 95.997 28l.001-12ZM39.823 39.042A80.048 80.048 0 0 0 16 94.906l11.998.17a68.048 68.048 0 0 1 20.252-47.49l-8.427-8.544ZM28 95.073c.231-16.857 17.49-32.255 40.25-32.255v-12c-27.19 0-51.901 18.727-52.248 44.09L28 95.073Zm40.25-32.255c1.783 0 12.13.186 21.493 5.097l5.574-10.627c-12.027-6.309-24.804-6.47-27.067-6.47v12Zm21.609 5.157a35.98 35.98 0 0 1 15.31 14.524l10.449-5.901A47.979 47.979 0 0 0 95.2 57.229l-5.342 10.746Zm15.334 14.565c2.75 4.782 3.363 11.338 3.363 14.07h12c0-3.514-.659-12.574-4.961-20.053l-10.402 5.983Zm3.363 14.07c0-.005 0 .034-.006.125a8.485 8.485 0 0 1-.034.358c-.034.305-.09.694-.171 1.16a44.332 44.332 0 0 1-.727 3.315c-.647 2.523-1.515 5.145-2.406 7.054l10.872 5.078c1.316-2.817 2.403-6.21 3.157-9.149.715-2.785 1.315-5.869 1.315-7.94h-12Zm6.289 14.585c.4.272.729.64.954 1.043.215.385.294.724.321.942.026.215.008.353-.002.409a.433.433 0 0 1-.034.111l-10.872-5.078c-1.347 2.883-2.293 8.976 2.887 12.497l6.746-9.924Z"
      />
    </svg>
  );
}

function BraveIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Brave</title>
      <path d="M15.68 0l2.096 2.38s1.84-.512 2.709.358c.868.87 1.584 1.638 1.584 1.638l-.562 1.381.715 2.047s-2.104 7.98-2.35 8.955c-.486 1.919-.818 2.66-2.198 3.633-1.38.972-3.884 2.66-4.293 2.916-.409.256-.92.692-1.38.692-.46 0-.97-.436-1.38-.692a185.796 185.796 0 01-4.293-2.916c-1.38-.973-1.712-1.714-2.197-3.633-.247-.975-2.351-8.955-2.351-8.955l.715-2.047-.562-1.381s.716-.768 1.585-1.638c.868-.87 2.708-.358 2.708-.358L8.321 0h7.36zm-3.679 14.936c-.14 0-1.038.317-1.758.69-.72.373-1.242.637-1.409.742-.167.104-.065.301.087.409.152.107 2.194 1.69 2.393 1.866.198.175.489.464.687.464.198 0 .49-.29.688-.464.198-.175 2.24-1.759 2.392-1.866.152-.108.254-.305.087-.41-.167-.104-.689-.368-1.41-.741-.72-.373-1.617-.69-1.757-.69zm0-11.278s-.409.001-1.022.206-1.278.46-1.584.46c-.307 0-2.581-.434-2.581-.434S4.119 7.152 4.119 7.849c0 .697.339.881.68 1.243l2.02 2.149c.192.203.59.511.356 1.066-.235.555-.58 1.26-.196 1.977.384.716 1.042 1.194 1.464 1.115.421-.08 1.412-.598 1.776-.834.364-.237 1.518-1.19 1.518-1.554 0-.365-1.193-1.02-1.413-1.168-.22-.15-1.226-.725-1.247-.95-.02-.227-.012-.293.284-.851.297-.559.831-1.304.742-1.8-.089-.495-.95-.753-1.565-.986-.615-.232-1.799-.671-1.947-.74-.148-.068-.11-.133.339-.175.448-.043 1.719-.212 2.292-.052.573.16 1.552.403 1.632.532.079.13.149.134.067.579-.081.445-.5 2.581-.541 2.96-.04.38-.12.63.288.724.409.094 1.097.256 1.333.256s.924-.162 1.333-.256c.408-.093.329-.344.288-.723-.04-.38-.46-2.516-.541-2.961-.082-.445-.012-.45.067-.579.08-.129 1.059-.372 1.632-.532.573-.16 1.845.009 2.292.052.449.042.487.107.339.175-.148.069-1.332.508-1.947.74-.615.233-1.476.49-1.565.986-.09.496.445 1.241.742 1.8.297.558.304.624.284.85-.02.226-1.026.802-1.247.95-.22.15-1.413.804-1.413 1.169 0 .364 1.154 1.317 1.518 1.554.364.236 1.355.755 1.776.834.422.079 1.08-.4 1.464-1.115.384-.716.039-1.422-.195-1.977-.235-.555.163-.863.355-1.066l2.02-2.149c.341-.362.68-.546.68-1.243 0-.697-2.695-3.96-2.695-3.96s-2.274.436-2.58.436c-.307 0-.972-.256-1.585-.461-.613-.205-1.022-.206-1.022-.206z" />
    </svg>
  );
}

function DefaultBrowserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Chrome Web Store</title>
      <path d="M0 1.637v19.09c0 .9.736 1.636 1.636 1.636h.131a10.4 10.4 0 0 1-.13-1.636 10.3 10.3 0 0 1 1.667-5.64l4.202 7.276h1.128A3.77 3.77 0 0 1 12 16.958a3.77 3.77 0 0 1 3.366 5.406h1.048a4.7 4.7 0 0 0-1.587-5.406h6.83a10.34 10.34 0 0 1 .577 5.406h.13c.9 0 1.636-.737 1.636-1.637V1.637Zm9.273 2.181h5.454a1.09 1.09 0 1 1 0 2.182H9.273a1.09 1.09 0 1 1 0-2.182M12 10.364a10.36 10.36 0 0 1 9.233 5.652H12a4.71 4.71 0 0 0-4.677 4.149L3.91 14.25A10.34 10.34 0 0 1 12 10.364" />
    </svg>
  );
}

type BrowserInfo = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  isChromium: boolean;
};

function detectBrowser(): BrowserInfo {
  const ua = navigator.userAgent;

  if (ua.includes("Brave")) {
    return { name: "Brave", icon: BraveIcon, isChromium: true };
  }
  if (ua.includes("Arc")) {
    return { name: "Arc", icon: ChromeIcon, isChromium: true };
  }
  if (ua.includes("OPR") || ua.includes("Opera")) {
    return { name: "Opera", icon: DefaultBrowserIcon, isChromium: true };
  }
  if (ua.includes("Edg")) {
    return { name: "Edge", icon: EdgeIcon, isChromium: true };
  }
  if (ua.includes("Chrome") && !ua.includes("Edg")) {
    return { name: "Chrome", icon: ChromeIcon, isChromium: true };
  }
  if (ua.includes("Firefox")) {
    return { name: "Firefox", icon: DefaultBrowserIcon, isChromium: false };
  }
  if (ua.includes("Safari") && !ua.includes("Chrome")) {
    return { name: "Safari", icon: DefaultBrowserIcon, isChromium: false };
  }

  return { name: "Browser", icon: DefaultBrowserIcon, isChromium: true };
}

export default function App() {
  const browser = useMemo(() => detectBrowser(), []);
  const BrowserIcon = browser.icon;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Navbar */}
      <nav
        className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2"
            aria-label="StreamZen Home"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <img
                src="logo-black.png"
                className="w-6 h-6"
                alt="StreamZen logo"
                width="24"
                height="24"
              />
            </div>
            <span className="text-xl font-bold tracking-tight">
              {BRAND_NAME}
            </span>
          </a>
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
          <a href={CHROME_STORE_URL} target="_blank" rel="noreferrer">
            <Button size="sm" className="font-semibold px-6 gap-2">
              <BrowserIcon className="w-4 h-4" />
              Add to {browser.name}
            </Button>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-16 overflow-hidden lg:pt-48 lg:pb-32">
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
                StreamZen automates the annoying parts of moviebox streaming. No
                more manually skipping intros or fumbling with your mouse
                between episodes.
              </p>
              <div className="flex flex-col items-center justify-center gap-6">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                  {browser.isChromium ? (
                    <a
                      href={CHROME_STORE_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto"
                    >
                      <Button
                        size="lg"
                        className="h-14 px-10 text-lg font-bold w-full shadow-lg shadow-primary/20 gap-3"
                      >
                        <BrowserIcon className="w-5 h-5" />
                        Add to {browser.name} — It's Free
                      </Button>
                    </a>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <a
                        href={CHROME_STORE_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:w-auto"
                      >
                        <Button
                          size="lg"
                          className="h-14 px-10 text-lg font-bold w-full shadow-lg shadow-primary/20 gap-3"
                        >
                          <ChromeIcon className="w-5 h-5" />
                          Get it on Chrome Web Store
                        </Button>
                      </a>
                      <p className="text-xs text-muted-foreground">
                        Also works on Edge, Brave, Arc & Opera
                      </p>
                    </div>
                  )}
                </div>

                <motion.a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border hover:bg-muted transition-colors text-sm font-medium"
                  aria-label="View StreamZen source code on GitHub"
                >
                  <Github className="w-4 h-4" />
                  <span>Open Source on GitHub</span>
                  <div className="w-px h-3 bg-border mx-1" />
                  <div className="flex items-center gap-1 text-primary">
                    <Star className="w-3 h-3 fill-primary" />
                    <span>1.2k+</span>
                  </div>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Scrolling Supported Sites */}
      <section
        className="py-12 border-y border-border/50 bg-muted/20 overflow-hidden"
        aria-label="Supported streaming sites"
      >
        <div className="container mx-auto px-4 mb-6">
          <h2 className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-50">
            Works Seamlessly On
          </h2>
        </div>
        <div
          className="relative flex overflow-x-hidden"
          role="marquee"
          aria-label="Supported websites: moviebox.ph, 123movienow.cc, netnaija.film, sflix.film, movieboxonline.net, moviebox.id, moviebox.pk, moviebox.in"
        >
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

      {/* Features */}
      <section
        id="features"
        className="py-24 border-t border-border/50"
        aria-label="StreamZen Features"
      >
        <div className="container mx-auto px-4">
          <h2 className="sr-only">
            StreamZen Features — Skip Intro, Autoplay, Fullscreen & Ad Removal
            for Moviebox
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Instant Skip",
                desc: "Intros disappear with one click. StreamZen knows exactly when the story starts.",
                icon: <SkipForward className="w-6 h-6" aria-hidden="true" />,
              },
              {
                title: "Smart Autoplay",
                desc: "The next episode starts automatically. No manual clicking required.",
                icon: <Play className="w-6 h-6" aria-hidden="true" />,
              },
              {
                title: "Total Fullscreen",
                desc: "Once you go fullscreen, you stay there. Episodes swap without exiting.",
                icon: <Maximize2 className="w-6 h-6" aria-hidden="true" />,
              },
              {
                title: "Pure Focus",
                desc: "We clear away ads and distractions so you can just enjoy the film.",
                icon: <ShieldCheck className="w-6 h-6" aria-hidden="true" />,
              },
            ].map((f, i) => (
              <article key={i} className="flex flex-col">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary border border-primary/20">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About / Why Section */}
      <section
        id="about"
        className="py-24 bg-muted/30"
        aria-label="About StreamZen"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-background border rounded-3xl p-8 md:p-16 relative overflow-hidden shadow-2xl">
            <div
              className="absolute top-0 right-0 p-8 opacity-5"
              aria-hidden="true"
            >
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
                    <div
                      className="mt-1 bg-primary/20 p-1 rounded"
                      aria-hidden="true"
                    >
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
                    <div
                      className="mt-1 bg-primary/20 p-1 rounded"
                      aria-hidden="true"
                    >
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
                    <blockquote className="text-lg font-bold mb-1 italic">
                      "It just works. I haven't clicked 'Skip' in months."
                    </blockquote>
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

      {/* Victhereum Banner */}
      <section
        className="py-24 text-center"
        aria-label="Made by Victhereum Technologies"
      >
        <div className="container mx-auto px-4">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Crafted for Excellence by
          </p>
          <a
            href={COMPANY_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 grayscale hover:grayscale-0 transition-all group"
            aria-label="Visit Victhereum Technologies website"
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
      <footer
        className="py-12 border-t border-border/50 text-muted-foreground"
        aria-label="Footer"
      >
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <a
            href="/"
            className="flex items-center gap-2"
            aria-label="StreamZen Home"
          >
            <img
              src="logo.png"
              className="w-6 h-6"
              alt="StreamZen logo"
              width="24"
              height="24"
            />
            <span className="font-bold text-foreground tracking-tight">
              {BRAND_NAME}
            </span>
          </a>

          <nav className="flex gap-8 text-sm" aria-label="Footer navigation">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="hover:text-primary transition-colors flex items-center gap-2"
            >
              <Mail className="w-4 h-4" aria-hidden="true" /> Support
            </a>
            <a
              href={GITHUB_URL}
              className="hover:text-primary transition-colors flex items-center gap-2"
            >
              <Github className="w-4 h-4" aria-hidden="true" /> GitHub
            </a>
            <a
              href={COMPANY_URL}
              className="hover:text-primary transition-colors flex items-center gap-2"
            >
              <Globe className="w-4 h-4" aria-hidden="true" /> Our Website
            </a>
            <a
              href="/privacy.html"
              className="hover:text-primary transition-colors flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" aria-hidden="true" /> Privacy
            </a>
          </nav>

          <div className="text-xs font-mono opacity-50">
            © 2026 Victhereum Technologies.
          </div>
        </div>
      </footer>

      {/* Hidden SEO-rich Content (visible to crawlers, not users) */}
      <div className="sr-only" aria-hidden="true">
        <h2>StreamZen — The Best Free Extension for Moviebox Streaming</h2>
        <p>
          StreamZen is a free Chrome extension designed for moviebox.ph,
          123movienow.cc, netnaija.film, sflix.film, movieboxonline.net,
          moviebox.in, moviebox.pk, and moviebox.id. It provides Netflix-style
          features including automatic intro skipping, next episode autoplay
          with countdown timer, persistent fullscreen mode across episodes, and
          comprehensive ad and clickjack removal. StreamZen uses The Intro DB
          (TIDB) API for precise intro and credits timestamps, ensuring accurate
          skip timing for every show and movie.
        </p>
        <p>
          Whether you're binge-watching on Moviebox, 123Movies, NetNaija, or
          SFlix, StreamZen transforms your streaming experience. No setup
          required — just install the extension and start watching. Compatible
          with Chrome, Edge, Brave, Arc, and all Chromium-based browsers. Open
          source and maintained by Victhereum Technologies.
        </p>
        <h3>Supported Streaming Sites</h3>
        <ul>
          <li>Moviebox (moviebox.ph) — skip intro, next episode, ad removal</li>
          <li>123movienow (123movienow.cc) — auto skip intro extension</li>
          <li>
            NetNaija (netnaija.film) — autoplay next episode chrome extension
          </li>
          <li>SFlix (sflix.film) — remove ads streaming extension</li>
          <li>Moviebox Online (movieboxonline.net) — fullscreen persistence</li>
          <li>Moviebox India (moviebox.in) — free moviebox chrome extension</li>
          <li>Moviebox Pakistan (moviebox.pk) — moviebox helper extension</li>
          <li>
            Moviebox Indonesia (moviebox.id) — best moviebox extension 2026
          </li>
        </ul>
        <h3>Frequently Searched Terms</h3>
        <p>
          moviebox extension, moviebox chrome extension, skip intro moviebox,
          moviebox next episode, 123movienow extension, 123movies skip intro,
          netnaija chrome extension, sflix extension, moviebox autoplay,
          moviebox ad remover, free streaming extension, binge watch extension,
          moviebox helper, moviebox enhancer, moviebox mod, best moviebox tools
          2026
        </p>
      </div>
    </div>
  );
}
