import PartnerCard from "@/components/ui/PartnerCard"

const partners = [
    { logo: '/assets/partners/oracle_white-1.svg', type: 'Diamond' },
    { logo: '/assets/partners/blackline 1.svg', type: 'Platinum' },
    { logo: '/assets/partners/anaplan 1.svg', type: 'Platinum' },
    { logo: '/assets/partners/workday 1.svg', type: 'Platinum' },
    { logo: '/assets/partners/tipalti 1.svg', type: 'Gold' },
    { logo: '/assets/partners/kyriba 1.svg', type: 'Gold' },
    { logo: '/assets/partners/highradius 1.svg', type: 'Gold' },
    { logo: '/assets/partners/coupa 1.svg', type: 'Gold' },
    { logo: '/assets/partners/bill_com 1.svg', type: 'Gold' },
    { logo: '/assets/partners/avalara 1.svg', type: 'Gold' },
    { logo: '/assets/partners/vena 1.svg', type: 'Exibitor' },
    { logo: '/assets/partners/jedox 1.svg', type: 'Exibitor' },
    { logo: '/assets/partners/prophix 1.svg', type: 'Exibitor' },
    { logo: '/assets/partners/floqast 1.svg', type: 'Exibitor' },
    { logo: '/assets/partners/trintech 1.svg', type: 'Exibitor' },
    { logo: '/assets/partners/sovos 1.svg', type: 'Exibitor' },
    { logo: '/assets/partners/vertex 1.svg', type: 'Exibitor' },
    { logo: '/assets/partners/mineraltree 1.svg', type: 'Exibitor' },
    { logo: '/assets/partners/airbase 1.svg', type: 'Exibitor' },
    { logo: '/assets/partners/ramp 1.svg', type: 'Exibitor' },
    { logo: '/assets/partners/navan 1.svg', type: 'Exibitor' },
    { logo: '/assets/partners/expensify 1.svg', type: 'Exibitor' },
    { logo: '/assets/partners/basware 1.svg', type: 'Exibitor' },
    { logo: '/assets/partners/medius 1.svg', type: 'Exibitor' },
    { logo: '/assets/partners/brex 1.svg', type: 'Exibitor' },
]

const PartnersSection = () => {
    return (
        <div className="bg-surfa py-10 md:py-20 flex items-center w-full justify-center bg-linear-to-t from bg-surface-page to-surface-default">
            <div className='flex flex-col items-center justify-center max-w-6xl w-full p-4 gap-14'>
                <div className="flex flex-col items-center flex-wrap gap-8">
                    <h2 className="text-h2 text-content-heading">Diamond partner</h2>
                </div>
                <div className="w-full max-w-lg">
                    {partners.filter(partner => partner.type === 'Diamond').map((partner, i) => (
                        <PartnerCard key={i} variant={'Diamond'} image={partner.logo} />
                    ))}
                </div>
                <div className="flex flex-col items-center flex-wrap gap-8">
                    <h2 className="text-h2 text-content-heading">Platinum partners</h2>
                </div>
                <div className="flex flex-wrap justify-center gap-6 w-full">
                    {partners.filter(partner => partner.type === 'Platinum').map((partner, i) => (
                        <div key={i} className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)]">
                            <PartnerCard variant={'Platinum'} image={partner.logo} />
                        </div>
                    ))}
                </div>
                <div className="flex flex-col items-center flex-wrap gap-8">
                    <h2 className="text-h2 text-content-heading">Gold partners</h2>
                </div>
                <div className="flex flex-wrap justify-center gap-6 w-full">
                    {partners.filter(partner => partner.type === 'Gold').map((partner, i) => (
                        <div key={i} className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)]">
                            <PartnerCard variant={'Gold'} image={partner.logo} />
                        </div>
                    ))}
                </div>
                <div className="flex flex-col items-center flex-wrap gap-8">
                    <h2 className="text-h2 text-content-heading">Exibitors</h2>
                </div>
                <div className="flex flex-wrap justify-center gap-6 w-full">
                    {partners.filter(partner => partner.type === 'Exibitor').map((partner, i) => (
                        <div key={i} className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)]">
                            <PartnerCard variant={'Exibitor'} image={partner.logo} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PartnersSection
