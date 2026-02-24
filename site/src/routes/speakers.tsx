import SpeakersHeroSection from '@/components/sections/speakers/Hero'
import SpeakersSection from '@/components/sections/speakers/Speakers'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/speakers')({ component: SpeakersPage })

function SpeakersPage() {
  return (
    <>
      <SpeakersHeroSection />
      <SpeakersSection />
    </>
  )
}
