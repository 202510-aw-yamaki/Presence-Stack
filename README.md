# Presence-Stack

## Page Transition

- `js/page-transition.js` が通常の内部リンクをフックし、2秒のローディング演出後に遷移します。
- 演出中の背面プレビューは `iframe` に実際の遷移先ページを読み込んで表示します。`link rel="prefetch"` と `fetch` はウォームアップ用途で、環境によっては効かなくても動作します。
- 除外対象は、同一ページ内アンカー、`mailto:`, `tel:`, `javascript:`, 外部リンク、`target="_blank"`, `download` 属性付きリンクです。
- フリック遷移は `js/common-navigation.js` から同じトランジションを呼び出します。
- 将来キャラクターを追加する場合は、オーバーレイ内の `.page-transition-character` レイヤーに 1 枚絵またはスプライト制御を差し込んでください。
