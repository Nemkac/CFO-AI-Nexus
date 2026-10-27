import HeroSection from '@/components/sections/landing/Hero'
import BrellaSection from '@/components/sections/landing/Brella'
import NumbersSection from '@/components/sections/landing/Numbers'
import OpportunitiesSection from '@/components/sections/landing/Opportunities'
import StagesSection from '@/components/sections/landing/Stages'
import VendorsSection from '@/components/sections/landing/Vendors'
import WhyAttendSection from '@/components/sections/landing/WhyAttend'
import FAQSection from '@/components/sections/landing/FAQ'
import { createFileRoute } from '@tanstack/react-router'
import PartnersSection from '@/components/sections/landing/Partners'
import FinalCtaSection from '@/components/sections/landing/FinalCta'


export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <>
      <HeroSection />
      <NumbersSection />
      <BrellaSection />
      <WhyAttendSection />
      <StagesSection />
      <PartnersSection />
      <VendorsSection />
      <OpportunitiesSection />
      <FAQSection />
      <FinalCtaSection />
    </>
  )
}
