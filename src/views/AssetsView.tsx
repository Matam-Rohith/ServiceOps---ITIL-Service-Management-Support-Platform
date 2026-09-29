import React, { useState } from 'react';
import { useServiceOps } from '../context/ServiceOpsContext';
import { Modal } from '../components/common/Modal';
import { Asset, AssetType, AssetStatus } from '../types';
import {
  Database,
  Search,
  PlusCircle,
  HardDrive,
  Laptop,
  Server,
  Network,
  Printer,
  Calendar,
  AlertTriangle,
  User,
  ShieldCheck,
  Tag
} from 'lucide-react';

interface AssetsViewProps {
  onSelectIncidentById: (incidentId: string) => void;
  selectedAssetId?: string;
}

export const AssetsView: React.FC<AssetsViewProps> = ({
  onSelectIncidentById,
  selectedAssetId
}) => {
  const { assets, incidents, createAsset, updateAsset, currentUser } = useServiceOps();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [inspectingAsset, setInspectingAsset] = useState<Asset | null>(() => {
    if (selectedAssetId) {
      return assets.find(a => a.id === selectedAssetId) || null;
    }
    return null;
  });
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New Asset Form
  const [name, setName] = useState('');
  const [type, setType] = useState<AssetType>('LAPTOP');
  const [status, setStatus] = useState<AssetStatus>('IN_STORAGE');
  const [ownerName, setOwnerName] = useState('');
  const [department, setDepartment] = useState('Product & Design');
  const [location, setLocation] = useState('Building A, Floor 3');
  const [serialNumber, setSerialNumber] = useState('');
  const [description, setDescription] = useState('');
  const [associatedService, setAssociatedService] = useState('Digital Workplace');

  const filteredAssets = assets.filter(a => {
    if (typeFilter !== 'ALL' && a.type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return a.assetTag.toLowerCase().includes(q) ||
             a.name.toLowerCase().includes(q) ||
             (a.ownerName && a.ownerName.toLowerCase().includes(q)) ||
             a.serialNumber.toLowerCase().includes(q);
    }
    return true;
  });

  const getAssetIcon = (type: AssetType) => {
    switch (type) {
      case 'LAPTOP': return Laptop;
      case 'SERVER': return Server;
      case 'NETWORK': return Network;
      case 'PRINTER': return Printer;
      default: return HardDrive;
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createAsset({
      name: name.trim(),
      type,
      status,
      ownerName: ownerName.trim() || undefined,
      department,
      location,
      serialNumber: serialNumber.trim() || undefined,
      description: description.trim(),
      associatedService
    });

    setCreateModalOpen(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Configuration Management Database (CMDB)
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
              {filteredAssets.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Hardware, Servers, Network Infrastructure, and Service Relationships
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-xs transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register New CI Asset</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by AST-XXXX, serial number, device name, or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-700"
          >
            <option value="ALL">All Asset Types</option>
            <option value="LAPTOP">Laptops</option>
            <option value="SERVER">Production Servers</option>
            <option value="NETWORK">Network Devices</option>
            <option value="APPLICATION">Core Applications</option>
            <option value="PRINTER">Printers &amp; Facilities</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="IN_USE">In Use</option>
            <option value="IN_STORAGE">In Storage (Depot)</option>
            <option value="IN_REPAIR">In Repair</option>
            <option value="RETIRED">Retired</option>
          </select>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAssets.map(asset => {
          const Icon = getAssetIcon(asset.type);
          const activeIncs = incidents.filter(
            i => i.affectedAssetId === asset.id && i.status !== 'RESOLVED' && i.status !== 'CLOSED'
          );

          return (
            <div
              key={asset.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    asset.status === 'IN_USE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    asset.status === 'IN_REPAIR' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {asset.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div>
                  <span className="font-mono text-xs font-bold text-indigo-600 block">
                    {asset.assetTag}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">{asset.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {asset.description}
                  </p>
                </div>

                <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned To:</span>
                    <span className="font-semibold text-slate-800">{asset.ownerName || 'Depot / Unassigned'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="text-slate-700 truncate max-w-[160px]">{asset.location}</span>
                  </div>
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-slate-400">Serial #:</span>
                    <span className="text-slate-700">{asset.serialNumber}</span>
                  </div>
                </div>

                {/* Active Incident Warning */}
                {activeIncs.length > 0 && (
                  <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-between text-xs text-rose-800">
                    <span className="flex items-center gap-1 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      {activeIncs.length} Active Incident(s)
                    </span>
                    <button
                      onClick={() => onSelectIncidentById(activeIncs[0].id)}
                      className="text-xs font-bold text-rose-700 hover:underline"
                    >
                      {activeIncs[0].incidentNumber} &rarr;
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  Service: <strong className="text-slate-600">{asset.associatedService || 'N/A'}</strong>
                </span>
                <button
                  onClick={() => setInspectingAsset(asset)}
                  className="font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Full CI Specs &rarr;
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspect Asset Specs Modal */}
      {inspectingAsset && (
        <Modal
          isOpen={true}
          onClose={() => setInspectingAsset(null)}
          title={`Configuration Item: ${inspectingAsset.assetTag} - ${inspectingAsset.name}`}
          subtitle={`Type: ${inspectingAsset.type} &bull; Status: ${inspectingAsset.status}`}
        >
          <div className="space-y-4 text-xs">
            <p className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 leading-relaxed">
              {inspectingAsset.description}
            </p>

            <div className="grid grid-cols-2 gap-3 border border-slate-200 rounded-lg divide-y divide-slate-100">
              <div className="p-3">
                <span className="text-slate-400 block text-[11px]">Primary User / Owner</span>
                <span className="font-bold text-slate-800">{inspectingAsset.ownerName || 'Unassigned Depot'}</span>
              </div>
              <div className="p-3">
                <span className="text-slate-400 block text-[11px]">Department</span>
                <span className="font-bold text-slate-800">{inspectingAsset.department}</span>
              </div>
              <div className="p-3">
                <span className="text-slate-400 block text-[11px]">Location</span>
                <span className="font-bold text-slate-800">{inspectingAsset.location}</span>
              </div>
              <div className="p-3">
                <span className="text-slate-400 block text-[11px]">Associated Business Service</span>
                <span className="font-bold text-slate-800">{inspectingAsset.associatedService || 'None'}</span>
              </div>
              <div className="p-3">
                <span className="text-slate-400 block text-[11px]">Serial Number</span>
                <span className="font-mono font-bold text-slate-800">{inspectingAsset.serialNumber}</span>
              </div>
              <div className="p-3">
                <span className="text-slate-400 block text-[11px]">Warranty Expiry</span>
                <span className="font-mono font-bold text-slate-800">{inspectingAsset.warrantyExpiry}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setInspectingAsset(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Register New Asset Modal */}
      {createModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setCreateModalOpen(false)}
          title="Register Configuration Item (CI) in CMDB"
          subtitle="Add a managed IT hardware asset or cloud infrastructure component"
          maxWidth="xl"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Asset Name / Model *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dell PowerEdge R750 2U Rack Server"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Asset Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as AssetType)}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="LAPTOP">Laptop / Workstation</option>
                  <option value="DESKTOP">Desktop Workstation</option>
                  <option value="SERVER">Server / Cloud Instance</option>
                  <option value="NETWORK">Network Router / Switch / Firewall</option>
                  <option value="APPLICATION">Core Software Application</option>
                  <option value="PRINTER">Printer / Facilities</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AssetStatus)}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="IN_USE">IN USE</option>
                  <option value="IN_STORAGE">IN STORAGE (DEPOT)</option>
                  <option value="IN_REPAIR">IN REPAIR</option>
                  <option value="RETIRED">RETIRED</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Owner Name</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Rohith"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Serial Number / Asset UID</label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="e.g. SN-8839104-X"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Location / Rack</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Data Center US-East (Rack 12)"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Associated Business Service</label>
                <input
                  type="text"
                  value={associatedService}
                  onChange={(e) => setAssociatedService(e.target.value)}
                  placeholder="e.g. Core Banking & ERP Services"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hardware Specifications / Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Hardware specs, RAM, CPU, IP addresses, firmware versions..."
                className="w-full text-xs p-3 rounded-lg border border-slate-200"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="px-3.5 py-2 rounded-lg border border-slate-200 font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              >
                Register CI Asset
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
