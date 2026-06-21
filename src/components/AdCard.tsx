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
      className={`group bg-white border rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer border-slate-200 relative ${
        ad.isFeatured ? "ring-2 ring-red-600 ring-offset-1" : ""
      }`}
    >
      {/* Tags absolute container */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
        {ad.isFeatured && (
          <div
            id={`featured-badge-${ad.id}`}
            className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide rounded-sm shadow-sm select-none"
          >
            Premium
          </div>
        )}
        {ad.sellerRole === UserRole.PROFESSIONNEL && (
          <div
            id={`seller-role-badge-${ad.id}`}
            className="bg-blue-700 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide rounded-sm shadow-sm flex items-center gap-1"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>PRO</span>
          </div>
        )}
      </div>

      {/* Action shortcuts absolute container */}
      <div className="absolute top-2 right-2 z-10 flex flex-col space-y-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          id={`fav-btn-${ad.id}`}
          className={`p-2 rounded-sm transition-transform duration-200 hover:scale-110 shadow-md flex items-center justify-center cursor-pointer ${
            isFavorite ? "bg-red-600 text-white" : "bg-white/90 text-slate-700 hover:bg-white"
          }`}
          title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart className={`h-4.5 w-4.5 ${isFavorite ? "fill-current" : ""}`} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComparison();
          }}
          id={`compare-btn-${ad.id}`}
          className={`p-2 rounded-sm transition-transform duration-200 hover:scale-110 shadow-md flex items-center justify-center cursor-pointer ${
            isInComparison ? "bg-blue-700 text-white" : "bg-white/90 text-slate-700 hover:bg-white"
          }`}
          title={isInComparison ? "Retirer du comparateur" : "Ajouter au comparateur"}
        >
          <Scale className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Image container */}
      <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
        <img
          src={ad.images[0]}
          alt={ad.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Ad Details Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Price tag */}
        <div className="text-red-600 font-bold text-xl mb-1">
          {formatPrice(ad.price)}
        </div>

        {/* Title */}
        <h3 className="font-sans font-bold text-slate-800 group-hover:text-blue-700 transition-colors text-base line-clamp-1 mb-2">
          {ad.title}
        </h3>

        {/* Specifications badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
            {ad.year}
          </span>
          <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded-sm truncate max-w-[120px]">
            {formatMileage(ad.mileage, ad.category)}
          </span>
          <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase">
            {ad.fuel}
          </span>
          <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase">
            {ad.transmission === "Automatique" ? "Auto" : "Bvm"}
          </span>
        </div>

        {/* Category & Location metadata */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
            <MapPin className="h-3 w-3 mr-1 text-red-600" />
            {ad.location}
          </span>
          <span className="text-[10px] font-bold text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded-sm">
            {ad.category}
          </span>
        </div>
      </div>
    </div>
  );
}
