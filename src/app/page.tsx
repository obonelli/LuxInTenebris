import HeroSection from './components/sections/HeroSection';
import TrustedBySection from './components/sections/TrustedBySection';
import StatsSection from './components/sections/StatsSection';
import HowItWorksSection from './components/sections/HowItWorksSection';

export default function Home() {
    return (
        <>
            <HeroSection />
            <TrustedBySection />
            <StatsSection />
            <HowItWorksSection />
        </>
    );
}
