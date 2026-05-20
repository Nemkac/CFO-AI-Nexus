import { useEffect, useState } from 'react'

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

const CountUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center min-w-9">
        <span className="text-h3 text-content-heading font-bold leading-none tabular-nums">
            {String(value).padStart(2, '0')}
        </span>
        <span className="text-p-xsm text-white/50 uppercase tracking-widest">{label}</span>
    </div>
)

const Countdown = ({ targetDate }: { targetDate: Date }) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(targetDate))

    useEffect(() => {
        const id = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000)
        return () => clearInterval(id)
    }, [targetDate])

    return (
        <div className="flex flex-row items-center gap-3">
            <CountUnit value={timeLeft.days} label="days" />
            <span className="text-white/30 text-xl pb-4">:</span>
            <CountUnit value={timeLeft.hours} label="hrs" />
            <span className="text-white/30 text-xl pb-4">:</span>
            <CountUnit value={timeLeft.minutes} label="min" />
            <span className="text-white/30 text-xl pb-4">:</span>
            <CountUnit value={timeLeft.seconds} label="sec" />
        </div>
    )
}

export default Countdown