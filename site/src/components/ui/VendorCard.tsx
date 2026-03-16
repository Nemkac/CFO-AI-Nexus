type Props = {
    imageUrl?: string,
    title: string,
    description: string,
}

const VendorCard = ({ ...props }: Props) => {
    return (
        <div className="flex flex-col items-center py-10 px-8 rounded-2xl max-w-xs bg-linear-to-t hover:-translate-y-1.25 hover:border-t transition-[0.5s] ease-in-out hover:border-t-pink-500 from-pink-900 to-transparent gap-8 text-center">
            <div className="w-30 h-30 flex items-center justify-center shrink-0">
                {props.imageUrl ? (
                    <img src={props.imageUrl} className="max-w-full max-h-full object-contain" />
                ) : (
                    <div className="bg-content-heading rounded-full w-30 h-30" />
                )}
            </div>
            <div className="flex flex-col gap-6 items-center">
                <h4 className="text-h4 text-content-heading text-pretty">{props.title}</h4>
                <p className="text-p-md text-content-heading">{props.description}</p>
            </div>
            {/* <Button label="Visit the site" variant="secondary" /> */}
        </div>
    )
}

export default VendorCard
