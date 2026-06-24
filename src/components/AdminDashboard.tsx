/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Users, ClipboardCheck, ShieldAlert, CreditCard, BarChart2, Check, X, ShieldCheck, Sparkles } from "lucide-react";
import { User, Ad, FraudReport, Transaction, UserRole } from "../types";

interface AdminDashboardProps {
  users: User[];
  ads: Ad[];
  reports: FraudReport[];
  transactions: Transaction[];
  onApproveAd: (adId: string) => void;
  onRejectAd: (adId: string) => void;
  onResolveReport: (reportId: string) => void;
}

export default function AdminDashboard({
  users,
  ads,
  reports,
  transactions,
  onApproveAd,
  onRejectAd,
  onResolveReport,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = React.useState<"overview" | "moderation" | "users" | "frauds" | "payments">("overview");

  // Filter ads under review
  const pendingAds = ads.filter((ad) => ad.status === "pending");
  const approvedCount = ads.filter((ad) => ad.status === "approved").length;

  // Calcul totals
  const totalRevenue = transactions
    .filter((tx) => tx.status === "succeeded")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(p);
  };

  return (
    <div id="admin-workspace-card" className="space-y-6">
      {/* Top Title Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-slate-900 text-white rounded-sm p-6 shadow-md relative overflow-hidden gap-4">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl"></div>

        <div>
          <h2 className="font-sans font-black text-xl tracking-wide uppercase flex items-center">
            <span className="bg-[#ED2939] text-white text-[10px] font-black px-2 py-0.5 rounded-sm mr-2">SECURE</span>
            Console d'Administration Vehi World
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">Modération des annonces, vérifications d'identité et ledger financier</p>
        </div>

        {/* Dynamic pending ads count indicator */}
        {pendingAds.length > 0 && (
          <div className="bg-[#ED2939] text-white px-4 py-1.5 rounded-sm text-xs font-bold animate-pulse inline-flex items-center space-x-1.5 self-start sm:self-center">
            <span>● {pendingAds.length} Annonce{pendingAds.length > 1 ? "s" : ""} à valider</span>
          </div>
        )}
      </div>

      {/* Grid: 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="admin-kpis">
        <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-semibold block uppercase">Chiffre d'Affaires</span>
            <span className="text-xl font-black text-slate-900 font-sans tracking-tight">{formatPrice(totalRevenue)}</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-sm">
            <CreditCard className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-semibold block uppercase">Membres Actifs</span>
            <span className="text-xl font-black text-slate-900 font-sans tracking-tight">{users.length}</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-sm">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-semibold block uppercase">Annonces En Ligne</span>
            <span className="text-xl font-black text-slate-900 font-sans tracking-tight">{approvedCount}</span>
          </div>
          <div className="p-3 bg-red-50 text-red-650 rounded-sm">
            <ClipboardCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-sm flex items-center justify-between relative overflow-hidden">
          <div>
            <span className="text-slate-400 text-xs font-semibold block uppercase">Fraudes Signalées</span>
            <span className="text-xl font-black text-[#ED2939] font-mono">{reports.filter(r => r.status === "pending").length}</span>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-sm">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Dashboard Custom Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition ${
            activeTab === "overview" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          Statistiques de Vente
        </button>
        <button
          onClick={() => setActiveTab("moderation")}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition relative ${
            activeTab === "moderation" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-950 hover:bg-slate-100"
          }`}
        >
          <span>Modération</span>
          {pendingAds.length > 0 && (
            <span className="absolute -top-1.5 -right-1 text-[9px] bg-red-600 text-white font-black px-1.5 py-0.2 rounded-full leading-none">
              {pendingAds.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition ${
            activeTab === "users" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-950 hover:bg-slate-100"
          }`}
        >
          Utilisateurs & Quotas
        </button>
        <button
          onClick={() => setActiveTab("frauds")}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition relative ${
            activeTab === "frauds" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-950 hover:bg-slate-100"
          }`}
        >
          <span>Signalements</span>
          {reports.filter(r => r.status === "pending").length > 0 && (
            <span className="absolute -top-1.5 -right-1 text-[9px] bg-rose-600 text-white font-black px-1.5 py-0.2 rounded-full leading-none">
              {reports.filter(r => r.status === "pending").length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition ${
            activeTab === "payments" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-950 hover:bg-slate-100"
          }`}
        >
          Factures & Paiements
        </button>
      </div>

      {/* TAB CONTENT 1: Overview and SVG financial layouts */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="dashboard-charts">
          
          {/* Custom SVG Bar Chart: Turnover Evolution */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
            <h4 className="font-sans font-black text-slate-950 uppercase text-xs tracking-wider mb-4 flex items-center space-x-1.5">
              <BarChart2 className="h-4.5 w-4.5 text-[#002395]" />
              <span>Chiffre d'Affaires Mensuel (Euros)</span>
            </h4>

            {/* SVG implementation */}
            <div className="h-64 flex items-end justify-between px-4 pb-6 pt-4 border-b border-l border-slate-200 relative">
              
              {/* Grid indicators */}
              <div className="absolute left-2 top-4 text-[9px] text-slate-400 font-mono">100 €</div>
              <div className="absolute left-2 top-28 text-[9px] text-slate-400 font-mono">50 €</div>
              <div className="absolute left-2 bottom-4 text-[9px] text-slate-400 font-mono">0 €</div>

              {/* Bar 1: Mars */}
              <div className="flex flex-col items-center flex-1 space-y-2 group">
                <span className="text-[10px] font-bold text-slate-600 p-0.5 bg-slate-50 border rounded opacity-0 group-hover:opacity-100 transition duration-200">20.00€</span>
                <div className="w-10 bg-blue-400 rounded-t-lg transition-all duration-300 group-hover:bg-[#002395]" style={{ height: "40px" }}></div>
                <span className="text-xs font-bold text-slate-500">Mars</span>
              </div>

              {/* Bar 2: Avril */}
              <div className="flex flex-col items-center flex-1 space-y-2 group">
                <span className="text-[10px] font-bold text-slate-600 p-0.5 bg-slate-50 border rounded opacity-0 group-hover:opacity-100 transition duration-200">54.91€</span>
                <div className="w-10 bg-blue-500 rounded-t-lg transition-all duration-300 group-hover:bg-[#002395]" style={{ height: "110px" }}></div>
                <span className="text-xs font-bold text-slate-500">Avril</span>
              </div>

              {/* Bar 3: Mai */}
              <div className="flex flex-col items-center flex-1 space-y-2 group">
                <span className="text-[10px] font-bold text-slate-600 p-0.5 bg-slate-50 border rounded opacity-0 group-hover:opacity-100 transition duration-200">95.42€</span>
                <div className="w-10 bg-[#002395] rounded-t-lg transition-all duration-300 group-hover:bg-blue-800" style={{ height: "190px" }}></div>
                <span className="text-xs font-bold text-slate-500">Mai</span>
              </div>

              {/* Bar 4: Juin (En cours) */}
              <div className="flex flex-col items-center flex-1 space-y-2 group">
                <span className="text-[10px] font-bold text-slate-600 p-0.5 bg-slate-50 border rounded opacity-0 group-hover:opacity-100 transition duration-200">{totalRevenue.toFixed(2)}€</span>
                <div className="w-10 bg-[#ED2939] rounded-t-lg transition-all duration-300 group-hover:bg-red-700 animate-pulse" style={{ height: "168px" }}></div>
                <span className="text-xs font-bold text-slate-900 font-sans">Juin (Courant)</span>
              </div>
            </div>
            
            <p className="text-[10px] text-slate-500 text-center mt-3">
              💡 Le mois de <span className="font-bold text-[#002395]">Juin</span> est stimulé par les nouveaux abonnements Pro d'Aero Motors (49,99€).
            </p>
          </div>

          {/* Custom Subscription Quota split radial block */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
            <h4 className="font-sans font-black text-slate-950 uppercase text-xs tracking-wider mb-4">
              Répartition des Formules du Site
            </h4>

            <div className="flex items-center justify-around h-60">
              {/* Custom SVG Pie Graph structure */}
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  {/* Circle 1 - Base */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#E2E8F0" strokeWidth="4" />
                  
                  {/* Circle 2 - Option payante à l'acte (50%) in Red */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#ED2939" strokeWidth="4.2" 
                    strokeDasharray="50 50" strokeDashoffset="0" />
                  
                  {/* Circle 3 - Abonnement (50%) in Blue */}
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#002395" strokeWidth="4.2" 
                    strokeDasharray="50 50" strokeDashoffset="50" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-black text-slate-900">50%</span>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Chaque</span>
                </div>
              </div>

              {/* Legend details list */}
              <div className="space-y-3.5 text-xs text-slate-705">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-[#002395]"></div>
                  <div>
                    <p className="font-bold">Abonnements mensuels</p>
                    <p className="text-[10px] text-slate-500">Particuliers & Concessionnaires</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-[#ED2939]"></div>
                  <div>
                    <p className="font-bold">Paiement à l'acte / options</p>
                    <p className="text-[10px] text-slate-500">Frais unique 9,99€ + Vedettes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: Moderation list */}
      {activeTab === "moderation" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Dépôt en attente d'approbation administrative
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Pour assurer la sécurité des acheteurs, chaque dépôt d'annonce doit faire l'objet d'une validation manuelle par l'équipe administrative de Vehi World.
          </p>

          {pendingAds.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed text-xs text-slate-500">
              ✓ Aucune annonce en attente de modération. Tout est en ordre !
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingAds.map((ad) => (
                <div key={ad.id} className="border border-slate-200 bg-slate-50/50 rounded-2xl p-4 flex gap-4">
                  {/* Photo mini preview */}
                  <img src={ad.images[0]} className="h-20 w-20 rounded-xl object-cover shrink-0 border" />
                  
                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase">
                      {ad.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 truncate">{ad.title}</h4>
                    <p className="text-[10px] font-mono text-slate-500">Propriétaire : {ad.sellerName}</p>
                    <p className="text-xs text-slate-700 font-bold">{ad.price.toLocaleString("fr-FR")} €</p>
                    
                    {/* Actions validation triggers */}
                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={() => onApproveAd(ad.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer"
                      >
                        <Check className="h-3 w-3" />
                        <span>Valider l'annonce</span>
                      </button>
                      <button
                        onClick={() => onRejectAd(ad.id)}
                        className="bg-[#ED2939] hover:bg-red-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                        <span>Rejeter</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 3: Users Accounts list */}
      {activeTab === "users" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
                <th className="p-4">Utilisateur</th>
                <th className="p-4">Rôle</th>
                <th className="p-4">Abonnement / Formule</th>
                <th className="p-4">Quotas d'Annonces</th>
                <th className="p-4">Inscrit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50">
                  <td className="p-4 flex items-center space-x-3">
                    <img src={u.avatar} className="h-8 w-8 rounded-full object-cover border" referrerPolicy="no-referrer" />
                    <div>
                      <p className="font-bold text-slate-990">{u.name}</p>
                      <p className="text-slate-400 font-mono tracking-tight text-[10px]">{u.email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 font-bold uppercase text-[9px] rounded-full ${
                      u.role === UserRole.ADMIN
                        ? "bg-slate-900 text-white"
                        : u.role === UserRole.PROFESSIONNEL
                        ? "bg-blue-105 bg-blue-100 text-[#002395]"
                        : "bg-amber-105 bg-amber-100 text-amber-800"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-slate-700 font-semibold">
                    {u.subscription ? u.subscription.name : "Aucun (Paiement unitaire)"}
                  </td>
                  <td className="p-4 font-mono font-medium text-slate-600">
                    {u.subscription ? `${u.subscription.adsCount} / ${u.subscription.maxAds}` : "—"}
                  </td>
                  <td className="p-4 text-slate-500 font-medium">{u.joinedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT 4: Fraud Reports clearing desk */}
      {activeTab === "frauds" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-rose-600">
            Signalements de fraude communautaire
          </h3>
          <p className="text-xs text-slate-500 font-medium pb-2 border-b">
            Ci-dessous les complaints déposées de manière anonyme ou authentifiée concernant des prix suspects ou usurpation d'images.
          </p>

          {reports.length === 0 ? (
            <div className="text-center py-10 bg-[#ED2939]/5 rounded-2xl border border-dashed border-[#ED2939]/30 text-xs text-[#ED2939]">
              ✓ Aucun signalement actif. La communauté est saine !
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div key={rep.id} className="p-4 border rounded-2xl bg-rose-50/20 border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-mono">{rep.date} • Plaignant : {rep.reporterName}</p>
                    <h5 className="text-xs font-bold text-slate-900 uppercase">
                      Cible : <span className="underline">{rep.adTitle}</span> (Réf ad: {rep.adId})
                    </h5>
                    <p className="text-xs text-[#ED2939] italic font-medium">« {rep.reason} »</p>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                      rep.status === "resolved" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-850 text-rose-700 font-black animate-pulse"
                    }`}>
                      {rep.status === "resolved" ? "Résolu" : "En cours"}
                    </span>

                    {rep.status === "pending" && (
                      <button
                        onClick={() => onResolveReport(rep.id)}
                        className="bg-[#002395] hover:bg-black text-white px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Marquer Résolu
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 5: Billing transactions list ledger */}
      {activeTab === "payments" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
                <th className="p-4">Transaction UUID</th>
                <th className="p-4">Facturé à</th>
                <th className="p-4">Type d'Action</th>
                <th className="p-4">Montant</th>
                <th className="p-4">Passerelle</th>
                <th className="p-4">Date de Facture</th>
                <th className="p-4">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-mono font-bold text-slate-900">{tx.id}</td>
                  <td className="p-4 font-medium text-slate-700">{tx.userName}</td>
                  <td className="p-4">
                    <span className="text-slate-500 font-medium block max-w-[180px] truncate">{tx.description}</span>
                  </td>
                  <td className="p-4 font-mono font-black text-slate-900 text-sm">
                    {formatPrice(tx.amount)}
                  </td>
                  <td className="p-4 uppercase font-bold text-[10px] text-slate-550">
                    {tx.paymentMethod === "card" ? "💳 STRIPE" : "🛍️ PAYPAL"}
                  </td>
                  <td className="p-4 text-slate-500 font-medium">{tx.date}</td>
                  <td className="p-4">
                    <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full font-bold">
                      {tx.status === "succeeded" ? "Réussi" : "Échec"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
