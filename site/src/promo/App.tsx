import Banner from './components/Banner'
import Footer from './components/Footer'
import RegistrationModal from './components/RegistrationModal'
import { RegistrationProvider, useRegistration } from './context/RegistrationContext'
import Hero from './sections/Hero'
import Numbers from './sections/Numbers'
import InsideTheSession from './sections/InsideTheSession'
import Carousel from './sections/Carousel'
import Costs from './sections/Costs'

const PromoContent = () => {
    const { open, closeModal } = useRegistration()
    return (
        <div className="bg-[#040820] text-white">
            <Banner />
            <div>
                <Hero />
                <Numbers />
                <InsideTheSession />
                <Carousel />
                <Costs />
                <Footer />
            </div>
            <RegistrationModal open={open} onClose={closeModal} />
        </div>
    )
}

const PromoApp = () => (
    <RegistrationProvider>
        <PromoContent />
    </RegistrationProvider>
)

export default PromoApp