import AddInCard from "@/components/ui/AddInCard"

const addInsTop = [
    {
        icon: "/icons/mail_outline.svg",
        title: "Exclusive “The Knowledge Series” Newsletter",
        description: "Sponsorship of a series of 3 pre-event newsletters delivering your expert insights, including your logo at the top and a “Message from our sponsor” section in the middle to all registrants. "
    },
    {
        icon: "/icons/home_work.svg",
        title: "Extra Session or Workshop",
        description: "Enhance your presence with a dedicated learning session or hands‑on workshop designed and led by your team, allowing you to demonstrate your expertise, present case studies, and engage directly with CFOs and finance leaders."
    },
]

const addInsBottom = [
    {
        icon: "/icons/linkedin.svg",
        title: "Exclusive Linkedin Amplifier",
        description: "Two LinkedIn posts from the CFO AI Nexus page before the event and two posts after the event, in addition to standard publications."
    },
    {
        icon: "/icons/workspace_premium.svg",
        title: "Exclusive Sponsored follow-up email",
        description: "Exclusive email to all registrants highlighting key conference takeaways with a custom call-to-action from the sponsor."
    },
    {
        icon: "/icons/video_library.svg",
        title: "Extra Pre-roll video",
        description: "Short 15-second branded videos shown in between sessions and workshops, keeping your brand top-of-mind throughout the event flow."
    },
]

const AddIns = () => {
    return (
        <div className="bg-surfa py-10 md:py-20 px-4 flex items-center w-full justify-center bg-surface-page">
            <div className='flex flex-col items-center justify-center max-w-6xl w-full p-4 gap-14'>
                <h2 className="text-h2 text-content-heading">Custom Add-ins</h2>
                <div className="flex flex-col gap-4">
                    <div className="grid gird-cols-1 md:grid-cols-2 w-full gap-4">
                        {addInsTop.map(addIn => (
                            <AddInCard icon={addIn.icon} title={addIn.title} description={addIn.description} />
                        ))}
                    </div>
                    <div className="grid gird-cols-1 md:grid-cols-3 w-full gap-4">
                        {addInsBottom.map(addIn => (
                            <AddInCard icon={addIn.icon} title={addIn.title} description={addIn.description} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddIns
