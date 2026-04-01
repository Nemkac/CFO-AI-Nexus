import * as Select from '@radix-ui/react-select'
import { ChevronDown, Check } from 'lucide-react'

interface Props {
    label?: string
    placeholder?: string
    value: string
    onChange: (value: string) => void
    onBlur?: () => void
    error?: string
    options: { value: string; label: string }[]
}

const SimpleSelect = ({ label, placeholder = 'Select an option', value, onChange, onBlur, error, options }: Props) => {
    return (
        <div className="flex flex-col w-full gap-2">
            {label && <p className="text-p-md text-content-heading">{label}</p>}
            <Select.Root value={value} onValueChange={onChange}>
                <Select.Trigger
                    onBlur={onBlur}
                    className={`flex items-center justify-between gap-2 rounded-xl border p-6 w-full min-w-0 outline-none bg-surface-default text-p-md cursor-pointer ${error
                            ? 'border-red-500 text-content-heading'
                            : value
                                ? 'border-pink-500 text-content-heading'
                                : 'border-stroke-default text-content-body'
                        }`}
                >
                    <span className="truncate min-w-0 flex-1 text-left">
                        <Select.Value placeholder={placeholder} />
                    </span>
                    <Select.Icon>
                        <ChevronDown className="size-4 text-content-body shrink-0" />
                    </Select.Icon>
                </Select.Trigger>

                <Select.Portal>
                    <Select.Content
                        position="popper"
                        sideOffset={4}
                        style={{ width: 'var(--radix-select-trigger-width)' }}
                        className="z-50 bg-surface-default border-[0.5px] border-stroke-default rounded-xl shadow-xl overflow-hidden"
                    >
                        <Select.Viewport className="max-h-64 overflow-y-auto p-1">
                            {options.map((opt) => (
                                <Select.Item
                                    key={opt.value}
                                    value={opt.value}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer text-p-md text-content-heading outline-none data-highlighted:bg-sapphire-800/50 data-[state=checked]:bg-sapphire-800/70"
                                >
                                    <Select.ItemText className='truncate'>{opt.label}</Select.ItemText>
                                    <Select.ItemIndicator className="ml-auto">
                                        <Check className="size-4 text-pink-500" />
                                    </Select.ItemIndicator>
                                </Select.Item>
                            ))}
                        </Select.Viewport>
                    </Select.Content>
                </Select.Portal>
            </Select.Root>
            {error && <p className="text-p-sm text-red-400">{error}</p>}
        </div>
    )
}

export default SimpleSelect