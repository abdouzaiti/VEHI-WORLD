/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Heart, Scale, MapPin, Calendar, Compass, Fuel, ShieldCheck } from "lucide-react";
import { Ad, UserRole } from "../types";

interface AdCardProps {
  key?: string;
  ad: Ad;
  isFavorite: boolean;
  isInComparison: boolean;
  onToggleFavorite: () => void;
  onToggleComparison: () => void;
  onViewDetails: () => void;
}

export default function AdCard({
  ad,
  isFavorite,
  isInComparison,
  onToggleFavorite,
  onToggleComparison,
  onViewDetails,
}: AdCardProps) {
  // Format price helper
  const formatPrice = (p: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(p);
  };

  // Format mileage helper
  const formatMileage = (m: number, cat: string) => {
    if (cat === "Bateaux" || cat === "Jets-skis") {
      return `${m} h (Moteur)`;
    }
    if (cat === "Engins agricoles") {
      return `${m} h (Heures)`;
    }
    return `${m.toLocaleString("fr-FR")} km`;
  };

  return (
    <div
      id={`ad-card-${ad.id}`}
      onClick={onViewDetails}
      className="group relative h-[420px] w-full rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200/50 cursor-pointer flex flex-col justify-end select-none"
    >
      {/* Background Image & Ambient Gradient Overlays */}
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-0">
        <img
          src={ad.images[0]}
          alt={ad.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Soft dark vignette gradient to make the elements extremely readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent z-[1]" />
      </div>

      {/* Tags absolute container (Top Left) */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {ad.isFeatured && (
          <div
            id={`featured-badge-${ad.id}`}
            className="bg-[#E11D48] text-white text-[10px] font-black px-2.5 py-1 uppercase tracking-wider rounded-md shadow-md"
          >
            Premium
          </div>
        )}
        {ad.sellerRole === UserRole.PROFESSIONNEL && (
          <div
            id={`seller-role-badge-${ad.id}`}
            className="bg-[#2563EB] text-white text-[10px] font-black px-2.5 py-1 uppercase tracking-wider rounded-md shadow-md flex items-center gap-1"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>PRO</span>
          </div>
        )}
      </div>

      {/* Action shortcuts absolute container (Top Right) */}
      <div className="absolute top-3 right-3 z-10 flex flex-col space-y-2">
        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          id={`fav-btn-${ad.id}`}
          className={`p-2 rounded-full transition-all duration-200 hover:scale-110 shadow-lg flex items-center justify-center cursor-pointer ${
            isFavorite ? "bg-white text-[#E11D48]" : "bg-white/95 text-slate-800 hover:bg-white"
          }`}
          title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart className={`h-4.5 w-4.5 ${isFavorite ? "fill-current" : ""}`} />
        </button>

        {/* Compare Scales Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComparison();
          }}
          id={`compare-btn-${ad.id}`}
          className={`p-2 rounded-full transition-all duration-200 hover:scale-110 shadow-lg flex items-center justify-center cursor-pointer ${
            isInComparison ? "bg-[#2563EB] text-white" : "bg-white/95 text-slate-800 hover:bg-white"
          }`}
          title={isInComparison ? "Retirer du comparateur" : "Ajouter au comparateur"}
        >
          <Scale className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Ad Details Overlay Content (Bottom) */}
      <div className="relative z-10 p-4 flex flex-col w-full">
        {/* Price tag */}
        <div className="text-white font-extrabold text-2xl tracking-tight leading-none mb-1">
          {formatPrice(ad.price)}
        </div>

        {/* Title */}
        <h3 className="font-sans font-extrabold text-white text-base leading-snug line-clamp-1 mb-2.5" title={ad.title}>
          {ad.title}
        </h3>

        {/* Specifications translucent pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="bg-white/15 backdrop-blur-md text-white border border-white/5 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center">
            <Calendar className="h-3 w-3 mr-1 opacity-80" />
            {ad.year} • {formatMileage(ad.mileage, ad.category)}
          </span>
          <span className="bg-white/15 backdrop-blur-md text-white border border-white/5 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
            {ad.fuel}
          </span>
          <span className="bg-white/15 backdrop-blur-md text-white border border-white/5 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
            {ad.transmission === "Automatique" ? "Auto" : "Bvm"}
          </span>
        </div>

        {/* Location & "Voir détails" actions row */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
          <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center">
            <MapPin className="h-3.5 w-3.5 mr-1 text-red-500 shrink-0" />
            <span className="truncate max-w-[130px]">{ad.location}</span>
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-950 text-[11px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-md flex items-center gap-1 transition-all shadow-md shrink-0 duration-200"
          >
            <span>Voir détails</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
