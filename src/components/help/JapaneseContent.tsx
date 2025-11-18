const JapaneseContent = () => {
  return (
    <>
      <h2>Harmonic Colorsとは</h2>
      <p>
        Harmonic Colorsは、音楽のコード進行を色彩とビジュアルエフェクトで表現する
        視覚化Webアプリケーションです。
      </p>

      <h3>コンセプト</h3>
      <ul>
        <li>音楽理論に基づいた色彩システム</li>
        <li>キー（調）を基準色として表現</li>
        <li>和声機能（トニック・サブドミナント・ドミナント）を色の混合比率で表現</li>
        <li>テンションやオルタレーションをパーティクルで視覚化</li>
      </ul>

      <h3>色彩システムの特徴</h3>
      <p>
        <strong>1. Color 1（調ベース色）</strong>: 主調・キーを表現
      </p>
      <ul>
        <li>色相: 12音を色相環にマッピング（C=0°, C#=30°, D=60°...）</li>
        <li>明度: メジャーキー = 明るい（約62%）、マイナーキー = 暗い（約42%）</li>
        <li>彩度: 約75%</li>
      </ul>

      <p>
        <strong>2. Color 2（コードベース色）</strong>: 和声機能を表現
      </p>
      <ul>
        <li>トニック: 安定した色（色相調整なし）</li>
        <li>サブドミナント: 中間的な色（色相+15°）</li>
        <li>ドミナント: 緊張感のある色（色相+30°）</li>
        <li>明度: 和声機能とコード種類によって変化</li>
      </ul>

      <p>
        <strong>3. マーブルパターン</strong>: Color 1とColor 2の混合
      </p>
      <ul>
        <li>トニックコード: Color 1が70%、Color 2が30%</li>
        <li>サブドミナント: 50/50</li>
        <li>ドミナント: Color 1が30%、Color 2が70%</li>
      </ul>

      <p>
        <strong>4. セブンスコード</strong>: 明度と彩度で表現
      </p>
      <ul>
        <li>maj7: 明るく洗練された色（明度+8、彩度+10）</li>
        <li>7（ドミナント）: 鮮やかで緊張した色（明度-3、彩度+15）</li>
        <li>m7: やや暗く柔らかい色（明度-5、彩度+8）</li>
        <li>m7♭5: 暗く不安定な色（明度-10、彩度+5）</li>
        <li>dim7: 最も暗くくすんだ色（明度-12、彩度-5）</li>
        <li>aug7: 浮遊感のある色（明度-2、彩度+12）</li>
      </ul>

      <p>
        <strong>5. パーティクル</strong>: テンションとオルタレーションを表現
      </p>
      <ul>
        <li>9th: 銀色、密度30</li>
        <li>11th: 青色、密度30</li>
        <li>13th: 黄色、密度30</li>
        <li>♭9/♯9: 赤みがかった色、密度70、サイズ大</li>
        <li>♯11: 明るい青、密度70、サイズ大</li>
        <li>♭13: オレンジ、密度70、サイズ大</li>
      </ul>

      <h2>基本的な使い方</h2>

      <h3>組み立てフェーズ</h3>
      <ol>
        <li><strong>キーの選択</strong>: Key Selectorでメジャー/マイナーキーを選択</li>
        <li><strong>コードの追加</strong>: Chord Paletteからコードをクリックして追加</li>
        <li><strong>コードの編集</strong>: 追加したコードを選択し、セブンス・テンション・オルタレーションを編集</li>
        <li><strong>デュレーション調整</strong>: コードの長さ（拍数）を調整</li>
        <li><strong>セクション管理</strong>: 複数のセクション（イントロ、Aメロなど）を作成可能</li>
        <li><strong>再生</strong>: Playback Controlsでコード進行を聴く（BPM、拍子、メトロノーム設定）</li>
      </ol>

      <h3>確認フェーズ</h3>
      <ol>
        <li><strong>視覚化の確認</strong>: Timeline Viewで全体のコード進行を視覚化</li>
        <li><strong>Playbackモード</strong>: 再生位置に追従して表示</li>
        <li><strong>Previewモード</strong>: ドラッグまたはスクロールバーで全体を確認</li>
      </ol>

      <h3>設定（⚙ボタン）</h3>
      <ul>
        <li><strong>Hue Rotation</strong>: メジャー/マイナーの色相環を回転して好みの色に調整</li>
        <li><strong>Visualization Style</strong>: Marble（マーブル）またはStripes（ストライプ）から選択</li>
        <li><strong>Minor Scale Type</strong>: Natural（ナチュラル）、Harmonic（ハーモニック）、Melodic（メロディック）から選択</li>
      </ul>

      <h2>転調について</h2>
      <p>
        複数のセクションを作成し、各セクションで異なるキーを設定することで転調を表現できます。
        転調すると、色相が劇的に変化し、視覚的に明確になります。
      </p>

      <h2>ヒント</h2>
      <ul>
        <li>コードの色プレビューは、Chord Palette内の各コードボタンの下に表示されます</li>
        <li>Timeline Viewでは、コードの長さが視覚的な幅として表現されます</li>
        <li>テンションやオルタレーションを追加すると、パーティクルが表示されます</li>
        <li>メトロノームは拍子に応じて1拍目が強調されます</li>
      </ul>
    </>
  );
};

export default JapaneseContent;
