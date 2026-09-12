# 変更履歴 (changelog.md)

すべての重要な変更、設計決定、TDDのRed/Green/Refactorサイクルをここに記録します。

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


