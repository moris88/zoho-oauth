import {
  Timeline,
  TimelineItem,
  TimelinePoint,
  TimelineTitle,
  TimelineContent,
} from 'flowbite-react'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import {
  Bs1Circle,
  Bs2Circle,
  Bs3Circle,
  Bs4Circle,
  Bs5Circle,
} from 'react-icons/bs'
import React from 'react'

interface StepProps {
  index: number
}

const icons = [Bs1Circle, Bs2Circle, Bs3Circle, Bs4Circle, Bs5Circle]
const titles = [
  'Registering Client',
  'Scope Selection',
  'Making the authorization Request',
  'Generating Tokens',
  'Requesting Data',
]

function Step({ index }: Readonly<StepProps>) {
  React.useEffect(() => {
    const svgElements = document.querySelectorAll('svg')
    svgElements.forEach((svgElement, i) => {
      svgElement.classList.add('h-5', 'w-5')
      svgElement.classList.remove('h-3', 'w-3')
      if (i <= index) {
        svgElement.classList.add('text-white')
        svgElement.parentElement?.classList.add('bg-green-800')
      } else {
        svgElement.parentElement?.classList.add('bg-gray-800')
      }
    })
  }, [index])

  return (
    <Timeline horizontal className="my-4">
      {icons.map((Icon, i) => (
        <TimelineItem key={i}>
          <TimelinePoint
            icon={i <= index ? IoMdCheckmarkCircleOutline : Icon}
          />
          <TimelineContent>
            <TimelineTitle>
              <span className={i === index + 1 ? 'border-b border-white' : ''}>
                {titles[i]}
              </span>
            </TimelineTitle>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}

export default Step
