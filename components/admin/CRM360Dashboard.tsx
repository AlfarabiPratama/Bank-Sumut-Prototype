import React, { useState, useEffect, useCallback } from 'react';
import { User, Campaign, LoanApplication } from '../../types';
import CRMLayout, { CRMPillar, SUB_TABS } from './CRMLayout';
import ExecutiveDashboard from './ExecutiveDashboard';
import MarketingCloud from './marketing/MarketingCloud';
import SalesCloud from './sales/SalesCloud';
import ServiceCloud from './service/ServiceCloud';
import ComplianceCloud from './compliance/ComplianceCloud';
import Customer360View from './Customer360View';
import QuickActions from '../ui/QuickActions';
import CommandPalette from '../ui/CommandPalette';

interface CRM360DashboardProps {
  customers: User[];
  campaigns: Campaign[];
  applications: LoanApplication[];
  onCampaignsChange?: (campaigns: Campaign[]) => void;
  onViewChange?: (view: 'mobile' | 'crm' | 'rm-mobile' | 'admin-legacy') => void;
}

const CRM360Dashboard: React.FC<CRM360DashboardProps> = ({
  customers,
  campaigns,
  applications,
  onCampaignsChange,
  onViewChange,
}) => {
  const [activePillar, setActivePillar] = useState<CRMPillar>('executive');
  const [activeSubTab, setActiveSubTab] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<{ label: string; onClick?: () => void }[]>([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Set default sub-tab when pillar changes
  useEffect(() => {
    const subTabs = SUB_TABS[activePillar];
    if (subTabs.length > 0) {
      setActiveSubTab(subTabs[0]);
    } else {
      setActiveSubTab('');
    }
  }, [activePillar]);

  // Keyboard shortcut for Command Palette (Cmd+K or Ctrl+K)
  const handleGlobalKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setIsCommandPaletteOpen(prev => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleGlobalKeyDown]);

  const handlePillarChange = (pillar: CRMPillar) => {
    setActivePillar(pillar);
    setSelectedCustomer(null);
    setBreadcrumbs([]);
  };

  const handleSubTabChange = (subTab: string) => {
    setActiveSubTab(subTab);
  };

  const handleSelectCustomer = (customer: User) => {
    setSelectedCustomer(customer);
    setBreadcrumbs([
      { label: 'Customers', onClick: () => setSelectedCustomer(null) },
      { label: customer.name },
    ]);
  };

  const handleCloseCustomer360 = () => {
    setSelectedCustomer(null);
    setBreadcrumbs([]);
  };

  const handleNavigateToPillar = (pillar: 'marketing' | 'sales' | 'service') => {
    setActivePillar(pillar);
    setBreadcrumbs([]);
  };

  // Quick Actions handlers
  const handleCreateCampaign = () => {
    setActivePillar('marketing');
    // Could trigger modal or navigate to campaign creation
  };

  const handleAddCustomer = () => {
    // Could trigger customer creation modal
    console.log('Add customer clicked');
  };

  const handleNewTicket = () => {
    setActivePillar('service');
    // Could trigger ticket creation modal
  };

  const handleGenerateReport = () => {
    // Could trigger report generation
    console.log('Generate report clicked');
  };

  const renderContent = () => {
    // If customer is selected, show Customer 360 view
    if (selectedCustomer) {
      return (
        <Customer360View
          user={selectedCustomer}
          onClose={handleCloseCustomer360}
        />
      );
    }

    // Render based on active pillar
    switch (activePillar) {
      case 'executive':
        return (
          <ExecutiveDashboard
            customers={customers}
            campaigns={campaigns}
            applications={applications}
            onNavigateToPillar={handleNavigateToPillar}
          />
        );

      case 'marketing':
        return (
          <MarketingCloud
            customers={customers}
            campaigns={campaigns}
            onCampaignsChange={onCampaignsChange}
            onSelectCustomer={handleSelectCustomer}
            activeSubTab={activeSubTab}
          />
        );

      case 'sales':
        return (
          <SalesCloud
            customers={customers}
            applications={applications}
            onSelectCustomer={handleSelectCustomer}
            activeSubTab={activeSubTab}
          />
        );

      case 'service':
        return (
          <ServiceCloud
            customers={customers}
            onSelectCustomer={handleSelectCustomer}
            activeSubTab={activeSubTab}
          />
        );

      case 'compliance':
        return (
          <ComplianceCloud
            activeSubTab={activeSubTab}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <CRMLayout
        activePillar={activePillar}
        onPillarChange={handlePillarChange}
        activeSubTab={activeSubTab}
        onSubTabChange={handleSubTabChange}
        breadcrumbs={breadcrumbs}
        onViewChange={onViewChange}
      >
        {renderContent()}
      </CRMLayout>

      {/* Quick Actions FAB */}
      <QuickActions
        onCreateCampaign={handleCreateCampaign}
        onAddCustomer={handleAddCustomer}
        onNewTicket={handleNewTicket}
        onGenerateReport={handleGenerateReport}
      />

      {/* Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </>
  );
};

export default CRM360Dashboard;
