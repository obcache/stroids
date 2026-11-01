import { useEffect, useRef, useState } from 'react';
import { Minus, Square, X, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import {
  defaultProfile,
  recordRun,
  type Profile,
  type Run,
  type Settings,
} from '../shared/profile';
import { bridge } from './bridge';
import { GameView } from './components/GameView';
import { Panels, type Panel } from './components/Panels';
import { ShipIcon } from './components/ShipIcon';
export default function App() {
  const [profile, setProfile] = useState<Profile>(defaultProfile),
    [loaded, setLoaded] = useState(false),
    [panel, setPanel] = useState<Panel>(null),
    [message, setMessage] = useState(''),
    [pending, setPending] = useState<Profile | null>(null);
  const current = useRef(profile),
    queue = useRef(Promise.resolve());
  current.current = profile;
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.code === 'Escape' && panel) {
        setPanel(null);
        setPending(null);
      }
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [panel]);
  useEffect(() => {
    let active = true;
    void bridge
      .loadProfile()
      .then((result) => {
        if (active) {
          current.current = result.profile;
          setProfile(result.profile);
          setMessage(result.warning ?? '');
          setLoaded(true);
        }
      })
      .catch(() => {
        if (active) {
          setMessage(
            'Could not load your flight log. Your existing file has been preserved.',
          );
          setLoaded(true);
        }
      });
    return () => {
      active = false;
    };
  }, []);
  const save = (next: Profile) => {
    current.current = next;
    setProfile(next);
    queue.current = queue.current
      .then(() => bridge.saveProfile(next))
      .catch(() => {
        setMessage(
          'Could not save your flight log. Check available disk space, then export a backup.',
        );
      });
  };
  const onRun = (run: Run) => save(recordRun(current.current, run));
  const settings = (value: Settings) =>
    save({ ...current.current, settings: value });
  const toggle = (value: Panel) => {
    setPending(null);
    setPanel((old) => (old === value ? null : value));
  };
  const exportLog = async () => {
    try {
      if (await bridge.exportProfile(current.current))
        setMessage('Flight log exported. Safe travels.');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Export failed.');
    }
  };
  const importLog = async () => {
    try {
      const imported = await bridge.importProfile();
      if (imported) setPending(imported);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Import failed.');
    }
  };
  return (
    <>
      <div className="titlebar">
        <div>
          <ShipIcon />
          <span>STROIDS</span>
        </div>
        {window.desktop && (
          <div className="window-controls">
            <button
              aria-label="Minimize window"
              onClick={() => void bridge.windowAction('minimize')}
            >
              <Minus />
            </button>
            <button
              aria-label="Maximize or restore window"
              onClick={() => void bridge.windowAction('maximize')}
            >
              <Square />
            </button>
            <button
              aria-label="Close window"
              onClick={() => void bridge.windowAction('close')}
            >
              <X />
            </button>
          </div>
        )}
      </div>
      <main className="app-shell">
        <header className="main-header">
          <a
            className="wordmark"
            href="#"
            aria-label="STROIDS home"
            onClick={(e) => {
              e.preventDefault();
              setPanel(null);
            }}
          >
            STROIDS
          </a>
          <nav aria-label="Main navigation">
            {(['help', 'log', 'settings'] as const).map((value, index) => (
              <button
                key={value}
                className={panel === value ? 'active' : ''}
                aria-expanded={panel === value}
                onClick={() => toggle(value)}
              >
                {['HOW TO PLAY', 'FLIGHT LOG', 'SETTINGS'][index]}
              </button>
            ))}
          </nav>
        </header>
        {message && (
          <div className="notice" role="status">
            <span>{message}</span>
            <button
              aria-label="Dismiss message"
              className="icon-button"
              onClick={() => setMessage('')}
            >
              <X size={16} />
            </button>
          </div>
        )}
        <Panels
          panel={panel}
          profile={profile}
          onClose={() => {
            setPanel(null);
            setPending(null);
          }}
          onSettings={settings}
          onExport={exportLog}
          onImport={importLog}
          pending={pending}
          onConfirmImport={() => {
            if (pending) {
              save(pending);
              setPending(null);
              setMessage('Flight log imported. Ready for your next run.');
            }
          }}
          onCancelImport={() => setPending(null)}
        />
        {loaded ? (
          <GameView
            settings={profile.settings}
            blocked={panel !== null}
            best={Math.max(0, ...profile.runs.map((r) => r.score))}
            onRun={onRun}
            onHome={() => setPanel(null)}
          />
        ) : (
          <div className="loading">PREPARING YOUR SHIP…</div>
        )}
        <div className="control-legend">
          <p>BUILT FOR THE LONG WAY HOME.</p>
          <div>
            <span>
              <kbd>
                <ArrowLeft />
              </kbd>
              <kbd>
                <ArrowRight />
              </kbd>{' '}
              ROTATE
            </span>
            <span>
              <kbd>
                <ArrowUp />
              </kbd>{' '}
              THRUST
            </span>
            <span>
              <kbd className="space-key">SPACE</kbd> FIRE
            </span>
            <span>
              <kbd>P</kbd> PAUSE
            </span>
          </div>
        </div>
        <footer>
          <span>An independent tribute to the golden age of arcades.</span>
          <span>LOCAL PLAY / NO QUARTERS REQUIRED</span>
        </footer>
      </main>
    </>
  );
}
