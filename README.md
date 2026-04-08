# Presence-Stack

Web面接ガイドの静的サイトです。  
HTML / CSS / JavaScript だけで構成されており、ビルドなしでそのまま表示できます。

## このリポジトリでできていること

- 章トップページと詳細ページを含むサイト構成
- 全ページ共通のヘッダー / フッター
- 前へ / 次へ / 章トップ / Index の共通ナビゲーション
- ページ間の共通トランジション演出
- 章構成に合わせたフォルダ分割

## サイト構成

### ルート

- `index.html`
  - トップページ
- `pre-interview-checks.html`
  - 第1章トップ
- `materials-preparation.html`
  - 第2章トップ
- `chatgpt-support.html`
  - 第3章トップ
- `closing.html`
  - 最終ページ

### 第1章: 事前確認

- `pre-interview-checks/usage-device.html`
- `pre-interview-checks/audio-camera-desktop.html`
- `pre-interview-checks/environment-notifications.html`
- `pre-interview-checks/platform-overview.html`
- `pre-interview-checks/platform-overview/zoom.html`
- `pre-interview-checks/platform-overview/google-meet.html`
- `pre-interview-checks/platform-overview/microsoft-teams.html`

### 第2章: 面接準備

- `materials-preparation/company-information.html`
- `materials-preparation/resume-career-history.html`
- `materials-preparation/portfolio.html`
- `materials-preparation/curriculum-learning-log.html`
- `materials-preparation/company-questionnaire.html`

### 第3章: ChatGPT活用

- `chatgpt-support/job-understanding.html`
- `chatgpt-support/reflection-memo.html`
- `chatgpt-support/mock-qa.html`
- `chatgpt-support/mock-interview.html`

## 主要ファイル

### スタイル

- `css/common.css`
  - 全ページ共通のベースレイアウト、共通ナビ、ページ遷移演出
- `css/section_common.css`
  - 詳細ページで使う共通セクションスタイル

### スクリプト

- `js/common-navigation.js`
  - ページごとの導線定義
  - 共通ヘッダー / フッターの差し込み
  - 前後ページリンクの生成
  - スワイプ操作
  - 共通ページ遷移演出
  - `sessionStorage` を使った遷移状態の引き継ぎ
- `js/page-transition.js`
  - 互換用の最小スタブ
- `js/index.js`
  - トップページ用の補助処理
- `js/pre-interview-checks.js`
  - 章トップ用の補助処理
- `js/usage-device.js`
  - 一部詳細ページ用の補助処理

## 共通ヘッダー / フッターについて

各 HTML に同じ内容を直接持たせず、`js/common-navigation.js` が現在のページを判定して共通ヘッダー / フッターを生成します。

各ページでは以下のプレースホルダを置く構成です。

- `data-shared-header`
- `data-shared-footer`

## ページ遷移について

ページ遷移の流れ自体は全ページ共通です。  
内部リンククリック時に共通トランジションが走り、到着ページ側でも状態を引き継いで演出を継続します。

現在の演出の特徴:

- 0 / 16 / 44 / 72 / 99% の進行表示
- 見本ベースのストリーム演出
- 中央収束する 2進数 / 16進数 / 64進数表現
- ニューロン / シナプス風の背景演出
- 到着ページのフラッシュを抑える初期非表示制御

除外されるリンク:

- `target="_blank"`
- `mailto:`
- `tel:`
- `javascript:`
- 同一ページ内アンカー
- `download` 属性付きリンク
- 外部サイトへのリンク

## 画像・補助ファイル

- `image/`
  - サイト内で使う画像
- `見本.html`
  - 遷移演出の方向性を確認するためのサンプル
- `preview.html`
  - 遷移実装の本番対象ではない確認用ファイル
- `テキストの見本.html`
  - 表示確認用の補助ファイル

## 編集時の前提

- 基本は UTF-8 BOM なしで扱う
- 日本語を含むファイルは文字コードに注意する
- 相対パスは配置階層に応じて確認する
- 共通導線を変更する場合は `js/common-navigation.js` を基点に見る

## 確認の入口

最初に見ると全体を追いやすいファイル:

1. `index.html`
2. `js/common-navigation.js`
3. `css/common.css`
4. `# Web面接ガイド -仕様書.md`
5. `ページ遷移実装.md`
