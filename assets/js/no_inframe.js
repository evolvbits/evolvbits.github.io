if (window.top !== window.self) {
  // Prevents the website from being displayed inside an <iframe>.
  // Forces the main window to navigate to the current URL.
  window.top.location = window.self.location;
}