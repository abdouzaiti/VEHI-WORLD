/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Scale, Trash2, Calendar, Compass, Fuel, HelpCircle, ArrowRight } from "lucide-react";
import { Ad } from "../types";

interface VehicleComparerProps {
  comparedAds: Ad[];
  onRemoveFromComparison: (adId: string) => void;
  onClearComparison: () => void;
  onViewDetails: (ad: Ad) => void;
}

export default function VehicleComparer({
  comparedAds,
  onRemoveFromComparison,
  onClearComparison,
  onViewDetails,
}: VehicleComparerProps) {
  const formatPrice = (p: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(p);
  };

  const formatMileage = (m: number, cat: string) => {
    if (cat === "Bateaux" || cat === "Jets-skis" || cat === "Engins agricoles") {
      return `${m} h`;
    }
    return `${m.toLocaleString("fr-FR")} km`;
  };

  // Extract all unique spec keys across all compared vehicles
  const allSpecKeys = React.useMemo(() => {
    const keysSet = new Set<string>();
    comparedAds.forEach((ad) => {
      if (ad.specifications) {
        Object.keys(ad.specifications).forEach((k) => keysSet.add(k));
      }
    });
    return Array.from(keysSet);
  }, [comparedAds]);

  if (comparedAds.length === 0) {
    return (
      <div id="compare-empty-view" className="max-w-md mx-auto text-center py-16 space-y-4">
        <div className="h-16 w-16 bg-blue-50 text-[#002395] rounded-full flex items-center justify-center mx-auto text-3xl">
          ⚖️
        </div>
        <h3 className="font-sans font-black text-lg text-slate-900 uppercase">Comparateur vide</h3>
        <p className="text-sm text-slate-500 leading-normal">
          Vous n'avez pas encore ajouté de véhicules à comparer. Parcourez nos annonces et cliquez sur l'icône de balance ⚖️ pour les ajouter ici.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="compare-matrix-view">
      {/* Header and Quick Stats */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="font-sans font-black text-xl text-slate-950 uppercase tracking-tight flex items-center space-x-2">
            <Scale className="h-5 w-5 text-[#002395]" />
            <span>Comparateur de véhicules ({comparedAds.length}/3)</span>
          </h2>
          <p className="text-xs text-slate-500">Analysez les fiches techniques side-by-side pour faire le meilleur choix.</p>
        </div>
        <button
          onClick={onClearComparison}
          id="btn-clear-comparison-list"
          className="text-xs font-bold text-[#ED2939] hover:underline bg-red-50 hover:bg-red-100/50 px-3 py-1.5 rounded-sm cursor-pointer"
        >
          Retirer tous les véhicules
        </button>
      </div>

      {/* Responsive comparison tables structure */}
      <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm" id="comparison-mesh-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {/* Visual Label Column */}
                <th className="p-4 text-xs font-black uppercase text-slate-400 w-1/4">Caractéristiques</th>
                
                {/* Compared items header rows */}
                {comparedAds.map((ad) => (
                  <th key={ad.id} className="p-4 relative">
                    {/* Delete item button */}
                    <button
                      onClick={() => onRemoveFromComparison(ad.id)}
                      className="absolute top-2 right-2 p-1.5 bg-slate-100 hover:bg-red-500 hover:text-white rounded-sm transition cursor-pointer text-slate-400"
                      title="Retirer ce modèle"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>

                    {/* Compact preview card */}
                    <div className="space-y-2 mt-2">
                      <div className="aspect-video w-full rounded-sm overflow-hidden bg-slate-100">
                        <img src={ad.images[0]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-white bg-blue-700 px-2 py-0.5 rounded-sm">
                        {ad.category}
                      </span>
                      <h4 className="font-sans font-black text-sm text-slate-900 line-clamp-1 leading-tight">{ad.title}</h4>
                      <p className="font-sans font-black text-base text-red-650 tracking-tight">{formatPrice(ad.price)}</p>
                    </div>
                  </th>
                ))}
                
                {/* Empty slots placeholders */}
                {Array.from({ length: 3 - comparedAds.length }).map((_, idx) => (
                  <th key={`empty-${idx}`} className="p-4 bg-slate-50/20 text-center text-xs text-slate-405 italic">
                    <div className="border border-dashed border-slate-250 py-10 rounded-sm flex flex-col items-center justify-center text-slate-400 max-w-[200px] mx-auto">
                      <span>Logement Vide</span>
                      <span className="text-[10px] font-normal leading-normal mt-1">+ Ajoutez un modèle</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 text-sm">
              {/* Brand Row */}
              <tr>
                <td className="p-4 font-semibold text-slate-500 bg-slate-50/30">Marque</td>
                {comparedAds.map((ad) => (
                  <td key={ad.id} className="p-4 font-bold text-slate-900">{ad.brand}</td>
                ))}
                {Array.from({ length: 3 - comparedAds.length }).map((_, idx) => (
                  <td key={`empty-brand-${idx}`} className="p-4 text-slate-350">—</td>
                ))}
              </tr>

              {/* Model Row */}
              <tr>
                <td className="p-4 font-semibold text-slate-500 bg-slate-50/30">Modèle</td>
                {comparedAds.map((ad) => (
                  <td key={ad.id} className="p-4 font-medium text-slate-800">{ad.model}</td>
                ))}
                {Array.from({ length: 3 - comparedAds.length }).map((_, idx) => (
                  <td key={`empty-model-${idx}`} className="p-4 text-slate-350">—</td>
                ))}
              </tr>

              {/* Year Row */}
              <tr>
                <td className="p-4 font-semibold text-slate-500 bg-slate-50/30">Mise en circulation</td>
                {comparedAds.map((ad) => (
                  <td key={ad.id} className="p-4 font-medium text-slate-800 flex items-center space-x-1.5">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>{ad.year}</span>
                  </td>
                ))}
                {Array.from({ length: 3 - comparedAds.length }).map((_, idx) => (
                  <td key={`empty-year-${idx}`} className="p-4 text-slate-350">—</td>
                ))}
              </tr>

              {/* Mileage Row */}
              <tr>
                <td className="p-4 font-semibold text-slate-500 bg-slate-50/30">Dépenses kilométriques</td>
                {comparedAds.map((ad) => (
                  <td key={ad.id} className="p-4 font-mono font-bold text-slate-900 flex items-center space-x-1.5">
                    <Compass className="h-4 w-4 text-slate-400" />
                    <span>{formatMileage(ad.mileage, ad.category)}</span>
                  </td>
                ))}
                {Array.from({ length: 3 - comparedAds.length }).map((_, idx) => (
                  <td key={`empty-mileage-${idx}`} className="p-4 text-slate-350">—</td>
                ))}
              </tr>

              {/* Fuel Row */}
              <tr>
                <td className="p-4 font-semibold text-slate-500 bg-slate-50/30">Énergie / Carburant</td>
                {comparedAds.map((ad) => (
                  <td key={ad.id} className="p-4 font-medium text-slate-800 flex items-center space-x-1.5">
                    <Fuel className="h-4 w-4 text-slate-400" />
                    <span className="truncate">{ad.fuel}</span>
                  </td>
                ))}
                {Array.from({ length: 3 - comparedAds.length }).map((_, idx) => (
                  <td key={`empty-fuel-${idx}`} className="p-4 text-slate-350">—</td>
                ))}
              </tr>

              {/* Transmission Row */}
              <tr>
                <td className="p-4 font-semibold text-slate-500 bg-slate-50/30">Boîte de vitesse</td>
                {comparedAds.map((ad) => (
                  <td key={ad.id} className="p-4 font-semibold text-[#002395]">{ad.transmission}</td>
                ))}
                {Array.from({ length: 3 - comparedAds.length }).map((_, idx) => (
                  <td key={`empty-transmission-${idx}`} className="p-4 text-slate-350">—</td>
                ))}
              </tr>

              {/* Location Row */}
              <tr>
                <td className="p-4 font-semibold text-slate-500 bg-slate-50/30">Localisation</td>
                {comparedAds.map((ad) => (
                  <td key={ad.id} className="p-4 text-slate-650 font-medium">{ad.location}</td>
                ))}
                {Array.from({ length: 3 - comparedAds.length }).map((_, idx) => (
                  <td key={`empty-location-${idx}`} className="p-4 text-slate-350">—</td>
                ))}
              </tr>

              {/* Seller Role Row */}
              <tr>
                <td className="p-4 font-semibold text-slate-500 bg-slate-50/30">vendeur</td>
                {comparedAds.map((ad) => (
                  <td key={ad.id} className="p-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm text-white ${
                      ad.sellerRole === "Professionnel" ? "bg-blue-600" : "bg-amber-600"
                    }`}>
                      {ad.sellerRole}
                    </span>
                  </td>
                ))}
                {Array.from({ length: 3 - comparedAds.length }).map((_, idx) => (
                  <td key={`empty-role-${idx}`} className="p-4 text-slate-350">—</td>
                ))}
              </tr>

              {/* Render dynamic unique custom specifications gathered */}
              {allSpecKeys.map((key) => (
                <tr key={key}>
                  <td className="p-4 font-semibold text-slate-500 bg-slate-50/30 capitalize">{key}</td>
                  {comparedAds.map((ad) => {
                    const value = ad.specifications ? ad.specifications[key] : null;
                    return (
                      <td key={ad.id} className="p-4 font-medium text-slate-700">
                        {value || <span className="text-slate-300 italic">Non renseigné</span>}
                      </td>
                    );
                  })}
                  {Array.from({ length: 3 - comparedAds.length }).map((_, idx) => (
                    <td key={`empty-dyn-${idx}`} className="p-4 text-slate-350">—</td>
                  ))}
                </tr>
              ))}

              {/* Action buttons footer Row */}
              <tr className="bg-slate-50/50">
                <td className="p-4 font-black text-slate-400 uppercase text-xs">Action</td>
                
                {comparedAds.map((ad) => (
                  <td key={ad.id} className="p-4">
                    <button
                      onClick={() => onViewDetails(ad)}
                      className="w-full bg-[#002395] hover:bg-[#ED2939] text-white py-2 px-3 rounded-sm font-bold text-xs transition-colors cursor-pointer flex items-center justify-center space-x-1"
                    >
                      <span>Consulter l'annonce</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                ))}
                
                {Array.from({ length: 3 - comparedAds.length }).map((_, idx) => (
                  <td key={`empty-action-${idx}`} className="p-4 text-slate-350 text-center">—</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
