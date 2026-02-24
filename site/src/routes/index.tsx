import HeroSection from '@/components/sections/landing/Hero'
import NumbersSection from '@/components/sections/landing/Numbers'
import OpportunitiesSection from '@/components/sections/landing/Opportunities'
import PartnersSection from '@/components/sections/landing/Partners'
import StagesSection from '@/components/sections/landing/Stages'
import VendorsSection from '@/components/sections/landing/Vendors'
import WhyAttendSection from '@/components/sections/landing/WhyAttend'
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <>
      <HeroSection />
      <NumbersSection />
      <WhyAttendSection />
      <StagesSection />
      <VendorsSection />
      {/* <OpportunitiesSection /> */}
      <PartnersSection />
    </>
  )
}
