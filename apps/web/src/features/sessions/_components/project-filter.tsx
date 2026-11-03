"use client";

import { useState, type ReactNode } from "react";
import { Check, Folder, ListFilter, Settings, SquareDashed } from "lucide-react";
import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/ui/components/command";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/popover";
import { IconTooltipButton } from "@/components/icon-tooltip-button";
import { getProjectInitials } from "@/lib/get-project-initials";
import { ALL_PROJECTS, MOCK_PROJECTS, NO_PROJECT } from "../data";

// Small rounded-square avatar used as a project's icon.
const ProjectAvatar = ({ project }: { project: string }) => (
  <Avatar className="size-5 rounded-sm">
    <AvatarFallback className="rounded-sm text-[10px] font-medium">
      {getProjectInitials(project)}
    </AvatarFallback>
  </Avatar>
);

// Wraps an option icon and overlays a small check badge when that option is selected.
const SelectableIcon = ({ selected, children }: { selected: boolean; children: ReactNode }) => (
  <span className="relative flex size-5 shrink-0 items-center justify-center">
    {children}
    {selected && (
      <span className="absolute -right-1 -bottom-1 flex size-3 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-popover">
        <Check className="size-2" strokeWidth={4} />
      </span>
    )}
  </span>
);

/**
 * @component ProjectFilter
 * @description Filter icon that opens a searchable project picker ("All projects" by default); the selected option gets a check badge and active background.
 * @param value Selected project name, ALL_PROJECTS or NO_PROJECT.
 * @param onChange Called with the newly selected filter value.
 */
export const ProjectFilter = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const isFiltered = value !== ALL_PROJECTS;

  // Applies a selection and closes the picker.
  const select = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  // Label of the selected option, so the keyboard cursor starts on it when opened.
  const selectedLabel =
    value === ALL_PROJECTS ? "All projects" : value === NO_PROJECT ? "No project" : value;

  // One option row: icon, label and (for projects) a settings gear. UI only for the gear for now.
  const renderItem = (id: string, label: string, icon: ReactNode, showGear = true) => (
    <CommandItem
      key={id}
      value={label}
      onSelect={() => select(id)}
      // cmdk sets data-selected="false" on idle rows (which would all show the active bg), so reset
      // them; the chosen option keeps the active bg.
      className={
        value === id
          ? "gap-3 rounded-lg bg-muted! px-2 py-2"
          : "gap-3 rounded-lg px-2 py-2 data-[selected=false]:bg-transparent!"
      }
    >
      <SelectableIcon selected={value === id}>{icon}</SelectableIcon>
      <span className="flex-1 truncate">{label}</span>
      {showGear && <Settings className="size-4 text-muted-foreground" />}
    </CommandItem>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <IconTooltipButton label="Filter by project">
          <span className="relative">
            <ListFilter className={isFiltered ? "text-primary" : undefined} />
            {isFiltered && (
              <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-primary" />
            )}
          </span>
        </IconTooltipButton>
      </PopoverTrigger>
      <PopoverContent align="end" collisionPadding={8} className="w-64 gap-0 p-2">
        {/* Search box restyled from a boxed input to a flat underlined one. */}
        <Command
          defaultValue={selectedLabel}
          className="**:data-[slot=input-group]:rounded-none! **:data-[slot=input-group]:border-0! **:data-[slot=input-group]:border-b! **:data-[slot=input-group]:border-ring! **:data-[slot=input-group]:bg-transparent!"
        >
          <CommandInput placeholder="Search projects..." />
          <CommandList className="mt-2 max-h-72">
            <CommandEmpty>No projects found.</CommandEmpty>
            {renderItem(ALL_PROJECTS, "All projects", <Folder className="size-5" />, false)}
            {MOCK_PROJECTS.map((project) =>
              renderItem(project, project, <ProjectAvatar project={project} />),
            )}
            {renderItem(NO_PROJECT, "No project", <SquareDashed className="size-5" />)}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
