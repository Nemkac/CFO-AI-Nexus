import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number }

function getTimeLeft(target: Date): TimeLeft {
    const diff = Math.max(0, target.getTime() - Date.now())
    return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
    }
}

// `compact` shrinks the countdown below md so it fits beside a button in the
// mobile banner; from md up it matches the default size. It uses plain Tailwind
// sizes because the text-h* / text-p-* classes don't take breakpoint prefixes.
const CountUnit = ({ value, label, compact }: { value: number; label: string; compact?: boolean }) => (
    <div className={cn("flex flex-col items-center", compact ? "min-w-6 md:min-w-9" : "min-w-9")}>
        {/* Plain string joins, not cn(): tailwind-merge mistakes text-h3 / text-p-xsm
            for colours and would drop the text colour next to them. */}
        <span className={`text-content-heading leading-none tabular-nums ${compact ? "font-heading font-bold text-lg/none md:text-[2.5rem]/none" : "text-h3 font-bold"}`}>
            {String(value).padStart(2, '0')}
        </span>
        <span className={`text-white/50 uppercase ${compact ? "font-medium text-[0.5625rem] tracking-wider mt-0.5 md:mt-0 md:text-xs md:tracking-widest" : "text-p-xsm tracking-widest"}`}>
            {label}
        </span>
    </div>
)

const Countdown = ({ targetDate, compact }: { targetDate: Date; compact?: boolean }) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(targetDate))

    useEffect(() => {
        const id = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000)
        return () => clearInterval(id)
    }, [targetDate])

    const separator = (
        <span className={cn("text-white/30", compact ? "text-sm pb-3 md:text-xl md:pb-4" : "text-xl pb-4")}>:</span>
    )

    return (
        <div className={cn("flex flex-row items-center", compact ? "gap-1.5 md:gap-3" : "gap-3")}>
            <CountUnit value={timeLeft.days} label="days" compact={compact} />
            {separator}
            <CountUnit value={timeLeft.hours} label="hrs" compact={compact} />
            {separator}
            <CountUnit value={timeLeft.minutes} label="min" compact={compact} />
            {separator}
            <CountUnit value={timeLeft.seconds} label="sec" compact={compact} />
        </div>
    )
}

export default Countdown
