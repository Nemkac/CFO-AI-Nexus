
type Props = {
    imageUrl?: string,
    title: string,
    description: string
}

const OpportunitiesCard = ({ ...props }: Props) => {
    return (
        <div className="flex flex-col rounded-lg max-w-md border-[0.5px] border-content-heading h-full">
            {props.imageUrl ? (
                <img src={props.imageUrl} className="w-full h-60 rounded-t-lg" />
            ) : (
                <div className="bg-content-heading w-full h-60 rounded-t-lg" />
            )}
            <div className="flex flex-col p-6 gap-3 text-balance items-start flex-1 min-h-40">
                <h4 className="text-h4 text-content-heading">{props.title}</h4>
                <p className="text-p-md text-content-heading">{props.description}</p>
            </div>
        </div>
    )
}

export default OpportunitiesCard
