import type { Project } from '../types';

export const projects: Project[] = [
    {
        id: 1,
        title: 'Portfolio Website',
        src: 'https://placehold.jp/440x420.png',
        description:
            'React + Astroで構築した個人ポートフォリオサイト。Three.jsによる3Dアニメーションとダークモード対応。',
        tags: ['React', 'Astro', 'TypeScript', 'Three.js', 'Tailwind CSS'],
        content: [
            { type: 'heading', text: '概要' },
            {
                type: 'paragraph',
                text: 'モダンなWeb技術を活用したポートフォリオサイト。パフォーマンスとアクセシビリティを重視した設計。',
            },
            { type: 'heading', text: '主な機能' },
            {
                type: 'list',
                items: [
                    'レスポンシブデザイン',
                    'Three.jsによる3Dキューブアニメーション',
                    'ダークモード切り替え',
                    'スムーススクロール',
                ],
            },
        ],
        link: {
            demo: 'https://example.com',
            github: 'https://github.com/username/portfolio',
        },
    },
    {
        id: 2,
        title: 'E-Commerce Dashboard',
        src: 'https://placehold.jp/440x420.png',
        description:
            'Next.js 14とPrismaを使用した管理ダッシュボード。リアルタイム分析とグラフ表示機能。',
        tags: ['Next.js', 'Prisma', 'PostgreSQL', 'Chart.js', 'shadcn/ui'],
        content: [
            { type: 'heading', text: 'プロジェクト詳細' },
            {
                type: 'paragraph',
                text: '売上管理、在庫管理、顧客分析を統合したダッシュボード。Server Componentsを活用した高速レンダリング。',
            },
            { type: 'heading', text: '技術スタック' },
            {
                type: 'list',
                items: [
                    'Next.js 14 App Router',
                    'Prisma ORM + PostgreSQL',
                    'Chart.js / Recharts',
                    'shadcn/ui コンポーネント',
                ],
            },
        ],
        link: {
            github: 'https://github.com/username/dashboard',
        },
    },
    {
        id: 3,
        title: 'AI Chat Application',
        src: 'https://placehold.jp/440x420.png',
        description:
            'OpenAI APIを統合したリアルタイムチャットアプリ。ストリーミングレスポンスとマークダウン対応。',
        tags: ['React', 'TypeScript', 'OpenAI', 'WebSocket', 'Tailwind CSS'],
        content: [
            { type: 'heading', text: '機能紹介' },
            {
                type: 'paragraph',
                text: 'GPT-4を活用したAIチャットインターフェース。ストリーミングレスポンスで自然な会話体験を実現。',
            },
            { type: 'heading', text: '主な実装' },
            {
                type: 'list',
                items: [
                    'OpenAI API統合',
                    'Server-Sent Events (SSE)',
                    'マークダウン + シンタックスハイライト',
                    '会話履歴管理',
                ],
            },
        ],
        link: {
            demo: 'https://chat.example.com',
            github: 'https://github.com/username/ai-chat',
        },
    },
    {
        id: 4,
        title: 'Task Management App',
        src: 'https://placehold.jp/440x420.png',
        description:
            'ドラッグ&ドロップ対応のタスク管理アプリ。認証機能とリアルタイム同期。',
        tags: ['Vue 3', 'Supabase', 'Pinia', 'dnd-kit', 'Vite'],
        content: [
            { type: 'heading', text: 'アプリケーション概要' },
            {
                type: 'paragraph',
                text: 'Supabaseを活用したフルスタックタスク管理アプリ。カンバンボード形式でタスクを視覚的に管理。',
            },
            { type: 'heading', text: '実装機能' },
            {
                type: 'list',
                items: [
                    'ドラッグ&ドロップによるタスク移動',
                    'Supabase認証',
                    'リアルタイムデータ同期',
                    'タグ・期限・優先度管理',
                ],
            },
        ],
        link: {
            demo: 'https://tasks.example.com',
        },
    },
    {
        id: 5,
        title: 'Weather Forecast PWA',
        src: 'https://placehold.jp/440x420.png',
        description:
            'Progressive Web Appとして動作する天気予報アプリ。オフライン対応とプッシュ通知。',
        tags: ['React', 'PWA', 'Service Worker', 'IndexedDB', 'Weather API'],
        content: [
            { type: 'heading', text: 'PWAの特徴' },
            {
                type: 'paragraph',
                text: 'ネイティブアプリのような体験を提供するWebアプリ。オフラインでも過去のデータを閲覧可能。',
            },
            { type: 'heading', text: '実装内容' },
            {
                type: 'list',
                items: [
                    'Service Worker によるキャッシュ戦略',
                    'IndexedDB でのデータ永続化',
                    'プッシュ通知（天気アラート）',
                    '位置情報ベースの天気取得',
                ],
            },
        ],
        link: {
            demo: 'https://weather.example.com',
            github: 'https://github.com/username/weather-pwa',
        },
    },
];
