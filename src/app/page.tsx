"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import FilterPanel, { FilterState } from "../components/FilterPanel";
import ResourceList from "../components/ResourceList";

export default function Home() {
  const [filters, setFilters] = useState<FilterState | undefined>(undefined);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 flex overflow-hidden">
          {/* Scrollable Resource List */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
              <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Resources</h1>
                <p className="text-slate-500 mt-1">Manage and organize your learning materials</p>
              </header>

              <ResourceList filters={filters} />
            </div>
          </div>

          {/* Right Side Filter Panel */}
          <div className="w-80 bg-white border-l border-slate-200 overflow-y-auto hidden xl:block">
            <div className="p-6">
              <FilterPanel onFiltersChange={setFilters} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
