/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Search, Filter, RefreshCw, MapPin } from "lucide-react";
import { FuelType, TransmissionType, VehicleCategory } from "../types";

export interface FilterState {
  searchQuery: string;
  category: VehicleCategory | "all";
  brand: string;
  model: string;
  priceMin: string;
  priceMax: string;
  yearMin: string;
  yearMax: string;
  mileageMax: string;
  fuel: FuelType | "all";
  transmission: TransmissionType | "all";
  location: string;
}

interface VehicleListingFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  availableBrands: string[];
  onReset: () => void;
}

export default function VehicleListingFilters({
  filters,
  setFilters,
  availableBrands,
  onReset,
}: VehicleListingFiltersProps) {

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div id="filter-panel" className="bg-white border border-slate-200 rounded-sm p-5 shadow-sm sticky top-24">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-blue-700" />
          <h2 className="font-sans font-bold text-slate-950 text-base">Filtres de recherche</h2>
        </div>
        <button
          id="btn-filter-reset"
          onClick={onReset}
          className="text-xs text-red-650 hover:underline font-medium flex items-center space-x-1 cursor-pointer"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Réinitialiser</span>
        </button>
      </div>

      <div className="space-y-4" id="filters-form">
        {/* Keyword Search */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Recherche par mot-clé
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              name="searchQuery"
              id="filter-search-input"
              value={filters.searchQuery}
              onChange={handleTextChange}
              placeholder="Ex: Sportive, Toit Ouvrant, Cuir..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Brand */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Marque
          </label>
          <select
            name="brand"
            id="filter-brand-select"
            value={filters.brand}
            onChange={handleTextChange}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 focus:bg-white transition"
          >
            <option value="">Toutes les marques</option>
            {availableBrands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Price limits */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Budget (€)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="number"
                name="priceMin"
                id="filter-price-min"
                value={filters.priceMin}
                onChange={handleTextChange}
                placeholder="Min"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
              />
            </div>
            <div>
              <input
                type="number"
                name="priceMax"
                id="filter-price-max"
                value={filters.priceMax}
                onChange={handleTextChange}
                placeholder="Max"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
              />
            </div>
          </div>
        </div>

        {/* Year limits */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Année de mise en circulation
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="number"
                name="yearMin"
                id="filter-year-min"
                value={filters.yearMin}
                onChange={handleTextChange}
                placeholder="Min (ex: 2018)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
              />
            </div>
            <div>
              <input
                type="number"
                name="yearMax"
                id="filter-year-max"
                value={filters.yearMax}
                onChange={handleTextChange}
                placeholder="Max (ex: 2026)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
              />
            </div>
          </div>
        </div>

        {/* Mileage max limit */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Kilométrage maximum (km / h)
          </label>
          <input
            type="number"
            name="mileageMax"
            id="filter-mileage-max"
            value={filters.mileageMax}
            onChange={handleTextChange}
            placeholder="Ex: 50000"
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
          />
        </div>

        {/* Energy (Fuel Type) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Énergie (Électrique, Hybride...)
          </label>
          <select
            name="fuel"
            id="filter-fuel-select"
            value={filters.fuel}
            onChange={handleTextChange}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
          >
            <option value="all">Toutes énergies</option>
            {Object.values(FuelType).map((fuel) => (
              <option key={fuel} value={fuel}>
                {fuel}
              </option>
            ))}
          </select>
        </div>

        {/* Gearbox Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Boîte de vitesse
          </label>
          <select
            name="transmission"
            id="filter-transmission-select"
            value={filters.transmission}
            onChange={handleTextChange}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
          >
            <option value="all">Toutes boîtes</option>
            {Object.values(TransmissionType).map((trans) => (
              <option key={trans} value={trans}>
                {trans}
              </option>
            ))}
          </select>
        </div>

        {/* Geolocation/Location Keyword */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Localisation (Ville / Département)
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              name="location"
              id="filter-location-input"
              value={filters.location}
              onChange={handleTextChange}
              placeholder="Ex: Paris, Lyon, 13..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
