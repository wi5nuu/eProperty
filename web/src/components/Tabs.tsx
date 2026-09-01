interface TabItem {
  key: string
  label: string
  content: React.ReactNode
}

interface TabsProps {
  items: TabItem[]
  defaultTab?: string
}

export function Tabs({ items, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultTab || items[0]?.key)

  return (
    <div>
      <div className="border-b border-slate-200 dark:border-slate-700">
        <div className="flex gap-1">
          {items.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === item.key
                  ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="pt-4">
        {items.find((item) => item.key === activeTab)?.content}
      </div>
    </div>
  )
}

import React from 'react'
