import { useState } from 'react';
import {
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  Download,
  Upload,
  X,
} from 'lucide-react';
import type { Profile, Settings } from '../../shared/profile';
import { scoreText } from './GameView';
export type Panel = 'help' | 'log' | 'settings' | null;
interface Props {
  panel: Panel;
  profile: Profile;
  onClose: () => void;
  onSettings: (settings: Settings) => void;
  onExport: () => Promise<void>;
  onImport: () => Promise<void>;
  pending: Profile | null;
  onConfirmImport: () => void;
  onCancelImport: () => void;
}
export function Panels({
  panel,
  profile,
  onClose,
  onSettings,
  onExport,
  onImport,
  pending,
  onConfirmImport,
  onCancelImport,
}: Props) {
  const [busy, setBusy] = useState(false);
  if (!panel) return null;
  const action = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };
  const change = (patch: Partial<Settings>) =>
    onSettings({ ...profile.settings, ...patch });
  return (
    <section
      className="inline-panel"
      aria-label={
        panel === 'help'
          ? 'How to play'
          : panel === 'log'
            ? 'Flight log'
            : 'Settings'
      }
    >
      <div className="panel-heading">
        <h2>
          {panel === 'help'
            ? 'Know your ship.'
            : panel === 'log'
              ? 'Every run counts.'
              : 'Your kind of space.'}
        </h2>
        <button
          className="icon-button"
          aria-label="Close panel"
          onClick={onClose}
        >
          <X />
        </button>
      </div>
      {panel === 'help' && (
        <div className="help-layout">
          <p className="panel-intro">
            Small ship. Big rocks.
            <br />
            Keep moving, keep shooting.
          </p>
          <div className="help-grid">
            <div>
              <kbd>
                <ArrowLeft />
              </kbd>
              <kbd>
                <ArrowRight />
              </kbd>
              <h3>ROTATE</h3>
              <p>Arrow keys or A / D turn your ship.</p>
            </div>
            <div>
              <kbd>
                <ArrowUp />
              </kbd>
              <h3>THRUST</h3>
              <p>Up or W accelerates. Let go to drift.</p>
            </div>
            <div>
              <kbd>SPACE</kbd>
              <h3>FIRE</h3>
              <p>Hold to shoot. Big rocks split into smaller ones.</p>
            </div>
            <div>
              <kbd>P</kbd>
              <kbd>ESC</kbd>
              <h3>TAKE A BREAK</h3>
              <p>Pause anytime. F toggles fullscreen.</p>
            </div>
          </div>
          <p className="help-note">
            Space wraps at the edges. Clear the belt to reach the next wave. You
            have three ships; earn an extra one every 10,000 points. Big /
            medium / small rocks: 20 / 50 / 100 points.
          </p>
        </div>
      )}
      {panel === 'settings' && (
        <div className="settings-layout">
          <p className="panel-intro">
            Make yourself at home.
            <br />
            Your preferences stay on this device.
          </p>
          <div className="settings-fields">
            <label className="toggle-row">
              <span>
                <b>SOUND EFFECTS</b>
                <small>Original synthesized arcade sounds</small>
              </span>
              <input
                type="checkbox"
                checked={profile.settings.sound}
                onChange={(e) => change({ sound: e.target.checked })}
              />
            </label>
            <label className="volume-row">
              <span>
                VOLUME <b>{Math.round(profile.settings.volume * 100)}%</b>
              </span>
              <input
                aria-label="Volume"
                type="range"
                min="0"
                max="1"
                step=".05"
                value={profile.settings.volume}
                onChange={(e) => change({ volume: Number(e.target.value) })}
              />
            </label>
            <label className="toggle-row">
              <span>
                <b>REDUCED EFFECTS</b>
                <small>Hide debris and reduce flame animation</small>
              </span>
              <input
                type="checkbox"
                checked={profile.settings.reducedMotion}
                onChange={(e) => change({ reducedMotion: e.target.checked })}
              />
            </label>
            <label className="toggle-row">
              <span>
                <b>ON-SCREEN CONTROLS</b>
                <small>Touch-friendly flight buttons</small>
              </span>
              <input
                type="checkbox"
                checked={profile.settings.touchControls}
                onChange={(e) => change({ touchControls: e.target.checked })}
              />
            </label>
          </div>
        </div>
      )}
      {panel === 'log' && (
        <>
          <div className="log-summary">
            <p className="panel-intro">
              A record of your time
              <br />
              among the rocks.
            </p>
            <div>
              <span>PERSONAL BEST</span>
              <strong>
                {scoreText(Math.max(0, ...profile.runs.map((r) => r.score)))}
              </strong>
            </div>
            <div>
              <span>RECORDED RUNS</span>
              <strong>{String(profile.runs.length).padStart(2, '0')}</strong>
            </div>
          </div>
          {profile.runs.length === 0 ? (
            <div className="empty-log">
              Nothing in the log. Yet.
              <span>Launch a run. Leave a little history.</span>
            </div>
          ) : (
            <div className="log-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>SCORE</th>
                    <th>WAVE</th>
                    <th>FLIGHT TIME</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.runs.map((r, i) => (
                    <tr key={`${r.date}-${i}`}>
                      <td>
                        {new Date(r.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td>{scoreText(r.score)}</td>
                      <td>{String(r.wave).padStart(2, '0')}</td>
                      <td>
                        {Math.floor(r.seconds / 60)}m{' '}
                        {Math.floor(r.seconds % 60)}s
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="log-actions">
            <button
              className="secondary"
              disabled={busy}
              onClick={() => void action(onExport)}
            >
              <Download size={16} /> EXPORT LOG
            </button>
            <button
              className="secondary"
              disabled={busy}
              onClick={() => void action(onImport)}
            >
              <Upload size={16} /> IMPORT LOG
            </button>
            <small>Versioned JSON. Your settings travel with you.</small>
          </div>
          {pending && (
            <div className="import-confirm">
              <p>
                Replace this device’s settings and {profile.runs.length} saved
                runs with {pending.runs.length} imported runs? Export your
                current log first if you want to keep it.
              </p>
              <button className="secondary" onClick={onConfirmImport}>
                REPLACE FLIGHT LOG
              </button>
              <button className="text-button" onClick={onCancelImport}>
                CANCEL
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
