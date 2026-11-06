import React, { useState, useEffect } from 'react';
import { AttendanceSession } from '../types';
import {
  formatWhatsAppReport,
  sendReportToWhatsApp,
  sharePDFToDevice,
  getWhatsAppShareUrl,
} from '../services/whatsappService';

interface WhatsAppModalProps {
  session: AttendanceSession;
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_PHONE_KEY = 'smart_attend_saved_whatsapp_phone';

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ session, isOpen, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSharingPDF, setIsSharingPDF] = useState(false);
  const [pdfShareMessage, setPdfShareMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedPhone = localStorage.getItem(STORAGE_PHONE_KEY);
    if (savedPhone) {
      setPhoneNumber(savedPhone);
    }
  }, []);

  if (!isOpen) return null;

  const messageText = formatWhatsAppReport(session);

  const handleSendDirect = () => {
    sendReportToWhatsApp(session);
    onClose();
  };

  const handleSendToNumber = () => {
    if (!phoneNumber.trim()) {
      alert('Please enter a WhatsApp phone number with country code (e.g. +91 9876543210)');
      return;
    }
    // Save to localStorage for convenience
    localStorage.setItem(STORAGE_PHONE_KEY, phoneNumber.trim());
    sendReportToWhatsApp(session, phoneNumber.trim());
    onClose();
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(messageText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSharePDF = async () => {
    setIsSharingPDF(true);
    setPdfShareMessage(null);
    try {
      const shared = await sharePDFToDevice(session);
      if (shared) {
        setPdfShareMessage('PDF opened in device share sheet! Choose WhatsApp to send.');
        setTimeout(() => setPdfShareMessage(null), 3000);
      } else {
        setPdfShareMessage('Native document sharing is not supported by your current browser. You can send the formatted report text directly or download the PDF.');
        setTimeout(() => setPdfShareMessage(null), 4000);
      }
    } catch {
      setPdfShareMessage('Sharing cancelled or failed.');
    } finally {
      setIsSharingPDF(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#25D366] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.584 1.761.884 2.802.884 3.179 0 5.767-2.587 5.768-5.766.001-3.18-2.587-5.771-5.774-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.158.57 4.186 1.564 5.941l-1.564 5.714 5.86-1.537c1.705.93 3.655 1.455 5.727 1.455 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-black leading-tight">Send to WhatsApp</h3>
              <p className="text-white/80 text-xs font-medium">Direct report sharing to WhatsApp on this device</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-black/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Primary Action: Direct WhatsApp App Launch */}
          <div className="space-y-2">
            <button
              onClick={handleSendDirect}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black py-4 px-6 rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-base"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.584 1.761.884 2.802.884 3.179 0 5.767-2.587 5.768-5.766.001-3.18-2.587-5.771-5.774-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.158.57 4.186 1.564 5.941l-1.564 5.714 5.86-1.537c1.705.93 3.655 1.455 5.727 1.455 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>Open WhatsApp & Choose Contact/Group</span>
            </button>
            <p className="text-center text-[11px] font-medium text-slate-400">
              Opens WhatsApp directly so you can choose any class group, HOD, or contact.
            </p>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              Or Send to Specific Number
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          {/* Send to Specific Number */}
          <div className="space-y-2 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Specific WhatsApp Mobile Number
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="e.g. +91 9876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#25D366]"
              />
              <button
                type="button"
                onClick={handleSendToNumber}
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-4 py-2.5 rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all whitespace-nowrap"
              >
                Send
              </button>
            </div>
            <p className="text-[11px] text-slate-400">Include country code (e.g., 91 for India). Saved automatically for next time.</p>
          </div>

          {/* Native PDF Document Sharing */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleSharePDF}
              disabled={isSharingPDF}
              className="w-full bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold py-3 px-4 rounded-xl border border-indigo-200 dark:border-indigo-800 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>Share Official PDF Document to WhatsApp</span>
            </button>
            {pdfShareMessage && (
              <p className="text-xs text-center font-medium text-indigo-600 dark:text-indigo-400">
                {pdfShareMessage}
              </p>
            )}
          </div>

          {/* Formatted Message Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                WhatsApp Message Preview
              </label>
              <button
                type="button"
                onClick={handleCopyText}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                {copied ? (
                  <span className="text-emerald-500">✓ Copied to clipboard!</span>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 max-h-44 overflow-y-auto whitespace-pre-wrap select-all leading-relaxed">
              {messageText}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/60 px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-bold text-slate-700 dark:text-slate-200 text-sm transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
