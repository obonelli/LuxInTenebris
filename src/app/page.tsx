'use client';

import HeroSection from './components/sections/HeroSection';
import HowItWorksSection from './components/sections/HowItWorksSection';
import HeaderSection from './components/sections/HeaderSection';

export default function Home() {
    return (
        <>
            <HeaderSection />
            <HeroSection />
            <HowItWorksSection />
        </>
    );
}
