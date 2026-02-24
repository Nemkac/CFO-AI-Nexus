type Props = {
    icon: string,
    title: string,
    description: string
}

const AddInCard = ({ ...props }: Props) => {
    return (
        <div className='flex flex-col w-full p-8 rounded-xl bg-linear-to-t from-surface-default to-sapphire-800/60 gap-4 text-balance hover:-translate-y-1.25 transition-[1s] ease-in-out'>
            <img src={props.icon} className="size-10" />
            <p className='text-p-lg-semibold text-content-heading'>{props.title}</p>
            <p className='text-p-md text-content-body'>{props.description}</p>
        </div>
    )
}



export default AddInCard
