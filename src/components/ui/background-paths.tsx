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
            <div className="relative flex-1 w-full border border-neutral-800/80 rounded-[2.5rem] overflow-hidden flex flex-col z-10 bg-black/40">
                
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
                        <div className="flex items-center space-x-3 hidden sm:flex">
                            <img src="/logo.png" alt="AuraStrength" className="h-8 md:h-10 w-auto opacity-90" />
                            <span className="text-white font-bold tracking-widest text-lg md:text-xl uppercase">
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
                            Build Your <br/>
                            <span className="font-bold text-white">Elite Physique</span> <br/>
                            Like A Pro
                        </motion.h1>
                    </div>

                    {/* Right Image with CSS Red Lighting Tricks */}
                    <div className="absolute right-0 top-0 bottom-0 w-[130%] sm:w-[90%] md:w-[70%] lg:w-[60%] flex items-end justify-end overflow-hidden pointer-events-none z-0">
                         {/* The Image (Assumes white background in the raw file) */}
                         <img 
                             src="/man.jpg" 
                             alt="Hero Model" 
                             className="absolute right-0 bottom-[-10%] h-[100%] md:h-[120%] w-auto object-cover object-bottom z-10"
                         />
                         
                         {/* Multiplicative Red Glow Overlay (turns white bg into deep red shadow) */}
                         <div className="absolute inset-0 z-20 bg-gradient-to-tr from-[#050505] via-[#5a0000] to-[#b30000] mix-blend-multiply opacity-100"></div>
                         
                         {/* Red Highlight/Flare to simulate studio light */}
                         <div className="absolute top-1/4 right-0 w-96 h-96 bg-red-600/30 blur-[100px] z-30 mix-blend-screen rounded-full"></div>
                         
                         {/* Black Gradients from left/bottom to smooth transition into the environment */}
                         <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[#050505] via-[#050505]/70 to-transparent z-40"></div>
                         <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#050505] to-transparent z-40"></div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="p-6 md:p-12 z-50">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="w-full flex justify-center md:justify-start"
                    >
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-red-600 uppercase tracking-widest text-center md:text-left drop-shadow-md pb-4 md:pb-0">
                            We make your strength impossible to ignore
                        </h2>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
