
type Props = {
    imageUrl?: string,
    title: string,
    description: string
}

const OpportunitiesCard = ({ ...props }: Props) => {
    return (
        <div
            className="flex flex-col max-w-md w-full h-110 rounded-2xl border border-stroke-default/25 backdrop-blur-sm bg-purple-800/10"
            style={{
                boxShadow: 'inset 0 1px 0 rgba(201, 208, 255, 0.2), inset 0 -1px 0 rgba(77, 93, 255, 0.12), inset 1px 0 0 rgba(201, 208, 255, 0.1), inset -1px 0 0 rgba(77, 93, 255, 0.08), inset 0 0 48px rgba(201, 208, 255, 0.04)',
            }}
        >
            <div className="w-full h-60 rounded-t-2xl overflow-hidden shrink-0">
                {props.imageUrl ? (
                    <img src={props.imageUrl} className="w-full h-full object-cover object-top" loading="lazy" />
                ) : (
                    <div className="bg-content-heading w-full h-full" />
                )}
            </div>
            <div className="flex flex-col p-6 gap-3 text-balance items-start flex-1 min-h-40">
                <h4 className="text-h4 text-content-heading">{props.title}</h4>
                <p className="text-p-md text-content-heading">{props.description}</p>
            </div>
        </div>
    )
}

export default OpportunitiesCard
