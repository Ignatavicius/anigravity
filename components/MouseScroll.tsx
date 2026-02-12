"use client";

import { useScroll, useTransform, MotionValue, motion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";

const frameCount = 99;
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1920;

export default function MouseScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);

    // Scroll progress relative to the container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Map scroll progress to frame index with smooth interpolation
    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);

    // Preload all images with progress tracking
    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            let loadedCount = 0;

            const promises = Array.from({ length: frameCount }, (_, i) => {
                return new Promise<void>((resolve) => {
                    const img = new Image();
                    // GIF files are named ffout001.gif to ffout099.gif (1-indexed, not 0-indexed)
                    const frameNumber = i + 1;
                    const src = `/video-split/ffout${frameNumber.toString().padStart(3, '0')}.gif`;
                    img.src = src;

                    img.onload = () => {
                        loadedImages[i] = img;
                        loadedCount++;
                        setLoadProgress(Math.round((loadedCount / frameCount) * 100));
                        resolve();
                    };

                    img.onerror = () => {
                        console.error(`Failed to load frame ${i}`);
                        loadedCount++;
                        setLoadProgress(Math.round((loadedCount / frameCount) * 100));
                        resolve();
                    };
                });
            });

            await Promise.all(promises);
            setImages(loadedImages);
            setLoaded(true);
        };

        loadImages();
    }, []);

    // Optimized canvas rendering
    const renderFrame = useCallback((index: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d", { alpha: false });
        if (!ctx || !canvas) return;

        const frameIdx = Math.round(index);
        const img = images[frameIdx];

        if (img && img.complete) {
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
    }, [images]);

    // Setup canvas and subscribe to scroll updates
    useEffect(() => {
        if (!loaded || !canvasRef.current || images.length === 0) return;

        const canvas = canvasRef.current;
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        // Initial render
        renderFrame(frameIndex.get());

        // Subscribe to frame changes
        const unsubscribe = frameIndex.on("change", (latest) => {
            requestAnimationFrame(() => renderFrame(latest));
        });

        return () => unsubscribe();
    }, [loaded, images, frameIndex, renderFrame]);

    if (!loaded) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#050505] z-50">
                <div className="text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white/90">
                            Labas
                        </h2>
                        <p className="text-sm text-white/50 mt-2 tracking-widest uppercase">
                            Tai dirbtinio intelekto kurtas puslapis
                        </p>
                    </motion.div>

                    {/* Progress bar */}
                    <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-white/80"
                            initial={{ width: 0 }}
                            animate={{ width: `${loadProgress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>

                    <p className="text-xs text-white/40 font-mono">{loadProgress}%</p>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="h-[400vh] relative">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505]">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full object-contain"
                />
                <OverlayText scrollYProgress={scrollYProgress} />
            </div>
        </div>
    );
}

function OverlayText({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
    // Section 1: Hero Title (0% - 20%)
    const opacity1 = useTransform(scrollYProgress, [0, 0.05, 0.15, 0.2], [0, 1, 1, 0]);
    const y1 = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
    const scale1 = useTransform(scrollYProgress, [0, 0.05, 0.15, 0.2], [0.95, 1, 1, 1.05]);

    // Section 2: Precision Engineering (25% - 45%)
    const opacity2 = useTransform(scrollYProgress, [0.2, 0.25, 0.4, 0.45], [0, 1, 1, 0]);
    const x2 = useTransform(scrollYProgress, [0.2, 0.25], [-50, 0]);

    // Section 3: Titanium Drivers (50% - 70%)
    const opacity3 = useTransform(scrollYProgress, [0.45, 0.5, 0.65, 0.7], [0, 1, 1, 0]);
    const x3 = useTransform(scrollYProgress, [0.45, 0.5], [50, 0]);

    // Section 4: Final CTA (75% - 100%)
    const opacity4 = useTransform(scrollYProgress, [0.7, 0.8, 1], [0, 1, 1]);
    const y4 = useTransform(scrollYProgress, [0.7, 0.8], [50, 0]);
    const scale4 = useTransform(scrollYProgress, [0.7, 0.8], [0.9, 1]);

    return (
        <div className="absolute inset-0 pointer-events-none">
            {/* Section 1: Hero Title */}
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    style={{ opacity: opacity1, y: y1, scale: scale1 }}
                    className="text-center px-4"
                >
                    <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-bold tracking-tighter text-white/95">
                        Labas
                    </h1>
                    <p className="text-lg md:text-2xl lg:text-3xl text-white/60 tracking-[0.3em] uppercase mt-4 md:mt-6">
                        AI PUSLAPIS
                    </p>
                </motion.div>
            </div>

            {/* Section 2: Precision Engineering */}
            <div className="absolute inset-0 flex items-center justify-start px-6 md:px-16 lg:px-24">
                <motion.div
                    style={{ opacity: opacity2, x: x2 }}
                    className="max-w-xl"
                >
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white/95 leading-tight">
                        kiekviena taska<br />viskas po truputi.
                    </h2>
                    <p className="mt-4 md:mt-6 text-white/60 text-base md:text-lg lg:text-xl leading-relaxed">
                        Tiesiog idomu, kaip neblogai
                    </p>
                </motion.div>
            </div>

            {/* Section 3: Titanium Drivers */}
            <div className="absolute inset-0 flex items-center justify-end px-6 md:px-16 lg:px-24">
                <motion.div
                    style={{ opacity: opacity3, x: x3 }}
                    className="max-w-xl text-right"
                >
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white/95 leading-tight">
                        Ar pasiruoses<br />pradeti?.
                    </h2>
                    <p className="mt-4 md:mt-6 text-white/60 text-base md:text-lg lg:text-xl leading-relaxed">
                        video irgi padarytas naudojant dirbtini intelekta
                    </p>
                </motion.div>
            </div>

            {/* Section 4: Final CTA */}
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    style={{ opacity: opacity4, y: y4, scale: scale4 }}
                    className="text-center px-4"
                >
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white/95">
                        Hear Everything.
                    </h2>
                    <motion.button
                        className="mt-8 md:mt-12 px-10 py-4 bg-white text-black text-sm md:text-base font-semibold rounded-full hover:bg-white/90 transition-all duration-300 pointer-events-auto shadow-2xl hover:shadow-white/20 hover:scale-105"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Kai kur skiriasi kalba, sorry:D
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}

