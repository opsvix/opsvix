import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const typographVariants = cva(
    "text-gray-500 text-start",
    {
        variants: {
            variant: {
                default: '',
                heading: 'text-4xl  text-center pt-20 bg-clip-text text-transparent bg-linear-to-r to-[#00003E] from-[#0000A4] bg-clip leading-tight ',
                tittle: 'text-lg  pl-2 text-black transition-colors',
                paragraph: '',
            },
            size: {
                default: '  ',
                sub: 'text-center pt-5 pb-20 2xl:pb-30 w-1/3 mx-auto',
                sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
                lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
                icon: 'size-9',
                'icon-sm': 'size-8',
                'icon-lg': 'size-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
)

function Typograph({
    className,
    variant,
    size,
    asChild = false,
    ...props
}: React.ComponentProps<'p'> &
    VariantProps<typeof typographVariants> & {
        asChild?: boolean
    }) {
    const Comp = asChild ? Slot : 'p'

    return (
        <Comp
            data-slot="p"
            className={cn(typographVariants({ variant, size, className }))}
            {...props}
        />
    )
}

export { Typograph, typographVariants }
