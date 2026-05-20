import HeroSection from '@/components/sections/landing/Hero'
import ImageSection from '@/components/sections/landing/Image'
import NumbersSection from '@/components/sections/landing/Numbers'
import OpportunitiesSection from '@/components/sections/landing/Opportunities'
import StagesSection from '@/components/sections/landing/Stages'
import VendorsSection from '@/components/sections/landing/Vendors'
import WhyAttendSection from '@/components/sections/landing/WhyAttend'
import FAQSection from '@/components/sections/landing/FAQ'
import { createFileRoute } from '@tanstack/react-router'
import PartnersSection from '@/components/sections/landing/Partners'


export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <>
      <HeroSection />
      <NumbersSection />
      <ImageSection />
      <WhyAttendSection />
      <StagesSection />
      <VendorsSection />
      <OpportunitiesSection />
      <FAQSection />
      <PartnersSection />
    </>
  )
}
