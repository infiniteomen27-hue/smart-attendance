import { AttendanceSession } from '../types';
import { getAttendancePDFBlob } from './pdfService';

/**
 * Formats attendance session into a clean, WhatsApp-ready message using WhatsApp markdown.
 */
export const formatWhatsAppReport = (session: AttendanceSession): string => {
  const rollsArray = Array.from(session.presentRolls as Set<number>).sort((a, b) => a - b);
  const presentCount = rollsArray.length;
  const absentCount = session.totalStudents - presentCount;
  const percentage = ((presentCount / session.totalStudents) * 100).toFixed(1);

  const absentRolls: number[] = [];
  const presentSet = new Set(rollsArray);
  for (let i = 1; i <= session.totalStudents; i++) {
    if (!presentSet.has(i)) {
      absentRolls.push(i);
    }
  }

  const presentText = rollsArray.length > 0 ? rollsArray.join(', ') : 'None';
  const absentText = absentRolls.length > 0 ? absentRolls.join(', ') : 'None';

  return [
    `📋 *SMARTATTEND - ATTENDANCE REPORT*`,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `🏛️ *Class:* ${session.year}`,
    `📚 *Subject:* ${session.lecture}`,
    `👨‍🏫 *Faculty:* ${session.facultyName}`,
    `📅 *Date:* ${session.date}`,
    `⏰ *Timing:* ${session.time}`,
    ``,
    `📊 *SUMMARY*`,
    `• Total Students: *${session.totalStudents}*`,
    `• Present: *${presentCount}* (${percentage}%)`,
    `• Absent: *${absentCount}* (${(100 - parseFloat(percentage)).toFixed(1)}%)`,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `✅ *PRESENT ROLL NUMBERS (${presentCount}):*`,
    presentText,
    ``,
    `❌ *ABSENT ROLL NUMBERS (${absentCount}):*`,
    absentText,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `_Generated via SmartAttend Attendance System_`,
  ].join('\n');
};

/**
 * Builds the URL to launch WhatsApp on the device.
 * Uses https://api.whatsapp.com/send which works seamlessly on mobile apps and desktop.
 */
export const getWhatsAppShareUrl = (text: string, phoneNumber?: string): string => {
  const cleanPhone = phoneNumber ? phoneNumber.replace(/[^0-9]/g, '') : '';
  const encodedText = encodeURIComponent(text);

  if (cleanPhone) {
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
  }
  return `https://api.whatsapp.com/send?text=${encodedText}`;
};

/**
 * Deep-link scheme specifically for native WhatsApp client on Android / iOS.
 */
export const getWhatsAppDeepLink = (text: string, phoneNumber?: string): string => {
  const cleanPhone = phoneNumber ? phoneNumber.replace(/[^0-9]/g, '') : '';
  const encodedText = encodeURIComponent(text);

  if (cleanPhone) {
    return `whatsapp://send?phone=${cleanPhone}&text=${encodedText}`;
  }
  return `whatsapp://send?text=${encodedText}`;
};

/**
 * Opens WhatsApp on the user's device directly.
 */
export const sendReportToWhatsApp = (session: AttendanceSession, phoneNumber?: string) => {
  const message = formatWhatsAppReport(session);
  const targetUrl = getWhatsAppShareUrl(message, phoneNumber);
  
  // Create an anchor element and trigger click to bypass iframe/pop-up blockers
  const link = document.createElement('a');
  link.href = targetUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Shares the actual PDF document report directly via native Web Share API (which includes WhatsApp).
 */
export const sharePDFToDevice = async (session: AttendanceSession): Promise<boolean> => {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      const pdfBlob = getAttendancePDFBlob(session);
      const safeYear = session.year.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const safeDate = session.date.replace(/\//g, '-');
      const filename = `Attendance_${safeYear}_${safeDate}.pdf`;

      const file = new File([pdfBlob], filename, { type: 'application/pdf' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Attendance Report - ${session.lecture}`,
          text: `Attendance report for ${session.year} - ${session.lecture} (${session.date})`,
          files: [file],
        });
        return true;
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Failed to share PDF directly:', err);
      }
    }
  }
  return false;
};
