# 変更履歴 (changelog.md)

すべての重要な変更、設計決定、TDDのRed/Green/Refactorサイクルをここに記録します。

### Fix: 図鑑クリック時に画面が真っ白になる不具合の修正 (React Rules of Hooks違反の解消 & BDD検証)
- `fix`:
  - `AllTypesModal.tsx` において、`if (!isOpen) return null;` より後ろで `useMemo`（カテゴリー抽出・フィルタリング）を呼び出していたため、モーダルを開閉する際にReactのHooks呼び出し順序が変化し `Rendered more hooks than during the previous render` エラーが発生して画面全体がクラッシュ（真っ白）していた不具合を解消。すべてのHooksをコンポーネントトップレベルで無条件に呼び出す構造に修正。
  - モーダル外枠や各カード要素に一意のID属性（`#all-types-modal-backdrop`, `#all-types-modal-dialog`, `#style-card-${typeId}`）を付与。
- `test`:
  - `jsdom` 環境でのインタラクティブ実機模倣テストスイート `InteractiveBookModal.spec.tsx` を新規作成。
  - ヘッダー図鑑ボタンクリック、スタート画面図鑑ボタンクリック、モーダル内の任意スタイルカード選択による診断結果画面遷移、結果画面下部からの再オープン、シークレットスタイル選択時の覚醒ヘッダー表示、カテゴリーフィルター＆検索の全シナリオを網羅テスト（全129件テスト全通過）。

### Feature: 100種類の新スタイル＋5種類のシークレットスタイルの拡充 (Green & Tested)
- `feat`:
  - スタイルタイプ数を全105種類（100通常スタイル＋5伝説シークレットスタイル）に大幅拡充
  - 11大カテゴリー体系の構築:
    1. 🏃‍♀️ スポーティ＆アクティブ (10種)
    2. 🎀 スウィート＆ガーリー (10種)
    3. 🕶️ クール＆ストリート (10種)
    4. 🌿 ナチュラル＆ピュア (10種)
    5. ⭐ トレンド＆アイドル (10種)
    6. 🏛️ クラシック＆レトロ (10種)
    7. 🎮 サブカル＆Y2K (10種)
    8. 🐾 アニマル＆マスコット (10種)
    9. 🌸 シーズン＆ネイチャー (10種)
    10. 🔮 ファンタジー＆ドリーム (10種)
    11. 🌟 シークレット (全5種):
        - 🦄 奇跡の幻獣！レインボーユニコーンエンジェル
        - 💖 奇跡の変身！ミラクル☆マジカルガール
        - ⚡ 空間跳躍！電脳サイバーフェアリー
        - 👑 砂漠の黄金！ファラオエンプレス女王
        - 🌌 銀河を統べる！コズミックギャラクシー
  - シークレット覚醒トリガーロジック（`DiagnosisDomainService.checkSecretTrigger`）
  - 全105種対応の「スタイル大図鑑モーダル」（カテゴリータブ・リアルタイム検索・シークレット出現ヒント開閉機能）
  - 5つのシークレットスタイル専用アニメーションSVGイラスト＆専用ヘッダーバッジ
  - 5つのシークレットスタイルに対するBDDテストスイートの追加（全16件テスト全通過）

## [Unreleased] - 2026-09-12

### Initial Setup
- プロジェクト初期化
- Git初期設定
- `plan.md` 作成（スキーマ駆動、簡易DDD、BDD/TDD設計方針の策定）
- `metadata.json` および `index.html` の更新
- テストフレームワーク（Vitest）およびスキーマ検証（Zod）のインストール

### TDD Cycle 1: 診断ドメインサービス & スキーマ (Red)
- `test(red)`: 診断のBDDシナリオ（ポップスポーティ、スウィートガーリー、バリデーション）のテストを記述し、テストが期待通り失敗（Red）することを確認。

### TDD Cycle 1: 診断ドメインサービス & スキーマ (Green)
- `feat(green)`: 
  - `StyleProfile`, `HairStyle`, `FashionCoord`, `ColorPaletteItem` ドメインモデルを定義
  - `UserAnswersSchema` によるスキーマ駆動の入力検証を実装
  - `DiagnosisDomainService` によるスコア判定および髪の長さに応じたヘアアレンジソートを実装
  - 全3件のBDDテストが成功（Green）することを確認。

### TDD Cycle 1: 診断ドメインサービス & スキーマ (Refactor)
- `refactor`:
  - `IStyleRepository` インターフェースをドメイン層に分離し、依存性逆転の原則 (DIP) を適用
  - `DiagnosisDomainService` 内のスコア配分ロジックを責務ごとにメソッド抽出し可読性と拡張性を向上
  - 全5つのスタイルタイプ（ポップスポーティ、スウィートガーリー、クールカジュアル、ナチュラルピュア、トレンドアイドル）のBDDテストケースを追加し、全6件が正常通過することを検証。

### Feature: UIコンポーネント & フロー統合 & AIスタイリスト (Green)
- `feat`:
  - 好きな色、食べ物、休日の過ごし方、気分、髪の長さを選ぶ診断ステップ画面（`DiagnosisQuestionCard`）
  - スタイルごとの可愛いSVGイラストレーション（`StyleIllustration`）
  - 似合う色パレット表示（`ColorPaletteView`）
  - 小学生向け学校OK・休日ヘアアレンジ手順図解カード（`HairArrangementCard`, `HairStepIllustration`）
  - 通学・学校コーデ vs 休日おでかけコーデ切替カード（`FashionCoordCard`）
  - Gemini API連携による今日の予定×お天気AIスタイリストアドバイス機能（`/api/stylist-advice`, `AiStylistConsultant`）
  - 全5タイプ一覧切り替えモーダル（`AllTypesModal`）
  - UIフロー・データ整合性のBDDテスト（全9件通過）

### Feature: GitHub Pages (github.io) デプロイ対応
- `feat`:
  - `vite.config.ts` に `base: './'` を設定し、`https://<ユーザー名>.github.io/<リポジトリ名>/` のサブパスでもアセットが404にならず正常に読み込めるよう対応
  - 自動デプロイ用 GitHub Actions ワークフロー（`.github/workflows/deploy.yml`）を構築
  - 手動デプロイ用の `gh-pages` パッケージ導入および `npm run deploy`, `npm run build:pages` スクリプトの追加
  - サーバーレス静的環境（GitHub Pages）でもアドバイス機能が正常稼働する `StylistAdviceService` フォールバックエンジンを実装（BDDテスト追加・全11テスト通過）
  - デプロイ手順を記載した `README.md` を作成
- `fix`:
  - GitHub Actionsの `cache: 'npm'` および `npm ci` で必須となる `package-lock.json` を生成・コミットし、「Dependencies lock file is not found」エラーを解消
  - `.github/workflows/deploy.yml` のインストールステップにフォールバック処理を追加


