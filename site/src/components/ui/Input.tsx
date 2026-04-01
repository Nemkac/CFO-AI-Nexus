type Props = {
    label?: string
    placeholder: string
    value?: string
    onChange?: (value: string) => void
    onBlur?: () => void
    type?: string
    error?: string
}

const Input = ({ label, placeholder, value, onChange, onBlur, type = 'text', error }: Props) => {
    return (
        <div className="flex flex-col w-full gap-2">
            {label && (
                <p className="text-p-md text-content-heading">{label}</p>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange ? (e) => onChange(e.target.value) : undefined}
                onBlur={onBlur}
                className={`rounded-xl border p-6 w-full outline-none bg-surface-default text-p-md text-content-heading placeholder:text-content-body ${
                    error
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-stroke-default focus:border-pink-500 not-placeholder-shown:border-pink-500'
                }`}
                placeholder={placeholder}
            />
            {error && <p className="text-p-sm text-red-400">{error}</p>}
        </div>
    )
}

export default Input
