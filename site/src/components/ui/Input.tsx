type Props = {
    label?: string
    placeholder: string
}

const Input = ({ ...props }: Props) => {
    return (
        <div className="flex flex-col w-full gap-2">
            {props.label && (
                <p className="text-p-md text-content-heading">{props.label}</p>

            )}
            <input
                className="rounded-xl border p-6 w-full outline-none bg-surface-default border-stroke-default focus:border-pink-500 not-placeholder-shown:border-pink-500 text-p-md text-content-heading placeholder:text-content-body"
                placeholder={props.placeholder}
            />
        </div>
    )
}

export default Input
