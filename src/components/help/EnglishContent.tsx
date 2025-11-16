const EnglishContent = () => {
  return (
    <>
      <h2>About Harmonic Colors</h2>
      <p>
        Harmonic Colors is a web application that visualizes chord progressions
        through colors and visual effects based on music theory.
      </p>

      <h3>Concept</h3>
      <ul>
        <li>Color system based on music theory</li>
        <li>Key represented as base color</li>
        <li>Harmonic functions (Tonic, Subdominant, Dominant) expressed through color mixing ratios</li>
        <li>Tensions and alterations visualized as particles</li>
      </ul>

      <h3>Color System Features</h3>
      <p>
        <strong>1. Color 1 (Key Base Color)</strong>: Represents the tonic/key
      </p>
      <ul>
        <li>Hue: 12 notes mapped to color wheel (C=0°, C#=30°, D=60°...)</li>
        <li>Lightness: Major key = bright (~62%), Minor key = dark (~42%)</li>
        <li>Saturation: ~75%</li>
      </ul>

      <p>
        <strong>2. Color 2 (Chord Base Color)</strong>: Represents harmonic function
      </p>
      <ul>
        <li>Tonic: Stable color (no hue adjustment)</li>
        <li>Subdominant: Intermediate color (hue +15°)</li>
        <li>Dominant: Tense color (hue +30°)</li>
        <li>Lightness: Varies based on harmonic function and chord type</li>
      </ul>

      <p>
        <strong>3. Marble Pattern</strong>: Mix of Color 1 and Color 2
      </p>
      <ul>
        <li>Tonic chord: 70% Color 1, 30% Color 2</li>
        <li>Subdominant: 50/50</li>
        <li>Dominant: 30% Color 1, 70% Color 2</li>
      </ul>

      <p>
        <strong>4. Seventh Chords</strong>: Expressed through lightness and saturation
      </p>
      <ul>
        <li>maj7: Bright and refined (lightness +8, saturation +10)</li>
        <li>7 (dominant): Vivid and tense (lightness -3, saturation +15)</li>
        <li>m7: Slightly dark and soft (lightness -5, saturation +8)</li>
        <li>m7♭5: Dark and unstable (lightness -10, saturation +5)</li>
        <li>dim7: Darkest and dullest (lightness -12, saturation -5)</li>
        <li>aug7: Floating quality (lightness -2, saturation +12)</li>
      </ul>

      <p>
        <strong>5. Particles</strong>: Represent tensions and alterations
      </p>
      <ul>
        <li>9th: Silver, density 30</li>
        <li>11th: Blue, density 30</li>
        <li>13th: Yellow, density 30</li>
        <li>♭9/♯9: Reddish, density 70, larger size</li>
        <li>♯11: Bright blue, density 70, larger size</li>
        <li>♭13: Orange, density 70, larger size</li>
      </ul>

      <h2>How to Use</h2>

      <h3>Build Phase</h3>
      <ol>
        <li><strong>Select Key</strong>: Choose major/minor key from Key Selector</li>
        <li><strong>Add Chords</strong>: Click chords from Chord Palette to add</li>
        <li><strong>Edit Chords</strong>: Select added chord and edit seventh, tensions, alterations</li>
        <li><strong>Adjust Duration</strong>: Change chord length (beats)</li>
        <li><strong>Section Management</strong>: Create multiple sections (Intro, Verse, etc.)</li>
        <li><strong>Playback</strong>: Listen to chord progression with Playback Controls (BPM, time signature, metronome)</li>
      </ol>

      <h3>Confirm Phase</h3>
      <ol>
        <li><strong>View Visualization</strong>: See entire chord progression in Timeline View</li>
        <li><strong>Playback Mode</strong>: View follows playback position</li>
        <li><strong>Preview Mode</strong>: Drag or use scrollbar to view entire progression</li>
      </ol>

      <h3>Settings (⚙ button)</h3>
      <ul>
        <li><strong>Hue Rotation</strong>: Rotate major/minor color wheels to adjust colors</li>
        <li><strong>Visualization Style</strong>: Choose Marble or Stripes</li>
        <li><strong>Minor Scale Type</strong>: Select Natural, Harmonic, or Melodic</li>
      </ul>

      <h2>Modulation</h2>
      <p>
        Create multiple sections and set different keys for each section to represent modulation.
        When you modulate, the hue changes dramatically, making it visually clear.
      </p>

      <h2>Tips</h2>
      <ul>
        <li>Chord color previews are displayed below each chord button in the Chord Palette</li>
        <li>In Timeline View, chord length is represented as visual width</li>
        <li>Adding tensions or alterations displays particles</li>
        <li>Metronome emphasizes the first beat according to time signature</li>
      </ul>
    </>
  );
};

export default EnglishContent;
