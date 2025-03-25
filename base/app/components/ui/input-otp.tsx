import { OTPInput, type OTPInputProps } from 'input-otp'
import { forwardRef } from 'react'
import { cn } from '#app/utils/misc'

export const InputOTP = forwardRef<HTMLDivElement, OTPInputProps>(
	({ className, ...props }, ref) => (
		<OTPInput
			ref={ref}
			containerClassName={cn('flex items-center gap-2', className)}
			{...props}
		/>
	),
)
InputOTP.displayName = 'InputOTP'

export const InputOTPGroup = OTPInput.Group
export const InputOTPSlot = OTPInput.Slot
export const InputOTPSeparator = OTPInput.Separator
