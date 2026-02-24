type Props = {
    icon: React.ReactNode,
    title: string,
    description: string
}

const WhyAttendCard = ({ icon, title, description }: Props) => {
    return (
        <div className="flex flex-col gap-2 items-center text-center min-w-35">
            {icon}
            <h5 className="text-h5 text-content-heading whitespace-pre-line text-pretty">{title}</h5>
            <h5 className="text-p-md text-content-body whitespace-pre-line text-pretty">{description}</h5>
        </div>
    )
}

export default WhyAttendCard