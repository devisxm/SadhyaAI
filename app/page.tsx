"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProbabilityGauge } from "@/components/ProbabilityGauge";
import { toast } from "sonner";
import {
  Upload, Activity, ArrowRight, Droplets, ShieldAlert, Zap, Quote, Heart, Menu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Apple-like ease curve
const appleEase = [0.16, 1, 0.3, 1];

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

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<{
    probability: number;
    threatLevel: string;
    analysis: string;
  } | null>(null);

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
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: appleEase }}
        className="sticky top-0 z-50 w-full border-b border-white/[0.05] bg-[#0a0a0a]/80 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-lg">Moru Engine Pro</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#engine" className="hover:text-white transition-colors">Engine</a>
            <a href="#technology" className="hover:text-white transition-colors">Technology</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Wall of Love</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden text-zinc-400">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="flex flex-col items-center relative overflow-hidden">

        {/* Ambient Blur Backgrounds */}
        <div className="absolute top-0 left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none mix-blend-screen" />

        {/* Hero & Engine Section */}
        <section id="engine" className="w-full max-w-7xl mx-auto px-4 md:px-6 py-20 flex flex-col items-center">
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
                Gemini 3.5 Flash Powered
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
                            className={`object-cover w-full h-full transition-all duration-700 ${isAnalyzing ? 'scale-105 blur-sm opacity-50' : 'scale-100 opacity-90'}`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none" />

                          <AnimatePresence>
                            {isAnalyzing && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                              >
                                <div className="h-12 w-12 rounded-full border-4 border-zinc-500 border-t-white animate-spin" />
                                <span className="text-sm font-medium tracking-wide text-white drop-shadow-md">Simulating fluid paths...</span>
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
                        <span className="flex items-center gap-2">
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
                          <div className="flex flex-col gap-3 animate-pulse opacity-50">
                            <div className="h-4 w-3/4 bg-zinc-700 rounded-full" />
                            <div className="h-4 w-1/2 bg-zinc-700 rounded-full" />
                            <div className="h-4 w-5/6 bg-zinc-700 rounded-full" />
                          </div>
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
            className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16"
          >
            <motion.div variants={fadeUpVariant} className="flex flex-col items-center text-center gap-6">
              <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                <Droplets className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold tracking-tight">Viscosity Tracking</h3>
              <p className="text-zinc-400 text-lg leading-relaxed">
                Our AI measures the surface tension of the Moru to determine if the consistency is too watery, predicting flow speed across the leaf terrain.
              </p>
            </motion.div>
            
            <motion.div variants={fadeUpVariant} className="flex flex-col items-center text-center gap-6">
              <div className="w-20 h-20 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                <ShieldAlert className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold tracking-tight">Structural Integrity</h3>
              <p className="text-zinc-400 text-lg leading-relaxed">
                We calculate the defensive capabilities of your Avial and Parippu barriers, ensuring your Payasam remains isolated from savory contamination.
              </p>
            </motion.div>
            
            <motion.div variants={fadeUpVariant} className="flex flex-col items-center text-center gap-6">
              <div className="w-20 h-20 rounded-3xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                <Zap className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-semibold tracking-tight">Real-time Defense</h3>
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
      <footer className="w-full bg-zinc-950 border-t border-white/[0.05] pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2 md:col-span-1 flex flex-col gap-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                  <Droplets className="w-5 h-5 text-white" />
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
              Made with <Heart className="w-5 h-5 text-red-500 mx-1" /> and a lot of coconut oil.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
