/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { MessageSquare, Send, Calendar, CheckCheck, User, Sparkles, ArrowLeft } from "lucide-react";
import { ChatRoom, ChatMessage, UserRole } from "../types";

interface MessageCenterProps {
  chatRooms: ChatRoom[];
  currentUser: {
    id: string;
    name: string;
    avatar: string;
  };
  onSendMessage: (roomId: string, text: string) => void;
  onSimulateReply: (roomId: string) => void;
}

export default function MessageCenter({
  chatRooms,
  currentUser,
  onSendMessage,
  onSimulateReply,
}: MessageCenterProps) {
  const [activeRoomIdx, setActiveRoomIdx] = React.useState<number>(0);
  const [typedMessage, setTypedMessage] = React.useState("");
  const [mobileShowChat, setMobileShowChat] = React.useState<boolean>(false);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  const selectedRoom = chatRooms[activeRoomIdx] || null;

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [selectedRoom, selectedRoom?.messages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !typedMessage.trim()) return;

    onSendMessage(selectedRoom.id, typedMessage);
    const textSnapshot = typedMessage;
    setTypedMessage("");

    // Simulate an automatic reply after 1.5 seconds
    setTimeout(() => {
      onSimulateReply(selectedRoom.id);
    }, 1500);
  };

  const formatTimestamp = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  if (chatRooms.length === 0) {
    return (
      <div id="messaging-empty" className="max-w-md mx-auto text-center py-16 space-y-4 bg-white border border-slate-200 p-8 rounded-sm">
        <MessageSquare className="h-12 w-12 text-[#002395] mx-auto opacity-70" />
        <h3 className="font-sans font-black text-lg text-slate-900 uppercase">Boîte de réception vide</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Aucune conversation en cours. Intéressé par un véhicule ? Envoyez un message directement depuis sa fiche détaillée !
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm h-[550px] sm:h-[600px]" id="inbox-hub">
      {/* Sidebar - Rooms List */}
      <div className={`col-span-1 border-r border-slate-200 flex flex-col h-full bg-slate-50/50 ${
        mobileShowChat ? "hidden md:flex" : "flex"
      }`}>
        <div className="p-4 border-b border-slate-200 bg-white">
          <h2 className="font-sans font-black text-slate-950 text-base uppercase tracking-wider flex items-center space-x-1.5">
            <MessageSquare className="h-4.5 w-4.5 text-[#002395]" />
            <span>Messages Internes</span>
          </h2>
          <p className="text-[10px] text-slate-450 uppercase font-bold tracking-widest mt-0.5">Discussions sécurisées</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {chatRooms.map((room, idx) => {
            const lastMsg = room.messages[room.messages.length - 1];
            const isSelected = activeRoomIdx === idx;
            const hasUnread = currentUser.id === room.sellerId ? room.unreadCountSec > 0 : room.unreadCountBuy > 0;

            return (
              <div
                key={room.id}
                onClick={() => {
                  setActiveRoomIdx(idx);
                  setMobileShowChat(true);
                }}
                id={`room-item-${room.id}`}
                className={`p-4 cursor-pointer transition flex items-center space-x-3 select-none ${
                   isSelected ? "bg-white border-l-4 border-blue-600 shadow-sm" : "hover:bg-slate-100/50"
                }`}
              >
                {/* Vehicle Thumbnail Overlay */}
                <div className="relative h-11 w-11 rounded-sm overflow-hidden bg-slate-200 flex-shrink-0 border border-slate-150">
                  <img src={room.adImage} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  {hasUnread && (
                    <span className="absolute top-0 right-0 h-3 w-3 bg-[#ED2939] border-2 border-white rounded-full"></span>
                  )}
                </div>

                {/* Info summary */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#002395] truncate max-w-[120px]">
                      {currentUser.id === room.sellerId ? room.buyerName : room.sellerName}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {lastMsg ? formatTimestamp(lastMsg.timestamp) : ""}
                    </span>
                  </div>
                  <p className="text-xs text-slate-900 font-bold truncate">{room.adTitle}</p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {lastMsg ? `${lastMsg.senderName}: ${lastMsg.content}` : "Aucun message"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Conversation Window */}
      {selectedRoom ? (
        <div className={`col-span-2 flex flex-col h-full bg-slate-50 ${
          mobileShowChat ? "flex" : "hidden md:flex"
        }`}>
          {/* Header - Active Room context info */}
          <div className="p-3 sm:p-4 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Back Arrow to list on mobile */}
              <button
                onClick={() => setMobileShowChat(false)}
                className="md:hidden p-1.5 mr-1 text-slate-500 hover:text-slate-800 bg-slate-100 active:bg-slate-200 rounded-sm transition flex items-center justify-center shrink-0"
                title="Retour aux salons"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              
              <img src={selectedRoom.adImage} className="h-8 w-8 sm:h-10 sm:w-10 rounded-sm object-cover border" referrerPolicy="no-referrer" />
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">Discussion autour de :</p>
                <h4 className="text-xs font-black text-slate-905 -mt-0.5 max-w-[150px] sm:max-w-[280px] truncate">{selectedRoom.adTitle}</h4>
                <p className="text-[9px] sm:text-[10px] text-[#002395] font-bold truncate">
                  Interlocuteur : {currentUser.id === selectedRoom.sellerId ? selectedRoom.buyerName : selectedRoom.sellerName}
                </p>
              </div>
            </div>

            {/* Simulated protection badge */}
            <div className="hidden sm:flex items-center space-x-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-sm border border-emerald-100">
              <CheckCheck className="h-3.5 w-3.5" />
              <span>Chiffrement Sécurisé Actif</span>
            </div>
          </div>

          {/* Messages list scroller */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" id="active-chat-scroller">
            {selectedRoom.messages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[70%] ${isMe ? "ml-auto items-end" : "mr-auto items-start"}`}
                >
                  {/* Sender Name bubble prefix */}
                  <span className="text-[10px] text-slate-400 mb-1 font-semibold">{msg.senderName}</span>
                  
                  {/* Bubble body content */}
                  <div
                    className={`rounded-sm px-4 py-2.5 text-sm shadow-sm leading-relaxed ${
                      isMe
                        ? "bg-[#002395] text-white"
                        : "bg-white text-slate-800 border border-slate-150"
                    }`}
                  >
                    <p>{msg.content}</p>
                  </div>

                  {/* Bubble timestamp footer */}
                  <span className="text-[9px] text-slate-400 mt-1 font-mono">{formatTimestamp(msg.timestamp)}</span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Text message composer footer */}
          <div className="p-4 bg-white border-t border-slate-200">
            <form onSubmit={handleSend} className="flex gap-2" id="chat-form">
              <input
                type="text"
                value={typedMessage}
                id="message-text-input"
                onChange={(e) => setTypedMessage(e.target.value)}
                placeholder="Rédigez votre message d'enquête..."
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-250 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition"
                required
              />
              <button
                type="submit"
                id="btn-chat-send"
                className="bg-[#ED2939] hover:bg-red-700 text-white p-3 rounded-sm transition cursor-pointer flex items-center justify-center shrink-0"
                title="Envoyer le message"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="col-span-2 flex items-center justify-center bg-slate-50 text-slate-400 p-8 text-center italic text-xs font-medium">
          Sélectionnez un canal de discussion pour commencer à argumenter.
        </div>
      )}
    </div>
  );
}
