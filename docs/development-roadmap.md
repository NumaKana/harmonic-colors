# Harmonic Colors - 開発ロードマップ

## 開発の進め方

1機能ごとにGitHub Issueを作成し、開発を進めます。
各Issueは以下の形式で管理：
- タイトル: `[Phase X] 機能名`
- ラベル: `phase-1`, `phase-2`, `phase-3`, `phase-4`
- マイルストーン: 各フェーズごと

---

## Phase 1: MVP（最小限の動作）

### 目標
基本的な色表示とコード再生機能を実装

### Issue一覧

#### #1 [Phase 1] プロジェクトセットアップ
**説明**: 開発環境の構築
**タスク**:
- [x] Vite + React + TypeScript環境構築
- [x] 必要なライブラリのインストール（Three.js, Tone.js）
- [x] 基本的なプロジェクト構造の作成
- [x] 型定義ファイルの作成

**完了条件**: `npm run dev` でアプリケーションが起動する

---

#### #2 [Phase 1] キー選択UIの実装
**説明**: ユーザーがキー（調）を選択できるUIコンポーネントを作成

**タスク**:
- [ ] `KeySelector` コンポーネントの作成
- [ ] メジャーキー12種類のドロップダウン実装
- [ ] マイナーキー12種類のドロップダウン実装
- [ ] 選択されたキーの状態管理（React State）
- [ ] UIスタイリング

**技術詳細**:
```typescript
// src/components/KeySelector.tsx
interface KeySelectorProps {
  selectedKey: Key;
  onKeyChange: (key: Key) => void;
}
```

**完了条件**:
- ドロップダウンから24種類のキーを選択可能
- 選択したキーが状態として保持される

---

#### #3 [Phase 1] コード入力UIの実装（基本版）
**説明**: ダイアトニックコードを選択・追加できるUIを作成

**タスク**:
- [ ] `ChordPalette` コンポーネントの作成
  - 選択されたキーに応じたダイアトニックコードボタンを表示
  - メジャーキー: I, ii, iii, IV, V, vi, vii°
  - マイナーキー: i, ii°, III, iv, v, VI, VII
- [ ] `ChordSequence` コンポーネントの作成
  - 追加されたコードを横並びで表示
  - 各コードに削除ボタン
  - ドラッグ&ドロップで順序変更（オプション）
- [ ] コード進行の状態管理
- [ ] UIスタイリング

**技術詳細**:
```typescript
// src/utils/diatonic.ts
// 選択されたキーからダイアトニックコードを生成
function getDiatonicChords(key: Key): Chord[]
```

**完了条件**:
- ダイアトニックコードをクリックで追加
- コード進行リストに表示
- 削除可能

---

#### #4 [Phase 1] 色生成ロジックの実装（基本版）
**説明**: 色1（調ベース）と色2（コードベース）の色相を計算する関数を実装

**タスク**:
- [ ] `src/utils/colorGenerator.ts` の作成
- [ ] 色1の生成関数: `generateKeyColor(key: Key, hueRotation: number): ColorHSL`
  - 調の主音を色相環にマッピング（C=0度）
  - メジャー/マイナーで明度を調整
- [ ] 色2の生成関数: `generateChordColor(chord: Chord, key: Key, baseColor: ColorHSL): ColorHSL`
  - 機能和声を判定
  - 色相を±30度の範囲で調整
  - 明度を調整
- [ ] 機能和声分析関数: `analyzeHarmonicFunction(chord: Chord, key: Key): HarmonicFunction`
- [ ] ユニットテストの作成

**技術詳細**:
```typescript
// 色相マッピング
const noteToHue: Record<Note, number> = {
  'C': 0, 'C#': 30, 'D': 60, 'D#': 90,
  'E': 120, 'F': 150, 'F#': 180,
  'G': 210, 'G#': 240, 'A': 270, 'A#': 300, 'B': 330
};
```

**完了条件**:
- キーとコードから正確にHSL色が生成される
- 機能和声が正しく判定される

---

#### #5 [Phase 1] 単色表示コンポーネントの実装
**説明**: 生成された色を画面に表示するシンプルなビジュアルコンポーネント

**タスク**:
- [ ] `VisualizationCanvas` コンポーネントの作成
- [ ] HSL色をCSS形式に変換する関数
- [ ] 単色または2色の縦グラデーション表示
- [ ] 800x600pxの固定サイズ表示エリア
- [ ] 現在のコード情報の表示（コード名、機能和声）

**技術詳細**:
```typescript
// src/components/VisualizationCanvas.tsx
interface VisualizationCanvasProps {
  color1: ColorHSL;
  color2: ColorHSL;
  currentChord?: Chord;
}
```

**完了条件**:
- 選択したキー・コードに応じて色が変化
- 視覚的に色の違いが確認できる

---

#### #6 [Phase 1] 基本的な音声再生の実装
**説明**: Tone.jsを使用してコードを音声で再生

**タスク**:
- [ ] `src/utils/audioEngine.ts` の作成
- [ ] Tone.jsのセットアップ
- [ ] コードから構成音を計算する関数
  - ルート、3度、5度、7度の音程計算
- [ ] シンセサイザーの初期化
- [ ] 単一コードの再生機能
- [ ] 再生/停止機能

**技術詳細**:
```typescript
// Tone.jsでの再生例
import * as Tone from 'tone';

const synth = new Tone.PolySynth(Tone.Synth).toDestination();

function playChord(chord: Chord, duration: number) {
  const notes = getChordNotes(chord); // ['C4', 'E4', 'G4']
  synth.triggerAttackRelease(notes, duration);
}
```

**完了条件**:
- コードをクリックすると音が鳴る
- 音の長さを指定可能

---

#### #7 [Phase 1] 再生コントロールUIの実装
**説明**: コード進行を順番に再生する機能

**タスク**:
- [ ] `PlaybackControls` コンポーネントの作成
  - 再生ボタン
  - 停止ボタン
  - 音量スライダー
- [ ] BPM入力フィールド（40-240の範囲）
- [ ] コード進行の順次再生ロジック
- [ ] 再生中の現在コードのハイライト表示

**技術詳細**:
```typescript
// BPMから1拍の長さを計算
const beatDuration = 60 / bpm; // 秒
```

**完了条件**:
- 再生ボタンでコード進行が順次再生
- 停止ボタンで再生停止
- BPMに応じた速度で再生

---

#### #8 [Phase 1] MVP統合とテスト
**説明**: Phase 1の全機能を統合し、動作確認

**タスク**:
- [ ] 全コンポーネントを `App.tsx` に統合
- [ ] レイアウトの調整
- [ ] データフローの確認
- [ ] バグ修正
- [ ] ドキュメント更新

**完了条件**:
- キー選択 → コード追加 → 色表示 → 音声再生の一連の流れが動作
- UIが使いやすい

---

## Phase 2: ビジュアル強化

### 目標
マーブルパターンとアニメーション機能の実装

### Issue一覧

#### #9 [Phase 2] Three.js統合とシェーダーセットアップ
**説明**: React Three Fiberの統合とシェーダー環境の構築

**タスク**:
- [ ] `VisualizationCanvas` をThree.jsベースに移行
- [ ] `@react-three/fiber` と `@react-three/drei` のセットアップ
- [ ] カスタムシェーダーマテリアルの基本実装
- [ ] パフォーマンス計測（FPS表示）

**技術詳細**:
```typescript
import { Canvas } from '@react-three/fiber';

// シェーダーでの色混合の準備
const marbleShader = {
  vertexShader: `...`,
  fragmentShader: `...`
};
```

**完了条件**:
- Three.jsで色を表示可能
- 60fps以上で動作

---

#### #10 [Phase 2] Perlinノイズマーブルパターンの実装
**説明**: 2色を有機的に混合するマーブルエフェクト

**タスク**:
- [ ] Perlinノイズ生成関数の実装（GLSL）
- [ ] 2色混合シェーダーの作成
- [ ] マーブル比率の動的調整機能
  - トニック: 色1が70%
  - サブドミナント: 50%
  - ドミナント: 30%
- [ ] マーブルパターンのアニメーション（ゆっくり流れる）
- [ ] パラメータ調整UI（開発用）

**技術詳細**:
```glsl
// Fragment Shader例
float noise = perlin(uv * scale + time * speed);
vec3 finalColor = mix(color1, color2, noise * ratio);
```

**完了条件**:
- 美しいマーブル模様が表示される
- コードの機能に応じて比率が変化

---

#### #11 [Phase 2] スムースグラデーションアニメーションの実装
**説明**: コード間の0.5秒遷移アニメーション

**タスク**:
- [ ] アニメーション状態管理
- [ ] 色1 → 新色1への補間
- [ ] 色2 → 新色2への補間
- [ ] マーブル比率の補間
- [ ] イージング関数の適用（easeInOutなど）
- [ ] アニメーション完了時のコールバック

**技術詳細**:
```typescript
// 線形補間（LERP）
function lerpColor(from: ColorHSL, to: ColorHSL, t: number): ColorHSL {
  return {
    hue: lerp(from.hue, to.hue, t),
    saturation: lerp(from.saturation, to.saturation, t),
    lightness: lerp(from.lightness, to.lightness, t),
  };
}
```

**完了条件**:
- コード変化時に滑らかにグラデーション
- 0.5秒で遷移完了
- 視覚的に自然

---

#### #12 [Phase 2] 明度・彩度調整システムの実装
**説明**: 色2の明度・彩度を機能和声に応じて調整

**タスク**:
- [ ] `colorGenerator.ts` の拡張
- [ ] 明度調整ロジックの実装
  - メジャーコード: トニック+10%, サブドミナント+5%, ドミナント-5%
  - マイナーコード: トニック±0%, サブドミナント-5%, ドミナント-10%
- [ ] 彩度調整ロジックの実装（テンション用）
- [ ] 範囲制限（20-80%）の適用

**完了条件**:
- 機能和声に応じて明度が変化
- 色の違いが視覚的に明確

---

#### #13 [Phase 2] Tone.js音声品質向上
**説明**: より音楽的な音色とボイシングの実装

**タスク**:
- [ ] ピアノ風音色の実装（サンプラーまたはFM合成）
- [ ] パッド系音色の実装
- [ ] ボイシングの改善（オクターブ配置の最適化）
- [ ] リバーブ・ディレイエフェクトの追加
- [ ] 音色選択UI

**技術詳細**:
```typescript
import * as Tone from 'tone';

const synth = new Tone.PolySynth(Tone.FMSynth, {
  harmonicity: 3,
  modulationIndex: 10,
  envelope: {
    attack: 0.01,
    decay: 0.5,
    sustain: 0.2,
    release: 1
  }
}).toDestination();

const reverb = new Tone.Reverb(2).toDestination();
synth.connect(reverb);
```

**完了条件**:
- 音色が音楽的で心地よい
- 音色を切り替え可能

---

#### #14 [Phase 2] タイミング精度の向上
**説明**: BPMとビート同期の正確な実装

**タスク**:
- [ ] `Tone.Transport` を使用したスケジューリング
- [ ] 各コードの拍数設定機能
- [ ] メトロノーム機能（オプション）
- [ ] ループ再生機能
- [ ] 再生位置の視覚的フィードバック

**技術詳細**:
```typescript
Tone.Transport.bpm.value = bpm;
Tone.Transport.scheduleRepeat((time) => {
  playChord(currentChord, time);
}, '4n'); // 4分音符ごと
```

**完了条件**:
- BPMが正確
- 拍節感が安定

---

## Phase 3: 完成版

### 目標
カラースプレー（テンション表示）と設定機能の実装

### Issue一覧

#### #15 [Phase 3] テンションノート入力UIの実装
**説明**: 7th, 9th, 11th, 13thとオルタードテンションの入力機能

**タスク**:
- [ ] `ChordEditor` コンポーネントの作成
- [ ] テンション選択UI（チェックボックスまたはボタン）
  - 7th, maj7, m7
  - 9th, #9, ♭9
  - 11th, #11
  - 13th, ♭13
- [ ] ディミニッシュ/オーグメントコードの入力
- [ ] コード表記のパース（文字列 → Chord型）
- [ ] コード表記の生成（Chord型 → 文字列）

**技術詳細**:
```typescript
// コード表記例: "Cmaj7#11", "G7♭9"
function parseChordNotation(notation: string): Chord
function generateChordNotation(chord: Chord): string
```

**完了条件**:
- 複雑なコードを入力可能
- コード表記が正確

---

#### #16 [Phase 3] パーティクルシステムの実装
**説明**: カラースプレー（テンション粒子）のビジュアル実装

**タスク**:
- [ ] Three.jsのPoints/InstancedMeshでパーティクル実装
- [ ] テンションタイプごとの粒子色定義
  - 7th: 金色
  - 9th: 銀色
  - #9/♭9: 赤みがかった色
  - 11th: 青色
  - #11: 明るい青
  - 13th: 黄色
  - ♭13: オレンジ
- [ ] 粒子の密度・サイズの設定
- [ ] 浮遊アニメーション（ゆっくり上昇・回転）
- [ ] フェードイン/アウト

**技術詳細**:
```typescript
// src/components/ParticleSystem.tsx
interface ParticleSystemProps {
  particles: ParticleConfig[];
  isAnimating: boolean;
}
```

**完了条件**:
- テンションノートに応じて粒子が表示
- 美しく、きらびやか

---

#### #17 [Phase 3] パーティクル遷移アニメーション
**説明**: コード変化時の粒子のフェードイン/アウト

**タスク**:
- [ ] 新しいテンション粒子のフェードイン（0.3秒）
- [ ] 古いテンション粒子のフェードアウト（0.3秒）
- [ ] パーティクル数の動的調整
- [ ] GPU最適化（インスタンシング）

**完了条件**:
- 粒子遷移が滑らか
- パフォーマンスが良好（60fps維持）

---

#### #18 [Phase 3] 色相環回転調整UIの実装
**説明**: C音の色相角度を調整する設定機能

**タスク**:
- [ ] `Settings` コンポーネントの作成
- [ ] 色相回転角度の数値入力（0-359度）
- [ ] リアルタイムプレビュー
- [ ] 設定のLocalStorage保存
- [ ] デフォルト値へのリセット機能

**技術詳細**:
```typescript
const [hueRotation, setHueRotation] = useState(0);

useEffect(() => {
  localStorage.setItem('hueRotation', String(hueRotation));
}, [hueRotation]);
```

**完了条件**:
- 角度調整で全体の色相が回転
- 設定が保存される

---

#### #19 [Phase 3] 詳細設定パネルの実装
**説明**: マーブル比率、粒子密度などの調整機能

**タスク**:
- [ ] 設定パネルUIの作成（折りたたみ可能）
- [ ] マーブル比率の調整スライダー
  - トニック、サブドミナント、ドミナントごと
- [ ] 粒子密度の調整スライダー
- [ ] アニメーション速度の調整
- [ ] 設定のエクスポート/インポート（JSON）

**完了条件**:
- 各種パラメータを細かく調整可能
- 設定の保存・読み込み

---

#### #20 [Phase 3] UI/UXの洗練
**説明**: 全体的なデザイン改善とユーザビリティ向上

**タスク**:
- [ ] レスポンシブデザインの調整
- [ ] ダークモード対応
- [ ] アイコンの追加
- [ ] ツールチップ・ヘルプテキストの追加
- [ ] キーボードショートカット
  - Space: 再生/停止
  - ←/→: 前/次のコード
- [ ] エラーハンドリングとユーザーフィードバック

**完了条件**:
- UIが直感的で使いやすい
- デザインが洗練されている

---

#### #21 [Phase 3] パフォーマンス最適化
**説明**: 全体的なパフォーマンスチューニング

**タスク**:
- [ ] React.memoの適用（不要な再レンダリング防止）
- [ ] useMemo/useCallbackの活用
- [ ] Three.jsのオブジェクトプーリング
- [ ] シェーダーの最適化
- [ ] バンドルサイズの削減（Code Splitting）
- [ ] パフォーマンスプロファイリング

**完了条件**:
- 常に60fps以上
- 初回ロードが高速

---

## Phase 4: 拡張機能（オプション）

### 目標
さらなる機能追加と利便性向上

### Issue一覧

#### #22 [Phase 4] ノンダイアトニックコード入力機能（優先度：高）
**説明**: ダイアトニックコード以外の任意のコードを入力できるカスタムコード入力機能

**タスク**:
- [ ] `CustomChordBuilder` コンポーネントの作成
- [ ] ルート音選択UI（12音のドロップダウンまたはボタン）
- [ ] コードクオリティ選択UI
  - Major, Minor, Diminished, Augmented
  - sus2, sus4, 6th, add9 など
- [ ] セブンス選択UI
  - なし, 7, maj7, m7, m7♭5, dim7, aug7
- [ ] テンション選択UI（複数選択可）
  - ♭9, 9, #9
  - 11, #11
  - ♭13, 13
- [ ] 選択されたコードのプレビュー表示
- [ ] "Add Chord" ボタンでコード進行に追加
- [ ] 機能和声分析のノンダイアトニックコード対応
  - セカンダリードミナント検出
  - 借用和音（モーダルインターチェンジ）検出
  - 代理コード検出

**技術詳細**:
```typescript
// src/components/CustomChordBuilder.tsx
interface CustomChordBuilderProps {
  selectedKey: Key;
  onChordAdd: (chord: Chord) => void;
}

// 機能和声分析の拡張
function analyzeNonDiatonicFunction(chord: Chord, key: Key): HarmonicFunction {
  // セカンダリードミナント: V7/X
  // 借用和音: ♭VII, ♭VI など
  // 代理コード: ♭II7 (Tritone Substitution)
}
```

**UI設計例**:
```
┌─────────────────────────────────────────┐
│  Custom Chord Builder                   │
├─────────────────────────────────────────┤
│  Root:  [C ▼]                           │
│  Quality: ○ Major  ○ Minor  ○ Dim      │
│            ○ Aug    ○ sus2   ○ sus4    │
│  7th:   ○ None  ○ 7  ○ maj7  ○ m7     │
│  Tensions: ☐ ♭9  ☐ 9  ☐ #9            │
│            ☐ 11  ☐ #11                 │
│            ☐ ♭13 ☐ 13                  │
│  Preview: [G7♭9]                        │
│  [Add Chord to Progression]             │
└─────────────────────────────────────────┘
```

**完了条件**:
- 任意のルート音・クオリティ・テンションのコードを作成可能
- 作成したコードがコード進行に追加される
- 音声再生が正しく動作する
- 色生成が適切に機能する（ノンダイアトニックコードの機能判定）

**関連Issue**: #3（色生成ロジック）でノンダイアトニックコード対応の基礎実装済み

---

#### #29 [Phase 4] コード進行プリセット機能
**説明**: よくあるコード進行のテンプレート

**タスク**:
- [ ] プリセットデータの作成
  - カノン進行（I-V-vi-iii-IV-I-IV-V）
  - 王道進行（IV-V-iii-vi）
  - ブルース進行（I-I-I-I-IV-IV-I-I-V-IV-I-V）
  - その他10種類程度
- [ ] プリセット選択UI
- [ ] プリセットの適用機能

**完了条件**:
- プリセットを選択すると即座にコード進行が設定される

---

#### #23 [Phase 4] コード進行の保存・共有機能
**説明**: 作成したコード進行をファイルまたはURLで共有

**タスク**:
- [ ] コード進行のJSON形式エクスポート
- [ ] JSONファイルのインポート
- [ ] URLパラメータでのコード進行共有
  - Base64エンコード
- [ ] クリップボードへのコピー機能

**技術詳細**:
```typescript
// URL例
https://harmonic-colors.com/?progression=eyJrZXkiOi...
```

**完了条件**:
- 保存・読み込みが可能
- URLで共有可能

---

#### #30 [Phase 4] 動画・GIFエクスポート機能
**説明**: ビジュアルを動画やGIFとして保存

**タスク**:
- [ ] Canvas録画機能の実装（MediaRecorder API）
- [ ] GIFエンコーダーの統合（gif.jsなど）
- [ ] エクスポート設定UI（解像度、フレームレートなど）
- [ ] ダウンロード機能

**技術詳細**:
```typescript
const stream = canvas.captureStream(60); // 60fps
const recorder = new MediaRecorder(stream);
```

**完了条件**:
- MP4またはGIFでエクスポート可能
- 音声も含められる（オプション）

---

#### #31 [Phase 4] 拍子の変更対応
**説明**: 4/4以外の拍子に対応

**タスク**:
- [ ] 拍子選択UI（3/4, 5/4, 6/8など）
- [ ] 拍子に応じた再生ロジックの調整
- [ ] 視覚表現への拍子の反映（オプション）

**完了条件**:
- 各種拍子で正確に再生

---

#### #32 [Phase 4] 複雑なコードタイプ対応
**説明**: sus4, add9, 6thなどの対応

**タスク**:
- [ ] 新しいコードタイプの型定義拡張
- [ ] パース・生成ロジックの拡張
- [ ] 音声生成の対応
- [ ] 色生成ロジックの調整（必要に応じて）

**完了条件**:
- より多様なコードに対応

---

#### #33 [Phase 4] MIDIファイルインポート
**説明**: MIDIファイルからコード進行を自動解析

**タスク**:
- [ ] MIDIパーサーの統合（@tonejs/midi）
- [ ] 和音検出アルゴリズムの実装
- [ ] コード進行への変換
- [ ] ファイルアップロードUI

**技術詳細**:
```typescript
import { Midi } from '@tonejs/midi';

const midi = await Midi.fromUrl('file.mid');
const chords = extractChords(midi);
```

**完了条件**:
- MIDIファイルをアップロードするとコード進行が生成される

---

#### #34 [Phase 4] チュートリアル・ヘルプ機能
**説明**: 初回ユーザー向けガイド

**タスク**:
- [ ] チュートリアルUIの作成（ステップバイステップ）
- [ ] ヘルプモーダルの実装
- [ ] 使い方動画の埋め込み（オプション）
- [ ] FAQページ

**完了条件**:
- 初めてのユーザーでも迷わず使える

---

## 開発の優先順位

### 必須（Phase 1-3）
Phase 1-3は仕様書で定義された核となる機能です。順番に実装を進めます。

### オプション（Phase 4）
Phase 4は追加機能です。Phase 3完了後、必要に応じて実装します。

---

## 進捗管理

### GitHub Project
- プロジェクトボードを作成
- カラム: `To Do`, `In Progress`, `Review`, `Done`
- 各IssueをPhaseごとにマイルストーンで管理

### ブランチ戦略
```
main (本番)
  └─ develop (開発)
       ├─ feature/issue-2-key-selector
       ├─ feature/issue-3-chord-input
       └─ feature/issue-4-color-generation
```

### Pull Request
- 各Issue完了時にPR作成
- セルフレビューまたはペアレビュー
- CI/CD（将来的に導入）

---

**作成日**: 2025-10-22
**最終更新**: 2025-10-22
