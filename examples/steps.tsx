import { Step, StepTitle, Steps } from "@/registry/0db/ui/steps"

export default function Example() {
  return (
    <Steps>
      <Step done>
        <StepTitle>Share the brief</StepTitle>
        <p>A paragraph on what you&apos;re making and who it&apos;s for.</p>
      </Step>
      <Step current>
        <StepTitle>Agree the scope</StepTitle>
        <p>We send back what we&apos;ll make, and what we won&apos;t.</p>
      </Step>
      <Step>
        <StepTitle>Book a first call</StepTitle>
        <p>Forty minutes, cameras optional.</p>
      </Step>
    </Steps>
  )
}
