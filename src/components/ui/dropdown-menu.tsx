import * as React from "react";
import { Menu } from "@base-ui/react/menu";

import { cn } from "@/lib/utils";

const DropdownMenu = Menu.Root;
const DropdownMenuTrigger = Menu.Trigger;
const DropdownMenuGroup = Menu.Group;
const DropdownMenuPortal = Menu.Portal;
const DropdownMenuSub = Menu.SubmenuRoot;
const DropdownMenuRadioGroup = Menu.RadioGroup;

function DropdownMenuContent({
  className,
  side = "bottom",
  sideOffset = 4,
  align = "start",
  alignOffset = 0,
  collisionPadding = 8,
  ...props
}: React.ComponentProps<typeof Menu.Popup> &
  React.ComponentProps<typeof Menu.Positioner>) {
  const { ...positionerProps } = props;
  return (
    <Menu.Portal>
      <Menu.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        className="isolate z-50"
      >
        <Menu.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "relative z-50 max-h-(--available-height) min-w-44 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...positionerProps}
        />
      </Menu.Positioner>
    </Menu.Portal>
  );
}

function DropdownMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof Menu.Item>) {
  return (
    <Menu.Item
      data-slot="dropdown-menu-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-x-2 rounded-md px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuLinkItem({
  className,
  ...props
}: React.ComponentProps<typeof Menu.LinkItem>) {
  return (
    <Menu.LinkItem
      data-slot="dropdown-menu-link-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-x-2 rounded-md px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuLabel({
  className,
  ...props
}: React.ComponentProps<typeof Menu.GroupLabel>) {
  return (
    <Menu.GroupLabel
      data-slot="dropdown-menu-label"
      className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Menu.Separator>) {
  return (
    <Menu.Separator
      data-slot="dropdown-menu-separator"
      className={cn("my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuLinkItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuTrigger,
};
