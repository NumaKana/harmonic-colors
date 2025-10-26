# Phase 2 実装計画

**作成日**: 2025-10-25
**目標**: ビジュアル強化 - マーブルパターンとアニメーション機能の実装

---

## Phase 2 Issue一覧

### 既存のissue（ロードマップより）
| Issue | タイトル | 優先度 | 依存関係 |
|-------|---------|--------|----------|
| #8 | Three.js統合とシェーダーセットアップ | 高 | なし |
| #9 | Perlinノイズマーブルパターンの実装 | 高 | #8 |
| #10 | スムースグラデーションアニメーションの実装 | 中 | #8 |
| #14 | メトロノーム機能の実装 | 中 | なし |

### 新規issue（issue #7で作成）
| Issue | タイトル | 優先度 | 依存関係 |
|-------|---------|--------|----------|
| #22 | 小節ベース表示UI | 低 | #23 |
| #23 | コード長さ選択機能 | 中 | なし |
| #24 | Three.js VisualizationCanvas実装 | 高 | なし |
| #25 | コード進行タイムライン表示 | 高 | #24, #23 |

---

## Issue整理と統合

### 🔍 重複・統合が必要なissue

#### Three.js関連の重複
- **#8**: Three.js統合とシェーダーセットアップ (旧)
- **#24**: Three.js VisualizationCanvas実装 (新)

**判断**: これらは同じ内容です。**#24を使用し、#8をクローズまたは統合**すべきです。

#### マーブルパターン関連
- **#9**: Perlinノイズマーブルパターンの実装
- **#10**: スムースグラデーションアニメーションの実装

**判断**: これらは密接に関連していますが、別々に実装可能です。
- #9: マーブル模様の静的実装
- #10: コード変化時のアニメーション

---

## 📋 推奨実装順序

Phase 2を**3つのサブフェーズ**に分けます：

### **サブフェーズ 2.1: コア機能拡張**（音楽的機能）
優先度: 高
期間目安: 1-2週間

1. **#23: コード長さ選択機能** ⭐
   - 理由: 音楽的に重要、他の機能の基礎
   - 依存: なし
   - 影響範囲: ChordPalette, ChordSequence, PlaybackControls
   - 実装コスト: 小～中

2. **#14: メトロノーム機能** ⭐
   - 理由: ユーザー要望、Phase 1から計画済み
   - 依存: なし
   - 影響範囲: PlaybackControls, audioEngine
   - 実装コスト: 小

3. **#22: 小節ベース表示UI**
   - 理由: #23と組み合わせで真価を発揮
   - 依存: #23（コード長さが決まっていると実装しやすい）
   - 影響範囲: ChordSequence
   - 実装コスト: 中

---

### **サブフェーズ 2.2: Three.js基盤構築**（ビジュアル基盤）
優先度: 高
期間目安: 2-3週間

4. **#24: Three.js VisualizationCanvas実装** ⭐⭐⭐（最重要）
   - 理由: Phase 2のビジュアル強化の基盤
   - 依存: なし（ただしサブフェーズ2.1完了後を推奨）
   - 影響範囲: VisualizationCanvas（大規模リファクタリング）
   - 実装コスト: 大
   - 注意: #8をクローズまたは統合

5. **#9: Perlinノイズマーブルパターンの実装** ⭐⭐
   - 理由: 仕様書の中核ビジュアル機能
   - 依存: #24（Three.js基盤が必要）
   - 影響範囲: VisualizationCanvas（シェーダー）
   - 実装コスト: 中～大

6. **#10: スムースグラデーションアニメーション** ⭐
   - 理由: マーブルパターンに動きを与える
   - 依存: #24, #9
   - 影響範囲: VisualizationCanvas（アニメーションロジック）
   - 実装コスト: 中

---

### **サブフェーズ 2.3: タイムライン表示**（高度なビジュアル）
優先度: 中
期間目安: 2-3週間

7. **#25: コード進行タイムライン表示** ⭐⭐
   - 理由: ユーザー要望、進行全体の可視化
   - 依存: #24（Three.js基盤）, #23（コード長さ）
   - 影響範囲: VisualizationCanvas（新しい表示モード）
   - 実装コスト: 大

---

## 🎯 詳細実装計画

### サブフェーズ 2.1: コア機能拡張

#### Step 1: #23 コード長さ選択機能
**目標**: 全音符～8分音符の選択を可能に

**実装タスク**:
1. ChordPaletteに音符長さセレクターを追加
   - ドロップダウンまたはボタングループUI
   - デフォルト値: 4拍（全音符）
2. 選択した長さをChord.durationに反映
3. ChordSequenceで長さを視覚表示
   - 音符記号: ♩（4分音符）, ♪（8分音符）, 𝅗𝅥（2分音符）, 𝅝（全音符）
   - または数値表示: "4拍", "2拍", "1拍", "0.5拍"
4. 追加後の長さ編集機能（オプション）

**技術的ポイント**:
- Chordタイプは既にdurationフィールドを持っている
- audioEngine.tsは可変durationに対応済み
- UIのみの変更で実装可能

**テスト**:
- 各音符長さの選択が動作
- 再生時に正しい長さで音が鳴る
- ChordSequenceの表示が正確

---

#### Step 2: #14 メトロノーム機能
**目標**: 再生中にクリック音を追加

**実装タスク**:
1. audioEngineにメトロノーム用のクリック音シンセを追加
   - 1拍目: 高い音（Metal Synth + 高周波）
   - 2-4拍目: 低い音（Metal Synth + 低周波）
2. Tone.Loopでクリック音をスケジュール
3. PlaybackControlsにON/OFFトグルを追加
4. ボリューム調整（オプション）

**技術的ポイント**:
```typescript
// audioEngine.ts
private metronome: Tone.MetalSynth | null = null;
private metronomeLoop: Tone.Loop | null = null;

enableMetronome(bpm: number) {
  this.metronomeLoop = new Tone.Loop((time) => {
    const beat = Math.floor(time * bpm / 60) % 4;
    const freq = beat === 0 ? 880 : 440; // A5 or A4
    this.metronome!.triggerAttackRelease(freq, "16n", time);
  }, "4n");
}
```

**テスト**:
- 正確な拍でクリック音が鳴る
- 1拍目と他の拍の音が区別できる
- ON/OFF切替が動作
- BPM変更に追従

---

#### Step 3: #22 小節ベース表示UI
**目標**: 楽譜のような小節区切り表示

**実装タスク**:
1. ChordSequenceをCSSグリッド/Flexboxでレイアウト変更
2. 4拍を1小節として計算
3. 小節ごとに区切り線（縦線）を追加
4. 各コードの幅をdurationに応じて調整
5. 小節番号の表示（オプション）

**技術的ポイント**:
```typescript
// 小節計算例
const measures: Chord[][] = [];
let currentMeasure: Chord[] = [];
let currentBeats = 0;

chords.forEach(chord => {
  if (currentBeats + chord.duration > 4) {
    measures.push(currentMeasure);
    currentMeasure = [chord];
    currentBeats = chord.duration;
  } else {
    currentMeasure.push(chord);
    currentBeats += chord.duration;
  }
});
```

**CSS例**:
```css
.measure {
  display: flex;
  border-right: 2px solid #666;
  padding-right: 0.5rem;
}

.chord-item {
  flex: 0 0 auto;
  width: calc(var(--duration) * 50px); /* 1拍 = 50px */
}
```

**テスト**:
- 小節区切り線が正しい位置に表示
- コードの幅が長さに応じて変化
- 4拍を超えると次の小節へ

---

### サブフェーズ 2.2: Three.js基盤構築

#### Step 4: #24 Three.js VisualizationCanvas実装
**目標**: CSS gradientをThree.js/WebGLで再現

**実装タスク**:
1. React Three Fiberのセットアップ
   ```tsx
   import { Canvas } from '@react-three/fiber';
   import { OrbitControls } from '@react-three/drei';
   ```

2. シェーダーマテリアルで縦グラデーション実装
   - Vertex Shader: 基本的な頂点変換
   - Fragment Shader: 色1と色2のグラデーション

3. HSL → RGB変換をGLSLで実装
   ```glsl
   vec3 hsl2rgb(vec3 hsl) {
     // HSL to RGB conversion in GLSL
   }
   ```

4. PlaneGeometryに適用
5. カメラ設定（OrthographicCamera推奨）
6. パフォーマンス計測（Stats.jsまたはReact Three Fiber Performance）
7. WebGL非対応時のフォールバック（CSS gradientに戻す）

**技術的ポイント**:
- 既存のgenerateKeyColor(), generateChordColor()の結果をuniformとして渡す
- ShaderMaterialでカスタムシェーダーを使用
- 60fpsを維持（requestAnimationFrame）

**テスト**:
- Three.jsで現在と同じ見た目
- 60fps以上で動作
- フォールバックが機能

---

#### Step 5: #9 Perlinノイズマーブルパターン
**目標**: 2色を有機的に混合

**実装タスク**:
1. Perlinノイズ関数をGLSLで実装
   - simplex noise または classic perlin noise
   - 2D or 3D noise

2. Fragment Shaderで色混合
   ```glsl
   float noise = perlin(uv * scale + time * speed);
   float mixRatio = marbleRatio + noise * noiseStrength;
   vec3 finalColor = mix(color1, color2, mixRatio);
   ```

3. uniformパラメータ
   - `marbleRatio`: 基本の混合比率（0.3, 0.5, 0.7）
   - `scale`: ノイズのスケール
   - `speed`: アニメーション速度
   - `noiseStrength`: ノイズの強さ

4. マーブル比率の動的調整
   - トニック: 0.7（色1が70%）
   - サブドミナント: 0.5
   - ドミナント: 0.3（色2が70%）

5. パラメータ調整UI（開発用）
   - dat.GUIまたはleva

**テスト**:
- 美しいマーブル模様
- 和声機能に応じて比率が変化
- アニメーションが滑らか

---

#### Step 6: #10 スムースグラデーションアニメーション
**目標**: コード変化時に0.5秒で遷移

**実装タスク**:
1. アニメーション状態管理（React state）
   ```typescript
   const [animating, setAnimating] = useState(false);
   const [fromColors, setFromColors] = useState<[ColorHSL, ColorHSL]>();
   const [toColors, setToColors] = useState<[ColorHSL, ColorHSL]>();
   ```

2. 補間関数（LERP）
   ```typescript
   function lerpColor(from: ColorHSL, to: ColorHSL, t: number): ColorHSL {
     return {
       hue: lerp(from.hue, to.hue, t),
       saturation: lerp(from.saturation, to.saturation, t),
       lightness: lerp(from.lightness, to.lightness, t),
     };
   }
   ```

3. イージング関数
   - easeInOutCubic, easeInOutQuad など

4. useFrameフック（React Three Fiber）
   ```tsx
   useFrame((state, delta) => {
     if (animating) {
       t += delta / 0.5; // 0.5秒で完了
       const currentColor = lerpColor(from, to, easeInOut(t));
       // uniformを更新
     }
   });
   ```

**テスト**:
- コード変化時に滑らかに遷移
- 0.5秒で完了
- 視覚的に自然

---

### サブフェーズ 2.3: タイムライン表示

#### Step 7: #25 コード進行タイムライン表示
**目標**: 左から右へ流れる色遷移

**実装タスク**:
1. タイムライン専用のThree.jsシーン作成
2. 各コードを色付きPlaneGeometryとして表現
   - width = duration（1拍 = 一定のワールド単位）
   - height = 固定
   - 色 = generateChordColor()の結果

3. 再生位置インジケーター
   - 縦線（LineGeometry）
   - カメラに追従

4. スクロールアニメーション
   - カメラ位置を時間に応じて移動
   - 現在のコードと1つ前のコードが見える

5. モード切替
   - **再生モード**: カメラが移動、現在位置中心
   - **プレビューモード**: 全体を俯瞰、すべてのコードが見える

6. UI
   - モード切替ボタン
   - ズームスライダー（オプション）

**技術的ポイント**:
```typescript
// コードセグメント生成
chords.map((chord, i) => {
  const color = generateChordColor(chord, key, keyColor);
  const width = chord.duration * BEAT_WIDTH;
  const position = accumulatedWidth;

  return (
    <mesh position={[position, 0, 0]}>
      <planeGeometry args={[width, HEIGHT]} />
      <shaderMaterial
        uniforms={{ color1: ..., color2: ... }}
      />
    </mesh>
  );
});
```

**テスト**:
- 再生中に左から右へ色が流れる
- インジケーターが正確
- プレビューモードで全体が見える
- 60fpsを維持

---

## 🗓️ 推奨スケジュール

| 期間 | サブフェーズ | Issue | 期間目安 |
|------|-------------|-------|----------|
| Week 1 | 2.1 | #23 コード長さ選択 | 2-3日 |
| Week 1 | 2.1 | #14 メトロノーム | 1-2日 |
| Week 2 | 2.1 | #22 小節ベース表示 | 3-4日 |
| Week 3-4 | 2.2 | #24 Three.js基盤 | 5-7日 |
| Week 4-5 | 2.2 | #9 マーブルパターン | 4-5日 |
| Week 5 | 2.2 | #10 アニメーション | 2-3日 |
| Week 6-7 | 2.3 | #25 タイムライン | 5-7日 |

**合計期間**: 約7週間（1.5-2ヶ月）

---

## 📝 実装開始前の準備

### 1. Issue整理
- [ ] #8と#24を統合（#24を使用、#8をクローズ）
- [ ] 各issueに詳細な実装計画を追記
- [ ] マイルストーン「Phase 2」を作成し、全issueを紐付け

### 2. 技術調査
- [ ] React Three Fiberのベストプラクティス調査
- [ ] GLSLシェーダーのサンプルコード収集
- [ ] Perlinノイズライブラリの選定（glsl-noise推奨）
- [ ] パフォーマンス計測ツールの選定

### 3. 開発環境
- [ ] Three.js DevToolsのインストール（オプション）
- [ ] Shader Linter/Formatterの設定
- [ ] パフォーマンスモニタリングの準備

---

## ✅ 最初に実装すべきissue

**推奨**: **#23 コード長さ選択機能**

**理由**:
1. 実装コストが低い（UIのみの変更）
2. 他の機能（#22, #25）の基盤となる
3. ユーザー体験が即座に向上
4. Phase 1の知識だけで実装可能（Three.js不要）
5. 音楽的に重要な機能

**次のステップ**:
1. #23実装 → テスト → PR
2. #14実装 → テスト → PR
3. #22実装 → テスト → PR
4. **サブフェーズ2.1完了**
5. #24実装開始（ここからビジュアル強化本番）

---

## 💡 実装上の注意点

### パフォーマンス
- Three.jsシーンは常に60fpsを維持
- React再レンダリングを最小化（React.memo, useMemo）
- シェーダーは可能な限りシンプルに

### 互換性
- WebGL非対応環境のフォールバック必須
- モバイルデバイスでのパフォーマンス確認

### コード品質
- TypeScript strictモードを維持
- ユニットテスト（必要に応じて）
- コンポーネントの責務を明確に

### ドキュメント
- 各PR時にCHANGELOG.md更新（オプション）
- 複雑なシェーダーにはコメント必須
- 新しい型定義は`src/types/index.ts`に追加

---

## 🎯 Phase 2完了の定義

Phase 2は以下の条件を満たした時点で完了とします:

✅ サブフェーズ2.1の全issue（#23, #14, #22）が完了
✅ サブフェーズ2.2の全issue（#24, #9, #10）が完了
✅ サブフェーズ2.3のissue（#25）が完了
✅ すべての機能が60fpsで動作
✅ 型チェックにエラーがない
✅ ドキュメントが更新されている
✅ PHASE_2_COMPLETE.mdを作成

その後、Phase 3（テンションパーティクル）に進みます。
