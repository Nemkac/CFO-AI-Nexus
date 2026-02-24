import NumberCounter from "@/components/ui/NumberCounter"

const numbers = [
    { value: 20, title: "Expert Sessions\nAcross 6 Stages" },
    { value: 30, title: "Technology\nExhibitors" },
    { value: 700, title: "CFOs, VPs & Finance\nDecision Makers" },
    { value: 2500, title: "Live\nProduct Demos" },
    { value: 3500, title: "AI-Matched 1:1\nMeetings" },
]

const NumbersSection = () => {
    return (
        <div className="[background:radial-gradient(50%_80%_at_center,#1F2566,#040820)] md:[background:radial-gradient(40%_100%_at_top,#1F2566,#040820)] py-10 md:py-20 flex items-center w-full justify-center">
            <div className='flex flex-row flex-wrap items-center justify-center max-w-6xl w-full p-4 gap-16'>
                {numbers.map(number => (
                    <NumberCounter value={number.value} title={number.title} />
                ))}
            </div>
        </div>
    )
}

export default NumbersSection
