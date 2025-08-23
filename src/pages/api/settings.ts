import type { NextApiRequest, NextApiResponse } from 'next';

// Temporary in-memory store. Replace with DB access later.
let settingsStore = {
  notifications: {
    email: true,
    push: true,
    eventReminders: true,
  },
  appearance: {
    darkMode: false,
    compactView: false,
  },
  privacy: {
    publicProfile: true,
    showAttendance: true,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json(settingsStore);
  }

  if (req.method === 'PATCH') {
    try {
      const { category, setting, value } = req.body || {};
      if (
        !category ||
        !setting ||
        typeof value === 'undefined' ||
        !(category in settingsStore) ||
        !(setting in (settingsStore as any)[category])
      ) {
        return res.status(400).json({ error: 'Invalid payload' });
      }
      (settingsStore as any)[category][setting] = value;
      return res.status(200).json({ success: true, settings: settingsStore });
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
  }

  res.setHeader('Allow', ['GET', 'PATCH']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
