import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function BackgroundPaths({
    onStart,
}: {
    onStart?: () => void;
}) {
    return (
        <div className="relative min-h-screen w-full bg-[#050505] p-3 md:p-8 overflow-hidden flex items-stretch">
            
            {/* The Framing / "Einkachelung" */}
            <div className="relative flex-1 w-full border-2 border-neutral-800/80 rounded-[2.5rem] overflow-hidden flex flex-col z-10 bg-black/40">
                
                {/* Navbar area */}
                <div className="flex items-center justify-between p-6 md:p-12 pb-0 z-50 relative">
                    <div className="flex items-center space-x-4 md:space-x-10">
                        {/* CTA button */}
                        <Button
                            variant="secondary"
                            onClick={onStart}
                            className="rounded-full px-5 py-2 text-sm md:text-base font-semibold bg-white text-black hover:bg-neutral-200 transition-all border-none"
                        >
                            Build Your Plan ↓
                        </Button>

                        {/* Logo */}
                        <div className="flex items-center space-x-4 hidden sm:flex">
                            <img 
                                src="/logo.png" 
                                alt="AuraStrength" 
                                className="h-10 md:h-14 lg:h-16 w-auto opacity-100" 
                                style={{ filter: "brightness(0) saturate(100%) invert(21%) sepia(74%) saturate(6145%) hue-rotate(349deg) brightness(97%) contrast(115%)" }}
                            />
                            <span className="text-red-600 font-black tracking-widest text-xl md:text-2xl uppercase drop-shadow-md">
                                AuraStrength
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Hero Body */}
                <div className="flex-1 flex flex-col md:flex-row relative z-10 p-6 md:p-12">

                    {/* Left Typography */}
                    <div className="flex-1 flex flex-col justify-center max-w-2xl pt-10 md:pt-0 z-20">
                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            className="text-5xl sm:text-6xl md:text-[5rem] leading-[1.1] font-light text-neutral-200 uppercase tracking-wide"
                        >
                            Your Plan <br/>
                            <span className="font-bold text-white">Backed By</span> <br/>
                            Science
                        </motion.h1>
                    </div>

                    {/* Right Image with CSS Red Lighting Tricks */}
                    <div className="absolute right-0 top-0 bottom-0 w-[130%] sm:w-[90%] md:w-[70%] lg:w-[65%] flex items-end justify-end overflow-hidden pointer-events-none z-0">
                         {/* 1. Underlying dark red studio background */}
                         <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] via-[#1a0000] to-[#400000] z-0"></div>

                         {/* 2. The Image: mix-blend-multiply merges the white background perfectly into the dark red base, while darkening the man */}
                         <img 
                             src="/man.jpg" 
                             alt="Hero Model" 
                             className="absolute right-[-5%] bottom-0 h-[100%] md:h-[115%] w-auto object-cover object-bottom z-10 mix-blend-multiply contrast-[1.1] grayscale-[10%]"
                         />
                         
                         {/* 3. Rim Light Overlay: Adds a vibrant red light hitting him from the right, using overlay to preserve midtones */}
                         <div className="absolute inset-0 z-20 bg-gradient-to-l from-red-600/60 via-red-900/10 to-transparent mix-blend-overlay"></div>
                         
                         {/* 4. Flare/Light Source: A soft bright red glow to anchor the lighting effect */}
                         <div className="absolute top-1/4 right-[-10%] w-[30rem] h-[30rem] bg-red-600/40 blur-[120px] z-30 mix-blend-screen rounded-full"></div>
                         
                         {/* 5. Seamless Masking Gradients: Fades the right container into the profound black background on the left and bottom */}
                         <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent z-40"></div>
                         <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-40"></div>
                    </div>
                </div>

                {/* Bottom Section (Spacing maintained) */}
                <div className="p-6 md:p-12 z-50"></div>
            </div>
        </div>
    );
}
