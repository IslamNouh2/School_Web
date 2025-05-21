"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type Framework = {
    value: string
    label: string
}

type ComboboxDemoProps = {
    frameworks: Framework[]
    type: string
    value: string
    onChange: (value: string) => void
    width:string
}

export function ComboboxDemo({ frameworks, type, value, onChange, width }: ComboboxDemoProps ) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`justify-between ${width}`}
                >
                    {value
                        ? frameworks.find((f) => f.value === value)?.label
                        : `Select ${type}...`}
                    <ChevronsUpDown className="ml-2 h-4 w-7 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandList>
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup>
                            {frameworks.map((f) => (
                                <CommandItem
                                    key={f.value}
                                    value={f.value}
                                    onSelect={(currentValue) => {
                                        onChange(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                    className="w-full text-right flex items-center"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-8 w-4",
                                            value === f.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {f.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>

    )
}