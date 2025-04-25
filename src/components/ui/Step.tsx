import {
    Timeline,
    TimelineItem,
    TimelinePoint,
    TimelineTitle,
    TimelineContent
} from 'flowbite-react';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import {
    Bs1Circle,
    Bs2Circle,
    Bs3Circle,
    Bs4Circle,
    Bs5Circle
} from 'react-icons/bs';

interface StepProps {
    index: number;
}

const icons = [Bs1Circle, Bs2Circle, Bs3Circle, Bs4Circle, Bs5Circle];
const titles = [
    'Registering Client',
    'Scope Selection',
    'Making the authorization Request',
    'Generating Tokens',
    'Requesting Data'
];

const Step = ({ index }: StepProps) => {
    return (
        <Timeline horizontal className='my-4'>
            {icons.map((Icon, i) => (
                <TimelineItem key={i}>
                    <TimelinePoint icon={i <= index ? IoMdCheckmarkCircleOutline : Icon} />
                    <TimelineContent>
                        <TimelineTitle><span className={i === index + 1 ? 'border-b border-black' : ''}>{titles[i]}</span></TimelineTitle>
                    </TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    );
};

export default Step;

