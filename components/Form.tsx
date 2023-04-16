import * as Primitives from '@radix-ui/react-form'
import { ComponentPropsWithoutRef, forwardRef } from 'react'

export const Form = Primitives.Root

export const Field = Primitives.Field

export const Label = forwardRef<HTMLLabelElement,ComponentPropsWithoutRef<'label'>>((props,ref)=>{
        return <Primitives.Label {...props} ref={ref} />
})

