import type { ReaderSettings } from "../types";

type SettingsPanelProps = {
  settings: ReaderSettings;
  onUpdate: (updates: Partial<ReaderSettings>) => void;
  isOpen: boolean;
  onClose: () => void;
};

export function SettingsPanel({ settings, onUpdate, isOpen, onClose }: SettingsPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="settings-panel-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={e => e.stopPropagation()}>
        <header className="settings-header">
          <h3>Settings</h3>
          <button className="icon-button" onClick={onClose}>X</button>
        </header>

        <div className="settings-body">
          <section className="settings-group">
            <label>Document Opening Mode</label>
            <select 
              value={settings.documentOpenMode} 
              onChange={e => onUpdate({ documentOpenMode: e.target.value as any })}
            >
              <option value="external">External Tab</option>
              <option value="right-drawer">Right Drawer</option>
              <option value="bottom-drawer">Bottom Drawer</option>
              <option value="top-drawer">Top Drawer</option>
              <option value="fullscreen">Full Screen</option>
            </select>
          </section>

          <section className="settings-group">
            <label>Reader Theme</label>
            <select 
              value={settings.readerTheme} 
              onChange={e => onUpdate({ readerTheme: e.target.value as any })}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="sepia">Sepia</option>
              <option value="high-contrast">High Contrast</option>
            </select>
            <p className="hint">Note: Google previews may not follow theme. Use Summary mode for full control.</p>
          </section>

          <section className="settings-group">
            <label>Font Size</label>
            <div className="button-toggle-group">
              {(["small", "medium", "large", "extra-large"] as const).map(size => (
                <button 
                  key={size}
                  className={settings.fontSize === size ? "active" : ""}
                  onClick={() => onUpdate({ fontSize: size })}
                >
                  {size.charAt(0).toUpperCase()}
                </button>
              ))}
            </div>
          </section>

          <section className="settings-group">
            <label>Touch Control Mode</label>
            <select 
              value={settings.touchControlMode} 
              onChange={e => onUpdate({ touchControlMode: e.target.value as any })}
            >
              <option value="pan-map">Pan Map (One Finger)</option>
              <option value="move-player">Move Player</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </section>

          <section className="settings-group checkbox-group">
            <label>
              <input 
                type="checkbox" 
                checked={settings.autoMarkAsOpened}
                onChange={e => onUpdate({ autoMarkAsOpened: e.target.checked })}
              />
              Auto-mark documents as read
            </label>
          </section>
        </div>

        <footer className="settings-footer">
          <button className="primary-button" onClick={onClose}>Done</button>
        </footer>
      </div>
    </div>
  );
}
