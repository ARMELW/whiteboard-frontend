import React, { useState } from 'react';
import { Image, Layers as LayersIcon, Type } from 'lucide-react';
import AssetsTab from './tabs/AssetsTab';
import LayersTab from './tabs/LayersTab';
import TextTab from './tabs/TextTab';

type TabType = 'assets' | 'layers' | 'text';

const ContextTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('layers');
  
  const tabs = [
    { id: 'assets' as TabType, label: 'Assets', icon: Image },
    { id: 'layers' as TabType, label: 'Layers', icon: LayersIcon },
    { id: 'text' as TabType, label: 'Text', icon: Type },
  ];

  return (
    <div className="bg-white border-r border-border flex flex-col h-full shadow-sm">
      {/* Tabs Header - Compact */}
  <div className="flex  mt-2 gap-3 px-3  overflow-hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-2 border-accent-foreground border rounded-full py-2 flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground bg-gray-100 hover:bg-secondary/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="text-md font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 px-2 py-3 overflow-hidden">
        {activeTab === 'assets' && <AssetsTab />}
        {activeTab === 'layers' && <LayersTab />}
        {activeTab === 'text' && <TextTab />}
      </div>
    </div>
  );
};

export default React.memo(ContextTabs);