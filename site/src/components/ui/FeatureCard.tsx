import Button from './Button'

type Props = {
    image?: string,
    title: string,
    description: string,
    flip?: boolean,
    minHeight?: number
}

const FeatureCard = ({ ...props }: Props) => {
    return (
        <div className='flex flex-col md:flex-row w-full items-center border rounded-3xl p-8 border-content-heading gap-8' style={props.minHeight ? { minHeight: props.minHeight } : undefined}>
            {props.flip ?
                (
                    <>
                        <div className='flex flex-col items-center justify-center w-full md:w-[50%] text-center gap-6'>
                            <div className='flex flex-col gap-3'>
                                <h4 className='text-h4 text-content-heading'>{props.title}</h4>
                                <p className='text-p-md text-content-body text-pretty'>{props.description}</p>
                            </div>
                            <Button label='Apply for Partnership' />
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
                            <Button label='Apply for Partnership' />
                        </div>
                    </>
                )}
        </div>
    )
}

export default FeatureCard
