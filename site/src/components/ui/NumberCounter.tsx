type Props = {
    value: number,
    title: string
}

const NumberCounter = ({ value, title }: Props) => {
    return (
        <div className='flex flex-col gap-2 items-center text-center min-w-35'>
            <h2 className='text-h2 text-content-heading'>{value}</h2>
            <h2 className='text-p-md text-content-heading whitespace-pre-line'>{title}</h2>
        </div>
    )
}

export default NumberCounter
