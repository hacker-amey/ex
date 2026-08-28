import React from 'react';
import { Project, ProductType } from '../../shared/types';
import { FoodFleetProduct } from './products/FoodFleetProduct';
import { CommerceXProduct } from './products/CommerceXProduct';
import { PipelineXProduct } from './products/PipelineXProduct';
import { CampusOSProduct } from './products/CampusOSProduct';
import { 
  Sparkles, 
  Boxes, 
  Globe, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface GeneratedProductSectionProps {
  currentProject: Project | null;
  onSelectArchetype: (type: ProductType) => void;
  onLiveAction: (action: string, payload: any) => void;
}

export const GeneratedProductSection: React.FC<GeneratedProductSectionProps> = ({
  currentProject,
  onSelectArchetype,
  onLiveAction
}) => {
  const currentType = currentProject?.productType || 'FoodFleet';
  const interactiveData = currentProject?.interactiveData || {};

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0e1017] border border-zinc-800">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>INTERACTIVE PRODUCTION SOFTWARE ARTIFACT</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Generated Live Product Experience
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Fully functional client and backend API responses powered by Buildora's AI architecture.
          </p>
        </div>

        {/* Product Switcher Bar */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono">
          {(['FoodFleet', 'CommerceX', 'PipelineX', 'CampusOS'] as ProductType[]).map((type) => (
            <button
              key={type}
              id={`product-tab-${type.toLowerCase()}`}
              onClick={() => onSelectArchetype(type)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentType === type
                  ? 'bg-zinc-800 text-cyan-300 font-bold border border-zinc-700 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Embedded Live Interactive Product Component */}
      <div className="space-y-4">
        {currentType === 'FoodFleet' && (
          <FoodFleetProduct data={interactiveData} onAction={onLiveAction} />
        )}
        {currentType === 'CommerceX' && (
          <CommerceXProduct data={interactiveData} onAction={onLiveAction} />
        )}
        {currentType === 'PipelineX' && (
          <PipelineXProduct data={interactiveData} onAction={onLiveAction} />
        )}
        {currentType === 'CampusOS' && (
          <CampusOSProduct data={interactiveData} onAction={onLiveAction} />
        )}
      </div>
    </div>
  );
};
