export type Settings = {
  notifications: {
    email: boolean;
    push: boolean;
    eventReminders: boolean;
  };
  appearance: {
    darkMode: boolean;
    compactView: boolean;
  };
  privacy: {
    publicProfile: boolean;
    showAttendance: boolean;
  };
};
