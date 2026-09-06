"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProbabilityGauge } from "@/components/ProbabilityGauge";
import { toast } from "sonner";
import {
  Upload, Activity, ArrowRight, Droplets, ShieldAlert, Zap, Quote, Heart, Menu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Apple-like ease curve
const appleEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: appleEase } },
};

const loadingPhrases = [
  "Calibrating fluid dynamics...",
  "Measuring Payasam viscosity...",
  "Checking Pappadam structural integrity...",
  "Running NASA telemetry...",
  "Deploying Avial defense models...",
  "Consulting local Malayalis...",
];

function AnalyzingAnimation() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % loadingPhrases.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-5 w-full py-2">
      <div className="flex items-center gap-4">
        <div className="relative flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600"></span>
        </div>
        <div className="h-6 relative w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: appleEase }}
              className="text-sm font-medium text-blue-400 absolute left-0"
            >
              {loadingPhrases[index]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-1.5 w-full bg-zinc-800/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 6, ease: "circOut" }}
          />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("engine");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<{
    probability: number;
    threatLevel: string;
    analysis: string;
  } | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid File", { description: "Please upload an image of a Sadya." });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzeMoru = async () => {
    if (!imagePreview) {
      toast.error("No Data", { description: "Please upload an image first." });
      return;
    }

    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const response = await fetch("/api/analyze-moru", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imagePreview,
          mimeType: "image/jpeg"
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data);

    } catch (error: any) {
      console.error(error);
      toast.error("Analysis Failed", { description: error.message || "Could not connect to the engine." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-blue-500/30">

      {/* Navigation Header */}
      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
        <motion.header
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: appleEase, delay: 0.1 }}
          className="pointer-events-auto flex items-center justify-between p-2 rounded-full bg-zinc-900/60 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-full max-w-3xl"
        >
          <div className="flex items-center gap-3 pl-2 flex-1">
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)] shrink-0">
              <Droplets className="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
            <span className="font-semibold tracking-tight text-sm pr-6 border-r border-white/10 hidden sm:block whitespace-nowrap">Moru Engine Pro</span>
          </div>

          <nav className="flex items-center justify-center gap-1 md:gap-2 px-2 text-sm font-medium text-zinc-400 relative">
            {["engine", "technology", "testimonials"].map((id) => (
              <a
                key={id}
                href={`#${id}`}
                className={`relative px-4 py-3 md:py-2 rounded-full transition-colors z-10 flex items-center justify-center ${activeSection === id ? "text-white" : "hover:text-zinc-200"}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                title={id === "engine" ? "Engine" : id === "technology" ? "Technology" : "Wall of Love"}
              >
                <span className="hidden md:block">
                  {id === "engine" ? "Engine" : id === "technology" ? "Technology" : "Wall of Love"}
                </span>
                <span className="block md:hidden">
                  {id === "engine" ? <Activity className="w-5 h-5" /> : id === "technology" ? <Zap className="w-5 h-5" /> : <Heart className="w-5 h-5" />}
                </span>
                {activeSection === id && (
                  <motion.div
                    layoutId="active-nav-pill"
                    className="absolute inset-0 bg-white/10 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* <div className="flex items-center justify-end gap-2 pr-1 flex-1">
            <Button className="hidden md:flex rounded-full bg-white text-black hover:bg-zinc-200 transition-colors text-xs font-semibold h-10 px-5">
              Get API Key
            </Button>
          </div> */}
        </motion.header>
      </div>

      <main className="flex flex-col items-center relative overflow-hidden">

        {/* Ambient Blur Backgrounds */}
        <div className="absolute top-0 left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none mix-blend-screen" />

        {/* Hero & Engine Section */}
        <section id="engine" className="w-full max-w-7xl mx-auto px-4 md:px-6 pt-20 pb-20 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: appleEase }}
            className="z-10 w-full flex flex-col items-center gap-12"
          >
            <div className="text-center space-y-4 w-full pb-6 max-w-4xl">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8, ease: appleEase }}
                className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-md mb-2 text-xs font-medium tracking-wide text-zinc-400"
              >
                <Zap className="w-3 h-3 mr-2 text-yellow-500" />
                Gemini Vision Powered
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 leading-tight pb-2">
                Never lose your Payasam to Moru again.
              </h1>
              <p className="text-lg md:text-xl text-zinc-400 font-medium tracking-tight max-w-2xl mx-auto">
                Advanced fluid dynamics modeling for your Sadya. Upload a photo and let our AI calculate the exact probability of a catastrophic buttermilk breach.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-5xl">

              {/* Left Column: Visual Input */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="col-span-1 lg:col-span-7"
              >
                <Card className="bg-zinc-900/40 backdrop-blur-2xl border border-white/[0.05] shadow-2xl rounded-[32px] overflow-hidden flex flex-col relative h-full">
                  <CardHeader className="pb-4 pt-8 px-8">
                    <CardTitle className="text-2xl font-semibold tracking-tight">Visual Telemetry</CardTitle>
                    <CardDescription className="text-base text-zinc-400">
                      Upload an overhead scan of your Banana Leaf.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-8 pb-8 flex-1 flex flex-col gap-6">

                    <div
                      className={`relative w-full flex-1 min-h-[300px] rounded-[24px] border border-white/[0.08] bg-zinc-950/50 flex flex-col items-center justify-center overflow-hidden group cursor-pointer transition-all duration-500 ease-out hover:bg-zinc-900/50 ${imagePreview ? 'border-transparent' : ''}`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {imagePreview ? (
                        <>
                          <img
                            src={imagePreview}
                            alt="Sadya Scan"
                            className={`object-cover w-full h-full transition-all duration-700 ${isAnalyzing ? 'scale-105 blur-[2px] opacity-80 sepia-[.4] hue-rotate-[-30deg] saturate-200' : 'scale-100 opacity-90'}`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none" />

                          <AnimatePresence>
                            {isAnalyzing && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 overflow-hidden"
                              >
                                {/* Thermal Grid Overlay */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.2)_1px,transparent_1px)] bg-[size:16px_16px] mix-blend-screen pointer-events-none" />

                                {/* Sweeping Scanner Line */}
                                <motion.div
                                  animate={{ top: ["0%", "100%", "0%"] }}
                                  transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                                  className="absolute left-0 right-0 h-1 bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.9)] z-20"
                                />

                                {/* Target Crosshairs (Structural Weaknesses) */}
                                <motion.div
                                  animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                                  className="absolute top-[30%] left-[40%] w-10 h-10 border border-red-500/80 flex items-center justify-center z-20"
                                >
                                  <div className="w-1 h-1 bg-red-500" />
                                  <span className="absolute -top-4 -right-8 text-[8px] font-mono text-red-500 font-bold">WEAKNESS_1</span>
                                </motion.div>

                                <motion.div
                                  animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                                  transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
                                  className="absolute top-[60%] left-[70%] w-14 h-14 border border-red-500/80 rounded-full flex items-center justify-center z-20"
                                >
                                  <div className="w-1 h-1 bg-red-500 rounded-full" />
                                  <span className="absolute -top-4 -right-8 text-[8px] font-mono text-red-500 font-bold">WEAKNESS_2</span>
                                </motion.div>

                                {/* Centered Processing Spinner */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-red-950/20 backdrop-blur-[1px] z-10">
                                  <div className="h-12 w-12 rounded-full border-4 border-red-500/30 border-t-red-500 animate-spin shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                                  <div className="bg-black/60 px-4 py-1.5 rounded-full border border-red-500/30 backdrop-blur-md">
                                    <span className="text-xs font-bold tracking-widest text-red-500 uppercase animate-pulse">Scanning Structural Weaknesses...</span>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-zinc-500 gap-4 transition-transform duration-300 group-hover:scale-105">
                          <div className="h-16 w-16 rounded-full bg-zinc-800/50 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
                            <Upload className="h-6 w-6" />
                          </div>
                          <span className="text-sm font-medium tracking-wide">Click to browse photos</span>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <Button
                      onClick={analyzeMoru}
                      disabled={!imagePreview || isAnalyzing}
                      className="w-full h-14 rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all font-semibold text-base shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none"
                    >
                      {isAnalyzing ? "Processing..." : (
                        <span className="flex items-center gap-2 cursor-pointer">
                          Start Scan <ArrowRight className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Right Column: Analysis Engine & Results */}
              <div className="col-span-1 lg:col-span-5 flex flex-col gap-6">

                {/* Probability Gauge Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="flex-1 flex"
                >
                  <Card className="bg-zinc-900/40 backdrop-blur-2xl border border-white/[0.05] shadow-2xl rounded-[32px] w-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
                    <ProbabilityGauge
                      probability={result?.probability ?? null}
                      threatLevel={result?.threatLevel ?? null}
                    />
                  </Card>
                </motion.div>

                {/* Diagnostics Output */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <Card className="bg-zinc-900/40 backdrop-blur-2xl border border-white/[0.05] shadow-2xl rounded-[32px] overflow-hidden">
                    <CardHeader className="pb-2 pt-6 px-6">
                      <CardTitle className="text-sm font-medium tracking-wide text-zinc-400 uppercase flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        AI Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <div className="min-h-[100px] text-base leading-relaxed text-zinc-200 font-medium">
                        {result ? (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            {result.analysis}
                          </motion.div>
                        ) : isAnalyzing ? (
                          <AnalyzingAnimation />
                        ) : (
                          <span className="text-zinc-600">Awaiting image upload and scan execution.</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Feature/Science Section */}
        <section id="technology" className="w-full bg-zinc-900/20 border-t border-white/[0.05] py-32 relative overflow-hidden">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="cursor-pointer max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16"
          >
            <motion.div variants={fadeUpVariant} className="flex flex-col items-start text-left gap-4 p-8 rounded-[32px] bg-zinc-900/40 border border-white/[0.05] hover:bg-zinc-800/50 transition-colors">
              <div className="flex items-center justify-between w-full mb-4">
                <span className="text-4xl font-light text-zinc-700">01</span>
                <Droplets className="w-8 h-8 text-zinc-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-medium tracking-tight text-zinc-100">Viscosity Tracking</h3>
              <p className="text-zinc-400 text-lg leading-relaxed">
                Our AI measures the surface tension of the Moru to determine if the consistency is too watery, predicting flow speed across the leaf terrain.
              </p>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="flex flex-col items-start text-left gap-4 p-8 rounded-[32px] bg-zinc-900/40 border border-white/[0.05] hover:bg-zinc-800/50 transition-colors">
              <div className="flex items-center justify-between w-full mb-4">
                <span className="text-4xl font-light text-zinc-700">02</span>
                <ShieldAlert className="w-8 h-8 text-zinc-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-medium tracking-tight text-zinc-100">Structural Integrity</h3>
              <p className="text-zinc-400 text-lg leading-relaxed">
                We calculate the defensive capabilities of your Avial and Parippu barriers, ensuring your Payasam remains isolated from savory contamination.
              </p>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="flex flex-col items-start text-left gap-4 p-8 rounded-[32px] bg-zinc-900/40 border border-white/[0.05] hover:bg-zinc-800/50 transition-colors">
              <div className="flex items-center justify-between w-full mb-4">
                <span className="text-4xl font-light text-zinc-700">03</span>
                <Zap className="w-8 h-8 text-zinc-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-medium tracking-tight text-zinc-100">Real-time Defense</h3>
              <p className="text-zinc-400 text-lg leading-relaxed">
                Powered by Gemini Vision, get millisecond-accurate alerts before disaster strikes. Simply upload a picture and avert the crisis.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="w-full py-32 px-6 max-w-7xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: appleEase }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-6">Loved by Malayalis Worldwide</h2>
            <p className="text-zinc-400 text-xl max-w-2xl mx-auto">Don't just take our word for it. Listen to the survivors.</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
          >
            <motion.div variants={fadeUpVariant} whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 30 }}>
              <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/[0.05] rounded-[32px] p-8 flex flex-col gap-6 h-full shadow-xl">
                <Quote className="w-10 h-10 text-blue-500/50" />
                <p className="text-zinc-300 text-lg leading-relaxed flex-1">"Before Moru Engine, my Payasam was constantly ruined. It was a tragedy every Onam. Now, I have peace of mind. Eda mone, idhu oru raksha illa!"</p>
                <div className="flex items-center gap-4 pt-6 border-t border-zinc-800">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-lg">S</div>
                  <div>
                    <div className="font-semibold">Sasi Kumar</div>
                    <div className="text-sm text-zinc-500">Tech Lead, Kochi</div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={fadeUpVariant} whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 30 }}>
              <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/[0.05] rounded-[32px] p-8 flex flex-col gap-6 h-full shadow-xl">
                <Quote className="w-10 h-10 text-purple-500/50" />
                <p className="text-zinc-300 text-lg leading-relaxed flex-1">"I used to build rice dams by hand. Now I just scan my leaf and the AI tells me if the Avial is placed optimally. NASA-level engineering for Sadyas."</p>
                <div className="flex items-center gap-4 pt-6 border-t border-zinc-800">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-lg">A</div>
                  <div>
                    <div className="font-semibold">Arya Nair</div>
                    <div className="text-sm text-zinc-500">Data Scientist, Trivandrum</div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={fadeUpVariant} whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 30 }} className="md:col-span-2 lg:col-span-1">
              <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/[0.05] rounded-[32px] p-8 flex flex-col gap-6 h-full shadow-xl">
                <Quote className="w-10 h-10 text-green-500/50" />
                <p className="text-zinc-300 text-lg leading-relaxed flex-1">"Moru overflowing into Parippu is acceptable. Moru into Payasam is a war crime. This app prevents war crimes. Highly recommend."</p>
                <div className="flex items-center gap-4 pt-6 border-t border-zinc-800">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-lg">B</div>
                  <div>
                    <div className="font-semibold">Biju Menon</div>
                    <div className="text-sm text-zinc-500">Gulf Returnee, Dubai</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full bg-zinc-950 border-t border-white/[0.05] pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2 md:col-span-1 flex flex-col gap-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)]">
                  <Droplets className="w-5 h-5 text-black" strokeWidth={2.5} />
                </div>
                <span className="font-semibold tracking-tight text-xl">Moru Engine Pro</span>
              </div>
              <p className="text-base text-zinc-500 leading-relaxed">
                Advanced fluid dynamics and containment breach prediction for traditional Kerala feasts.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <span className="font-semibold text-zinc-100 mb-2">Product</span>
              <a href="#" className="text-base text-zinc-500 hover:text-white transition-colors">Features</a>
            </div>

            <div className="flex flex-col gap-4">
              <span className="font-semibold text-zinc-100 mb-2">Company</span>
              <a href="#" className="text-base text-zinc-500 hover:text-white transition-colors">About Us</a>
              <a href="#" className="text-base text-zinc-500 hover:text-white transition-colors">Careers</a>
              <a href="#" className="text-base text-zinc-500 hover:text-white transition-colors">Contact</a>
            </div>

            <div className="flex flex-col gap-4">
              <span className="font-semibold text-zinc-100 mb-2">Legal</span>
              <a href="#" className="text-base text-zinc-500 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-base text-zinc-500 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-base text-zinc-500 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>

          <div className="border-t border-white/[0.05] pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-base text-zinc-600">
            <p>© 2026 Moru Engine Corp. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              Made with <Heart className="w-5 h-5 text-red-500 mx-1" /> and a lot of sadhya.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
