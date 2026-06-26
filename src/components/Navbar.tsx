/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Car, Heart, Scale, MessageSquare, LayoutDashboard, User, PlusCircle } from "lucide-react";
import { UserRole } from "../types";

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  currentUser: {
    id: string;
    name: string;
    role: UserRole;
    avatar: string;
  };
  unreadMessagesCount: number;
  favoritesCount: number;
  comparisonCount: number;
  onLogout: () => void;
  onLoginAs: (role: UserRole) => void;
}

export default function Navbar({
  currentView,
  setCurrentView,
  currentUser,
  unreadMessagesCount,
  favoritesCount,
  comparisonCount,
  onLogout,
  onLoginAs,
}: NavbarProps) {
  const [showRoleSelector, setShowRoleSelector] = React.useState(false);

  return (
    <header id="app-navbar" className="sticky top-0 z-50 bg-white/75 backdrop-blur-md border-b border-slate-200/50 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
      {/* Top Banner: Tricolore Accent Strip */}
      <div className="h-1.5 w-full flex">
        <div className="bg-[#002395] h-full flex-1"></div>
        <div className="bg-white h-full flex-1"></div>
        <div className="bg-[#ED2939] h-full flex-1"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo & Name */}
          <div
            id="logo-container"
            onClick={() => setCurrentView("acheter")}
            className="flex items-center cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Vehi World"
                className="h-[55px] sm:h-[70px] md:h-[85px] w-auto object-contain py-1 transition-transform group-hover:scale-105 duration-200"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback if logo.png is blank/empty or not loaded
                  e.currentTarget.style.display = 'none';
                  const fallback = document.getElementById("fallback-logo-text");
                  if (fallback) fallback.classList.remove("hidden");
                }}
              />
              <div id="fallback-logo-text" className="hidden text-2xl font-black tracking-tighter flex items-center">
                <span className="text-blue-700 underline decoration-red-600 decoration-4">VEHI</span>
                <span className="text-slate-900 ml-1">WORLD</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1 h-16" id="desktop-nav">
            <button
              id="nav-acheter-btn"
              onClick={() => setCurrentView("acheter")}
              className={`px-4 h-16 border-b-2 flex items-center text-xs font-bold uppercase tracking-wider transition-colors ${
                currentView === "acheter" || currentView === "details"
                  ? "border-blue-700 text-blue-700 font-extrabold"
                  : "border-transparent text-slate-500 hover:text-blue-700"
              }`}
            >
              Rechercher
            </button>
            <button
              id="nav-favoris-btn"
              onClick={() => setCurrentView("favoris")}
              className={`px-4 h-16 border-b-2 flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                currentView === "favoris"
                  ? "border-blue-700 text-blue-700 font-extrabold"
                  : "border-transparent text-slate-500 hover:text-blue-700"
              }`}
            >
              <span>Favoris</span>
              {favoritesCount > 0 && (
                <span className="px-1.5 py-0.5 text-[9px] font-bold leading-none text-white bg-red-600 rounded-sm">
                  {favoritesCount}
                </span>
              )}
            </button>
            <button
              id="nav-compare-btn"
              onClick={() => setCurrentView("comparaison")}
              className={`px-4 h-16 border-b-2 flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                currentView === "comparaison"
                  ? "border-blue-700 text-blue-700 font-extrabold"
                  : "border-transparent text-slate-500 hover:text-blue-700"
              }`}
            >
              <span>Comparateur</span>
              {comparisonCount > 0 && (
                <span className="px-1.5 py-0.5 text-[9px] font-bold leading-none text-white bg-blue-700 rounded-sm">
                  {comparisonCount}
                </span>
              )}
            </button>
            <button
              id="nav-messagerie-btn"
              onClick={() => setCurrentView("messagerie")}
              className={`px-4 h-16 border-b-2 flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                currentView === "messagerie"
                  ? "border-blue-700 text-blue-700 font-extrabold"
                  : "border-transparent text-slate-500 hover:text-blue-700"
              }`}
            >
              <span>Messagerie</span>
              {unreadMessagesCount > 0 && (
                <span className="px-1.5 py-0.5 text-[9px] font-bold leading-none text-white bg-red-650 bg-red-600 rounded-sm animate-pulse">
                  {unreadMessagesCount}
                </span>
              )}
            </button>
            <button
              id="nav-vendre-btn"
              onClick={() => setCurrentView("vendre")}
              className={`px-4 h-16 border-b-2 flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                currentView === "vendre"
                  ? "border-red-600 text-red-600 font-extrabold"
                  : "border-transparent text-slate-500 hover:text-red-600"
              }`}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Publier</span>
            </button>
            <button
              id="nav-admin-btn"
              onClick={() => setCurrentView("admin")}
              className={`px-4 h-16 border-b-2 flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                currentView === "admin"
                  ? "border-slate-900 text-slate-900 font-extrabold"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Console Admin</span>
            </button>
          </nav>

          {/* User Account Controls */}
          <div className="flex items-center space-x-3" id="navbar-user-actions">
            <div className="relative">
              <button
                id="role-trigger"
                onClick={() => setShowRoleSelector(!showRoleSelector)}
                className="flex items-center space-x-2 text-left bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-sm p-1.5 pr-3 transition-all cursor-pointer"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-8 w-8 rounded-sm object-cover border border-slate-300"
                  referrerPolicy="no-referrer"
                />
                <div className="hidden lg:block">
                  <p className="text-xs font-semibold text-slate-800 line-clamp-1">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono tracking-wide">
                    {currentUser.role === UserRole.ADMIN
                      ? "👑 Admin"
                      : currentUser.role === UserRole.PROFESSIONNEL
                      ? "💼 Pro"
                      : "👤 Perso"}
                  </p>
                </div>
              </button>

              {/* Persona Switcher Dropdown */}
              {showRoleSelector && (
                <div
                  id="role-switch-dropdown"
                  className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-sm shadow-xl z-50 py-2 animate-in fade-in duration-200"
                >
                  <p className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Changer de profil (Simulation)
                  </p>
                  <hr className="border-slate-100 my-1" />
                  <button
                    onClick={() => {
                      onLoginAs(UserRole.PARTICULIER);
                      setShowRoleSelector(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm font-medium text-slate-700 flex items-center justify-between"
                  >
                    <span>👤 Jean (Particulier)</span>
                    {currentUser.role === UserRole.PARTICULIER && <span className="text-[#002395] text-xs">● Actif</span>}
                  </button>
                  <button
                    onClick={() => {
                      onLoginAs(UserRole.PROFESSIONNEL);
                      setShowRoleSelector(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm font-medium text-slate-700 flex items-center justify-between"
                  >
                    <span>💼 Aero Motors (Pro)</span>
                    {currentUser.role === UserRole.PROFESSIONNEL && <span className="text-[#002395] text-xs">● Actif</span>}
                  </button>
                  <button
                    onClick={() => {
                      onLoginAs(UserRole.ADMIN);
                      setShowRoleSelector(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm font-medium text-slate-700 flex items-center justify-between"
                  >
                    <span>👑 Super Admin Vehi World</span>
                    {currentUser.role === UserRole.ADMIN && <span className="text-[#002395] text-xs">● Actif</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Quick Action: Publish button on mobile (hidden since bottom nav represents this) */}
          </div>
        </div>
      </div>

      {/* Premium Mobile Bottom Navigation Bar */}
      <div 
        id="mobile-bottom-nav" 
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-[100] px-1 py-2 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] flex items-center justify-around select-none"
      >
        {/* Rechercher */}
        <button
          onClick={() => setCurrentView("acheter")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            currentView === "acheter" || currentView === "details"
              ? "text-blue-700 scale-105 font-extrabold"
              : "text-slate-500 active:scale-95"
          }`}
          style={{ touchAction: "manipulation" }}
        >
          <Car className="h-5 w-5 mb-0.5" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Rechercher</span>
        </button>

        {/* Favoris */}
        <button
          onClick={() => setCurrentView("favoris")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
            currentView === "favoris"
              ? "text-blue-700 scale-105 font-extrabold"
              : "text-slate-500 active:scale-95"
          }`}
          style={{ touchAction: "manipulation" }}
        >
          <div className="relative">
            <Heart className={`h-5 w-5 mb-0.5 ${currentView === "favoris" ? "fill-current" : ""}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.5 text-[8px] font-extrabold leading-none text-white bg-red-650 bg-red-600 rounded-full">
                {favoritesCount}
              </span>
            )}
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider">Favoris</span>
        </button>

        {/* Publier */}
        <button
          onClick={() => setCurrentView("vendre")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
            currentView === "vendre"
              ? "text-red-600 scale-105 font-extrabold"
              : "text-slate-500 active:scale-95"
          }`}
          style={{ touchAction: "manipulation" }}
        >
          <PlusCircle className="h-5.5 w-5.5 mb-0.5 text-red-600" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Publier</span>
        </button>

        {/* Comparateur */}
        <button
          onClick={() => setCurrentView("comparaison")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
            currentView === "comparaison"
              ? "text-blue-700 scale-105 font-extrabold"
              : "text-slate-500 active:scale-95"
          }`}
          style={{ touchAction: "manipulation" }}
        >
          <div className="relative">
            <Scale className="h-5 w-5 mb-0.5" />
            {comparisonCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.5 text-[8px] font-extrabold leading-none text-white bg-blue-700 rounded-full">
                {comparisonCount}
              </span>
            )}
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider">Comparer</span>
        </button>

        {/* Messagerie */}
        <button
          onClick={() => setCurrentView("messagerie")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
            currentView === "messagerie"
              ? "text-blue-700 scale-105 font-extrabold"
              : "text-slate-500 active:scale-95"
          }`}
          style={{ touchAction: "manipulation" }}
        >
          <div className="relative">
            <MessageSquare className="h-5 w-5 mb-0.5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.5 text-[8px] font-extrabold leading-none text-white bg-red-600 rounded-full animate-pulse">
                {unreadMessagesCount}
              </span>
            )}
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider">Messages</span>
        </button>

        {/* Admin Dashboard (if admin) */}
        {currentUser.role === UserRole.ADMIN && (
          <button
            onClick={() => setCurrentView("admin")}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
              currentView === "admin"
                ? "text-slate-900 scale-105 font-extrabold"
                : "text-slate-500 active:scale-95"
            }`}
            style={{ touchAction: "manipulation" }}
          >
            <LayoutDashboard className="h-5 w-5 mb-0.5" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Admin</span>
          </button>
        )}
      </div>
    </header>
  );
}
