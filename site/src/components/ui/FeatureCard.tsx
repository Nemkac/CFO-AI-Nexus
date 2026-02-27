import Button from './Button'

type Props = {
    image?: string,
    title: string,
    description: string,
    flip?: boolean,
    minHeight?: number,
    buttonVariant: "primary" | "white",
    buttonLabel: string
}

const FeatureCard = ({ ...props }: Props) => {
    return (
        <div
            className='flex flex-col md:flex-row w-full items-center rounded-3xl p-8 gap-8 border border-stroke-default/25 backdrop-blur-sm bg-purple-800/10'
            style={{
                boxShadow: 'inset 0 1px 0 rgba(201, 208, 255, 0.2), inset 0 -1px 0 rgba(77, 93, 255, 0.12), inset 1px 0 0 rgba(201, 208, 255, 0.1), inset -1px 0 0 rgba(77, 93, 255, 0.08), inset 0 0 48px rgba(201, 208, 255, 0.04)',
                ...(props.minHeight ? { minHeight: props.minHeight } : undefined)
            }}
        >
            {props.flip ?
                (
                    <>
                        <div className='flex flex-col items-center justify-center w-full md:w-[50%] text-center gap-6'>
                            <div className='flex flex-col gap-3'>
                                <h4 className='text-h4 text-content-heading'>{props.title}</h4>
                                <p className='text-p-md text-content-body text-pretty'>{props.description}</p>
                            </div>
                            <Button label={props.buttonLabel} variant={props.buttonVariant} />
                        </div>
                        {props.image ? (<img className='rounded-2xl' />) : (<div className='rounded-2xl bg-content-heading h-full w-full md:w-[50%]' />)}
                    </>
                ) : (
                    <>
                        {props.image ? (<img className='rounded-2xl' />) : (<div className='rounded-2xl bg-content-heading h-full w-full md:w-[50%]' />)}
                        <div className='flex flex-col items-center justify-center w-full md:w-[50%] text-center gap-6'>
                            <div className='flex flex-col gap-3'>
                                <h4 className='text-h4 text-content-heading'>{props.title}</h4>
                                <p className='text-p-md text-content-body text-pretty'>{props.description}</p>
                            </div>
                            <Button label={props.buttonLabel} variant={props.buttonVariant} />
                        </div>
                    </>
                )}
        </div>
    )
}

export default FeatureCard
