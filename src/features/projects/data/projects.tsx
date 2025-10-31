import type { Project } from '../types';

export const projects: Project[] = [
    {
        id: 1,
        title: 'Portfolio Website',
        src: '/images/projects/portfolio.jpg',
        description: 'React + Astroで構築した個人ポートフォリオサイト。Three.jsによる3Dアニメーションとダークモード対応。',
        tags: ['React', 'Astro', 'TypeScript', 'Three.js', 'Tailwind CSS'],
        content: () => (
            <>
                <h3 className="mb-4 font-bold text-2xl">概要</h3>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                    モダンなWeb技術を活用したポートフォリオサイト。
                    パフォーマンスとアクセシビリティを重視した設計。
                </p>
                <h3 className="mb-4 font-bold text-2xl">主な機能</h3>
                <ul className="mb-6 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-300">
                    <li>レスポンシブデザイン</li>
                    <li>Three.jsによる3Dキューブアニメーション</li>
                    <li>ダークモード切り替え</li>
                    <li>スムーススクロール</li>
                </ul>
            </>
        ),
        link: {
            demo: 'https://example.com',
            github: 'https://github.com/username/portfolio',
        },
    },
    {
        id: 2,
        title: 'E-Commerce Dashboard',
        src: '/images/projects/dashboard.jpg',
        description: 'Next.js 14とPrismaを使用した管理ダッシュボード。リアルタイム分析とグラフ表示機能。',
        tags: ['Next.js', 'Prisma', 'PostgreSQL', 'Chart.js', 'shadcn/ui'],
        content: () => (
            <>
                <h3 className="mb-4 font-bold text-2xl">プロジェクト詳細</h3>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                    売上管理、在庫管理、顧客分析を統合したダッシュボード。
                    Server Componentsを活用した高速レンダリング。
                </p>
                <h3 className="mb-4 font-bold text-2xl">技術スタック</h3>
                <ul className="mb-6 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-300">
                    <li>Next.js 14 App Router</li>
                    <li>Prisma ORM + PostgreSQL</li>
                    <li>Chart.js / Recharts</li>
                    <li>shadcn/ui コンポーネント</li>
                </ul>
            </>
        ),
        link: {
            github: 'https://github.com/username/dashboard',
        },
    },
    {
        id: 3,
        title: 'AI Chat Application',
        src: '/images/projects/chat.jpg',
        description: 'OpenAI APIを統合したリアルタイムチャットアプリ。ストリーミングレスポンスとマークダウン対応。',
        tags: ['React', 'TypeScript', 'OpenAI', 'WebSocket', 'Tailwind CSS'],
        content: () => (
            <>
                <h3 className="mb-4 font-bold text-2xl">機能紹介</h3>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                    GPT-4を活用したAIチャットインターフェース。
                    ストリーミングレスポンスで自然な会話体験を実現。
                </p>
                <h3 className="mb-4 font-bold text-2xl">主な実装</h3>
                <ul className="mb-6 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-300">
                    <li>OpenAI API統合</li>
                    <li>Server-Sent Events (SSE)</li>
                    <li>マークダウン + シンタックスハイライト</li>
                    <li>会話履歴管理</li>
                </ul>
            </>
        ),
        link: {
            demo: 'https://chat.example.com',
            github: 'https://github.com/username/ai-chat',
        },
    },
    {
        id: 4,
        title: 'Task Management App',
        src: '/images/projects/task.jpg',
        description: 'ドラッグ&ドロップ対応のタスク管理アプリ。認証機能とリアルタイム同期。',
        tags: ['Vue 3', 'Supabase', 'Pinia', 'dnd-kit', 'Vite'],
        content: () => (
            <>
                <h3 className="mb-4 font-bold text-2xl">アプリケーション概要</h3>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                    Supabaseを活用したフルスタックタスク管理アプリ。
                    カンバンボード形式でタスクを視覚的に管理。
                </p>
                <h3 className="mb-4 font-bold text-2xl">実装機能</h3>
                <ul className="mb-6 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-300">
                    <li>ドラッグ&ドロップによるタスク移動</li>
                    <li>Supabase認証</li>
                    <li>リアルタイムデータ同期</li>
                    <li>タグ・期限・優先度管理</li>
                </ul>
            </>
        ),
        link: {
            demo: 'https://tasks.example.com',
        },
    },
    {
        id: 5,
        title: 'Weather Forecast PWA',
        src: '/images/projects/weather.jpg',
        description: 'Progressive Web Appとして動作する天気予報アプリ。オフライン対応とプッシュ通知。',
        tags: ['React', 'PWA', 'Service Worker', 'IndexedDB', 'Weather API'],
        content: () => (
            <>
                <h3 className="mb-4 font-bold text-2xl">PWAの特徴</h3>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                    ネイティブアプリのような体験を提供するWebアプリ。
                    オフラインでも過去のデータを閲覧可能。
                </p>
                <h3 className="mb-4 font-bold text-2xl">実装内容</h3>
                <ul className="mb-6 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-300">
                    <li>Service Worker によるキャッシュ戦略</li>
                    <li>IndexedDB でのデータ永続化</li>
                    <li>プッシュ通知（天気アラート）</li>
                    <li>位置情報ベースの天気取得</li>
                </ul>
            </>
        ),
        link: {
            demo: 'https://weather.example.com',
            github: 'https://github.com/username/weather-pwa',
        },
    },
];