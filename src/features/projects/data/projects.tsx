import type { Project } from '../types';

export const projects: Project[] = [
    {
        id: 1,
        title: '多自由度ロボットの制御',
        src: '/images/lerobot.png',
        description:
            '運動方程式の記述が困難、かつ非線形性の強い多自由度ロボットについて高精度な手先位置制御を実現するため、深層学習とモデル予測制御(MPC)を組み合わせた制御手法を研究しています。',
        tags: ['Python', 'PyTorch', 'MuJoCo', 'LeRobot', '研究'],
        content: [
            { type: 'heading', text: '概要' },
            {
                type: 'paragraph',
                text: '多自由度ロボットは動力学モデルが複雑であり、高精度な制御には通常、Motion Capture等の高コストな外部計測システムが必要です。本研究では、深層学習を用いてロボットの複雑な動力学モデルを高精度に近似しました。これにより、外部センサによる手先位置計測に頼ることなく、MPC（モデル予測制御）を用いた高精度な位置制御を実現する手法を開発しています。',
            },
            { type: 'heading', text: '使用している技術' },
            {
                type: 'paragraph',
                text: '主に以下の技術を使用しています。'
            },
            {
                type: 'list',
                items: [
                    'LeRobot 「SO-101」: 6自由度を持つロボットアーム。',
                    'Python: 研究開発の主要言語として使用。',
                    'PyTorch: 深層学習モデルの構築とトレーニングに使用。',
                    'MuJoCo: ロボットの物理シミュレーション環境として利用。',
                ]
            }
        ],
    },
    {
        id: 2,
        title: 'Debug Master',
        src: '/images/debug-master-thumb.png',
        description: 'プログラミング初心者の「1から書く」ハードルを下げるため、AI生成の不具合コードを修正する新感覚学習アプリ「Debug Master」を開発。間違い探し感覚で楽しく学べる体験設計により、従来より気軽にコーディングスキルを習得できる学習環境を実現しています。',
        tags: ['AI', 'TypeScript', 'React', 'FastAPI', 'チーム開発'],
        content: [
            { type: 'heading', text: '概要' },
            {
                type: 'paragraph',
                text: 'AIコーディングの普及によりコード生成は容易になりましたが、生成されたコードの正誤を判断し、修正する「デバッグ力」の重要性はむしろ高まっています。本アプリは、AIが生成した「意図的なバグを含むコード」をユーザーが修正する学習プラットフォームです。 ゼロからコードを書く必要がないため、初心者でもハードルを感じずに取り組むことができ、実践的なトラブルシューティング能力を養うことができます。つまずきを最小化するためのヒント機能も搭載しています。',
            },
            { type: 'heading', text: '開発ついて'},
            {
                type: 'paragraph',
                text: 'ハッカソンをきっかけに結成した3名チームで開発しています。特定の役割に縛られず、メンバー全員が課題発見から実装までを能動的に行うスタイル(スクラム開発)を採用しています。 現在は、某中学校のプログラミング部にて実証実験を実施中です。実際の生徒(ユーザー)からのフィードバックを基に、UI/UXの改善や機能追加をアジャイルに進めています。',
            },
            { type: 'heading', text: '技術スタック' },
            {
                type: 'list',
                items: [
                    'フロントエンド: React, TypeScript',
                    'バックエンド: FastAPI, Python',
                    'AIモデル: Gemini API',
                ],
            },
            
        ],
        link: {
            github: 'https://github.com/matsuda-tkm/debug-master',
        },
    },
    {
        id: 3,
        title: 'Debug Puzzle',
        src: '/images/debug-puzzle-thumb.png',
        description:
            'Debug Masterの姉妹アプリで、ブロックを組み合わせてバグを修正するパズル形式の学習アプリ。コードを書いたことがない方向けに開発しました。プログラミングの基礎概念を楽しく学べるよう設計しました。',
        tags: ['AI', 'TypeScript', 'React', 'FastAPI', 'チーム開発'],
        content: [
            { type: 'heading', text: '概要' },
            {
                type: 'paragraph',
                text: 'コードを書いたことのない方にもプログラミングの面白さを知ってほしいという想いから、Debug Masterの姉妹アプリとして開発しました。Debug Puzzleでは、「〇〇をする」、「もし〜なら」などの書かれたブロックが表示され、ユーザーはそれらをドラッグ&ドロップで組み合わせて正しいコードを完成させます。これにより、プログラミングの基礎概念を直感的に理解することが出来るよう工夫しました。',
            },
            { type: 'heading', text: '実装機能' },
            {
                type: 'list',
                items: [
                    'ドラッグ&ドロップでブロックを組み合わせる直感的なUI',
                    'AIコード生成に含まれるバグの修正',
                ],
            },
        ],
        link: {
            github: 'https://github.com/Moriyuki-S/debug-puzzle',
        },
    },
    {
        id: 4,
        title: '動画像の異常検知システム',
        src: '/images/anomaly-detection.png',
        description:
            '製造業向けに、動画像から異常を検知するシステムを開発。NVIDIA Jetsonを用いたエッジデバイス上で、リアルタイムに高精度な異常検知を実現しています。これにより、製造ラインの品質管理と効率化に貢献しています。',
        tags: ['Python', 'PyTorch', 'OpenCV', 'NVIDIA Jetson', 'チーム開発'],
        content: [
            { type: 'heading', text: '概要' },
            {
                type: 'paragraph',
                text: '製造業における品質管理のため、動画像からリアルタイムに以上を検知するシステムを開発しました。NVIDIA Jetsonをエッジデバイスとして使用し、現場での即時異常検知を可能にしています。リアルタイム性能を向上させるため、TensorRTを活用し、モデルの推論速度を最適化しました。',
            },
            {
                type: 'heading',
                text: '使用した技術',
            },
            {
                type: 'list',
                items: [
                    'Python: 主要な開発言語として使用。',
                    'PyTorch: 深層学習モデルの構築とトレーニングに使用。',
                    'OpenCV: 動画像の前処理と解析に利用。',
                    'NVIDIA Jetson: エッジデバイスとしてリアルタイム推論を実現。',
                    'TensorRT: モデルの最適化と高速推論に使用。',
                ]
            }
        ],
    },
];
