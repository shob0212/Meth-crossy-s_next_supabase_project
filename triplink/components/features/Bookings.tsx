"use client";

import React, { useState } from "react";
import { Booking, Language } from "@/lib/types";
import {
  Plus,
  X,
  Plane,
  Hotel,
  Ticket,
  FileText,
  Copy,
  Trash2,
  Paperclip,
} from "lucide-react";

interface BookingsProps {
  bookings: Booking[];
  onAddBooking: (booking: Omit<Booking, "id">) => void;
  onDeleteBooking: (id: string) => void;
  isReadOnly: boolean;
  language?: Language;
}

const TEXT = {
  ja: {
    noBookings: "予約がありません",
    desc: "チケットや予約番号をここに保存",
    add: "予約を追加",
    title: "予約を追加",
    titleLabel: "タイトル (例: JAL 123)",
    ref: "予約番号 / 参照番号",
    save: "保存",
    types: {
      Flight: "航空券",
      Hotel: "宿泊",
      Activity: "アクティビティ",
      Other: "その他",
    },
  },
  en: {
    noBookings: "No Bookings",
    desc: "Keep your tickets handy.",
    add: "Add Booking",
    title: "Add Booking",
    titleLabel: "Title (e.g. Flight 123)",
    ref: "Reference Number",
    save: "Save",
    types: {
      Flight: "Flight",
      Hotel: "Hotel",
      Activity: "Activity",
      Other: "Other",
    },
  },
};

export function Bookings({
  bookings,
  onAddBooking,
  onDeleteBooking,
  isReadOnly,
  language = "ja",
}: BookingsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState<Booking["type"]>("Flight");
  const [title, setTitle] = useState("");
  const [bookingNumber, setBookingNumber] = useState("");

  const t = TEXT[language];

  const getTypeIcon = (type: string, size: number = 20) => {
    switch (type) {
      case "Flight":
        return <Plane size={size} className="text-blue-400" />;
      case "Hotel":
        return <Hotel size={size} className="text-purple-400" />;
      case "Activity":
        return <Ticket size={size} className="text-mint-400" />;
      default:
        return <FileText size={size} className="text-gray-400" />;
    }
  };

  const handleSave = () => {
    if (!title) return;
    onAddBooking({
      type,
      title,
      bookingNumber,
      date: "TBD",
      time: "",
      notes: "",
      attachments: [],
    });
    setIsModalOpen(false);
    setTitle("");
    setBookingNumber("");
  };

  return (
    <div className="pb-24">
      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-[32px] border border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 bg-ivory dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 border border-gray-100 dark:border-gray-600">
            <Ticket size={24} />
          </div>
          <h3 className="text-gray-800 dark:text-white font-bold mb-1">
            {t.noBookings}
          </h3>
          <p className="text-gray-400 text-sm mb-6">{t.desc}</p>
          {!isReadOnly && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-mint-400 text-white px-6 py-3 rounded-full font-bold shadow-sm hover:bg-mint-500"
            >
              {t.add}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-[24px] shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-center group hover:border-mint-200 dark:hover:border-mint-900 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-ivory dark:bg-gray-700 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-gray-600">
                  {getTypeIcon(booking.type)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-white">
                    {booking.title}
                  </h4>
                  <p className="font-mono text-xs text-gray-400 mt-1 bg-gray-50 dark:bg-gray-700 px-2 py-0.5 rounded-lg border border-gray-100 dark:border-gray-600 inline-block">
                    {booking.bookingNumber || "No Ref"}
                  </p>
                </div>
              </div>
              {!isReadOnly && (
                <button
                  onClick={() => onDeleteBooking(booking.id)}
                  className="w-10 h-10 rounded-full bg-ivory dark:bg-gray-700 flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {!isReadOnly && bookings.length > 0 && (
        <div className="fixed z-50 bottom-32 right-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-14 h-14 rounded-full shadow-lg bg-mint-400 text-white flex items-center justify-center hover:bg-mint-500 transition-colors border-4 border-ivory dark:border-gray-900"
          >
            <Plus size={24} />
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-[32px] p-8 shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-gray-800 dark:text-white">
                {t.title}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-ivory dark:bg-gray-700 flex items-center justify-center text-gray-400 border border-gray-100 dark:border-gray-600"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2">
                {(["Flight", "Hotel", "Activity"] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => setType(key as any)}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold border ${type === key ? "border-mint-400 text-mint-400 bg-mint-50 dark:bg-mint-900/20" : "border-gray-200 dark:border-gray-700 text-gray-400 bg-white dark:bg-gray-800"}`}
                  >
                    {t.types[key]}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-ivory dark:bg-gray-700 dark:text-white rounded-2xl p-4 outline-none text-sm border border-transparent focus:border-mint-200"
                placeholder={t.titleLabel}
              />
              <input
                type="text"
                value={bookingNumber}
                onChange={(e) => setBookingNumber(e.target.value)}
                className="w-full bg-ivory dark:bg-gray-700 dark:text-white rounded-2xl p-4 outline-none text-sm font-mono border border-transparent focus:border-mint-200"
                placeholder={t.ref}
              />
              <button
                onClick={handleSave}
                className="w-full bg-mint-400 text-white py-4 rounded-full font-bold mt-2 hover:bg-mint-500 shadow-sm"
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
