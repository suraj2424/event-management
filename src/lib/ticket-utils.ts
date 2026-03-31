// lib/ticket-utils.ts
import QRCode from "qrcode";

/**
 * Generates a unique, human-readable ticket number.
 * Format: TKT-BASE36TIME-RANDOM
 */
export const generateTicketNumber = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `TKT-${timestamp}-${random}`.toUpperCase();
};

/**
 * Generates a Base64 Data URL for a QR code.
 * Encodes the ticket ID and event ID for verification scanning.
 */
export const generateQRCode = async (ticketId: string | number, eventId: number): Promise<string> => {
  try {
    const qrData = JSON.stringify({
      t: ticketId,
      e: eventId,
      v: 1, // Versioning for future-proofing
      ts: Date.now(),
    });

    // Generate high-quality QR code with a decent margin
    return await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 400,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
  } catch (error) {
    console.error("Failed to generate QR code:", error);
    return "";
  }
};