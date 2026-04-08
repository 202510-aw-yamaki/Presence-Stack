# Web面接ガイド - 最終的なサイトマップ予定

```
📱 Web面接に向けた事前準備と対策
│
├─ 🏠 [index.html] - トップページ、Web面接に向けた事前準備と対策ページ（目次）
│  
├─ 📚 第1章：Web面接前に確認しておきたいこと
│　├─ [pre-interview-checks.html] - 章トップ（第一章の目次）
│　│
|　└ [pre-interview-checks]フォルダ
|　　  ├─ 🔧 1-1. [usage-device.html]
│ 　　 │       使用機材の確認
│ 　　 │
│ 　　 ├─ 🔊 1-2. [audio-camera-desktop.html]
│  　　│       音量の調整とデスクトップのレイアウト
│ 　　 │
│ 　　 ├─ 🎬 1-3. [environment-notifications.html]
│  　　│       映像・背景・周囲の環境と通知の停止
│ 　　 │
│  　　└─ 🌐 1-4. [platform-overview.html]
│          使用されやすいWeb会議ツール
│           │
|           └platform-overviewフォルダ
│         　 　├─ 💜 [zoom.html]
│        　  　├─ 🔵 [google-meet.html]
│          　　└─ 🟢 [microsoft-teams.html]
│
├─ 📋 第2章：面接資料の準備方法
│  ├─ [materials-preparation.html] - 章トップ
│　│
|　└─ [materials-preparation]フォルダ
│  　　|
│  　　├─ 🏢 2-1. [company-information.html]
│  　　│       応募先企業の情報および求人情報
│  　　│
│  　　├─ 📄 2-2. [resume-career-history.html]
│  　　│       自身の履歴書・職務経歴書
│  　　│
│  　　├─ 🎨 2-3. [portfolio.html]
│  　　│       自身のポートフォリオ
│  　　│
│  　　├─ 📚 2-4. [curriculum-learning-log.html]
│  　　│       職業訓練校のカリキュラムおよび学習記録
│  　　│
│  　　└─ 📝 2-5. [company-questionnaire.html]
│          企業アンケートも有効活用
│
├─ 💬 第3章：ChatGPTを活用した面接準備の進め方
│  ├─ [chatgpt-support.html] - 章トップ
│  |
|  └─ [chatgpt-support]フォルダ
│     │
│     ├─ 🔍 3-1. [job-understanding.html]
│     │       求人内容の理解を深め、訓練校での学びを話せる形に整理
│     │
│     ├─ 📌 3-2. [reflection-memo.html]
│     │       自分用の振り返りメモは役割を分けて活用する
│     │
│     ├─ ❓ 3-3. [mock-qa.html]
│     │       想定問答集を作成する
│     │
│     └─ 🎤 3-4. [mock-interview.html]
│          ChatGPTと模擬面接を行う
│
├─ ✅ 第4章：最後に
|  └─ [closing.html]
|     最終チェックリストと全体のまとめ
|
├─ CSSフォルダ
│  | common.css（基本的にコモンから全て）
|　└―必要であれば各種ページに合うCSSを作成
│
│
├─ JSフォルダ
│  ├─ index.js
|  |
│  ├― 各種.JS


```

## **階層構造**

- **レベル0**：トップページ（index.html）
- **レベル1**：4つの章トップページ
- **レベル2**：各章配下のサブページ（計15ページ）
- **レベル3**：プラットフォーム詳細ページ（Zoom、Google Meet、Teams）

## **訪問順序の推奨**

利用者は通常、この順序で進みます：
1. **トップページ** → 全体像を把握
2. **第1章** → 環境確認（4ページ）
プラットフォーム詳細ページ（3ページ）
3. **第2章** → 資料準備（5ページ）
4. **第3章** → ChatGPT活用（4ページ）
5. **第4章** → 最終チェック＆まとめ

または、目次から気になる項目を直接選択できます。

## **共通項**
- **ヘッダー**：セクション番号、Indexへのリンク、Sec.Topへのリンク、ページ送り
- **フッター**：前後のページナビゲーション、ページ番号、進捗バー
- **JavaScriptインタラクション**：
  - ページトランジション
  - 画像モーダル表示
  - スライドナビゲーション（キーボード・フリック操作）
- **未実装項目**
- ページ遷移の間に演出を入れる

## **各種CSSの役割**

1.common.css
トップページ、及び各章の目次ページの統一感の為
（ **レベル0** **レベル1**）
2.各章名_section.css
各章内のセクションの統一感を出すため。
 （**レベル2**）
3.ページ名.css
そのページだけのCSS。できる限り避ける。
（**レベル3**）
## **各種JSの役割**
1.index.js
各ページから
- ページトランジション
- 画像モーダル表示
- スライドナビゲーション（キーボード・フリック操作）
を参照

2.ページ名.js
そのページのみのJS。