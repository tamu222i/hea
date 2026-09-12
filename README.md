# 小学生ヘア＆ファッションスタイル診断 🎀

好きな色や食べもの、休日の過ごし方、気分、髪の長さを選んで、自分に一番似合うスタイルタイプ（全5種）、似合うカラーパレット、学校・休日ヘアアレンジ（図解つき）、通学＆おでかけコーデを楽しく診断できるWebアプリケーションです。

---

## 🚀 GitHub Pages (github.io) へのデプロイ方法

本リポジトリは GitHub Pages (`https://<ユーザー名>.github.io/<リポジトリ名>/`) に完全対応しています。
以下の **2つの方法（自動または手動コマンド）** のどちらでも簡単に公開できます。

### 方法1: GitHub Actions（おすすめ・完全自動）

リポジトリに `.github/workflows/deploy.yml` が用意されているため、GitHubの設定を1つ有効にするだけで自動デプロイされます。

1. GitHubのリポジトリページを開きます。
2. **Settings**（設定）タブ → 左メニューの **Pages** をクリックします。
3. **Build and deployment** の **Source** を **`GitHub Actions`** に変更します。
4. コードを `main`（または `master`）ブランチに `git push` すると、自動的にビルド＆テストが実行され、数分で `https://<ユーザー名>.github.io/<リポジトリ名>/` に公開されます！

---

### 方法2: npm run deploy コマンドで手動デプロイ

ターミナルから直接コマンドで公開したい場合:

```bash
# 依存パッケージのインストール
npm install

# ビルドして gh-pages ブランチにデプロイ
npm run deploy
```

デプロイ後、GitHubのリポジトリ設定（**Settings** → **Pages**）にて、Sourceが「Deploy from a branch」、Branchが「**gh-pages / (root)**」になっていることを確認してください。

---

## 🛠️ 技術スタック & 特徴

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Lucide Icons + Motion
- **Architecture**: 簡易DDD（ドメイン駆動設計） + Zodスキーマ駆動
- **Testing**: Vitest（BDD Given-When-Then シナリオテスト）
- **GitHub Pages 対応**: 相対アセットパス（`base: './'`）設定、サーバーレス環境下でのスタイリストアドバイス自動フォールバック搭載
