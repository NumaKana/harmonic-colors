# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

**Harmonic Colors** は、コード進行を色彩とビジュアルエフェクトで表現する音楽視覚化Webアプリケーションです。音楽的な和声（キー、コード、テンション）をHSL色空間を使用した視覚的な色システムにマッピングします。

ユーザーができること:
- 音楽のキー（メジャー/マイナー）を選択
- ダイアトニックコードパレットからコード進行を構築
- 2色マーブルシステム＋パーティクルエフェクトでコードを視覚化
- Web Audio APIを通じてコード進行を聴く

## 開発コマンド

### 基本コマンド
```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動 (localhost:3000で実行)
npm run dev

# 型チェック（ビルドなし）
npm run lint

# プロダクションビルド
npm run build

# プロダクションビルドのプレビュー
npm run preview
```

## コアアーキテクチャ

### 色彩システムの設計

このプロジェクトは、音楽理論に基づいた独自の**2色マーブル視覚化**システムを実装しています：

**色1（調ベース色）**: 主調/キーを表現
- 色相: 主音を12音色相環にマッピング（C=0°, C#=30°, D=60°など）
- 明度: メジャーキー = 約62%、マイナーキー = 約42%
- 彩度: 約75%
- 実装: `src/utils/colorGenerator.ts:generateKeyColor()`

**色2（コードベース色）**: 和声機能を表現
- 色相: 色1から和声機能に基づいて調整
  - トニック: ±0°
  - サブドミナント: +15°
  - ドミナント: +30°
- 明度: 和声機能とコード種類によって変化
- 実装: `src/utils/colorGenerator.ts:generateChordColor()`

**マーブル比率**: 色1と色2の混合比率
- トニックコード: 色1が70%、色2が30%
- サブドミナント: 50/50
- ドミナント: 色1が30%、色2が70%
- 実装: `src/utils/colorGenerator.ts:getMarbleRatio()`

**テンションパーティクル**（計画中）: テンション音（9th、11th、13th、オルタード）を表現する視覚的粒子

### 和声分析システム

アプリケーションはコードを分析し、キー内での和声機能を判定します：

- **入力**: Chord（ルート、種類）+ Key（主音、モード）
- **出力**: 和声機能（トニック/サブドミナント/ドミナント）+ ダイアトニック判定
- **実装**: `src/utils/harmonicAnalysis.ts`
  - `analyzeHarmonicFunction()`: ローマ数字を含む完全な分析を返す
  - `getHarmonicFunctionType()`: 和声機能タイプのみを返す
- メジャーとマイナー両モードをサポートし、適切なスケールディグリー分析を実施

### コンポーネント構造

アプリはReactの状態管理を使用したシングルページアーキテクチャです：

**App.tsx**: ルートコンポーネント
- グローバル状態を管理: `selectedKey`、`chordProgression`、`currentChordIndex`
- 入力コントロールと視覚化の間のデータフローを調整

**主要コンポーネント**:
- `KeySelector`: 音楽のキー（メジャー/マイナー）を選択するドロップダウン
- `ChordPalette`: 選択したキーのダイアトニックコードを表示、進行への追加が可能
- `ChordSequence`: 現在のコード進行を表示、削除が可能
- `VisualizationCanvas`: Three.js/React Three Fiberを使用して視覚表現をレンダリング

### 型システム

コア型は `src/types/index.ts` で定義されています：

```typescript
Note: 'C' | 'C#' | 'D' | ... | 'B'
ChordQuality: 'major' | 'minor' | 'diminished' | 'augmented'
Chord: { root, quality, seventh?, tensions[], alterations[], duration }
Key: { tonic, mode }
ColorHSL: { hue, saturation, lightness }
ChordColor: { baseColor, chordColor, marbleRatio, particles[] }
```

### ダイアトニックコード生成

`src/utils/diatonic.ts` モジュールはスケールに適したコードを生成します：
- メジャーキー: I, ii, iii, IV, V, vi, vii°
- マイナーキー: i, ii°, III, iv, v, VI, VII（ナチュラルマイナー）
- 各スケールディグリーに適切な種類を持つ、正しく型付けされた `Chord` オブジェクトを返す

## 技術スタック

- **TypeScript** (strictモード有効)
- **React 19** (hooks使用)
- **Vite** (開発サーバーはポート3000)
- **Three.js** + **@react-three/fiber** + **@react-three/drei** (3D視覚化)
- **Tone.js** (Web Audio API操作用、計画中)

## プロジェクトフェーズ状況

プロジェクトは段階的な開発ロードマップに従っています：

**フェーズ1（MVP）**: 基本的な色表示とコード再生
**フェーズ2**: マーブルパターン実装とアニメーション
**フェーズ3**: テンション用のカラースプレーパーティクルシステム
**フェーズ4**: ノンダイアトニックコード対応（現在はダイアトニックコードのみ対応）

現在のステータス: **フェーズ1-2**（基本的な視覚化が実装済み）

## 設計思想

1. **音楽理論ファースト**: すべての色決定は音楽理論（和声機能、スケールディグリー、テンション分析）に基づく

2. **機械的な色割り当て**: 色はアルゴリズムで決定され、主観的な「感情的」マッピングには基づかない

3. **視覚的階層**:
   - キー（色1）= 基盤/背景
   - 和声機能（色2 + マーブル比率）= アクティブ要素
   - テンション（パーティクル）= 装飾的追加要素

4. **転調の明確性**: キー変化は視覚的に劇的（色相シフト）、一方でキー内のコード変化はより微妙（明度/比率シフト）

## 重要なコンテキスト

### 日本語ドキュメント

設計議論と仕様書は日本語で書かれています：
- `docs/design-discussion.md`: 完全な設計根拠と経緯
- `docs/specification.md`: 詳細な技術仕様

これらのドキュメントが権威ある設計決定を含んでいます。色アルゴリズムや和声分析に変更を加える際は、これらの仕様を参照してください。

### 色空間の制約

システムは特定の範囲を持つHSL色空間を使用します：
- ダイアトニックコードの色相調整: キー色から±30°に制限
- 明度の境界: 視認性を確保するため20-80%
- 彩度: 通常70-95%

これらの範囲は視覚的一貫性を保証し、広範な設計議論に基づいているため、違反しないでください。

### 和声機能のエッジケース

- マイナーキーでは、Vはメジャー（ハーモニックマイナー）またはマイナー（ナチュラルマイナー）の場合がある
- メジャーのiiiとviは「トニック代理」として機能
- ノンダイアトニックコードはデフォルトでトニック機能だが、`isDiatonic: false` を設定

## ファイル構成

```
src/
  types/index.ts           # コアTypeScript型定義
  utils/
    colorGenerator.ts      # 色1、色2、マーブル比率の生成
    harmonicAnalysis.ts    # 和声機能分析（I、IV、Vなど）
    diatonic.ts           # キーのダイアトニックコード生成
  components/
    App.tsx               # メインアプリコンテナ
    KeySelector.tsx       # キー選択UI
    ChordPalette.tsx      # ダイアトニックコードパレット
    ChordSequence.tsx     # コード進行表示
    VisualizationCanvas.tsx  # Three.js視覚化

docs/
  specification.md        # 完全な技術仕様（日本語）
  design-discussion.md    # 設計根拠（日本語）
  development-roadmap.md  # 開発フェーズ
```

## 開発時の注意事項

- TypeScriptのstrictモードが有効 - すべてのコードは完全に型付けされている必要があります
- 開発時にReact strict modeが有効
- プロジェクトはESモジュールを使用（package.jsonで`"type": "module"`）
- Viteが開発中のホットモジュールリプレースメントを処理
- 開発を始めるときは必ずbranchを切る
- issueに対応したPRを作成するときはissue numberを末尾につける
