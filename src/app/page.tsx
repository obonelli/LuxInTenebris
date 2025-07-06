'use client';

import HeroSection from './components/HeroSection';
import HowItWorksSection from './components/HowItWorksSection';
import HeaderSection from './components/HeaderSection';

export default function Home() {
    return (
        <>
            <HeaderSection />
            <HeroSection />
            <HowItWorksSection />
        </>
    );
}
