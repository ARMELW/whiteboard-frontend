import React, { useState } from 'react';
import { Sparkles, Layers as LayersIcon, Type, Music, Hand } from 'lucide-react';
import MediaTab from './tabs/MediaTab';
import LayersTab from './tabs/LayersTab';
import TextTab from './tabs/TextTab';
import AudioTab from './tabs/AudioTab';
import HandTab from './tabs/HandTab';

type TabType = 'media' | 'layers' | 'text' | 'audio' | 'hand';

const ContextTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('layers');
  
  const tabs = [
    { id: 'media' as TabType, label: 'Media', icon: Sparkles },
    { id: 'layers' as TabType, label: 'Layers', icon: LayersIcon },
    { id: 'text' as TabType, label: 'Text', icon: Type },
    { id: 'audio' as TabType, label: 'Audio', icon: Music },
    { id: 'hand' as TabType, label: 'Hand', icon: Hand },
  ];

  return (
    <div className="bg-white border-r border-border flex h-full shadow-sm">
      {/* Vertical Tabs Sidebar */}
      <div className="flex flex-col w-16 border-r border-gray-200 bg-gray-50 py-2 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-3 px-2 gap-1 transition-all rounded-lg mx-1 ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
              title={tab.label}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'media' && <MediaTab />}
        {activeTab === 'layers' && <LayersTab />}
        {activeTab === 'text' && <TextTab />}
        {activeTab === 'audio' && <AudioTab />}
        {activeTab === 'hand' && <HandTab />}
      </div>
    </div>
  );
};

export default React.memo(ContextTabs);