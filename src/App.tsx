/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ServiceOpsProvider, useServiceOps } from './context/ServiceOpsContext';
import { Header } from './components/layout/Header';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { DashboardView } from './views/DashboardView';
import { IncidentsView } from './views/IncidentsView';
import { IncidentDetailView } from './views/IncidentDetailView';
import { ServiceCatalogView } from './views/ServiceCatalogView';
import { ServiceRequestsView } from './views/ServiceRequestsView';
import { ApprovalsView } from './views/ApprovalsView';
import { ProblemsView } from './views/ProblemsView';
import { ChangesView } from './views/ChangesView';
import { KnowledgeBaseView } from './views/KnowledgeBaseView';
import { AssetsView } from './views/AssetsView';
import { AdminView } from './views/AdminView';
import { ArchitectureView } from './views/ArchitectureView';
import { LoginView } from './views/LoginView';
import { Incident } from './types';

function MainApp() {
  const { currentUser, token, incidents } = useServiceOps();

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [selectedProblemId, setSelectedProblemId] = useState<string | undefined>(undefined);
  const [selectedAssetId, setSelectedAssetId] = useState<string | undefined>(undefined);
  const [selectedCatalogItemId, setSelectedCatalogItemId] = useState<string | undefined>(undefined);
  const [globalCreateIncidentOpen, setGlobalCreateIncidentOpen] = useState(false);

  // If unauthenticated, show login view
  if (!token) {
    return <LoginView onSuccess={() => setActiveTab('dashboard')} />;
  }

  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    setSelectedIncident(null);
  };

  const handleNavigateWithParams = (tab: NavTab, params?: any) => {
    setActiveTab(tab);
    if (tab === 'incidents' && params?.selectedId) {
      const match = incidents.find(i => i.id === params.selectedId);
      if (match) setSelectedIncident(match);
    } else if (tab === 'catalog' && params?.selectedItemId) {
      setSelectedCatalogItemId(params.selectedItemId);
      setSelectedIncident(null);
    } else {
      setSelectedIncident(null);
    }
  };

  const handleSelectIncidentById = (id: string) => {
    const match = incidents.find(i => i.id === id);
    if (match) {
      setSelectedIncident(match);
      setActiveTab('incidents');
    }
  };

  const handleSelectProblemById = (id: string) => {
    setSelectedProblemId(id);
    setSelectedIncident(null);
    setActiveTab('problems');
  };

  const handleSelectAssetById = (id: string) => {
    setSelectedAssetId(id);
    setSelectedIncident(null);
    setActiveTab('assets');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <Header onOpenArchitecture={() => handleSelectTab('architecture')} />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} onSelectTab={handleSelectTab} />

        {/* Dynamic Viewport */}
        <main className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-57px)]">
          <div className="max-w-7xl mx-auto">
            {/* View Switching */}
            {activeTab === 'dashboard' && (
              <DashboardView
                onNavigate={handleNavigateWithParams}
                onOpenCreateIncident={() => {
                  setActiveTab('incidents');
                  setGlobalCreateIncidentOpen(true);
                }}
              />
            )}

            {activeTab === 'incidents' && (
              selectedIncident ? (
                <IncidentDetailView
                  incident={selectedIncident}
                  onBack={() => setSelectedIncident(null)}
                  onSelectProblem={handleSelectProblemById}
                  onSelectAsset={handleSelectAssetById}
                />
              ) : (
                <IncidentsView
                  onSelectIncident={(inc) => setSelectedIncident(inc)}
                  openCreateModal={globalCreateIncidentOpen}
                  onCloseCreateModal={() => setGlobalCreateIncidentOpen(false)}
                />
              )
            )}

            {activeTab === 'catalog' && (
              <ServiceCatalogView
                selectedItemId={selectedCatalogItemId}
                onSuccessSubmit={(reqId) => {
                  setSelectedCatalogItemId(undefined);
                  setActiveTab('requests');
                }}
              />
            )}

            {activeTab === 'requests' && (
              <ServiceRequestsView onOpenCatalog={() => setActiveTab('catalog')} />
            )}

            {activeTab === 'approvals' && (
              <ApprovalsView />
            )}

            {activeTab === 'problems' && (
              <ProblemsView
                selectedProblemId={selectedProblemId}
                onSelectIncidentById={handleSelectIncidentById}
              />
            )}

            {activeTab === 'changes' && (
              <ChangesView />
            )}

            {activeTab === 'knowledge' && (
              <KnowledgeBaseView />
            )}

            {activeTab === 'assets' && (
              <AssetsView
                selectedAssetId={selectedAssetId}
                onSelectIncidentById={handleSelectIncidentById}
              />
            )}

            {activeTab === 'admin' && (
              <AdminView />
            )}

            {activeTab === 'architecture' && (
              <ArchitectureView />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ServiceOpsProvider>
      <MainApp />
    </ServiceOpsProvider>
  );
}
