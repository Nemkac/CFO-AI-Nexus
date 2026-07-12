import { useEffect, useRef, useState } from 'react'
import Banner from './components/Banner'
import Footer from './components/Footer'
import RegistrationModal from './components/RegistrationModal'
import { RegistrationProvider, useRegistration } from './context/RegistrationContext'
import Hero from './sections/Hero'
import Numbers from './sections/Numbers'
import InsideTheSession from './sections/InsideTheSession'
import Carousel from './sections/Carousel'
import Costs from './sections/Costs'
import { fetchPromoContent, type PromoData } from '@/lib/wordpress'

const PromoContent = ({ data }: { data: PromoData | null }) => {
    const { open, closeModal } = useRegistration()
    const kitContainerRef = useRef<HTMLDivElement>(null)
    const kitScriptInjected = useRef(false)

    useEffect(() => {
        const uid = data?.registration?.kit_form_uid
        if (!uid || kitScriptInjected.current || !kitContainerRef.current) return
        kitScriptInjected.current = true
        const script = document.createElement('script')
        script.src = `https://f.convertkit.com/${uid}/index.js`
        script.async = true
        script.setAttribute('data-uid', uid)
        kitContainerRef.current.appendChild(script)
    }, [data?.registration?.kit_form_uid])

    return (
        <div className="bg-[#040820] text-white">
            <Banner text={data?.hero?.banner_text} conferenceDatetime={data?.hero?.conference_datetime} />
            <div>
                <Hero cmsData={data?.hero} />
                <Numbers cmsData={data?.numbers} />
                <InsideTheSession cmsData={data?.inside} />
                <Carousel cmsData={data?.carousel} />
                <Costs cmsData={data?.costs} />
                <Footer cmsData={data?.footer} />
            </div>
            <div ref={kitContainerRef} style={{ display: 'none' }} aria-hidden="true" />
            <RegistrationModal
                open={open}
                onClose={closeModal}
                kitFormId={data?.registration?.kit_form_id}
                kitFormUid={data?.registration?.kit_form_uid}
                title={data?.modal?.title}
                subtext={data?.modal?.subtext}
                conferenceDatetime={data?.hero?.conference_datetime}
            />
        </div>
    )
}

const PromoApp = () => {
    const [data, setData] = useState<PromoData | null>(null)

    useEffect(() => {
        fetchPromoContent().then(setData).catch(console.error)
    }, [])

    return (
        <RegistrationProvider>
            <PromoContent data={data} />
        </RegistrationProvider>
    )
}

export default PromoApp