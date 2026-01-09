import { createRoot, type Root } from 'react-dom/client';
import type { Lang } from 'src/lib/i18n/type';


const OVERLAY_STYLES = `
@keyframes langOverlaySpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes langOverlayPulse { 0%, 100% { transform: scale(0.96); opacity: 0.85; } 50% { transform: scale(1.05); opacity: 1; } }
@keyframes langOverlayCore { 0% { transform: scale(0.9); box-shadow: 0 0 12px rgba(122,217,255,0.4); } 50% { transform: scale(1.07); box-shadow: 0 0 26px rgba(122,217,255,0.65); } 100% { transform: scale(0.9); box-shadow: 0 0 12px rgba(122,217,255,0.4); } }
@keyframes langOverlayBeam { 0% { transform: translateX(-60%); opacity: 0; } 25% { opacity: 0.35; } 60% { opacity: 0.3; } 100% { transform: translateX(60%); opacity: 0; } }
@keyframes langOverlayGrid { 0% { transform: translateY(0); } 100% { transform: translateY(-14px); } }
#lang-transition-overlay .lang-overlay-spinner { position: relative; width: 76px; height: 76px; border-radius: 50%; display: grid; place-items: center; }
#lang-transition-overlay .lang-overlay-spinner::before, #lang-transition-overlay .lang-overlay-spinner::after { content: ''; position: absolute; inset: 0; border-radius: 50%; }
#lang-transition-overlay .lang-overlay-spinner::before { background: conic-gradient(from 180deg, rgba(255,255,255,0.12), rgba(79,176,255,0.6), rgba(122,217,255,0.9), rgba(255,255,255,0.5), rgba(79,176,255,0.6), rgba(255,255,255,0.12)); mask: radial-gradient(circle at center, transparent 62%, black 65%); animation: langOverlaySpin 1.05s linear infinite; }
#lang-transition-overlay .lang-overlay-spinner::after { inset: 10px; border: 2px dashed rgba(255, 255, 255, 0.35); animation: langOverlaySpin 1.8s ease-in-out infinite reverse; }
#lang-transition-overlay .lang-overlay-glow { width: 100%; height: 100%; border-radius: inherit; background: radial-gradient(circle at 35% 35%, rgba(255,255,255,0.4), transparent 45%), radial-gradient(circle at 70% 70%, rgba(79,176,255,0.55), transparent 40%); filter: drop-shadow(0 0 16px rgba(79,176,255,0.4)); animation: langOverlayPulse 1.6s ease-in-out infinite; }
#lang-transition-overlay .lang-overlay-core { width: 18px; height: 18px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.9), rgba(122,217,255,0.9) 60%, rgba(79,176,255,0.7)); animation: langOverlayCore 1.6s ease-in-out infinite; box-shadow: 0 0 20px rgba(122,217,255,0.55); position: relative; }
#lang-transition-overlay .lang-overlay-core::after { content: ''; position: absolute; inset: -14px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.22); opacity: 0.7; }
#lang-transition-overlay .lang-overlay-grid { position: absolute; inset: 0; background: repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 32px), repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 26px); mask-image: radial-gradient(circle at center, black 40%, transparent 80%); opacity: 0.65; animation: langOverlayGrid 6s linear infinite; }
#lang-transition-overlay .lang-overlay-beam { position: absolute; inset: -20%; background: linear-gradient(120deg, rgba(79,176,255,0) 0%, rgba(79,176,255,0.22) 40%, rgba(255,255,255,0.45) 50%, rgba(79,176,255,0.22) 60%, rgba(79,176,255,0) 100%); filter: blur(12px); animation: langOverlayBeam 1.85s ease-in-out infinite; }
#lang-transition-overlay .lang-overlay-card { position: relative; padding: 22px 24px; border-radius: 18px; backdrop-filter: blur(8px); background: linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.05)); border: 1px solid rgba(255,255,255,0.16); box-shadow: 0 18px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.2); min-width: 240px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
#lang-transition-overlay .lang-overlay-pill { padding: 6px 10px; border-radius: 999px; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.75); background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.16); }
`;

const OverlayContent = ({ nextLang }: { nextLang: Lang }) => {
    const message = nextLang === 'en' ? 'Switching language...' : '言語を切り替えています...';

    return (
        <>
            <div className="lang-overlay-beam" />
            <div className="lang-overlay-grid" />
            <div
                id="lang-transition-overlay-content"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px',
                    textAlign: 'center',
                }}
            >
                <div className="lang-overlay-card">
                    <div className="lang-overlay-pill">Language</div>
                    <div className="lang-overlay-spinner" aria-hidden="true">
                        <div className="lang-overlay-glow" />
                        <div className="lang-overlay-core" />
                    </div>
                    <div
                        id="lang-transition-overlay-message"
                        style={{
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: 700,
                            textAlign: 'center',
                            lineHeight: 1.4,
                            maxWidth: '80vw',
                        }}
                    >
                        {message}
                    </div>
                </div>
            </div>
        </>
    );
};

// Rootを保持して二重作成を防ぐための変数
let overlayRoot: Root | null = null;

// --- 3. Main Function ---
export const showLanguageTransition = (next: Lang, onReady: () => void) => {
    if (typeof document === 'undefined') {
        onReady();
        return;
    }

    // 1. スタイルの注入
    if (!document.getElementById('lang-overlay-style')) {
        const style = document.createElement('style');
        style.id = 'lang-overlay-style';
        style.textContent = OVERLAY_STYLES;
        document.head.appendChild(style);
    }

    // 2. コンテナの確保
    let container = document.getElementById('lang-transition-overlay');
    if (!container) {
        container = document.createElement('div');
        container.id = 'lang-transition-overlay';
        container.setAttribute('aria-hidden', 'true');
        container.style.cssText = `
            position: fixed;
            inset: 0;
            background: radial-gradient(circle at center, rgba(255,255,255,0.06), transparent 40%), rgba(5,10,20,0.82);
            backdrop-filter: blur(6px);
            opacity: 0;
            transition: opacity 200ms ease;
            z-index: 9999;
            pointer-events: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            box-sizing: border-box;
            overflow: hidden;
        `;
        document.body.appendChild(container);
        
        // 新しいコンテナを作った場合はRootも作り直す必要があるためリセット
        overlayRoot = null;
    }

    // 3. Reactコンポーネントのマウント (innerHTMLの代わり)
    if (!overlayRoot) {
        overlayRoot = createRoot(container);
    }
    overlayRoot.render(<OverlayContent nextLang={next} />);

    // 4. クリーンアップ処理
    const handleCleanup = () => {
        const target = document.getElementById('lang-transition-overlay');
        if (!target) return;

        target.style.opacity = '0';
        
        window.setTimeout(() => {
            // Reactのアンマウント処理（メモリリーク防止）
            if (overlayRoot) {
                overlayRoot.unmount();
                overlayRoot = null;
            }
            target.remove();
        }, 220);
    };

    // Astroのイベントハンドリング
    document.addEventListener('astro:after-swap', handleCleanup, { once: true });
    
    const fallback = window.setTimeout(handleCleanup, 1500);
    document.addEventListener(
        'astro:after-swap',
        () => window.clearTimeout(fallback),
        { once: true },
    );

    // 5. アニメーション開始
    requestAnimationFrame(() => {
        if (container) container.style.opacity = '0.9';
        window.setTimeout(onReady, 40);
    });
};