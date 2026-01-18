import { Tabs as BaseTabs } from '@base-ui/react/tabs'

interface TabsRootProps extends React.ComponentProps<typeof BaseTabs.Root> {
  children: React.ReactNode
}

function TabsRoot({ children, className = '', ...props }: TabsRootProps) {
  return (
    <BaseTabs.Root className={className} {...props}>
      {children}
    </BaseTabs.Root>
  )
}

interface TabsListProps extends React.ComponentProps<typeof BaseTabs.List> {
  children: React.ReactNode
}

function TabsList({ children, className = '', ...props }: TabsListProps) {
  return (
    <BaseTabs.List
      className={`flex gap-1 border-b border-slate-700 ${className}`}
      {...props}
    >
      {children}
    </BaseTabs.List>
  )
}

interface TabsTriggerProps extends React.ComponentProps<typeof BaseTabs.Tab> {
  children: React.ReactNode
}

function TabsTrigger({ children, className = '', ...props }: TabsTriggerProps) {
  return (
    <BaseTabs.Tab
      className={`
        px-4 py-2 text-sm font-medium text-slate-400 
        border-b-2 border-transparent -mb-px
        hover:text-white
        data-selected:text-white data-selected:border-blue-500
        transition-colors cursor-pointer
        ${className}
      `}
      {...props}
    >
      {children}
    </BaseTabs.Tab>
  )
}

interface TabsContentProps extends React.ComponentProps<typeof BaseTabs.Panel> {
  children: React.ReactNode
}

function TabsContent({ children, className = '', ...props }: TabsContentProps) {
  return (
    <BaseTabs.Panel className={`pt-4 ${className}`} {...props}>
      {children}
    </BaseTabs.Panel>
  )
}

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
}
