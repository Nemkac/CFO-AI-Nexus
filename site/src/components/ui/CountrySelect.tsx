import * as Select from '@radix-ui/react-select'
import ReactCountryFlag from 'react-country-flag'
import { countries } from 'countries-list'
import { ChevronDown, Check } from 'lucide-react'
import { ALLOWED_COUNTRY_CODES } from '@/data/blockedCountries'

const countryList = (Object.entries(countries) as [string, { name: string }][])
    .filter(([code]) => ALLOWED_COUNTRY_CODES.has(code))
    .map(([code, data]) => ({ code, name: data.name }))
    .sort((a, b) => a.name.localeCompare(b.name))

interface Props {
    label?: string
    value: string
    onChange: (value: string) => void
    onBlur?: () => void
    error?: string
}

const CountrySelect = ({ label = 'Country', value, onChange, onBlur, error }: Props) => {
    return (
        <div className="flex flex-col w-full gap-2">
            <p className="text-p-md text-content-heading">{label}</p>
            <Select.Root value={value} onValueChange={onChange}>
                <Select.Trigger
                    onBlur={onBlur}
                    className={`flex items-center justify-between rounded-xl border p-6 w-full outline-none bg-surface-default text-p-md text-content-heading cursor-pointer ${error
                            ? 'border-red-500'
                            : value
                                ? 'border-pink-500'
                                : 'border-stroke-default'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        {value && (
                            <ReactCountryFlag countryCode={value} svg style={{ width: '1.25rem', height: '1.25rem' }} />
                        )}
                        <Select.Value placeholder={<span className="text-content-body">Select country</span>} />
                    </div>
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
                            {countryList.map(({ code, name }) => (
                                <Select.Item
                                    key={code}
                                    value={code}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer text-p-md text-content-heading outline-none data-highlighted:bg-sapphire-800/50 data-[state=checked]:bg-sapphire-800/70"
                                >
                                    <ReactCountryFlag countryCode={code} svg style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }} />
                                    <Select.ItemText>{name}</Select.ItemText>
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

export default CountrySelect